import React, { useState, useEffect } from 'react';
import '../Styles/Solicitud.css';
import { CabeceraObjetos } from './CabeceraObjetos';

export function Solicitud({ data }) {
  const [activeTab, setActiveTab] = useState('DETAILS');

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className='Solicitud'>
      <CabeceraObjetos />
      <div className='header'>
        <h1 className='codigo'>{data.codigo}</h1>
      </div>
      <div className='separador'></div>

      <div className="solicitud-info">
        <div className="info-item-content"><strong>Cliente:</strong> <span className="data-item-content">{data.cliente_nombre}</span></div>
        <div className="info-item-content"><strong>Email:</strong> <span className="data-item-content">{data.cliente_email}</span></div>
        <div className="info-item-content"><strong>Phone#:</strong> <span className="data-item-content">{data.cliente_telefono}</span></div>
        <div className="info-item-content"><strong>Cliente Codigo:</strong> <span className="data-item-content">{data.cliente_codigo}</span></div>
      </div>

      <div className="tabs">
        <button className={activeTab === 'DETAILS' ? 'active' : ''} onClick={() => setActiveTab('DETAILS')}>DETAILS</button>
        <button className={activeTab === 'PRICING' ? 'active' : ''} onClick={() => setActiveTab('PRICING')}>PRICING</button>
      </div>

      <div className="tab-content">
        {activeTab === 'DETAILS' && (
          <div className="details">
            <div className="section">
              <div className="info-item"><strong>Localizador:</strong> <span className="data-item">{data.codigo}</span></div>
              <div className="info-item"><strong>Proveedor:</strong> <span className="data-item">{data.proveedor_codigo}</span></div>
              <div className="info-item"><strong>Producto:</strong> <span className="data-item">{data.producto_codigo}</span></div>
              <div className="info-item"><strong>Precio:</strong> <span className="data-item">${data.producto_precio}</span></div>
              <div className="info-item"><strong>Descuento:</strong> <span className="data-item">{data.descuento ? `%${data.descuento}` : 'N/A'}</span></div>
            </div>
            <div className="section">
              <div className="info-item"><strong>Status:</strong> <span className="data-item">{data.fecha_cancelacion ? 'Cancelled' : 'Active'}</span></div>
              <div className="info-item"><strong>Created:</strong> <span className="data-item">{new Date(data.fecha_solicitud).toLocaleString()}</span></div>
              <div className="info-item"><strong>Cantidad:</strong> <span className="data-item">{data.cantidad_solicitada}</span></div>
              <div className="info-item"><strong>Total:</strong> <span className="data-item">{data.total}</span></div>
              <div className="info-item"><strong>Método de Pago:</strong> <span className="data-item">{data.metodo_pago}</span></div>
            </div>
          </div>
        )}
        {activeTab === 'PRICING' && (
          <div className="pricing">
            <div className="info-item"><strong>Precio:</strong> <span className="data-item">${data.producto_precio}</span></div>
          </div>
        )}
      </div>

      <div className="product-details">
        <h2 className="product-name">{data.producto_nombre}</h2>
        <p className="product-description">{data.producto_descripcion}</p>
      </div>
    </div>
  );
}
