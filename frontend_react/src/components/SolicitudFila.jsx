import React from 'react';

const SolicitudFila = ({ solicitud }) => {
  return (
    <div className="solicitud-fila">
      <div>{solicitud.codigo}</div>
      <div>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</div>
      <div>{solicitud.producto}</div>
      <div>{solicitud.proveedor}</div>
      <div>{solicitud.cliente}</div>
      <div>{solicitud.cantidad_solicitada}</div>
      <div>{solicitud.total_recibido.toFixed(2)}</div>
      <div>{solicitud.descuento}%</div>
      <div>{solicitud.estado}</div>
    </div>
  );
};

export default SolicitudFila;
