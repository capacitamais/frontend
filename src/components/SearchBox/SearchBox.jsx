import { useState } from 'react';
import "./style.css"

export default function SearchBox({ onSearch }) { // Adicionado o { após function SearchBox
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className='searchBox'>
      <input
        type="text"
        placeholder="Procurar..."
        value={searchTerm}
        onChange={handleInputChange}
        className="searchBoxInput" // Mantenha esta classe se quiser usar .searchBoxInput no CSS
      />
      <button onClick={handleSearch}>Buscar</button> {/* Removido value="->" pois não é necessário para o botão */ }
    </div>
  );
}