// src/pages/TrainingAddForm.jsx
import { useState } from 'react'; // Importa useState
import GenericForm from '../components/GenericForm/GenericForm'
import { useParams, useNavigate } from "react-router-dom";
import api from '../hooks/api'; // Importa a instância do axios configurada

export default function TrainingForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Para o modo de edição, se for implementado no futuro

  // 1. Estado para o formData
  const [formData, setFormData] = useState({
    trainingTag: '',
    title: '',
    description: '',
    revision: '',
  });

  // 2. Função de mudança de campo para o GenericForm
  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // 3. Função de submissão para o GenericForm
  const handleSubmit = async (dataToSubmit) => {
    try {
      if (id) {
        await api.put(`/trainings/${id}`, dataToSubmit);
        alert('Treinamento atualizado com sucesso!');
      } else {
        await api.post('/trainings', dataToSubmit); // Usa a instância 'api'
        alert('Treinamento criado com sucesso!');
      }
      navigate('/trainings');
    } catch (err) {
      console.error('Erro ao salvar treinamento:', err.response?.data || err);
      throw err; // Re-lança para que o GenericForm possa exibir a mensagem
    }
  };

  const trainingFields = [
    {
      name: 'trainingTag',
      label: 'Código',
      type: 'text',
      required: true,
    },
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
    },
    {
      name: 'revision',
      label: 'Nº da Revisão',
      type: 'number',
      required: false,
    },
  ];

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