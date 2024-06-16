import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/SolicitudesResumen.css';

const SolicitudesResumen = ({ startDate, endDate }) => {
    const [resumenData, setResumenData] = useState({});

    useEffect(() => {
        const fetchResumenData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/ventas/api/resumen-solicitudes/', {
                    params: { start_date: startDate, end_date: endDate }
                });
                setResumenData(response.data);
            } catch (error) {
                console.error('Error fetching resumen data:', error);
            }
        };

        fetchResumenData();
    }, [startDate, endDate]);

    return (
        <div className="solicitudes-resumen">
            <div className="solicitud-item">
                <p>Solicitudes</p>
                <span>{resumenData.total_solicitudes}</span>
            </div>
            <div className="solicitud-item">
                <p>Activas</p>
                <span>{resumenData.solicitudes_activas}</span>
            </div>
            <div className="solicitud-item">
                <p>Canceladas</p>
                <span>{resumenData.solicitudes_canceladas}</span>
            </div>
        </div>
    );
};

export default SolicitudesResumen;
