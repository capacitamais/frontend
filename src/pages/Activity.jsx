// src/pages/Activity.jsx
import React, { act, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../hooks/api";
import RelationshipManager from '../components/RelationshipManager/RelationshipManager';
import EntityDetailsCard from '../components/EntityDetailsCard/EntityDetailsCard';

export default function Activity() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [errorActivity, setErrorActivity] = useState(null);

  const fetchActivity = async () => {
    try {
      setLoadingActivity(true);
      const response = await api.get(`/activities/${id}`);
      setActivity(response.data);
    } catch (err) {
      setErrorActivity('Falha ao carregar dados da atividade.');
      console.error('Erro ao buscar atividade:', err);
    } finally {
      setLoadingActivity(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchActivity();
    }
  }, [id]);

  const activityRequiredTrainingExtraFieldsForRelation = useMemo(() => [], []);
  
  const trainingExtraFieldsForDisplay = useMemo(() => [
    { key: 'trainingTag', label: 'Código' },
    { key: 'revision', label: 'Revisão' },
  ], []);

  if (loadingActivity) {
    return <div className="loading-message">Carregando detalhes da atividade...</div>;
  }

  if (errorActivity) {
    return <div className="error-message">{errorActivity}</div>;
  }

  if (!activity) {
    return <div className="no-data-message">Atividade não encontrada.</div>;
  }

  return (
    <div className="activity-details-page-wrapper">
      <EntityDetailsCard
        entityData={activity}
        entityName="Atividade"
        apiUrl="/activities"
        fieldsToDisplay={[{ key: "name", label: "Nome"},{ key: "description", label: "Descrição" }]}
        editUrl={`/activities/edit/${activity._id}`}
      >
        <RelationshipManager
          mainEntityId={activity._id}
          relationEntityName="activity-required-training"
          getRelationshipsApiUrl="/activity-required-training/activity"
          availableItemsApiUrl="/trainings"
          mainEntityRelationField="training"
          relatedItemField="training"
          relatedItemDisplayKey="title"
          mainEntityPayloadField="activityId"
          relatedItemPayloadField="trainingId"
          extraFields={activityRequiredTrainingExtraFieldsForRelation}
          relatedItemExtraFields={trainingExtraFieldsForDisplay}
          title="Treinamentos obrigatórios"
        />
      </EntityDetailsCard>
    </div>
  );
}