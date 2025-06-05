import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (!user || user.id !== id) {
    return <p>Você não tem permissão para ver este perfil.</p>;
  }

  return (
    <div className="profile-container">
      <h1>Perfil do Usuário</h1>

      <div className="profile-info">
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Função:</strong> {user.role}</p>
      </div>

      <div className="profile-buttons">
        <button onClick={handleLogout}>Sair</button>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    </div>
  );
}
