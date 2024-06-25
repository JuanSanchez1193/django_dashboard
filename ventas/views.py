from datetime import datetime
from decimal import Decimal

from django.db.models import Count, Q, Sum, F, Avg
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from django.utils.dateparse import parse_date
from rest_framework import viewsets

from .models import Cliente, Proveedor, Producto, Solicitud
from .serializer import ClienteSerializer, ProveedorSerializer, ProductoSerializer, SolicitudSerializer



class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer

def resumen_solicitudes(request):
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')

    if start_date_str:
        start_date = parse_date(start_date_str)
    else:
        start_date = timezone.datetime.min.date()  # Fecha mínima posible

    if end_date_str:
        end_date = parse_date(end_date_str)
    else:
        end_date = timezone.now().date()  # Fecha actual

    # Convertir fechas a objetos datetime para comparación
    start_datetime = timezone.make_aware(timezone.datetime.combine(start_date, timezone.datetime.min.time()))
    end_datetime = timezone.make_aware(timezone.datetime.combine(end_date, timezone.datetime.max.time()))

    # Filtrar solicitudes dentro del rango de fechas
    solicitudes_en_rango = Solicitud.objects.filter(
        Q(fecha_solicitud__range=(start_datetime, end_datetime)) |
        Q(fecha_cancelacion__range=(start_datetime, end_datetime))
    )

    total_solicitudes = solicitudes_en_rango.count()

    solicitudes_canceladas = solicitudes_en_rango.filter(fecha_cancelacion__range=(start_datetime, end_datetime)).count()

    solicitudes_activas = solicitudes_en_rango.filter(
        fecha_solicitud__range=(start_datetime, end_datetime)
    ).exclude(
        fecha_cancelacion__range=(start_datetime, end_datetime)
    ).count()

    # Datos de tipos de cancelación
    tipos_cancelacion = solicitudes_en_rango.filter(
        fecha_cancelacion__range=(start_datetime, end_datetime)
    ).values('tipo_cancelacion').annotate(total=Count('tipo_cancelacion'))

    # Datos de razones de cancelación voluntaria e involuntaria
    razones_cancelacion_voluntaria = solicitudes_en_rango.filter(
        fecha_cancelacion__range=(start_datetime, end_datetime),
        tipo_cancelacion='V'
    ).values('razon_cancelacion').annotate(total=Count('razon_cancelacion'))

    razones_cancelacion_involuntaria = solicitudes_en_rango.filter(
        fecha_cancelacion__range=(start_datetime, end_datetime),
        tipo_cancelacion='I'
    ).values('razon_cancelacion').annotate(total=Count('razon_cancelacion'))

    # Combinar razones de cancelación voluntaria e involuntaria
    combined_razones = {}
    for razon in razones_cancelacion_voluntaria:
        combined_razones[razon['razon_cancelacion']] = razon['total']
    for razon in razones_cancelacion_involuntaria:
        if razon['razon_cancelacion'] in combined_razones:
            combined_razones[razon['razon_cancelacion']] += razon['total']
        else:
            combined_razones[razon['razon_cancelacion']] = razon['total']

    # Formatear datos para la gráfica de pastel
    cancelacion_data = {tipo['tipo_cancelacion']: tipo['total'] for tipo in tipos_cancelacion}

    data = {
        "total_solicitudes": total_solicitudes,
        "solicitudes_canceladas": solicitudes_canceladas,
        "solicitudes_activas": solicitudes_activas,
        "cancelacion_data": cancelacion_data,
        "razones_combined_data": combined_razones,
    }

    return JsonResponse(data)



