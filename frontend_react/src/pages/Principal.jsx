// Principal.jsx

import React, { useState } from 'react';
import SolicitudesResumen from "../components/SolicitudesResumen";
import TipoCancelSolicitudGrafica from "../components/TipoCancelSolicitudGrafica";
import RazonesCancelacionGrafica from "../components/RazonesCancelacionGrafica";
import { CabeceraObjetos } from '../components/CabeceraObjetos';
import FechaRango from '../components/FechaRango';

import "../Styles/Principal.css";

export function Principal() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica para manejar el filtro de fechas
    };

    return (
        <div className='Principal'>
            <CabeceraObjetos/>
            <div className='datos_principal'>
                <SolicitudesResumen startDate={startDate} endDate={endDate} />
                            
                <FechaRango 
                startDate={startDate} 
                endDate={endDate} 
                setStartDate={setStartDate} 
                setEndDate={setEndDate} 
                handleFilterSubmit={handleFilterSubmit} 
                
                />
            </div>
            <div className='graficas_principal'>
                <div className='grafica-container'>
                    <TipoCancelSolicitudGrafica startDate={startDate} endDate={endDate} />
                </div>
                <div className='grafica-container'>
                    <RazonesCancelacionGrafica startDate={startDate} endDate={endDate} />
                </div>
            </div>

        </div>
    );
}
