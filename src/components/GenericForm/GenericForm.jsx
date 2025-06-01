import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../hooks/api';
import './style.css';

export default function GenericForm({
  entityName,
  fields,
  onSubmit, 
  apiUrl,
  isEditing = false,
  children,
  currentFormData,
  onFieldChange,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  
  useEffect(() => {
    if (isEditing && id && !Object.keys(currentFormData || {}).length) {
      const fetchEntityData = async () => {
        setLoading(true);
        try {
          const response = await api.get(`${apiUrl}/${id}`);
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
  }, [isEditing, id, apiUrl, currentFormData, onFieldChange]);

  const handleInternalChange = (e) => {
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