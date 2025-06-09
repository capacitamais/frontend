// src/pages/Employee.jsx (ou EmployeeDetailsPage.jsx)
import React, { useState, useEffect, useMemo } from "react"; // Importe useMemo
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

  // Memoriza os campos extras para exibição dos TREINAMENTOS
  const trainingExtraFieldsForDisplay = useMemo(() => [
    { key: 'trainingTag', label: 'Código' },
    { key: 'revision', label: 'Revisão' },
  ], []);

  // Memoriza os campos extras para exibição dos EXAMES DE SAÚDE (se houver, por exemplo, 'type' ou 'validityPeriod')
  const healthExaminationExtraFieldsForDisplay = useMemo(() => [
    // { key: 'type', label: 'Tipo' }, // Exemplo: se HealthExamination tiver um campo 'type'
    // { key: 'issuingBody', label: 'Órgão Emissor' }, // Exemplo
  ], []);

  // Memoriza os campos extras para o relacionamento Received Training
  const receivedTrainingRelationExtraFields = useMemo(() => [
    { name: "date", label: "Data realização", type: "date", required: true },
    {
      name: "dueDate",
      label: "Data validade",
      type: "date",
      required: false,
    },
  ], []);

  // Memoriza os campos extras para o relacionamento Employee Health Examination
  const healthExaminationRelationExtraFields = useMemo(() => [
    { name: "date", label: "Data realização", type: "date", required: true },
    {
      name: "dueDate",
      label: "Data validade",
      type: "date",
      required: false,
    },
  ], []);


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
        {/* RelationshipManager para Treinamentos Recebidos */}
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
          extraFields={receivedTrainingRelationExtraFields} // Usando o array memorizado
          relatedItemExtraFields={trainingExtraFieldsForDisplay} // Passando campos extras do treinamento
          title="Treinamentos recebidos"
        />

        {/* RelationshipManager para Exames de Saúde */}
        <RelationshipManager
          mainEntityId={employee._id}
          relationEntityName="employee-health-examinations"
          getRelationshipsApiUrl="/employee-health-examinations/employee"
          availableItemsApiUrl="/health-examinations"
          mainEntityRelationField="healthExamination"
          relatedItemField="healthExamination"
          relatedItemDisplayKey="title" // Ou outro campo de exibição principal do exame de saúde
          mainEntityPayloadField="employeeId"
          relatedItemPayloadField="healthExaminationId"
          extraFields={healthExaminationRelationExtraFields} // Usando o array memorizado
          relatedItemExtraFields={healthExaminationExtraFieldsForDisplay} // Passando campos extras do exame de saúde (se houver)
          title="Exames de saúde"
        />
      </EntityDetailsCard>
    </div>
  );
}