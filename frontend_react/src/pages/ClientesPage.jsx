import React, { useEffect, useState } from "react";
import { CabeceraObjetos } from "../components/CabeceraObjetos";
import FechaRango from "../components/FechaRango";
import ClienteFila from "../components/ClienteFila";
import axios from "axios";
import "../Styles/ClientesPage.css";
import FiltroOpciones from "../components/FiltroOpciones";
import { Pie } from "react-chartjs-2";
import 'chart.js/auto';

export function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [totales, setTotales] = useState({ total_solicitudes: 0, total_cantidad_comprada: 0, total_gastado: 0 });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeWithoutRequests, setIncludeWithoutRequests] = useState(false);
  const [selectedTopOption, setSelectedTopOption] = useState('nada');
  const [selectedOtherOption, setSelectedOtherOption] = useState('CANT_COMPRADA');
  const [topX, setTopX] = useState(3);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, includeWithoutRequests, selectedTopOption, selectedOtherOption, topX]);

  const fetchData = () => {
    axios.get('http://localhost:8000/ventas/api/clientes-con-datos/', {
      params: {
        start_date: startDate,
        end_date: endDate,
        include_without_requests: includeWithoutRequests,
        top_option: selectedTopOption,
        other_option: selectedOtherOption,
        top_x: topX
      }
    })
    .then(response => {
      setClientes(response.data.clientes);
      setTotales(response.data.totales);
    })
    .catch(error => {
      console.error("Hubo un error al obtener los clientes: ", error);
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
    const labels = clientes.map(cliente => cliente.codigo);
    const data = clientes.map(cliente => {
      switch (selectedOtherOption) {
        case 'CANT_COMPRADA':
          return cliente.cantidad_comprada;
        case 'CANT_SOLICITUDES':
          return cliente.cantidad_solicitudes;
        case 'TOTAL_GASTADO':
          return cliente.total_gastado;
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
    <div className="Clientes-Page">
      <CabeceraObjetos />
      <div className="titulo-fecha">
        <h1>CLIENTES</h1>
        <button className="toggle-button" onClick={handleToggleInclude}>
          {includeWithoutRequests ? 'Ocultar Clientes sin Solicitudes' : 'Mostrar Clientes sin Solicitudes'}
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
        <div className="datos-clientes">
          <div className="clientes-header">
            <div>CODIGO</div>
            <div>CANT_COMPRADA</div>
            <div>CANT_SOLICITUDES</div>
            <div>TOTAL_GASTO</div>
          </div>
          <div className="clientes-lista">
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <ClienteFila key={cliente.codigo} cliente={cliente} />
              ))
            ) : (
              <div>No hay clientes en el rango de fechas seleccionado.</div>
            )}
          </div>
          {/* Fila de totales */}
          <div className="clientes-fila totales-fila">
            <div>Totales</div>
            <div>{totales.total_cantidad_comprada}</div>
            <div>{totales.total_solicitudes}</div>
            <div>{totales.total_gastado}</div>
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
            { value: 'CANT_COMPRADA', label: 'Cantidad Comprada' },
            { value: 'CANT_SOLICITUDES', label: 'Cantidad Solicitudes' },
            { value: 'TOTAL_GASTADO', label: 'Total Gastado' },
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

export default ClientesPage;
