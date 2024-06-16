import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Producto } from './Producto';
import { Cliente } from './Cliente';
import { Proveedor } from './Proveedor';
import { Solicitud } from './Solicitud';

export function Detalle() {
  const location = useLocation();
  const [data, setData] = useState(location.state?.data || null);

  useEffect(() => {
    if (!data) {
      // Intentar recuperar los datos de localStorage si no están en location.state
      const storedData = localStorage.getItem('searchData');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    }
  }, [data]);

  if (!data) {
    return <div>Cargando datos...</div>;
  }

  let content;
  switch (data.tipo) {
    case 'Producto':
      content = <Producto data={data} />;
      break;
    case 'Cliente':
      content = <Cliente data={data} />;
      break;
    case 'Proveedor':
      content = <Proveedor data={data} />;
      break;
    case 'Solicitud':
      content = <Solicitud data={data} />;
      break;
    default:
      content = <div>No se encontró información.</div>;
  }

  return <div>{content}</div>;
}
