from django.contrib import admin
from .models import Producto, Proveedor, Cliente, Solicitud
# Register your models here.
admin.site.register(Producto)
admin.site.register(Proveedor)
admin.site.register(Cliente)
admin.site.register(Solicitud)