def buscar_objeto_por_codigo(request, codigo):
    # Determinar el prefijo del código
    prefijo = codigo[0]  # Tomar la primera letra para el prefijo

    # Inicializar la variable de resultado
    resultado = {}

    # Realizar la búsqueda según el prefijo del código
    if prefijo == 'C':
        cliente = get_object_or_404(Cliente, codigo=codigo)
        resultado = {
            'tipo': 'Cliente',
            'nombre': cliente.nombre,
            'fecha_nacimiento': str(cliente.fecha_nacimiento),
            'direccion': cliente.direccion,
            'email': cliente.email,
            'telefono': cliente.telefono,
            'numero_identificacion': cliente.numero_identificacion,
            'codigo': cliente.codigo,
            'id': cliente.id,
        }
    elif prefijo == 'P' and len(codigo) == 7:
        proveedor = get_object_or_404(Proveedor, codigo=codigo)
        resultado = {
            'tipo': 'Proveedor',
            'nombre': proveedor.nombre,
            'email': proveedor.email,
            'telefono': proveedor.telefono,
            'direccion': proveedor.direccion,
            'sitio_web': proveedor.sitio_web,
            'calificacion': proveedor.calificacion,
            'codigo': proveedor.codigo,
            'id': proveedor.id,
        }
    elif prefijo == 'P' and len(codigo) == 6:
        # Si el código es solo 'P' o tiene 6 caracteres, lo interpretamos como un código de producto
        producto = get_object_or_404(Producto, codigo=codigo)
        resultado = {
            'tipo': 'Producto',
            'nombre': producto.nombre,
            'descripcion': producto.descripcion,
            'precio': str(producto.precio),
            'cantidad_disponible': producto.cantidad_disponible,
            'fecha_entrada_inventario': str(producto.fecha_entrada_inventario),
            'codigo': producto.codigo,
            'id': producto.id,
        }
    elif prefijo == 'S':
        solicitud = get_object_or_404(Solicitud, codigo=codigo)
        precio = solicitud.producto.precio
        descuento = solicitud.descuento if solicitud.descuento else Decimal(0)

        descuento_decimal = Decimal(descuento / 100)
        total = precio - (precio * descuento_decimal)

        resultado = {
            'tipo': 'Solicitud',
            'cliente_nombre': solicitud.cliente.nombre,
            'cliente_email': solicitud.cliente.email,
            'cliente_telefono': solicitud.cliente.telefono,
            'cliente_codigo': solicitud.cliente.codigo,
            'producto_codigo': solicitud.producto.codigo,
            'producto_nombre': solicitud.producto.nombre,
            'producto_descripcion': solicitud.producto.descripcion,
            'producto_precio': str(precio),
            'proveedor_codigo': solicitud.proveedor.codigo,
            'cantidad_solicitada': solicitud.cantidad_solicitada,
            'fecha_solicitud': str(solicitud.fecha_solicitud),
            'metodo_pago': solicitud.get_metodo_pago_display(),
            'fecha_cancelacion': str(solicitud.fecha_cancelacion) if solicitud.fecha_cancelacion else None,
            'tipo_cancelacion': solicitud.get_tipo_cancelacion_display() if solicitud.tipo_cancelacion else None,
            'descuento': str(descuento),
            'razon_cancelacion': solicitud.get_razon_cancelacion_display() if solicitud.razon_cancelacion else None,
            'total': str(total),
            'codigo': solicitud.codigo,
            'id': solicitud.id,
        }
    
    return JsonResponse(resultado)


