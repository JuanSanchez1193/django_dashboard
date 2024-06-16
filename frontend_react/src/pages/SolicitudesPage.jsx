import React, { useEffect, useState } from "react";
import { CabeceraObjetos } from "../components/CabeceraObjetos";
import FechaRango from "../components/FechaRango";
import SolicitudFila from "../components/SolicitudFila";
import axios from "axios";
import "../Styles/SolicitudesPage.css";
import FiltroOpciones from "../components/FiltroOpciones";
import { Pie } from "react-chartjs-2";
import 'chart.js/auto';

export function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [totales, setTotales] = useState({ total_solicitudes: 0, total_cantidad_solicitada: 0, total_cantidad_vendida: 0, total_ganancias: 0 });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeCancelled, setIncludeCancelled] = useState(false);
  const [selectedTopOption, setSelectedTopOption] = useState('nada');
  const [selectedOtherOption, setSelectedOtherOption] = useState('CANT_SOLICITADA');
  const [topX, setTopX] = useState(3);  
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, includeCancelled, selectedTopOption, selectedOtherOption, topX]);

  const fetchData = () => {
    axios.get('http://localhost:8000/ventas/api/solicitudes-con-datos/', {
      params: {
        start_date: startDate,
        end_date: endDate,
        include_cancelled: includeCancelled,
        top_option: selectedTopOption,
        other_option: selectedOtherOption,
        top_x: topX
      }
    })
    .then(response => {
      setSolicitudes(response.data.solicitudes);
      setTotales(response.data.totales);
    })
    .catch(error => {
      console.error("Hubo un error al obtener las solicitudes: ", error);
    });
  };

  const handleToggleCancelled = () => {
    setIncludeCancelled(!includeCancelled);
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
    const labels = solicitudes.map(solicitud => solicitud.codigo);
    const data = solicitudes.map(solicitud => {
      switch (selectedOtherOption) {
        case 'CANT_SOLICITADA':
          return solicitud.cantidad_solicitada;
        case 'TOTAL_RECIBIDO':
          return solicitud.total_recibido;
        case 'DESCUENTO':
          return solicitud.descuento;
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
    <div className="Solicitudes-Page">
      <CabeceraObjetos />
      <div className="titulo-fecha">
        <h1>SOLICITUDES</h1>
        <button className="toggle-button" onClick={handleToggleCancelled}>
          {includeCancelled ? 'Ocultar Solicitudes Canceladas' : 'Mostrar Solicitudes Canceladas'}
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
        <div className="datos-solicitudes">
          <div className="solicitudes-header">
            <div>CODIGO</div>
            <div>FECHA SOLICITUD</div>
            <div>PRODUCTO</div>
            <div>PROVEEDOR</div>
            <div>CLIENTE</div>
            <div>CANTIDAD SOLICITADA</div>
            <div>TOTAL RECIBIDO</div>
            <div>DESCUENTO</div>
            <div>ESTADO</div>
          </div>
          {solicitudes.length > 0 ? (
            solicitudes.map((solicitud) => (
              <SolicitudFila key={solicitud.codigo} solicitud={solicitud} />
            ))
          ) : (
            <div>No hay solicitudes en el rango de fechas seleccionado.</div>
          )}
          {/* Fila de totales */}
          <div className="solicitudes-fila totales-fila">
            <div>Totales</div>
            <div></div> {/* Columna vacía para alinear con fecha solicitud */}
            <div></div> {/* Columna vacía para alinear con producto */}
            <div></div> {/* Columna vacía para alinear con proveedor */}
            <div></div> {/* Columna vacía para alinear con cliente */}
            <div>{totales.total_cantidad_solicitada}</div>
            <div>${parseFloat(totales.total_ganancias).toFixed(2)}</div>
            <div></div> {/* Columna vacía para alinear con cliente */}
            <div></div> {/* Columna vacía para alinear con cliente */}
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
            { value: 'CANT_SOLICITADA', label: 'Cantidad Solicitada' },
            { value: 'TOTAL_RECIBIDO', label: 'Total Recibido' },
            { value: 'DESCUENTO', label: 'Descuento' }
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
