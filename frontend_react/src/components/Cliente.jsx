import React, { useState } from 'react';
import '../Styles/Cliente.css';
import { SolicitudesCliente } from './SolicitudesCliente';
import { CabeceraObjetos } from './CabeceraObjetos';
import FechaRango from "./FechaRango";

export function Cliente({ data }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilterSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className='Cliente'>
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

      <div className="cliente-container">
        <h2 className="cliente-nombre">{data.nombre}</h2>
        <div className="cliente-info">
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
            <strong class='item-info'>Fecha de Registro:</strong> <span className="data-item">{data.fecha_registro}</span>
          </div>
          <div className="info-item">
            <strong class='item-info'>Código:</strong> <span className="data-item">{data.codigo}</span>
          </div>
        </div>

        <SolicitudesCliente 
          clienteId={data.id} 
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </div>
  );
}
