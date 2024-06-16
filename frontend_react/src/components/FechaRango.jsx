import React from 'react';
import '../Styles/FechaRango.css';

const FechaRango = ({ startDate, endDate, setStartDate, setEndDate, handleFilterSubmit }) => {
  return (
    <form className="fecha-rango-form" onSubmit={handleFilterSubmit}>
      <label>
        Fecha de inicio:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        Fecha de fin:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <button type="submit">Filtrar</button>
    </form>
  );
};

export default FechaRango;
