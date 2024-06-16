import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import '../Styles/Buscador.css';

export function Buscador() {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    axios.get(`http://localhost:8000/ventas/api/buscar/${searchTerm}/`)
      .then(response => {
        // Almacenar los datos en localStorage
        localStorage.setItem('searchData', JSON.stringify(response.data));
        // Abrir una nueva pestaña con la URL
        window.open(`/codigo/${searchTerm}`, '_blank');
        setError(null);
      })
      .catch(error => {
        console.error('Error de búsqueda:', error);
        setError('No se pudo completar la búsqueda. Inténtalo de nuevo más tarde.');
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