def productos_con_datos(request):
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')
    top_option = request.GET.get('top_option')
    other_option = request.GET.get('other_option')
    include_without_requests = request.GET.get('include_without_requests', 'false')
    top_x = int(request.GET.get('top_x', 3))

    if start_date_str:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    else:
        start_date = timezone.datetime.min.date()

    if end_date_str:
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    else:
        end_date = timezone.now().date()

    start_datetime = timezone.make_aware(timezone.datetime.combine(start_date, datetime.min.time()))
    end_datetime = timezone.make_aware(timezone.datetime.combine(end_date, datetime.max.time()))

    solicitudes_en_rango = Solicitud.objects.filter(fecha_solicitud__range=(start_datetime, end_datetime))

    productos_con_datos = Producto.objects.filter(solicitud__in=solicitudes_en_rango).distinct()

    datos_productos = []
    total_solicitudes = 0
    total_ventas = 0
    total_ganancias = 0

    for producto in productos_con_datos:
        solicitudes_producto = solicitudes_en_rango.filter(producto=producto)
        
        cantidad_pedida_total = solicitudes_producto.aggregate(total=Sum('cantidad_solicitada'))['total'] or 0
        cantidad_vendida = solicitudes_producto.filter(Q(fecha_cancelacion__isnull=True) | Q(fecha_cancelacion__gt=end_datetime)).aggregate(total=Sum('cantidad_solicitada'))['total'] or 0
        precio_total = producto.precio
        total_producto_ganancias = cantidad_vendida * precio_total

        total_solicitudes += cantidad_pedida_total
        total_ventas += cantidad_vendida
        total_ganancias += total_producto_ganancias

        datos_productos.append({
            'codigo': producto.codigo,
            'fecha_entrada_inventario': producto.fecha_entrada_inventario,
            'cantidad_pedida_total': cantidad_pedida_total,
            'cantidad_vendida': cantidad_vendida,
            'cantidad_disponible': producto.cantidad_disponible,
            'precio_total': precio_total,
            'total_ganancias': total_producto_ganancias
        })

    if include_without_requests == 'true':
        productos_sin_solicitudes = Producto.objects.exclude(solicitud__in=solicitudes_en_rango)
        for producto in productos_sin_solicitudes:
            datos_productos.append({
                'codigo': producto.codigo,
                'fecha_entrada_inventario': producto.fecha_entrada_inventario,
                'cantidad_pedida_total': 0,
                'cantidad_vendida': 0,
                'cantidad_disponible': producto.cantidad_disponible,
                'precio_total': producto.precio,
                'total_ganancias': 0
            })

    # Aplicar filtros si están presentes en la solicitud
    if top_option and other_option:
        datos_productos = apply_filters_productos(datos_productos, top_option, other_option, top_x)

    # Calcular nuevos totales después del filtrado
    total_solicitudes_filtradas = sum(p['cantidad_pedida_total'] for p in datos_productos)
    total_ventas_filtradas = sum(p['cantidad_vendida'] for p in datos_productos)
    total_ganancias_filtradas = sum(p['total_ganancias'] for p in datos_productos)

    response_data = {
        'productos': datos_productos,
        'totales': {
            'total_solicitudes': total_solicitudes_filtradas,
            'total_ventas': total_ventas_filtradas,
            'total_ganancias': total_ganancias_filtradas
        }
    }

    return JsonResponse(response_data, safe=False)

def apply_filters_productos(data, top_option, other_option, top_x):
    key_mapping = {
        'CANT_PEDIDA_TOTAL': 'cantidad_pedida_total',
        'CANT_VENDIDA': 'cantidad_vendida',
        'CANT_DISPO': 'cantidad_disponible',
        'PRECIO_TOTAL': 'precio_total',
        'TOTAL_GANANCIAS': 'total_ganancias'
    }

    if top_option == 'mejores':
        data = sorted(data, key=lambda x: x[key_mapping[other_option]], reverse=True)[:top_x]
    elif top_option == 'peores':
        data = sorted(data, key=lambda x: x[key_mapping[other_option]])[:top_x]

    return data

def solicitudes_producto(request):
    product_id = request.GET.get('producto')
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')

    if start_date_str:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    else:
        start_date = timezone.datetime.min.date()

    if end_date_str:
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    else:
        end_date = timezone.now().date()

    start_datetime = timezone.make_aware(timezone.datetime.combine(start_date, datetime.min.time()))
    end_datetime = timezone.make_aware(timezone.datetime.combine(end_date, datetime.max.time()))

    solicitudes = Solicitud.objects.filter(producto_id=product_id).select_related('cliente', 'producto', 'proveedor')

    # Filtrar según las reglas
    solicitudes = solicitudes.filter(
        (Q(fecha_solicitud__lte=end_datetime) & (Q(fecha_cancelacion__gte=start_datetime) | Q(fecha_cancelacion__isnull=True))) |
        (Q(fecha_solicitud__gte=start_datetime) & Q(fecha_solicitud__lte=end_datetime))
    )

    data = [
        {
            'id': solicitud.id,
            'cliente_codigo': solicitud.cliente.codigo,
            'cantidad_solicitada': solicitud.cantidad_solicitada,
            'fecha_solicitud': solicitud.fecha_solicitud,
            'metodo_pago': solicitud.get_metodo_pago_display(),
            'fecha_cancelacion': solicitud.fecha_cancelacion,
            'solicitud_codigo': solicitud.codigo,
        }
        for solicitud in solicitudes
    ]
    return JsonResponse(data, safe=False)

