// CabeceraObjetos.jsx
import React from 'react';
import '../Styles/CabeceraObjetos.css';
import { BotonesObjetosBar } from './BotonesObjetosBar';
import { Buscador } from './Buscardor';

export function CabeceraObjetos() {
  return (
    <div className="cabecera-objetos">
      <BotonesObjetosBar/>
      <Buscador/>
    </div>
  );
}