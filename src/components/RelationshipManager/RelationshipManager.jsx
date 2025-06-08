// src/components/RelationshipManager/RelationshipManager.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../hooks/api';
import { FaTimesCircle, FaPlusCircle } from 'react-icons/fa'; // Ícones para remover e adicionar
import './style.css'; // Estilos para este componente

export default function RelationshipManager({
  mainEntityId,
  relationEntityName, // Ex: 'received-training' ou 'activity-required-trainings'
  getRelationshipsApiUrl, // Ex: '/received-training/employee' ou '/activity-required-trainings/activity'
  availableItemsApiUrl, // Ex: '/trainings' ou '/health-examinations'
  mainEntityRelationField, // Ex: 'employee' ou 'activity' (campo no OBJETO RETORNADO PELO POPULATE)
  relatedItemField, // Ex: 'training' ou 'healthExamination' (campo no OBJETO RETORNADO PELO POPULATE)
  relatedItemDisplayKey, // Ex: 'trainingTag' para Training, 'title' para HealthExamination
  mainEntityPayloadField, // NOVA PROP: Ex: 'employeeId'
  relatedItemPayloadField, // NOVA PROP: Ex: 'trainingId' ou 'healthExaminationId'
  extraFields = [], // Campos adicionais no relacionamento (ex: date, dueDate)
  title,
}) {
  const [availableItems, setAvailableItems] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItemFormData, setNewItemFormData] = useState({});

  const itemMap = useMemo(() => {
    return availableItems.reduce((map, item) => {
      map[item.value] = item.label;
      return map;
    }, {});
  }, [availableItems]);

  const fetchRelationshipsAndAvailableItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allItemsRes = await api.get(availableItemsApiUrl);
      const formattedAllItems = allItemsRes.data.map(item => ({
        value: item._id,
        label: item[relatedItemDisplayKey] || item.name || item.title || item.trainingTag,
      }));
      setAvailableItems(formattedAllItems);

      const relatedRes = await api.get(`${getRelationshipsApiUrl}/${mainEntityId}`);
      setRelatedItems(relatedRes.data);

      const initialNewItemData = { [relatedItemPayloadField]: '' }; // Usa o payload field aqui
      extraFields.forEach(field => {
        initialNewItemData[field.name] = field.type === 'date' ? '' : field.defaultValue || '';
      });
      setNewItemFormData(initialNewItemData);

    } catch (err) {
      console.error(`Error fetching data for ${relationEntityName}:`, err);
      setError(`Failed to load ${title} data.`);
    } finally {
      setLoading(false);
    }
  }, [mainEntityId, relationEntityName, getRelationshipsApiUrl, availableItemsApiUrl, relatedItemField, relatedItemDisplayKey, mainEntityPayloadField, relatedItemPayloadField, extraFields, title]); // Adicione as novas props às dependências

  useEffect(() => {
    if (mainEntityId) {
      fetchRelationshipsAndAvailableItems();
    }
  }, [mainEntityId, fetchRelationshipsAndAvailableItems]);

  const handleNewItemFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItemFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddRelationship = async (e) => {
    e.preventDefault();
    // Usa relatedItemPayloadField para verificar se um item foi selecionado
    if (!newItemFormData[relatedItemPayloadField]) {
      alert('Please select an item to add.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const dataToSubmit = {
        ...newItemFormData,
        // Usa as novas props para definir os nomes das chaves no payload
        [mainEntityPayloadField]: mainEntityId,
        [relatedItemPayloadField]: newItemFormData[relatedItemPayloadField], // Pega o ID do item selecionado
        isActive: true, // Ou de acordo com sua lógica de negócio
      };

      // O backend espera o formato de data "AAAA/MM/DD", não ISO string do input type="date"
      if (dataToSubmit.date && dataToSubmit.date.includes('-')) {
        dataToSubmit.date = dataToSubmit.date.replace(/-/g, '/');
      }
      if (dataToSubmit.dueDate && dataToSubmit.dueDate.includes('-')) {
        dataToSubmit.dueDate = dataToSubmit.dueDate.replace(/-/g, '/');
      }


      await api.post(`/${relationEntityName}`, dataToSubmit);
      alert(`${itemMap[newItemFormData[relatedItemPayloadField]] || 'Item'} added successfully!`); // Usa o payload field aqui para a mensagem
      fetchRelationshipsAndAvailableItems(); // Recarrega os dados para atualizar as listas
    } catch (err) {
      console.error(`Error adding relationship to ${relationEntityName}:`, err.response?.data || err);
      setError(`Failed to add relationship: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRelationship = async (relationshipId) => {
    if (!window.confirm('Are you sure you want to remove this relationship?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.delete(`/${relationEntityName}/${relationshipId}`);
      alert('Relationship removed successfully!');
      fetchRelationshipsAndAvailableItems();
    } catch (err) {
      console.error(`Error removing relationship from ${relationEntityName}:`, err.response?.data || err);
      setError(`Failed to remove relationship: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filtra os itens disponíveis que ainda não foram relacionados
  const actualAvailableItems = availableItems.filter(item =>
    !relatedItems.some(rel => rel[relatedItemField]?._id === item.value)
  );

  if (loading) {
    return <div className="loading-message">Loading {title}...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="relationship-manager-container">
      <h3>{title}</h3>

      {/* Seção para adicionar novo relacionamento */}
      <div className="add-relationship-section">
        <select
          // Usa relatedItemPayloadField para o nome e value
          value={newItemFormData[relatedItemPayloadField]}
          onChange={handleNewItemFormChange}
          name={relatedItemPayloadField} // O `name` do select deve corresponder ao campo no `newItemFormData`
          disabled={actualAvailableItems.length === 0 || loading}
        >
          <option value="">Select an item to add</option>
          {actualAvailableItems.map(item => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {extraFields.map(field => (
          <React.Fragment key={field.name}>
            {field.type === 'date' ? (
              <input
                type="date"
                id={field.name}
                name={field.name}
                value={newItemFormData[field.name] || ''}
                onChange={handleNewItemFormChange}
                required={field.required}
              />
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={newItemFormData[field.name] || false}
                onChange={handleNewItemFormChange}
                required={field.required}
              />
            ) : (
              <input
                type={field.type || 'text'}
                id={field.name}
                name={field.name}
                value={newItemFormData[field.name] || ''}
                onChange={handleNewItemFormChange}
                required={field.required}
              />
            )}
            <label htmlFor={field.name} className="extra-field-label">{field.label}:</label>
          </React.Fragment>
        ))}


        <button onClick={handleAddRelationship} disabled={loading || !newItemFormData[relatedItemPayloadField]}>
          <FaPlusCircle /> Add
        </button>
      </div>

      {/* Lista de relacionamentos existentes */}
      <div className="related-items-list">
        {relatedItems.length === 0 ? (
          <p className="no-items-message">No {title.toLowerCase()} found.</p>
        ) : (
          <ul>
            {relatedItems.map(rel => (
              <li key={rel._id} className="related-item-tag">
                <span className="item-main-display">
                  {rel[relatedItemField]
                    ? rel[relatedItemField][relatedItemDisplayKey] || rel[relatedItemField].name || rel[relatedItemField].title || rel[relatedItemField].trainingTag
                    : `Unknown Item (${rel[relatedItemField]})`}
                </span>
                {extraFields.map(field => (
                  <span key={field.name} className="extra-field-display">
                    <strong>{field.label}:</strong> {field.type === 'date' && rel[field.name]
                      ? new Date(rel[field.name]).toLocaleDateString('pt-BR') // Formata para DD/MM/AAAA
                      : rel[field.name]}
                  </span>
                ))}
                <FaTimesCircle
                  className="remove-item-icon"
                  onClick={() => handleRemoveRelationship(rel._id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}