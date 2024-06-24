// ProveedoresPage.js
import React, { useEffect, useState } from "react";
import { CabeceraObjetos } from "../components/CabeceraObjetos";
import FechaRango from "../components/FechaRango";
import ProveedorFila from "../components/ProveedorFila";
import "../Styles/ProveedoresPage.css";
import FiltroOpciones from "../components/FiltroOpciones";
import { Pie } from "react-chartjs-2";
import 'chart.js/auto';

import { fetchProveedoresConDatos } from "../api/ventas.api";

export function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [totales, setTotales] = useState({ total_solicitudes: 0, total_ventas: 0, total_ganancias: 0 });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeWithoutRequests, setIncludeWithoutRequests] = useState(false);
  const [selectedTopOption, setSelectedTopOption] = useState('nada');
  const [selectedOtherOption, setSelectedOtherOption] = useState('CANT_PRODUCTOS_VENDIDOS');
  const [topX, setTopX] = useState(3);  // Valor predeterminado para el top X
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, includeWithoutRequests, selectedTopOption, selectedOtherOption, topX]);

  const fetchData = () => {
    fetchProveedoresConDatos({
      startDate,
      endDate,
      includeWithoutRequests,
      topOption: selectedTopOption,
      otherOption: selectedOtherOption,
      topX
    }).then(data => {
      setProveedores(data.proveedores);
      setTotales(data.totales);
    }).catch(error => {
      console.error("Hubo un error al obtener los proveedores: ", error);
    });
  };

  const handleToggleInclude = () => {
    setIncludeWithoutRequests(!includeWithoutRequests);
  };

  const handleFilterChange = (topOption, otherOption, topX) => {
    setSelectedTopOption(topOption);
    setSelectedOtherOption(otherOption);
    setTopX(topX);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleToggleChart = () => {
    setShowChart(!showChart);
  };

  const generateChartData = () => {
    const labels = proveedores.map(proveedor => proveedor.codigo);
    const data = proveedores.map(proveedor => {
      switch (selectedOtherOption) {
        case 'CANT_PROD_MANEJADOS':
          return proveedor.cantidad_productos_manejados;
        case 'CANT_SOLICITUDES':
          return proveedor.cantidad_solicitudes;
        case 'CANT_VENDIDA':
          return proveedor.cantidad_vendida;
        case 'CALIFICACION':
          return proveedor.calificacion;
        case 'TOTAL_GANANCIAS':
          return proveedor.total_ganancias;
        default:
          return 0;
      }
    });

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      }],
    };
  };

  return (
    <div className="Proveedores-Page">
      <CabeceraObjetos />
      <div className="titulo-fecha">
        <h1>PROVEEDORES</h1>
        <button className="toggle-button" onClick={handleToggleInclude}>
          {includeWithoutRequests ? 'Ocultar Proveedores sin Solicitudes' : 'Mostrar Proveedores sin Solicitudes'}
        </button>
        <FechaRango 
          startDate={startDate} 
          endDate={endDate} 
          setStartDate={setStartDate} 
          setEndDate={setEndDate} 
          handleFilterSubmit={handleFilterSubmit}
        />
      </div>
      <div className="separador"></div>
      <div className="contenedor-tabla">
        <div className="datos-proveedores">
          <div className="proveedores-header">
            <div>CODIGO</div>
            <div>CANT_PROD_MANEJADOS</div>
            <div>CANT_SOLICITUDES</div>
            <div>CANTIDAD_VENDIDA</div>
            <div>CALIFICACION</div>
            <div>TOTAL_GANANCIAS</div>
          </div>
          <div className="proveedores-lista">
            {proveedores.length > 0 ? (
              proveedores.map((proveedor) => (
                <ProveedorFila key={proveedor.codigo} proveedor={proveedor} />
              ))
            ) : (
              <div>No hay proveedores en el rango de fechas seleccionado.</div>
            )}
          </div>
          {/* Fila de totales */}
          <div className="proveedores-fila totales-fila">
            <div>Totales</div>
            <div></div> {/* Columna vacía para alinear  */}
            <div>{totales.total_solicitudes}</div>
            <div></div> {/* Columna vacía para alinear  */}
            <div></div> {/* Columna vacía para alinear  */}
            <div>${parseFloat(totales.total_ganancias).toFixed(2)}</div>
          </div>
        </div>
        <FiltroOpciones 
          onFilterChange={handleFilterChange}
          topOptions={[
            { value: 'nada', label: 'Nada' },
            { value: 'mejores', label: 'Mejores' },
            { value: 'peores', label: 'Peores' }
          ]}
          otherOptions={[
            { value: 'CANT_PROD_MANEJADOS', label: 'Cantidad Productos Manejados' },
            { value: 'CANT_SOLICITUDES', label: 'Cantidad Solicitudes' },
            { value: 'CANT_VENDIDA', label: 'Cantidad Vendida' },
            { value: 'CALIFICACION', label: 'Calificación' },
            { value: 'TOTAL_GANANCIAS', label: 'Total Ganancias' }
          ]}
          topLabel="Seleccione Mejores/Peores"
          otherLabel="Seleccione Criterio"
        />
      </div>
      <button onClick={handleToggleChart} className="grafico-button">
        {showChart ? 'Ocultar Gráfico' : 'Mostrar Gráfico'}
      </button>
      {showChart && (
        <div className="grafico-pastel-container">
          <div className="grafico-pastel">
            <Pie data={generateChartData()} />
          </div>
        </div>
      )}
    </div>
  );
}
