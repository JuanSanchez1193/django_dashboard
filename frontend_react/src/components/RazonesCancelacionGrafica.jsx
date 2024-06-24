// RazonesCancelacionGrafica.jsx
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { fetchRazonesCancelacion } from '../api/ventas.api'; 

const RazonesCancelacionGrafica = ({ startDate, endDate }) => {
    const [razonesData, setRazonesData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchRazonesCancelacion(startDate, endDate);
                setRazonesData(data);
            } catch (error) {
                console.error('Error fetching razones de cancelacion data:', error);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    const pieData = {
        labels: [
            'No estoy interesado en el producto',
            'No encontré lo que buscaba',
            'No hay la cantidad suficiente que necesito',
            'El precio es muy elevado',
            'La marca/proveedor no es la que busco',
            'Solicitud cancelada repentinamente'
        ],
        datasets: [
            {
                data: [
                    razonesData['NI'] || 0,
                    razonesData['NB'] || 0,
                    razonesData['NC'] || 0,
                    razonesData['PE'] || 0,
                    razonesData['NP'] || 0,
                    razonesData['SR'] || 0,
                ],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
            },
        ],
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Razones de Cancelación</h2>
            <Pie data={pieData} />
        </div>
    );
};

export default RazonesCancelacionGrafica;
