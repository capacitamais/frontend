import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../hooks/api";
import RelationshipManager from "../components/RelationshipManager/RelationshipManager";
import EntityDetailsCard from "../components/EntityDetailsCard/EntityDetailsCard";

export default function Employee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [errorEmployee, setErrorEmployee] = useState(null);

  const fetchEmployee = async () => {
    try {
      setLoadingEmployee(true);
      const response = await api.get(`/employees/${id}`);
      setEmployee(response.data);
    } catch (err) {
      setErrorEmployee("Falha ao carregar dados do colaborador.");
      console.error("Erro ao buscar colaborador:", err);
    } finally {
      setLoadingEmployee(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  if (loadingEmployee) {
    return (
      <div className="loading-message">
        Carregando detalhes do colaborador...
      </div>
    );
  }

  if (errorEmployee) {
    return <div className="error-message">{errorEmployee}</div>;
  }

  if (!employee) {
    return <div className="no-data-message">Colaborador não encontrado.</div>;
  }

  return (
    <div className="employee-details-page-wrapper">
      <EntityDetailsCard
        entityData={employee}
        entityName="Colaborador"
        apiUrl="/employees"
        fieldsToDisplay={[{ key: "registration", label: "Matrícula" }]}
        editUrl={`/employees/edit/${employee._id}`}
      >
        <RelationshipManager
          mainEntityId={employee._id}
          relationEntityName="received-training"
          getRelationshipsApiUrl="/received-training/employee"
          availableItemsApiUrl="/trainings"
          mainEntityRelationField="training"
          relatedItemField="training"
          relatedItemDisplayKey="title"
          mainEntityPayloadField="employeeId"
          relatedItemPayloadField="trainingId"
          extraFields={[
            { name: "date", label: "Data realização", type: "date", required: true },
            {
              name: "dueDate",
              label: "Data validade",
              type: "date",
              required: false,
            },
          ]}
          title="Treinamentos recebidos"
        />

        <RelationshipManager
          mainEntityId={employee._id}
          relationEntityName="employee-health-examinations"
          getRelationshipsApiUrl="/employee-health-examinations/employee"
          availableItemsApiUrl="/health-examinations"
          mainEntityRelationField="healthExamination"
          relatedItemField="healthExamination"
          relatedItemDisplayKey="title"
          mainEntityPayloadField="employeeId"
          relatedItemPayloadField="healthExaminationId"
          extraFields={[
            { name: "date", label: "Data realização", type: "date", required: true },
            {
              name: "dueDate",
              label: "Data validade",
              type: "date",
              required: false,
            },
          ]}
          title="Exames de saúde"
        />
      </EntityDetailsCard>
    </div>
  );
}
