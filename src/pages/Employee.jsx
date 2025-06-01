import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EditBtn from "../components/EditBtn/EditBtn";
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
      <h2>{emplooye.registration}- {emplooye.name}</h2>
      <EditBtn to={`/employees/${id}/edit`} />
      <button onClick={() => navigate(-1)}>
        Voltar
      </button>
    </>
  );
}