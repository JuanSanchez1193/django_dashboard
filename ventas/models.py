from django.db import models
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import string
import random

def generate_code(prefix, length=5):
    return prefix + ''.join(random.choices(string.ascii_uppercase, k=length))

class Cliente(models.Model):
    nombre = models.CharField(max_length=255)
    fecha_nacimiento = models.DateField()
    direccion = models.CharField(max_length=200)
    email = models.EmailField()
    telefono = models.CharField(max_length=20)
    numero_identificacion = models.CharField(max_length=50, blank=True)
    codigo = models.CharField(max_length=6, unique=True, blank=True)

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if not self.codigo:
            self.codigo = generate_code('C')
        super().save(*args, **kwargs)

class Proveedor(models.Model):
    nombre = models.CharField(max_length=255)
    email = models.EmailField()
    telefono = models.CharField(max_length=20)
    direccion = models.CharField(max_length=200, blank=True)
    sitio_web = models.URLField(blank=True)
    calificacion = models.PositiveSmallIntegerField(
        default=0,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    codigo = models.CharField(max_length=6, unique=True, blank=True)

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if not self.codigo:
            self.codigo = generate_code('PV')
        super().save(*args, **kwargs)

class Producto(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad_disponible = models.PositiveIntegerField()
    fecha_entrada_inventario = models.DateField(blank=True, null=True)
    codigo = models.CharField(max_length=6, unique=True, blank=True)

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if not self.codigo:
            self.codigo = generate_code('P')
        super().save(*args, **kwargs)

class Solicitud(models.Model):
    METODOS_PAGO = [
        ('TC', 'Tarjeta de Crédito'),
        ('PE', 'Pago contra Entrega'),
        ('TR', 'Transferencia'),
    ]

    TIPOS_CANCELACION = [
        ('V', 'Voluntario'),
        ('I', 'Involuntario'),
    ]

    RAZONES_CANCELACION_VOLUNTARIA = [
        ('NI', 'No estoy interesado en el producto'),
        ('NB', 'No encontré lo que buscaba'),
        ('NC', 'No hay la cantidad suficiente que necesito'),
        ('PE', 'El precio es muy elevado'),
        ('NP', 'La marca/proveedor no es la que busco'),
    ]

    RAZONES_CANCELACION_INVOLUNTARIA = [
        ('NC', 'No hay la cantidad suficiente que necesito'),
        ('SR', 'Solicitud cancelada repentinamente'),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    cantidad_solicitada = models.PositiveIntegerField()
    fecha_solicitud = models.DateTimeField(default=timezone.now, blank=True)
    metodo_pago = models.CharField(max_length=2, choices=METODOS_PAGO)
    fecha_cancelacion = models.DateTimeField(null=True, blank=True)
    tipo_cancelacion = models.CharField(max_length=1, choices=TIPOS_CANCELACION, null=True, blank=True)
    descuento = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    razon_cancelacion = models.CharField(max_length=2, null=True, blank=True, choices=[('NI', 'No estoy interesado en el producto'),
                                                                                        ('NB', 'No encontré lo que buscaba'),
                                                                                        ('NC', 'No hay la cantidad suficiente que necesito'),
                                                                                        ('PE', 'El precio es muy elevado'),
                                                                                        ('NP', 'La marca/proveedor no es la que busco'),
                                                                                        ('SR', 'Solicitud cancelada repentinamente')])
    codigo = models.CharField(max_length=6, unique=True, blank=True)

    def __str__(self):
        return f"Solicitud de {self.producto.nombre} por {self.cliente.nombre} a {self.proveedor.nombre}"

    def clean(self):
        # Validación de cantidad solicitada vs cantidad disponible
        if self.cantidad_solicitada > self.producto.cantidad_disponible:
            self.fecha_cancelacion = timezone.now()
            self.tipo_cancelacion = 'I'
            self.razon_cancelacion = 'NC'
        
        # Validación de razones de cancelación de acuerdo al tipo
        if self.tipo_cancelacion == 'V' and self.razon_cancelacion not in dict(self.RAZONES_CANCELACION_VOLUNTARIA):
            raise ValidationError("La razón de cancelación no es válida para una cancelación voluntaria.")
        if self.tipo_cancelacion == 'I' and self.razon_cancelacion not in dict(self.RAZONES_CANCELACION_INVOLUNTARIA):
            raise ValidationError("La razón de cancelación no es válida para una cancelación involuntaria.")

        # Validación de campos de cancelación
        cancelacion_campos = [self.fecha_cancelacion, self.tipo_cancelacion, self.razon_cancelacion]
        if any(cancelacion_campos) and not all(cancelacion_campos):
            raise ValidationError("Todos los campos de cancelación (fecha_cancelacion, tipo_cancelacion, razon_cancelacion) deben estar completos.")

    def save(self, *args, **kwargs):
        if self.pk:
            try:
                old_instance = Solicitud.objects.get(pk=self.pk)
                self.old_cantidad_solicitada = old_instance.cantidad_solicitada
                self.old_fecha_cancelacion = old_instance.fecha_cancelacion
            except Solicitud.DoesNotExist:
                self.old_cantidad_solicitada = None
                self.old_fecha_cancelacion = None
        else:
            self.old_cantidad_solicitada = None
            self.old_fecha_cancelacion = None

        if not self.codigo:
            self.codigo = generate_code('S')
        
        # Si fecha_solicitud no está definida, usar la fecha actual
        if not self.fecha_solicitud:
            self.fecha_solicitud = timezone.now()

        self.clean()
        super().save(*args, **kwargs)

@receiver(post_save, sender=Solicitud)
def actualizar_cantidad_producto(sender, instance, created, **kwargs):
    if created:
        # Si la solicitud es nueva y no está cancelada
        if not instance.fecha_cancelacion:
            producto = instance.producto
            producto.cantidad_disponible -= instance.cantidad_solicitada
            producto.save()
    else:
        # Si la solicitud fue actualizada y ahora está cancelada
        if instance.fecha_cancelacion and not instance.old_fecha_cancelacion:
            producto = instance.producto
            producto.cantidad_disponible += instance.cantidad_solicitada
            producto.save()

@receiver(post_delete, sender=Solicitud)
def revertir_cantidad_producto(sender, instance, **kwargs):
    if not instance.fecha_cancelacion:
        producto = instance.producto
        producto.cantidad_disponible += instance.cantidad_solicitada
        producto.save()



