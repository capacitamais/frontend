import { useState } from 'react';
import './SearchBox.css';

export default function SearchBox({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
      setSearchTerm(''); // Limpa o campo após buscar (opcional)
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="searchBox">
      <input
        type="text"
        placeholder="Procurar..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="searchBoxInput"
        aria-label="Campo de busca"
      />
      <button
        onClick={handleSearch}
        className="searchBoxButton"
        aria-label="Botão de buscar"
      >
        🔍 Buscar
      </button>
    </div>
  );
}
