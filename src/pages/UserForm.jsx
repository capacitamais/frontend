// src/pages/UserAddForm.jsx
import { useState } from 'react'; // Importa useState
import GenericForm from '../components/GenericForm/GenericForm';
import { useNavigate } from 'react-router-dom';
import api from '../hooks/api'; // Importa a instância do axios configurada

export default function UserForm() {
  const navigate = useNavigate();

  // 1. Estado para o formData (similar ao TaskForm)
  const [formData, setFormData] = useState({
    name: '',
    registration: '',
    role: '',
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
      await api.post('/users', dataToSubmit); // Usa a instância 'api'
      alert('Usuário criado com sucesso!');
      navigate('/users');
    } catch (err) {
      console.error('Erro ao criar usuário:', err.response?.data || err);
      throw err; // Re-lança para que o GenericForm possa exibir a mensagem
    }
  };

  const userFields = [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'registration', label: 'Matrícula', type: 'text', required: true },
    {
      name: 'role',
      label: 'Papel',
      type: 'select',
      required: true,
      options: [
        { value: 'analyst', label: 'Analista' },
        { value: 'technician', label: 'Técnico' },
      ],
    },
  ];

  return (
    <GenericForm
      entityName="usuário"
      fields={userFields}
      onSubmit={handleSubmit}
      apiUrl="/users"
      currentFormData={formData}
      onFieldChange={handleFormFieldChange}
    />
  );
}