def proveedores_con_datos(request):
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')
    top_option = request.GET.get('top_option')
    other_option = request.GET.get('other_option')
    include_without_requests = request.GET.get('include_without_requests', 'false')
    top_x = int(request.GET.get('top_x', 3))

    if start_date_str:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    else:
        start_date = timezone.datetime.min.date()

    if end_date_str:
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    else:
        end_date = timezone.now().date()

    start_datetime = timezone.make_aware(timezone.datetime.combine(start_date, datetime.min.time()))
    end_datetime = timezone.make_aware(timezone.datetime.combine(end_date, datetime.max.time()))

    solicitudes_en_rango = Solicitud.objects.filter(fecha_solicitud__range=(start_datetime, end_datetime))

    proveedores_con_datos = Proveedor.objects.filter(solicitud__in=solicitudes_en_rango).distinct()

    datos_proveedores = []
    total_solicitudes = 0
    total_cantidad_vendida = 0
    total_ganancias = 0

    for proveedor in proveedores_con_datos:
        solicitudes_proveedor = solicitudes_en_rango.filter(proveedor=proveedor)
        
        # Cantidad de solicitudes
        cantidad_solicitudes = solicitudes_proveedor.aggregate(total=Count('id'))['total'] or 0
        
        # Cantidad de productos manejados (distintos productos)
        cantidad_productos_manejados = solicitudes_proveedor.aggregate(total=Count('producto', distinct=True))['total'] or 0
        
        # Cantidad total vendida (suma de cantidad solicitada en solicitudes no canceladas)
        cantidad_vendida = solicitudes_proveedor.filter(Q(fecha_cancelacion__isnull=True) | Q(fecha_cancelacion__gt=end_datetime)).aggregate(total=Sum('cantidad_solicitada'))['total'] or 0
        
        # Total de ganancias
        total_ganancias_proveedor = solicitudes_proveedor.filter(Q(fecha_cancelacion__isnull=True) | Q(fecha_cancelacion__gt=end_datetime)).aggregate(total=Sum(F('cantidad_solicitada') * F('producto__precio')))['total'] or 0

        total_solicitudes += cantidad_solicitudes
        total_cantidad_vendida += cantidad_vendida
        total_ganancias += total_ganancias_proveedor

        datos_proveedores.append({
            'codigo': proveedor.codigo,
            'cantidad_solicitudes': cantidad_solicitudes,
            'cantidad_productos_manejados': cantidad_productos_manejados,
            'cantidad_vendida': cantidad_vendida,
            'calificacion': proveedor.calificacion,
            'total_ganancias': total_ganancias_proveedor
        })

    if include_without_requests == 'true':
        proveedores_sin_solicitudes = Proveedor.objects.exclude(solicitud__in=solicitudes_en_rango)
        for proveedor in proveedores_sin_solicitudes:
            datos_proveedores.append({
                'codigo': proveedor.codigo,
                'cantidad_solicitudes': 0,
                'cantidad_productos_manejados': 0,
                'cantidad_vendida': 0,
                'calificacion': proveedor.calificacion,
                'total_ganancias': 0
            })

    # Aplicar filtros si están presentes en la solicitud
    if top_option and other_option:
        datos_proveedores = apply_filters_proveedores(datos_proveedores, top_option, other_option, top_x)

    # Calcular nuevos totales después del filtrado
    total_solicitudes_filtradas = sum(p['cantidad_solicitudes'] for p in datos_proveedores)
    total_cantidad_vendida_filtrada = sum(p['cantidad_vendida'] for p in datos_proveedores)
    total_ganancias_filtradas = sum(p['total_ganancias'] for p in datos_proveedores)

    response_data = {
        'proveedores': datos_proveedores,
        'totales': {
            'total_solicitudes': total_solicitudes_filtradas,
            'total_cantidad_vendida': total_cantidad_vendida_filtrada,
            'total_ganancias': total_ganancias_filtradas
        }
    }

    return JsonResponse(response_data, safe=False)

