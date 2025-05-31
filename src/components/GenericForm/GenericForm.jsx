import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../hooks/api';
import './style.css';

// Remove initialData como estado interno primário para campos simples
// Agora o componente recebe `formData` e `onFormChange` para os campos básicos
export default function GenericForm({
  entityName,
  fields,
  onSubmit, // Mudança: agora recebe uma função `onSubmit`
  apiUrl,
  isEditing = false,
  children,
  currentFormData, // Nova prop: o formData atual do componente pai
  onFieldChange, // Nova prop: função para atualizar campos simples no pai
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // useEffect para carregar dados para edição se `currentFormData` não foi preenchido pelo pai
  useEffect(() => {
    // Se está em modo de edição, tem um ID, e o pai não preencheu os dados iniciais
    if (isEditing && id && !Object.keys(currentFormData || {}).length) {
      const fetchEntityData = async () => {
        setLoading(true);
        try {
          const response = await api.get(`${apiUrl}/${id}`);
          // Chame a função de mudança de campo no pai para atualizar os dados
          // Isso é importante para que o pai seja o dono dos dados
          for (const key in response.data) {
            onFieldChange({ target: { name: key, value: response.data[key] } });
          }
        } catch (err) {
          setError('Failed to load entity data.');
          console.error('Error fetching entity data:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchEntityData();
    }
  }, [isEditing, id, apiUrl, currentFormData, onFieldChange]); // Depende de onFieldChange também

  const handleInternalChange = (e) => {
    // Apenas repassa a mudança para o pai
    onFieldChange(e);
  };

  const handleInternalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // O `onSubmit` agora é passado como prop e já tem a lógica de POST/PUT
      await onSubmit(currentFormData); // Envia o formData completo do pai

      // Não há mais navigate aqui, o pai decide o que fazer após o sucesso
    } catch (err) {
      setError(`Failed to save ${entityName}. Details: ${err.response?.data?.error || err.message}`);
      console.error(`Error saving ${entityName}:`, err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading && isEditing && !Object.keys(currentFormData || {}).length) {
    return <div className="loading-message">Loading {entityName} data...</div>;
  }

  if (error && isEditing && !Object.keys(currentFormData || {}).length) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="generic-form-container">
      <h2>{isEditing ? `Editar ${entityName}` : `Criar ${entityName}`}</h2>
      <form onSubmit={handleInternalSubmit} className="generic-form">
        {error && <p className="error-message">{error}</p>}
        {fields.map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}:</label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={currentFormData[field.name] || ''} // Usa currentFormData
                onChange={handleInternalChange}
                required={field.required}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={currentFormData[field.name] || ''} // Usa currentFormData
                onChange={handleInternalChange}
                required={field.required}
              >
                <option value="">Selecione um {field.label}</option>
                {field.options && field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={currentFormData[field.name] || ''} // Usa currentFormData
                onChange={handleInternalChange}
                required={field.required}
              />
            )}
          </div>
        ))}

        {children} {/* Renderiza os children */}

        <div className="form-actions"> 
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}