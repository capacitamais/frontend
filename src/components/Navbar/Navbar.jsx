// src/components/Navbar.jsx
import { useAuth } from '../../hooks/useAuth';
import NavbarBtn from '../NavBarBtn/NavbarBtn';
import './style.css';

export default function Navbar() {
  const user = useAuth();

  if (!user) return null; // Evita renderizar se não estiver logado

  return (
    <nav className='navbar'>
      <NavbarBtn to='/'>Início</NavbarBtn>
      <NavbarBtn to={`/profile/${user.id}`}>Perfil</NavbarBtn>
    </nav>
  );
}
