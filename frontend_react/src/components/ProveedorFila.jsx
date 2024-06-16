import React from "react";

function ProveedorFila({ proveedor }) {
  return (
    <div className="proveedor-fila">
      <div>{proveedor.codigo}</div>
      <div>{proveedor.cantidad_productos_manejados}</div>
      <div>{proveedor.cantidad_solicitudes}</div>
      <div>{proveedor.cantidad_vendida}</div>
      <div>{proveedor.calificacion}</div>
      <div>${parseFloat(proveedor.total_ganancias).toFixed(2)}</div>
    </div>
  );
}

export default ProveedorFila;
