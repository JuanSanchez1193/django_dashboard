import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function SolicitudesCliente({ clienteId, startDate, endDate }) {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    fetchSolicitudes();
  }, [clienteId, startDate, endDate]);

  const fetchSolicitudes = () => {
    axios.get('http://localhost:8000/ventas/api/solicitudes-cliente/', {
      params: {
        cliente: clienteId,
        start_date: startDate,
        end_date: endDate,
      }
    })
    .then(response => {
      setSolicitudes(response.data);
    })
    .catch(error => {
      console.error('Error al obtener las solicitudes del cliente:', error);
    });
  };

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
      <h3>Solicitudes del Cliente</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre Producto</th>
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
              <td>{solicitud.producto_nombre}</td>
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
