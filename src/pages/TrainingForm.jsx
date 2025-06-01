import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import GenericForm from "../components/GenericForm/GenericForm";
import api from "../hooks/api";

export default function TrainingForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    trainingTag: "",
    title: "",
    description: "",
    revision: "",
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
      const fetchTraining = async () => {
        if (!id) return;
        try {
          setLoading(true);
          const response = await api.get(`/trainings/${id}`);
          const training = response.data;
  
          setFormData({
            trainingTag: training.trainingTag || "",
            title: training.title || "",
            description: training.description || "",
            revision: training.revision || "",
          });
  
          setLoading(false);
        } catch (err) {
          console.error("Erro ao carregar treinamento:", err);
          setError("Erro ao carregar dados do treinamento.");
          setLoading(false);
        }
      };
  
      fetchTraining();
    }, [id]);

  const handleSubmit = async (dataToSubmit) => {
    try {
      if (id) {
        await api.put(`/trainings/${id}`, dataToSubmit);
        alert("Treinamento atualizado com sucesso!");
      } else {
        await api.post("/trainings", dataToSubmit); // Usa a instância 'api'
        alert("Treinamento criado com sucesso!");
      }
      navigate("/trainings");
    } catch (err) {
      console.error("Erro ao salvar treinamento:", err.response?.data || err);
      throw err; // Re-lança para que o GenericForm possa exibir a mensagem
    }
  };

  const trainingFields = [
    {
      name: "trainingTag",
      label: "Código",
      type: "text",
      required: true,
    },
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Descrição",
      type: "textarea",
      required: true,
    },
    {
      name: "revision",
      label: "Nº da Revisão",
      type: "number",
      required: false,
    },
  ];

  if (loading) return <p>Carregando treinamento...</p>;
  if (error) return <p>{error}</p>;

  return (
    <GenericForm
      entityName="treinamento"
      fields={trainingFields}
      onSubmit={handleSubmit}
      apiUrl="/trainings"
      isEditing={!!id}
      currentFormData={formData}
      onFieldChange={handleFormFieldChange}
    />
  );
}
