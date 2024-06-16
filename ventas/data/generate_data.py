import json
import random
import string
from datetime import datetime, timedelta
import os

# Helper functions
def generate_code(prefix, length=5):
    return prefix + ''.join(random.choices(string.ascii_uppercase, k=length))

def random_date(start, end):
    return start + timedelta(
        seconds=random.randint(0, int((end - start).total_seconds())),
    )

# Generate example data
def generate_clientes(num=10):
    clientes = []
    for i in range(1, num + 1):
        cliente = {
            "id": i,
            "nombre": f"Cliente {i}",
            "fecha_nacimiento": str(random_date(datetime(1960, 1, 1), datetime(2005, 1, 1)).date()),
            "direccion": f"Dirección {i}",
            "email": f"cliente{i}@example.com",
            "telefono": f"{random.randint(3000000000, 3999999999)}",
            "numero_identificacion": f"ID-{i}",
            "codigo": generate_code('C')
        }
        clientes.append(cliente)
    return clientes

def generate_proveedores(num=10):
    proveedores = []
    for i in range(1, num + 1):
        proveedor = {
            "id": i,
            "nombre": f"Proveedor {i}",
            "email": f"proveedor{i}@example.com",
            "telefono": f"{random.randint(3000000000, 3999999999)}",
            "direccion": f"Dirección {i}",
            "sitio_web": f"https://www.ejemplo.com/pagina{i}",
            "calificacion": random.randint(1, 5),
            "codigo": generate_code('PV')
        }
        proveedores.append(proveedor)
    return proveedores

def generate_productos(proveedores, num=10):
    productos = []
    for i in range(1, num + 10):
        proveedor = random.choice(proveedores)
        producto = {
            "id": i,
            "nombre": f"Producto {i}",
            "descripcion": f"Descripción del producto {i}",
            "precio": f"{random.uniform(10, 1000):.2f}",
            "cantidad_disponible": random.randint(1, 100),
            "fecha_entrada_inventario": str(random_date(datetime(2023, 1, 1), datetime(2024, 1, 1)).date()),
            "codigo": generate_code('P'),
            "proveedor": proveedor["id"]
        }
        productos.append(producto)
    return productos

def generate_solicitudes(clientes, productos, num=10):
    solicitudes = []
    for i in range(1, num + 1):
        cliente = random.choice(clientes)
        producto = random.choice(productos)
        proveedor = next(p for p in productos if p["id"] == producto["id"])["proveedor"]
        cantidad_solicitada = random.randint(1, producto["cantidad_disponible"])
        
        # Determine if the solicitud is canceled
        is_canceled = random.choice([True, False])
        if is_canceled:
            fecha_cancelacion = str(random_date(datetime(2023, 1, 1), datetime(2024, 1, 1)))
            tipo_cancelacion = random.choice(['V', 'I'])
            razon_cancelacion = random.choice(['NI', 'NB', 'NC', 'PE', 'NP']) if tipo_cancelacion == 'V' else "NC"
        else:
            fecha_cancelacion = None
            tipo_cancelacion = None
            razon_cancelacion = None

        solicitud = {
            "id": i,
            "cantidad_solicitada": cantidad_solicitada,
            "fecha_solicitud": str(random_date(datetime(2023, 1, 1), datetime(2024, 1, 1))),
            "metodo_pago": random.choice(["TC", "PE", "TR"]),
            "fecha_cancelacion": fecha_cancelacion,
            "tipo_cancelacion": tipo_cancelacion,
            "descuento": f"{random.uniform(0, 5):.2f}",
            "razon_cancelacion": razon_cancelacion,
            "codigo": generate_code('S'),    
            "cliente": cliente["id"],
            "producto": producto["id"],
            "proveedor": proveedor
        }
        solicitudes.append(solicitud)
    return solicitudes

# Write to JSON files
def write_json(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

def main():

    clientes = generate_clientes(100)
    proveedores = generate_proveedores(20)
    productos = generate_productos(proveedores, 100)
    solicitudes = generate_solicitudes(clientes, productos, 200)

    os.makedirs('data', exist_ok=True)
    write_json(clientes, 'data/clientes.json')
    write_json(proveedores, 'data/proveedores.json')
    write_json(productos, 'data/productos.json')
    write_json(solicitudes, 'data/solicitudes.json')

    print("JSON files generated successfully!")

if __name__ == "__main__":
    main()
