import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GenericForm from "../components/GenericForm/GenericForm";
import api from "../hooks/api";

export default function HealthExaminationForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title:'',
    description:'',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)

  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
      const fetchExam = async () => {
        if (!id) return;
        try {
          setLoading(true);
          const response = await api.get(`/health-examinations/${id}`);
          const exam = response.data;
  
          setFormData({
            title: exam.title || "",
            description: exam.description || "",
          });
  
          setLoading(false);
        } catch (err) {
          console.error("Erro ao carregar exame:", err);
          setError("Erro ao carregar dados do exame.");
          setLoading(false);
        }
      };
  
      fetchExam();
    }, [id]);

  const handleSubmit = async (dataToSubmit) => {
    try {
      if (id) {
        await api.put(`/health-examinations/${id}`, dataToSubmit);
        alert('Exame atualizado com sucesso!');
      } else {
        await api.post('/health-examinations', dataToSubmit); // Usa a instância 'api'
        alert('Exame criado com sucesso!');
      }
      navigate('/health-examinations');
    } catch (err) {
      console.error('Erro ao salvar exame:', err.response?.data || err);
      throw err; // Re-lança para que o GenericForm possa exibir a mensagem
    }
  };

  const healthExaminationFields = [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea',
      required: true,
    }
  ];

  if (loading) return <p>Carregando exame...</p>;
  if (error) return <p>{error}</p>;

  return (
    <GenericForm
          entityName="exame"
          fields={healthExaminationFields}
          onSubmit={handleSubmit}
          apiUrl="/health-examination" 
          isEditing={!!id}
          currentFormData={formData} 
          onFieldChange={handleFormFieldChange}
        />
  );
}