def apply_filters_proveedores(data, top_option, other_option, top_x):
    key_mapping = {
        'CANT_SOLICITUDES': 'cantidad_solicitudes',
        'CANT_PROD_MANEJADOS': 'cantidad_productos_manejados',
        'CANT_VENDIDA': 'cantidad_vendida',
        'TOTAL_GANANCIAS': 'total_ganancias',
        'CALIFICACION': 'calificacion'
    }

    if top_option == 'mejores':
        data = sorted(data, key=lambda x: x[key_mapping[other_option]], reverse=True)[:top_x]
    elif top_option == 'peores':
        data = sorted(data, key=lambda x: x[key_mapping[other_option]])[:top_x]

    return data

def solicitudes_proveedor(request):
    proveedor_id = request.GET.get('proveedor')
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')

    if start_date_str:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    else:
        start_date = timezone.datetime.min.date()

    if end_date_str:
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    else:
        end_date = timezone.now().date()

    start_datetime = timezone.make_aware(timezone.datetime.combine(start_date, datetime.min.time()))
    end_datetime = timezone.make_aware(timezone.datetime.combine(end_date, datetime.max.time()))

    solicitudes = Solicitud.objects.filter(proveedor_id=proveedor_id).select_related('cliente', 'producto', 'proveedor')

    # Filtrar según las reglas
    solicitudes = solicitudes.filter(
        (Q(fecha_solicitud__lte=end_datetime) & (Q(fecha_cancelacion__gte=start_datetime) | Q(fecha_cancelacion__isnull=True))) |
        (Q(fecha_solicitud__gte=start_datetime) & Q(fecha_solicitud__lte=end_datetime))
    )

    data = [
        {
            'id': solicitud.id,
            'cliente_codigo': solicitud.cliente.codigo,
            'producto_nombre': solicitud.producto.nombre,
            'cantidad_solicitada': solicitud.cantidad_solicitada,
            'fecha_solicitud': solicitud.fecha_solicitud,
            'metodo_pago': solicitud.get_metodo_pago_display(),
            'fecha_cancelacion': solicitud.fecha_cancelacion,
            'solicitud_codigo': solicitud.codigo,
        }
        for solicitud in solicitudes
    ]
    return JsonResponse(data, safe=False)

