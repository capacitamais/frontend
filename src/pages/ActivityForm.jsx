import { useState } from "react";
import GenericForm from "../components/GenericForm/GenericForm";
import { useParams, useNavigate } from "react-router-dom";
import api from "../hooks/api";

export default function ActivityForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (dataToSubmit) => {
    try {
      if (id) {
        await api.put(`/activities/${id}`, dataToSubmit);
        alert("Atividade atualizada com sucesso!");
      } else {
        await api.post("/activities", dataToSubmit); // Usa a instância 'api'
        alert("Atividade criada com sucesso!");
      }
      navigate("/activities");
    } catch (err) {
      console.error("Erro ao salvar atividade:", err.response?.data || err);
      throw err; // Re-lança para que o GenericForm possa exibir a mensagem
    }
  };

  const activityFields = [
    {
      name: "name",
      label: "Nome",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Descrição",
      type: "textarea",
      required: true,
    },
  ];

  return (
    <GenericForm
      entityName="activities"
      fields={activityFields}
      onSubmit={handleSubmit}
      apiUrl="/activities"
      isEditing={!!id}
      currentFormData={formData}
      onFieldChange={handleFormFieldChange}
    />
  );
}
