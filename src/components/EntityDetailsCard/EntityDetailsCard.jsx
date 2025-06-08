import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../hooks/api';
import EditBtn from '../EditBtn/EditBtn';
import './style.css';

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
      alert(`${entityName} status updated successfully!`);
    } catch (err) {
      console.error(`Error updating ${entityName} status:`, err.response?.data || err);
      setErrorUpdate(`Failed to update ${entityName} status.`);
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
        <button className="back-button" onClick={handleGoBack}>
          Voltar
        </button>
        <h2 className="entity-title">{entityData.name || entityData.title || entityName + ' Details'}</h2>
        {editUrl && (
          <EditBtn to={editUrl} />
        )}
      </div>

      <p className="entity-description">Detalhes do {entityName.toLowerCase()}</p>

      <div className="details-grid">
        {fieldsToDisplay.map((field) => (
          <p key={field.key} className="detail-item">
            <strong>{field.label}:</strong> {entityData[field.key]}
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