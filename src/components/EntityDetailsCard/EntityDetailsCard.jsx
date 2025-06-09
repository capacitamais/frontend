// src/components/EntityDetailsCard/EntityDetailsCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../hooks/api';
import EditBtn from '../EditBtn/EditBtn';
import './style.css';

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export default function EntityDetailsCard({
  entityData,
  entityName,
  apiUrl,
  fieldsToDisplay = [],
  editUrl = null,
  children,
}) {
  const navigate = useNavigate();
  const [isActiveState, setIsActiveState] = useState(entityData.isActive);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);

  useEffect(() => {
    setIsActiveState(entityData.isActive);
  }, [entityData.isActive]);

  const handleIsActiveToggle = async (e) => {
    const newIsActive = e.target.checked;
    setIsActiveState(newIsActive);
    setLoadingUpdate(true);
    setErrorUpdate(null);

    try {
      await api.patch(`${apiUrl}/${entityData._id}`, { isActive: newIsActive });
      alert(`${entityName} status atualizado com sucesso!`);
    } catch (err) {
      console.error(`Erro ao atualizar status de ${entityName}:`, err.response?.data || err);
      setErrorUpdate(`Falha ao atualizar status de ${entityName}.`);
      setIsActiveState(!newIsActive);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="entity-details-card-container">
      <div className="card-header">
        <h2 className="entity-title">{entityData.name || entityData.title || `Detalhes do ${entityName}`}</h2>
        <div className="card-actions"> {/* Novo contêiner para os botões */}
          <button className="back-button" onClick={handleGoBack}>
            Voltar
          </button>
          {editUrl && (
            <EditBtn to={editUrl} />
          )}
        </div>
      </div>

      <p className="entity-description">Detalhes de {entityName.toLowerCase()}</p>

      <div className="details-grid">
        {fieldsToDisplay.map((field) => (
          <p key={field.key} className="detail-item">
            <strong>{field.label}:</strong>{' '}
            {field.format
              ? field.format(getNestedValue(entityData, field.key), entityData)
              : getNestedValue(entityData, field.key)}
          </p>
        ))}

        <div className="detail-item status-toggle">
          <strong>Status:</strong> {isActiveState ? 'Ativo' : 'Inativo'}
          <input
            type="checkbox"
            checked={isActiveState}
            onChange={handleIsActiveToggle}
            disabled={loadingUpdate}
          />
          {loadingUpdate && <span className="status-loading"> (Atualizando...)</span>}
          {errorUpdate && <span className="status-error"> ({errorUpdate})</span>}
        </div>
      </div>

      {children}
    </div>
  );
}