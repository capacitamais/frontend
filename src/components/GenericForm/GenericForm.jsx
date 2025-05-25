// src/components/GenericForm/GenericForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../hooks/api';
import './style.css';

export default function GenericForm({ entityName, fields, onSubmitSuccess, initialData = {}, isEditing = false }) {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Para edição, se aplicável

  const apiUrl = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    if (isEditing && id && !Object.keys(initialData).length) {
      // Se for edição e initialData não foi fornecido, busca os dados
      const fetchEntityData = async () => {
        setLoading(true);
        try {
          // Usa 'api' em vez de 'axios'
          const response = await api.get(`/${entityName}/${id}`);
          setFormData(response.data);
        } catch (err) {
          setError('Falha ao carregar os dados.');
          console.error('Erro ao buscar dados da entidade:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchEntityData();
    }
  }, [isEditing, id, apiUrl, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        [name]: checked
      }));
    } else if (name === 'activities' || name === 'employees') {
        // Se o campo for um array (e.g., activities, employees para Task)
        setFormData(prevData => ({
            ...prevData,
            [name]: value.split(',').map(item => item.trim()) // Assume entrada como string separada por vírgulas
        }));
    }
    else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await api.put(`${apiUrl}/${entityName}/${id}`, formData);
      } else {
        await api.post(`${apiUrl}/${entityName}`, formData);
      }
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        navigate(`/${entityName.toLowerCase()}`);
      }
    } catch (err) {
      setError(`Falha ao criar ${entityName}. Favor tentar novamente`);
      console.error(`Erro ao salvar ${entityName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing && !Object.keys(initialData).length) {
    return <div className="loading-message">Carregando {entityName}...</div>;
  }

  if (error && isEditing && !Object.keys(initialData).length) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="generic-form-container">
      <h2>{isEditing ? `Editar ${entityName}` : `Adicionar ${entityName}`}</h2>
      <form onSubmit={handleSubmit} className="generic-form">
        {fields.map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}:</label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
              >
                <option value="">Selecione um {field.label}</option>
                {field.options.map((option) => (
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
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
              />
            )}
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}