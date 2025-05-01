// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h1>404 - Página não encontrada</h1>
      <p>A página que você tentou acessar não existe.</p>
      <Link to="/">
        Voltar para o início.
      </Link>
    </div>
  );
}
