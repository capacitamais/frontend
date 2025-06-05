import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../hooks/api";
import "./Training.css";

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

  if (!training) return <div className="loading">Carregando...</div>;

  return (
    <div className="training-container">
      <div className="training-card">
        <h2 className="training-title">{training.title}</h2>

        <div className="training-info">
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
        </div>

        <div className="training-buttons">
          <button onClick={() => navigate(-1)} className="btn-back">
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
