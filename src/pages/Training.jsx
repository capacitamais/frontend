// pages/Training.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../hooks/api";
import EntityDetailsCard from "../components/EntityDetailsCard/EntityDetailsCard";

export default function Training() {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [loadingTraining, setLoadingTraining] = useState(true);
  const [errorTraining, setErrorTraining] = useState(null);

  const fetchTraining = async () => {
    try {
      setLoadingTraining(true);
      const response = await api.get(`/trainings/${id}`);
      setTraining(response.data);
    } catch (err) {
      setErrorTraining('Falha ao carregar dados do treinamento.');
      console.error("Erro ao buscar o treinamento:", err);
    } finally {
      setLoadingTraining(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTraining();
    }
  }, [id]);

  const trainingFieldsToDisplay = useMemo(() => [
    { key: "trainingTag", label: "Código" },
    { key: "revision", label: "Revisão" },
    { key: "description", label: "Descrição" },
  ], []);

  if (loadingTraining) {
    return <div className="loading-message">Carregando detalhes do treinamento...</div>;
  }

  if (errorTraining) {
    return <div className="error-message">{errorTraining}</div>;
  }

  if (!training) {
    return <div className="no-data-message">Treinamento não encontrado.</div>;
  }

  return (
    <div className="training-details-page-wrapper">
      <EntityDetailsCard
        entityData={training}
        entityName="Treinamento"
        apiUrl="/trainings"
        fieldsToDisplay={trainingFieldsToDisplay}
        editUrl={`/trainings/edit/${training._id}`}
      />
    </div>
  );
}