import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EditBtn from "../components/EditBtn/EditBtn";
import api from "../hooks/api";

export default function Activity() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    api
      .get(`/activities/${id}`)
      .then((response) => setActivity(response.data))
      .catch((error) => console.error("Erro ao buscar a atividade:", error));
  }, [id]);

  if (!activity) return <p>Carregando...</p>;

  return (
    <>
      <h2>{activity.name}</h2>
      <p>{activity.description}</p>
      <EditBtn to={`/activities/${id}/edit`} />
      <button onClick={() => navigate(-1)}>
        Voltar
      </button>
    </>
  );
}
