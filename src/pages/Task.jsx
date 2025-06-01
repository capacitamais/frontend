import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import EditBtn from "../components/EditBtn/EditBtn";
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
      <EditBtn to={`/tasks/${id}/edit`} />
      <button onClick={() => navigate(-1)}>
        Voltar
      </button>
    </>
  );
}
