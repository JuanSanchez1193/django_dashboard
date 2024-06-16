import React, { useState } from 'react';
import '../Styles/Producto.css';
import { SolicitudesProducto } from './SolicitudesProducto';
import { CabeceraObjetos } from './CabeceraObjetos';
import FechaRango from "./FechaRango";

export function Producto({ data }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilterSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className='Producto'>
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

      <div className="producto-container">
        <h2 className="producto-nombre">{data.nombre}</h2>
        <div className="producto-info">
          <div className="info-item">
            <strong class='item-info'>Cantidad Disponible:</strong> <span className="data-item">{data.cantidad_disponible}</span>
          </div>
          <div className="info-item">
            <strong class='item-info'>Código:</strong> <span className="data-item">{data.codigo}</span>
          </div>
          <div className="info-item">
            <strong class='item-info'>ID:</strong> <span className="data-item">{data.id}</span>
          </div>
          <div className="info-item">
            <strong class='item-info'>Precio:</strong> <span className="data-item">${data.precio}</span>
          </div>
          <div className="info-item">
            <strong class='item-info'>Fecha de Entrada al Inventario:</strong> <span className="data-item">{data.fecha_entrada_inventario}</span>
          </div>
        </div>
        <div className="producto-descripcion">
          <p>{data.descripcion}</p>
        </div>

        <SolicitudesProducto 
          productId={data.id} 
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </div>
  );
}
