import React, { useState, useEffect } from 'react';
import { fetchSolicitudesProducto } from '../api/ventas.api';

export function SolicitudesProducto({ productId, startDate, endDate }) {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const data = await fetchSolicitudesProducto(productId, startDate, endDate);
        setSolicitudes(data);
      } catch (error) {
        console.error('Error al obtener las solicitudes del producto:', error);
      }
    };

    fetchSolicitudes();
  }, [productId, startDate, endDate]);

  const getSolicitudEstado = (solicitud) => {
    const fechaCancelacion = solicitud.fecha_cancelacion ? new Date(solicitud.fecha_cancelacion) : null;
    const fechaSolicitud = new Date(solicitud.fecha_solicitud);
    const filtroStartDate = new Date(startDate);
    const filtroEndDate = new Date(endDate);

    if (!fechaCancelacion || fechaCancelacion > filtroEndDate) {
      return 'Activa';
    }
    if (fechaCancelacion && fechaCancelacion <= filtroEndDate) {
      return 'Cancelada';
    }
    if (fechaSolicitud <= filtroEndDate && fechaSolicitud >= filtroStartDate) {
      return 'Activa';
    }
    return 'Cancelada';
  };

  return (
    <div>
      <h3>Solicitudes del Producto</h3>
      <table>
        <thead>
          <tr>
            <th>Código Cliente</th>
            <th>Cantidad Solicitada</th>
            <th>Fecha de Solicitud</th>
            <th>Método de Pago</th>
            <th>Estado</th>
            <th>Código Solicitud</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map(solicitud => (
            <tr key={solicitud.id}>
              <td>{solicitud.cliente_codigo}</td>
              <td>{solicitud.cantidad_solicitada}</td>
              <td>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
              <td>{solicitud.metodo_pago}</td>
              <td>{getSolicitudEstado(solicitud)}</td>
              <td>{solicitud.solicitud_codigo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
