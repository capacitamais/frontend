import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../hooks/api";

export default function HealthExamination() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [examination, setTraining] = useState(null);

  useEffect(() => {
    api
      .get(`/health-examinations/${id}`)
      .then((response) => setTraining(response.data))
      .catch((error) => console.error("Erro ao buscar o exame:", error));
  }, [id]);

  if(!examination) return <p>Carregando...</p>;

  return (
    <>
      <h2>{examination.title}</h2>
      <p>
        <strong>Descrição:</strong> {examination.description}
      </p>
      <button onClick={() => navigate(-1)}>Voltar</button>
    </>
  );
}
