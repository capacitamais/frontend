import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import GenericForm from "../components/GenericForm/GenericForm";
import api from "../hooks/api";

export default function ActivityForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await api.get(`/activities/${id}`);
        const activity = response.data;

        setFormData({
          name: activity.name || "",
          description: activity.description || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar atividade:", err);
        setError("Erro ao carregar dados da atividade.");
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const handleSubmit = async (dataToSubmit) => {
    try {
      if (id) {
        await api.put(`/activities/${id}`, dataToSubmit);
        alert("Atividade atualizada com sucesso!");
      } else {
        await api.post("/activities", dataToSubmit);
        alert("Atividade criada com sucesso!");
      }
      navigate(`/activities`);
    } catch (err) {
      console.error("Erro ao salvar atividade:", err.response?.data || err);
      throw err;
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

  if (loading) return <p>Carregando atividade...</p>;
  if (error) return <p>{error}</p>;

  return (
    <GenericForm
      entityName="Atividade"
      fields={activityFields}
      onSubmit={handleSubmit}
      apiUrl="/activities"
      isEditing={!!id}
      currentFormData={formData}
      onFieldChange={handleFormFieldChange}
    />
  );
}
