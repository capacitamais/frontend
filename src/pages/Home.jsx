// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-logo">
        <h1>Capacita</h1>
        <FaPlus size={30} className="fa-plus" />
      </div>
      <div className="home-app-name">Gestão de treinamentos</div>
      <ul className="home-links-list">
        <li>
          <Link to="/tasks">Tarefas</Link>
        </li>
        <li>
          <Link to="/activities">Atividades</Link>
        </li>
        <li>
          <Link to="/employees">Colaboradores</Link>
        </li>
        <li>
          <Link to="/trainings">Treinamentos</Link>
        </li>
        <li>
          <Link to="/health-examinations">Exames de Saúde</Link>
        </li>
        <li>
          <Link to="/users">Usuários</Link>
        </li>
        <li>
          <Link to="/import">Importar Controle de Treinamentos</Link>
        </li>
      </ul>
    </div>
  );
}
