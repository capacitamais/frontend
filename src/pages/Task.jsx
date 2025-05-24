import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../hooks/api";

export default function Task() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    api
      .get(`/tasks/${id}`)
      .then((response) => setTask(response.data))
      .catch((error) => console.error("Erro ao buscar a tarefa:", error));
  }, [id]);

  if (!task) return <p>Carregando...</p>;

  return (
    <>
      <h2>{task.name}</h2>
      <button onClick={() => navigate(-1)}>
        Voltar
      </button>
    </>
  );
}
