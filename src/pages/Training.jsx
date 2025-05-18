// pages/Training.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../hooks/api";

export default function Training() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [training, setTraining] = useState(null);

  useEffect(() => {
    api
      .get(`/trainings/${id}`)
      .then((response) => setTraining(response.data))
      .catch((error) => console.error("Erro ao buscar o treinamento:", error));
  }, [id]);

  if (!training) return <p>Carregando...</p>;

  return (
    <>
      <h2>{training.title}</h2>
      <p>
        <strong>Tag:</strong> {training.trainingTag}
      </p>
      <p>
        <strong>Revisão:</strong> {training.revision}
      </p>
      <p>
        <strong>Descrição:</strong> {training.description}
      </p>
      <p>
        <strong>Ativo:</strong> {training.isActive ? "Sim" : "Não"}
      </p>
      <button onClick={() => navigate(-1)}>
        Voltar
      </button>
    </>
  );
}
