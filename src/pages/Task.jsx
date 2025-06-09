import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../hooks/api";
import EntityDetailsCard from "../components/EntityDetailsCard/EntityDetailsCard";

export default function Task() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loadingTask, setLoadingTask] = useState(true);
  const [errorTask, setErrorTask] = useState(null);

  const fetchTask = async () => {
    try {
      setLoadingTask(true);
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data);
    } catch (err) {
      setErrorTask('Falha ao carregar dados da tarefa.');
      console.error("Erro ao buscar a tarefa:", err);
    } finally {
      setLoadingTask(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const taskFieldsToDisplay = useMemo(() => {
    const fields = [
      { key: "name", label: "Nome" },
      { key: "description", label: "Descrição" },
      { key: "site", label: "Local" },
      {
        key: "dueDate",
        label: "Data Limite",
        format: (value) => value ? new Date(value).toLocaleDateString('pt-BR') : 'N/A'
      },
      {
        key: "technician.name",
        label: "Técnico",
        format: (value, entity) => entity.technician ? `${entity.technician.name} (Matrícula: ${entity.technician.registration})` : 'N/A'
      },
    ];

    if (task && task.activities && task.activities.length > 0) {
        fields.push({
            key: "activities",
            label: "Atividades",
            format: (value, entity) => entity.activities.map(act => act.name).join(', ') || 'Nenhuma'
        });
    } else if (task && !task.activities) {
        fields.push({ key: "activities", label: "Atividades", format: () => 'Nenhuma' });
    }

    if (task && task.employees && task.employees.length > 0) {
        fields.push({
            key: "employees",
            label: "Funcionários",
            format: (value, entity) => entity.employees.map(emp => `${emp.name} (${emp.registration})`).join(', ') || 'Nenhum'
        });
    } else if (task && !task.employees) { 
        fields.push({ key: "employees", label: "Funcionários", format: () => 'Nenhum' });
    }

    return fields;
  }, [task]);

  if (loadingTask) {
    return <div className="loading-message">Carregando detalhes da tarefa...</div>;
  }

  if (errorTask) {
    return <div className="error-message">{errorTask}</div>;
  }

  if (!task) {
    return <div className="no-data-message">Tarefa não encontrada.</div>;
  }

  return (
    <div className="task-details-page-wrapper">
      <EntityDetailsCard
        entityData={task}
        entityName="Tarefa"
        apiUrl="/tasks"
        fieldsToDisplay={taskFieldsToDisplay}
        editUrl={`/tasks/edit/${task._id}`}
      />
    </div>
  );
}