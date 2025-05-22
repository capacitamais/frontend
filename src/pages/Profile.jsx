import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { id } = useParams();
  const user = useAuth();

  // Você pode buscar mais dados do usuário via API aqui, se necessário

  if (!user || user.id !== id) {
    return <p>Você não tem permissão para ver este perfil.</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Perfil do Usuário</h1>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Função:</strong> {user.role}</p>

      {/* Futuro: adicionar botões para editar ou excluir conta */}
    </div>
  );
}
