import React, { useState } from 'react';
import "../Styles/FiltroOpciones.css"

const FiltroOpciones = ({ onFilterChange, topOptions, otherOptions, topLabel, otherLabel }) => {
  const [selectedTopOption, setSelectedTopOption] = useState(topOptions[0].value);
  const [selectedOtherOption, setSelectedOtherOption] = useState(otherOptions[0].value);
  const [topX, setTopX] = useState(3);  // Valor predeterminado para el top X

  const handleTopOptionChange = (e) => {
    const value = e.target.value;
    setSelectedTopOption(value);
    onFilterChange(value, selectedOtherOption, topX);
  };

  const handleOtherOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOtherOption(value);
    onFilterChange(selectedTopOption, value, topX);
  };

  const handleTopXChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setTopX(value);
    onFilterChange(selectedTopOption, selectedOtherOption, value);
  };

  return (
    <div className="filtro-opciones">
      <label>
        {topLabel}:
        <select value={selectedTopOption} onChange={handleTopOptionChange}>
          {topOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        {otherLabel}:
        <select value={selectedOtherOption} onChange={handleOtherOptionChange}>
          {otherOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Top X:
        <input 
          type="number" 
          value={topX} 
          min="1" 
          onChange={handleTopXChange} 
        />
      </label>
    </div>
  );
};

export default FiltroOpciones;
