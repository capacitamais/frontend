// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const user = useAuth();

  if (!user) return null; // Evita renderizar se não estiver logado

  return (
    <nav>
      <Link to="/">
        <button>Início</button>
      </Link>
      <Link to={`/profile/${user.id}`}>
        <button>Meu Perfil</button>
      </Link>
    </nav>
  );
}
