import React from "react";

function ClienteFila({ cliente }) {
  return (
    <div className="cliente-fila">
      <div>{cliente.codigo}</div>
      <div>{cliente.cantidad_comprada}</div>
      <div>{cliente.cantidad_solicitudes}</div>
      <div>${parseFloat(cliente.total_gastado).toFixed(2)}</div>
    </div>
  );
}

export default ClienteFila;
