import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { buscadorCodigos } from '../api/ventas.api';
import '../Styles/Buscador.css';

export function Buscador() {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    buscadorCodigos(searchTerm)
      .then(response => {
        // Almacenar los datos en localStorage
        localStorage.setItem('searchData', JSON.stringify(response.data));
        // Abrir una nueva pestaña con los datos
        window.open(`/codigo/${searchTerm}`, '_blank');
      })
      .catch(error => {
        setError('Error al buscar el código.');
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="buscador">
      <input
        type="text"
        placeholder="Buscar códigos de letras..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>
        <FaSearch />
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
