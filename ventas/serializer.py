from rest_framework import serializers
from .models import Cliente, Proveedor, Producto, Solicitud

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class SolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitud
        fields = '__all__'

    def validate(self, data):
        producto = data['producto']
        cantidad_solicitada = data['cantidad_solicitada']
        if cantidad_solicitada > producto.cantidad_disponible:
            raise serializers.ValidationError(f"No hay suficiente cantidad disponible de {producto.nombre}. Solo hay {producto.cantidad_disponible} en stock.")
        return data

    def create(self, validated_data):
        solicitud = Solicitud.objects.create(**validated_data)
        producto = solicitud.producto
        producto.cantidad_disponible -= solicitud.cantidad_solicitada
        producto.save()
        return solicitud
