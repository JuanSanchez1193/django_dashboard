import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Producto } from './Producto';
import { Cliente } from './Cliente';
import { Proveedor } from './Proveedor';
import { Solicitud } from './Solicitud';

export function Detalle() {
  const { codigo } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('searchData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.codigo === codigo) {
        setData(parsedData);
      }
    }
  }, [codigo]);

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
