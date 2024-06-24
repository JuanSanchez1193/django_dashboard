import React, { useEffect, useState } from 'react';
import { fetchResumenSolicitudes } from '../api/ventas.api'; 
import '../Styles/SolicitudesResumen.css';

const SolicitudesResumen = ({ startDate, endDate }) => {
    const [resumenData, setResumenData] = useState({});

    useEffect(() => {
        const fetchResumenData = async () => {
            try {
                const data = await fetchResumenSolicitudes(startDate, endDate);
                setResumenData(data);
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
