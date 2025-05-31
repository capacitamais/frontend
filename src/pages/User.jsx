import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../hooks/api";

export default function User() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((response) => {
        console.log("Resposta completa:", response.data);
        setUser(response.data);
      })
      .catch((error) => console.error("Erro ao buscar o usuário:", error));
  }, [id]);

  if (user === null || user === undefined) {
    return <p>Carregando...</p>;
  }

  console.log(user);

  return (
    <>
      <h2>{`Nome: ${user.name}`}</h2>
      <h3>{user.role}</h3>
      <button onClick={() => navigate(-1)}>Voltar</button>
    </>
  );
}
