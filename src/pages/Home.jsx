// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>Capacita +</h1>
      <h3>Gestão de treinamentos</h3>
      <ul>
        <li><Link to="/tasks">Tarefas</Link></li>
        <li><Link to="/activities">Atividades</Link></li>
        <li><Link to="/employees">Colaboradores</Link></li>
        <li><Link to="/trainings">Treinamentos</Link></li>
        <li><Link to="/health-examinations">Exames de Saúde</Link></li>
        <li><Link to="/users">Usuários</Link></li>
      </ul>
    </div>
  );
}

