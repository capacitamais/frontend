import GenericForm from '../components/GenericForm/GenericForm';
import { useNavigate } from 'react-router-dom';

export default function UserAddForm() {
  const navigate = useNavigate();

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

  const handleSubmitSuccess = () => {
    alert('User saved successfully!');
    navigate('/users');
  };

  return (
    <GenericForm
      entityName="users"
      fields={userFields}
      onSubmitSuccess={handleSubmitSuccess}
    />
  );
}