// BotonesObjetosBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/BotonesObjetosBar.css';

export function BotonesObjetosBar() {
  return (
    <div className="botones-objetos-bar">
      <Link to="/" className="boton">Inicio</Link>
      <Link to="/solicitudes" className="boton">Solicitudes</Link>
      <Link to="/productos" className="boton">Productos</Link>
      <Link to="/Proveedores" className="boton">Proveedores</Link>
      <Link to="/Clientes" className="boton">Clientes</Link>     
    </div>
  );
};
