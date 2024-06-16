# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Crear un enrutador
router = DefaultRouter()

# Registrar las vistas en el enrutador
router.register(r'productos', views.ProductoViewSet, basename='producto')
router.register(r'clientes', views.ClienteViewSet, basename='cliente')
router.register(r'proveedores', views.ProveedorViewSet, basename='proveedor')
router.register(r'solicitudes', views.SolicitudViewSet, basename='solicitud')

# Definir las URL de la aplicación 'Ventas'
urlpatterns = [
    path('api/', include(router.urls)),
    path('api/resumen-solicitudes/', views.resumen_solicitudes, name='resumen-solicitudes'),
    path('api/buscar/<str:codigo>/', views.buscar_objeto_por_codigo, name='buscar_objeto_por_codigo'),
    path('api/productos-con-datos/', views.productos_con_datos, name='productos_con_datos'),
    path('api/solicitudes-producto/', views.solicitudes_producto, name='solicitudes_producto'),
    path('api/proveedores-con-datos/', views.proveedores_con_datos, name='proveedores_con_datos'),
    path('api/solicitudes-proveedor/', views.solicitudes_proveedor,name='solicitudes_proveedor'),
    path('api/clientes-con-datos/', views.clientes_con_datos, name='productos_con_datos'),
    path('api/solicitudes-cliente/', views.solicitudes_cliente, name='solicitudes_cliente'),
    path('api/solicitudes-con-datos/', views.solicitudes_con_datos, name='solicitudes_con_datos'),

]
