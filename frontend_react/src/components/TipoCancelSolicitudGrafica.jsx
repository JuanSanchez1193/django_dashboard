import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { fetchTipoCancelacion } from '../api/ventas.api'; 

const TipoCancelSolicitudGrafica = ({ startDate, endDate }) => {
    const [tipoCancelData, setTipoCancelData] = useState({});

    useEffect(() => {
        const fetchTipoCancelData = async () => {
            try {
                const data = await fetchTipoCancelacion(startDate, endDate);
                setTipoCancelData(data);
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
