import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import NavbarBtn from "../NavBarBtn/NavbarBtn";
import "./style.css";

export default function Navbar() {
  const user = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user) return null;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleLogout = () => {
    // Aqui você pode adicionar lógica de logout, ex: limpar token e redirecionar
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
        </button>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavbarBtn to="/" onClick={() => setMenuOpen(false)}>Início</NavbarBtn>
          <NavbarBtn to={`/profile/${user.id}`} onClick={() => setMenuOpen(false)}>Perfil</NavbarBtn>
        </div>
      </div>

      <div className="profile-menu">
        <button
          className="profile-btn"
          onClick={toggleProfile}
          aria-haspopup="true"
          aria-expanded={profileOpen}
        >
          Olá, {user.name || "Usuário"}
        </button>
        {profileOpen && (
          <ul className="dropdown">
            <li>
              <NavbarBtn to={`/profile/${user.id}`} onClick={() => setProfileOpen(false)}>
                Meu Perfil
              </NavbarBtn>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Sair
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
