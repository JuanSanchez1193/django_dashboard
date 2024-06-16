import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const TipoCancelSolicitudGrafica = ({ startDate, endDate }) => {
    const [tipoCancelData, setTipoCancelData] = useState({});

    useEffect(() => {
        const fetchTipoCancelData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/ventas/api/resumen-solicitudes/', {
                    params: { start_date: startDate, end_date: endDate }
                });
                setTipoCancelData(response.data.cancelacion_data);
            } catch (error) {
                console.error('Error fetching tipo cancelacion data:', error);
            }
        };

        fetchTipoCancelData();
    }, [startDate, endDate]);

    const pieData = {
        labels: ['Voluntario', 'Involuntario'],
        datasets: [
            {
                data: [tipoCancelData.V || 0, tipoCancelData.I || 0],
                backgroundColor: ['#FF6384', '#36A2EB'],
            },
        ],
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Tipos de Cancelación</h2>
            <Pie data={pieData} />
        </div>
    );
};

export default TipoCancelSolicitudGrafica;
