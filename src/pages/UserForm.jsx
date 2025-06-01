// src/pages/UserAddForm.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GenericForm from '../components/GenericForm/GenericForm';
import api from '../hooks/api';

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    registration: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await api.get(`/users/${id}`);
        const user = response.data;

        setFormData({
          name: user.name || "",
          registration: user.registration || "",
          role: user.role || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
        setError("Erro ao carregar dados de usuário.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (dataToSubmit) => {
    try {
      if(id){
        await api.put(`/users/${id}`, dataToSubmit);
        alert('Usuário atualizado com sucesso!');
      } else {
        await api.post('/users', dataToSubmit);
        alert('Usuário criado com sucesso!');
      }
      navigate('/users');
    } catch (err) {
      console.error('Erro ao criar usuário:', err.response?.data || err);
      throw err;
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

  if (loading) return <p>Carregando usuário...</p>;
  if (error) return <p>{error}</p>;

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