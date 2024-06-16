import os
import json
import django
from datetime import datetime
from django.utils import timezone
from django.core.exceptions import ValidationError

# Configura el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')  # Cambia 'backend_django' al nombre correcto de tu proyecto
django.setup()

from ventas.models import Cliente, Producto, Proveedor, Solicitud

def load_clientes(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        for item in data:
            Cliente.objects.create(
                id=item['id'],
                nombre=item['nombre'],
                fecha_nacimiento=item['fecha_nacimiento'],
                direccion=item['direccion'],
                email=item['email'],
                telefono=item['telefono'],
                numero_identificacion=item['numero_identificacion'],
                codigo=item['codigo']
            )
    print(f"Clientes cargados desde {file_path}")

def load_productos(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        for item in data:
            Producto.objects.create(
                id=item['id'],
                nombre=item['nombre'],
                descripcion=item['descripcion'],
                precio=item['precio'],
                cantidad_disponible=item['cantidad_disponible'],
                fecha_entrada_inventario=item['fecha_entrada_inventario'],
                codigo=item['codigo']
            )
    print(f"Productos cargados desde {file_path}")

def load_proveedores(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        for item in data:
            Proveedor.objects.create(
                id=item['id'],
                nombre=item['nombre'],
                email=item['email'],
                telefono=item['telefono'],
                direccion=item['direccion'],
                sitio_web=item['sitio_web'],
                calificacion=item['calificacion'],
                codigo=item['codigo']
            )
    print(f"Proveedores cargados desde {file_path}")

def load_solicitudes(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        for item in data:
            try:
                cliente = Cliente.objects.get(id=item['cliente'])
                producto = Producto.objects.get(id=item['producto'])
                proveedor = Proveedor.objects.get(id=item['proveedor'])

                # Convertir fechas ingenuas a fechas con zona horaria
                fecha_solicitud = timezone.make_aware(datetime.fromisoformat(item['fecha_solicitud'].replace("Z", "+00:00")))
                fecha_cancelacion = timezone.make_aware(datetime.fromisoformat(item['fecha_cancelacion'])) if item['fecha_cancelacion'] else None

                Solicitud.objects.create(
                    id=item['id'],
                    cantidad_solicitada=item['cantidad_solicitada'],
                    fecha_solicitud=fecha_solicitud,
                    metodo_pago=item['metodo_pago'],
                    fecha_cancelacion=fecha_cancelacion,
                    tipo_cancelacion=item['tipo_cancelacion'],
                    descuento=item['descuento'],
                    razon_cancelacion=item['razon_cancelacion'],
                    codigo=item['codigo'],
                    cliente=cliente,
                    producto=producto,
                    proveedor=proveedor
                )
            except (Cliente.DoesNotExist, Producto.DoesNotExist, Proveedor.DoesNotExist) as e:
                print(f"Error al crear la solicitud {item['id']}: {e}")
    print(f"Solicitudes cargadas desde {file_path}")

# Especifica las rutas de los archivos JSON
clientes_file = r'ventas\data\clientes.json'
productos_file = r'ventas\data\productos.json'
proveedores_file = r'ventas\data\proveedores.json'
solicitudes_file = r'ventas\data\solicitudes.json'

# Carga los datos
load_clientes(clientes_file)
load_productos(productos_file)
load_proveedores(proveedores_file)
load_solicitudes(solicitudes_file)

print("Datos cargados en la base de datos.")
