import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EditBtn from "../components/EditBtn/EditBtn";
import api from "../hooks/api";

export default function User() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => console.error("Erro ao buscar o usuário:", error));
  }, [id]);

  if (!user) return <p>Carregando...</p>;

  console.log(user);

  return (
    <>
      <h2><strong>Nome: </strong> {user.name}</h2>
      <p><strong>Matrícula: </strong> {user.registration}</p>
      <p>{user.role}</p>
      <EditBtn to={`/users/${id}/edit`} />
      <button onClick={() => navigate(-1)}>Voltar</button>
    </>
  );
}
