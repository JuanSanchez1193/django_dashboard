import React, { useState } from 'react';
import '../Styles/Proveedor.css';
import { SolicitudesProveedor } from './SolicitudesProveedor';
import { CabeceraObjetos } from './CabeceraObjetos';
import FechaRango from "./FechaRango";

export function Proveedor({ data }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilterSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className='Proveedor'>
      <CabeceraObjetos/>
      <div className='header'>
        <h1 className='codigo'>{data.codigo}</h1>
        <FechaRango 
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleFilterSubmit={handleFilterSubmit}
        />
      </div>
      <div className='separador'></div>

      <div className="proveedor-container">
        <h2 className="proveedor-nombre">{data.nombre}</h2>
        <div className="proveedor-info">
          <div className="info-item">
            <strong class='item-info'>Email:</strong> <span className="data-item">{data.email}</span>
          </div>
          <div className="info-item">
            <strong class='item-info'>Teléfono:</strong> <span className="data-item">{data.telefono}</span>
          </div>
          <div className="info-item">
            <strong class='item-info'>Dirección:</strong> <span className="data-item">{data.direccion}</span>
          </div>
          <div className="info-item">
            <strong class='item-info'>Sitio Web:</strong> <span className="data-item">{data.sitio_web}</span>
          </div>
          <div className="info-item">
            <strong class='item-info'>Calificación:</strong> <span className="data-item">{data.calificacion}</span>
          </div>
          <div className="info-item">
            <strong class='item-info'>Código:</strong> <span className="data-item">{data.codigo}</span>
          </div>
        </div>

        <SolicitudesProveedor 
          proveedorId={data.id} 
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </div>
  );
}
