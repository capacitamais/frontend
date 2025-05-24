import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../hooks/api";

export default function Emplooye() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [emplooye, setEmplooye] = useState(null);

  useEffect(() => {
    api
      .get(`/employees/${id}`)
      .then((response) => setEmplooye(response.data))
      .catch((error) => console.error("Erro ao buscar colaborador:", error));
  }, [id]);

  if (!emplooye) return <p>Carregando...</p>;

  return (
    <>
      <h2>{emplooye.name}</h2>
      <button onClick={() => navigate(-1)}>
        Voltar
      </button>
    </>
  );
}