// ProductosPage.js
import React, { useEffect, useState } from "react";
import { CabeceraObjetos } from "../components/CabeceraObjetos";
import FechaRango from "../components/FechaRango";
import ProductoFila from "../components/ProductoFila";
import "../Styles/ProductosPage.css";
import FiltroOpciones from "../components/FiltroOpciones";
import { Pie } from "react-chartjs-2";
import 'chart.js/auto';

import { fetchProductosConDatos } from "../api/ventas.api";

export function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [totales, setTotales] = useState({ total_solicitudes: 0, total_ventas: 0, total_ganancias: 0 });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeWithoutRequests, setIncludeWithoutRequests] = useState(false);
  const [selectedTopOption, setSelectedTopOption] = useState('nada');
  const [selectedOtherOption, setSelectedOtherOption] = useState('CANT_PEDIDA_TOTAL');
  const [topX, setTopX] = useState(3);  // Valor predeterminado para el top X
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, includeWithoutRequests, selectedTopOption, selectedOtherOption, topX]);

  const fetchData = () => {
    fetchProductosConDatos({
      startDate,
      endDate,
      includeWithoutRequests,
      topOption: selectedTopOption,
      otherOption: selectedOtherOption,
      topX
    }).then(data => {
      setProductos(data.productos);
      setTotales(data.totales);
    }).catch(error => {
      console.error("Hubo un error al obtener los productos: ", error);
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
    const labels = productos.map(producto => producto.codigo);
    const data = productos.map(producto => {
      switch (selectedOtherOption) {
        case 'CANT_PEDIDA_TOTAL':
          return producto.cantidad_pedida_total;
        case 'CANT_VENDIDA':
          return producto.cantidad_vendida;
        case 'CANT_DISPO':
          return producto.cantidad_disponible;
        case 'PRECIO_TOTAL':
          return producto.precio_total;
        case 'TOTAL_GANANCIAS':
          return producto.total_ganancias;
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
    <div className="Productos-Page">
      <CabeceraObjetos />
      <div className="titulo-fecha">
        <h1>PRODUCTOS</h1>
        <button className="toggle-button" onClick={handleToggleInclude}>
          {includeWithoutRequests ? 'Ocultar Productos sin Solicitudes' : 'Mostrar Productos sin Solicitudes'}
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
        <div className="datos-productos">
          <div className="productos-header">
            <div>CODIGO</div>
            <div>FECHA_INGRE</div>
            <div>CANT_PEDIDA_TOTAL</div>
            <div>CANT_VENDIDA</div>
            <div>CANT_DISPO</div>
            <div>PRECIO_TOTAL</div>
            <div>TOTAL_GANANCIAS</div>
          </div>
          <div className="productos-lista">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <ProductoFila key={producto.codigo} producto={producto} />
              ))
            ) : (
              <div>No hay productos en el rango de fechas seleccionado.</div>
            )}
          </div>
          {/* Fila de totales */}
          <div className="productos-fila totales-fila">
            <div>Totales</div>
            <div></div> {/* Columna vacía para alinear con fecha ingreso */}
            <div>{totales.total_solicitudes}</div>
            <div>{totales.total_ventas}</div>
            <div></div> {/* Columna vacía para alinear con cantidad disponible */}
            <div></div> {/* Columna vacía para alinear con precio total */}
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
            { value: 'CANT_PEDIDA_TOTAL', label: 'Cantidad Pedida Total' },
            { value: 'CANT_VENDIDA', label: 'Cantidad Vendida' },
            { value: 'CANT_DISPO', label: 'Cantidad Disponible' },
            { value: 'PRECIO_TOTAL', label: 'Precio Total' },
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
