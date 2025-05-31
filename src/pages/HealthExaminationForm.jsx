import { useState } from "react";
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

  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

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
