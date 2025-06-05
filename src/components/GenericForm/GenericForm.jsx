import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../hooks/api';
import './style.css';

/**
 * Componente de formulário genérico
 * 
 * Props:
 * - entityName: string (nome da entidade, ex: "Usuário")
 * - fields: array (campos do formulário)
 * - onSubmit: function (função para submit)
 * - apiUrl: string (endpoint da API, ex: "/users")
 * - isEditing: boolean (se está no modo de edição)
 * - children: ReactNode (componentes extras dentro do form)
 * - currentFormData: objeto (dados atuais do formulário, controlado pelo pai)
 * - onFieldChange: function (função para atualizar campos no pai)
 */
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

  // Carrega dados da API se for edição e não houver dados no pai
  useEffect(() => {
    const shouldFetchData = isEditing && id && !Object.keys(currentFormData || {}).length;
    if (shouldFetchData) {
      const fetchEntityData = async () => {
        setLoading(true);
        try {
          const response = await api.get(`${apiUrl}/${id}`);
          const data = response.data;
          for (const key in data) {
            onFieldChange({ target: { name: key, value: data[key] } });
          }
        } catch (err) {
          setError(`Erro ao carregar dados de ${entityName}.`);
          console.error('Erro ao buscar dados:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchEntityData();
    }
  }, [isEditing, id, apiUrl, currentFormData, onFieldChange, entityName]);

  const handleInputChange = (e) => {
    onFieldChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(currentFormData);
    } catch (err) {
      const apiError = err.response?.data?.error || err.message;
      setError(`Falha ao salvar ${entityName}. Detalhes: ${apiError}`);
      console.error(`Erro ao salvar ${entityName}:`, err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const isFetchingInitialData = loading && isEditing && !Object.keys(currentFormData || {}).length;

  if (isFetchingInitialData) {
    return <div className="loading-message">Carregando dados de {entityName}...</div>;
  }

  if (error && isEditing && !Object.keys(currentFormData || {}).length) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="generic-form-container">
      <h2>{isEditing ? `Editar ${entityName}` : `Criar ${entityName}`}</h2>

      <form onSubmit={handleSubmit} className="generic-form">
        {error && <p className="error-message">{error}</p>}

        {fields.map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}:</label>

            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={currentFormData[field.name] || ''}
                onChange={handleInputChange}
                required={field.required}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={currentFormData[field.name] || ''}
                onChange={handleInputChange}
                required={field.required}
              >
                <option value="">Selecione um {field.label}</option>
                {field.options?.map((option) => (
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
                value={currentFormData[field.name] || ''}
                onChange={handleInputChange}
                required={field.required}
              />
            )}
          </div>
        ))}

        {children}

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
