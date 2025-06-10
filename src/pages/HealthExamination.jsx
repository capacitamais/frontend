import React, { useState, useEffect, useMemo } from "react"; // Importe useMemo
import { useParams } from "react-router-dom"; // Removido 'useNavigate' e 'Link' pois EntityDetailsCard os gerencia
import api from "../hooks/api";
import EntityDetailsCard from "../components/EntityDetailsCard/EntityDetailsCard"; // Importe EntityDetailsCard

export default function HealthExamination() {
  const { id } = useParams();
  const [examination, setExamination] = useState(null); // Renomeado setTraining para setExamination
  const [loadingExamination, setLoadingExamination] = useState(true); // Adiciona estado de carregamento
  const [errorExamination, setErrorExamination] = useState(null);     // Adiciona estado de erro

  const fetchExamination = async () => {
    try {
      setLoadingExamination(true);
      const response = await api.get(`/health-examinations/${id}`);
      setExamination(response.data);
    } catch (err) {
      setErrorExamination('Falha ao carregar dados do exame.'); // Mensagem de erro
      console.error("Erro ao buscar o exame:", err);
    } finally {
      setLoadingExamination(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchExamination();
    }
  }, [id]);

  // Memoriza os campos a serem exibidos no EntityDetailsCard
  const examinationFieldsToDisplay = useMemo(() => [
    { key: "description", label: "Descrição" },
  ], []);

  if (loadingExamination) {
    return <div className="loading-message">Carregando detalhes do exame...</div>;
  }

  if (errorExamination) {
    return <div className="error-message">{errorExamination}</div>;
  }

  if (!examination) {
    return <div className="no-data-message">Exame não encontrado.</div>;
  }

  return (
    <div className="health-examination-details-page-wrapper">
      <EntityDetailsCard
        entityData={examination}
        entityName="Exame de Saúde"
        apiUrl="/health-examinations"
        fieldsToDisplay={examinationFieldsToDisplay}
        editUrl={`/health-examinations/edit/${examination._id}`}
      />
    </div>
  );
}