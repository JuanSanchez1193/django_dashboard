import React from 'react';
import { Pie } from 'react-chartjs-2';

const GraficaProductos = ({ data }) => {
  const chartData = {
    labels: data.map(producto => producto.codigo),
    datasets: [
      {
        label: 'Total Ganancias',
        data: data.map(producto => producto.total_ganancias),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ]
      }
    ]
  };

  return (
    <div>
      <h2>Gráfica de Total Ganancias</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default GraficaProductos;