def clientes_con_datos(request):
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')
    top_option = request.GET.get('top_option')
    other_option = request.GET.get('other_option')
    include_without_requests = request.GET.get('include_without_requests', 'false')
    top_x = int(request.GET.get('top_x', 3))

    if start_date_str:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    else:
        start_date = timezone.datetime.min.date()

    if end_date_str:
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    else:
        end_date = timezone.now().date()

    start_datetime = timezone.make_aware(timezone.datetime.combine(start_date, datetime.min.time()))
    end_datetime = timezone.make_aware(timezone.datetime.combine(end_date, datetime.max.time()))

    solicitudes_en_rango = Solicitud.objects.filter(fecha_solicitud__range=(start_datetime, end_datetime))

    clientes_con_datos = Cliente.objects.filter(solicitud__in=solicitudes_en_rango).distinct()

    datos_clientes = []
    total_solicitudes = 0
    total_cantidad_comprada = 0
    total_gastado = 0

    for cliente in clientes_con_datos:
        solicitudes_cliente = solicitudes_en_rango.filter(cliente=cliente)
        
        # Cantidad de solicitudes
        cantidad_solicitudes = solicitudes_cliente.aggregate(total=Count('id'))['total'] or 0
        
        # Cantidad total comprada
        cantidad_comprada = solicitudes_cliente.filter(Q(fecha_cancelacion__isnull=True) | Q(fecha_cancelacion__gt=end_datetime)).aggregate(total=Sum('cantidad_solicitada'))['total'] or 0
        
        # Total gastado
        total_gastado_cliente = solicitudes_cliente.filter(Q(fecha_cancelacion__isnull=True) | Q(fecha_cancelacion__gt=end_datetime)).aggregate(total=Sum(F('cantidad_solicitada') * F('producto__precio')))['total'] or 0

        total_solicitudes += cantidad_solicitudes
        total_cantidad_comprada += cantidad_comprada
        total_gastado += total_gastado_cliente

        datos_clientes.append({
            'codigo': cliente.codigo,
            'nombre': cliente.nombre,
            'cantidad_solicitudes': cantidad_solicitudes,
            'cantidad_comprada': cantidad_comprada,
            'total_gastado': total_gastado_cliente
        })

    if include_without_requests == 'true':
        clientes_sin_solicitudes = Cliente.objects.exclude(solicitud__in=solicitudes_en_rango)
        for cliente in clientes_sin_solicitudes:
            datos_clientes.append({
                'codigo': cliente.codigo,
                'nombre': cliente.nombre,
                'cantidad_solicitudes': 0,
                'cantidad_comprada': 0,
                'total_gastado': 0
            })

    # Aplicar filtros si están presentes en la solicitud
    if top_option and other_option:
        datos_clientes = apply_filters_clientes(datos_clientes, top_option, other_option, top_x)

    # Calcular nuevos totales después del filtrado
    total_solicitudes_filtradas = sum(c['cantidad_solicitudes'] for c in datos_clientes)
    total_cantidad_comprada_filtrada = sum(c['cantidad_comprada'] for c in datos_clientes)
    total_gastado_filtrado = sum(c['total_gastado'] for c in datos_clientes)

    response_data = {
        'clientes': datos_clientes,
        'totales': {
            'total_solicitudes': total_solicitudes_filtradas,
            'total_cantidad_comprada': total_cantidad_comprada_filtrada,
            'total_gastado': total_gastado_filtrado
        }
    }

    return JsonResponse(response_data, safe=False)

def apply_filters_clientes(data, top_option, other_option, top_x):
    key_mapping = {
        'CANT_SOLICITUDES': 'cantidad_solicitudes',
        'CANT_COMPRADA': 'cantidad_comprada',
        'TOTAL_GASTADO': 'total_gastado'
    }

    if top_option == 'mejores':
        data = sorted(data, key=lambda x: x[key_mapping[other_option]], reverse=True)[:top_x]
    elif top_option == 'peores':
        data = sorted(data, key=lambda x: x[key_mapping[other_option]])[:top_x]

    return data


def solicitudes_cliente(request):
    cliente_id = request.GET.get('cliente')
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')

    if start_date_str:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    else:
        start_date = timezone.datetime.min.date()

    if end_date_str:
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    else:
        end_date = timezone.now().date()

    start_datetime = timezone.make_aware(timezone.datetime.combine(start_date, datetime.min.time()))
    end_datetime = timezone.make_aware(timezone.datetime.combine(end_date, datetime.max.time()))

    solicitudes = Solicitud.objects.filter(cliente_id=cliente_id).select_related('cliente', 'producto', 'proveedor')

    # Filtrar según las reglas
    solicitudes = solicitudes.filter(
        (Q(fecha_solicitud__lte=end_datetime) & (Q(fecha_cancelacion__gte=start_datetime) | Q(fecha_cancelacion__isnull=True))) |
        (Q(fecha_solicitud__gte=start_datetime) & Q(fecha_solicitud__lte=end_datetime))
    )

    data = [
        {
            'id': solicitud.id,
            'producto_nombre': solicitud.producto.nombre,
            'cantidad_solicitada': solicitud.cantidad_solicitada,
            'fecha_solicitud': solicitud.fecha_solicitud,
            'metodo_pago': solicitud.get_metodo_pago_display(),
            'fecha_cancelacion': solicitud.fecha_cancelacion,
            'solicitud_codigo': solicitud.codigo,
        }
        for solicitud in solicitudes
    ]
    return JsonResponse(data, safe=False)


