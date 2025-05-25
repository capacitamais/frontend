import GenericForm from '../components/GenericForm/GenericForm'
import { useParams, useNavigate } from "react-router-dom";

export default function TrainingAddForm() {
  const navigate = useNavigate();

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
      type: 'text',
      required: true,
    },
    {
      name: 'revision',
      label: 'Nº da Revisão',
      type: 'number',
      required: false,
    },
  ];

  const handleSubmitSuccess = () => {
    alert('Treinamento criado com sucesso!');
    navigate('/trainings');
  };

  return (
    <GenericForm
          entityName="trainings"
          fields={trainingFields}
          onSubmitSuccess={handleSubmitSuccess}
        />
  );
}