def solicitudes_con_datos(request):
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')
    include_cancelled = request.GET.get('include_cancelled') == 'true'
    top_option = request.GET.get('top_option')
    other_option = request.GET.get('other_option')
    top_x = int(request.GET.get('top_x', 3))

    if start_date_str:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    else:
        start_date = timezone.datetime.min.date()

    if end_date_str:
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    else:
        end_date = timezone.now().date()

    start_datetime = timezone.make_aware(timezone.datetime.combine(start_date, datetime.min.time()))
    end_datetime = timezone.make_aware(timezone.datetime.combine(end_date, datetime.max.time()))

    solicitudes_en_rango = Solicitud.objects.filter(fecha_solicitud__range=(start_datetime, end_datetime))

    if not include_cancelled:
        solicitudes_en_rango = solicitudes_en_rango.filter(fecha_cancelacion__isnull=True)

    datos_solicitudes = []
    total_solicitudes = 0
    total_cantidad_solicitada = 0
    total_cantidad_vendida = 0
    total_ganancias = 0

    for solicitud in solicitudes_en_rango:
        cantidad_solicitada = solicitud.cantidad_solicitada
        cantidad_vendida = cantidad_solicitada if not solicitud.fecha_cancelacion else 0
        precio_total = solicitud.producto.precio
        descuento = Decimal(solicitud.descuento or 0)
        total_recibido = cantidad_vendida * (precio_total * (Decimal(1) - descuento / Decimal(100)))

        total_solicitudes += 1
        total_cantidad_solicitada += cantidad_solicitada
        total_cantidad_vendida += cantidad_vendida
        total_ganancias += total_recibido

        datos_solicitudes.append({
            'codigo': solicitud.codigo,
            'fecha_solicitud': solicitud.fecha_solicitud,
            'cliente': solicitud.cliente.codigo,
            'producto': solicitud.producto.codigo,
            'proveedor': solicitud.proveedor.codigo,
            'cantidad_solicitada': cantidad_solicitada,
            'cantidad_vendida': cantidad_vendida,
            'precio_total': precio_total,
            'total_recibido': float(total_recibido),  # Asegurarse de que sea un número
            'descuento': float(descuento),  # Asegurarse de que sea un número
            'metodo_pago': solicitud.metodo_pago,
            'fecha_cancelacion': solicitud.fecha_cancelacion,
            'tipo_cancelacion': solicitud.tipo_cancelacion,
            'razon_cancelacion': solicitud.razon_cancelacion,
            'estado': 'Cancel' if solicitud.fecha_cancelacion else 'Active'
        })

    if top_option and other_option:
        datos_solicitudes = apply_filters_solicitudes(datos_solicitudes, top_option, other_option, top_x)

    total_solicitudes_filtradas = len(datos_solicitudes)
    total_cantidad_solicitada_filtrada = sum(p['cantidad_solicitada'] for p in datos_solicitudes)
    total_cantidad_vendida_filtrada = sum(p['cantidad_vendida'] for p in datos_solicitudes)
    total_ganancias_filtradas = sum(p['total_recibido'] for p in datos_solicitudes)

    response_data = {
        'solicitudes': datos_solicitudes,
        'totales': {
            'total_solicitudes': total_solicitudes_filtradas,
            'total_cantidad_solicitada': total_cantidad_solicitada_filtrada,
            'total_cantidad_vendida': total_cantidad_vendida_filtrada,
            'total_ganancias': total_ganancias_filtradas
        }
    }

    return JsonResponse(response_data, safe=False)

def apply_filters_solicitudes(data, top_option, other_option, top_x):
    key_mapping = {
        'CANT_SOLICITADA': 'cantidad_solicitada',
        'CANT_VENDIDA': 'cantidad_vendida',
        'PRECIO_TOTAL': 'precio_total',
        'TOTAL_RECIBIDO': 'total_recibido',
        'DESCUENTO': 'descuento',
        'FECHA_SOLICITUD': 'fecha_solicitud'
    }

    if top_option == 'mejores':
        data = sorted(data, key=lambda x: x[key_mapping[other_option]], reverse=True)[:top_x]
    elif top_option == 'peores':
        data = sorted(data, key=lambda x: x[key_mapping[other_option]])[:top_x]

    return data

