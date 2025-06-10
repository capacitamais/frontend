import React, { useState } from 'react';
import './style.css';

export default function ProfileCard({
  user,
  onLogout,
  onBack,
  onPasswordReset,
  loadingPasswordReset,
  passwordResetError,
  passwordResetSuccess
}) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handlePasswordResetSubmit = (e) => {
    e.preventDefault();
    onPasswordReset(newPassword, confirmNewPassword);
    setNewPassword('');
    setConfirmNewPassword('');
  };

  if (!user) {
    return <div className="loading-message">Carregando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Perfil do Usuário</h1>
        <div className="profile-actions">
          <button className="back-button" onClick={onBack}>
            Voltar
          </button>
          <button className="logout-button" onClick={onLogout}>
            Sair
          </button>
        </div>
      </div>

      <div className="profile-details">
        <p className="detail-item"><strong>Nome:</strong> {user.name}</p>
        <p className="detail-item"><strong>Matrícula:</strong> {user.registration}</p>
        <p className="detail-item"><strong>Função:</strong> {user.role}</p>
      </div>

      <div className="password-reset-section">
        <h2 className="section-title">Redefinir Senha</h2>
        <form onSubmit={handlePasswordResetSubmit} className="password-reset-form">
          <div className="form-group">
            <label htmlFor="new-password">Nova Senha:</label>
            <input
              type="password"
              id="new-password"
              name="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-new-password">Confirmar Nova Senha:</label>
            <input
              type="password"
              id="confirm-new-password"
              name="confirm-new-password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          {passwordResetError && <p className="error-message">{passwordResetError}</p>}
          {passwordResetSuccess && <p className="success-message">{passwordResetSuccess}</p>}
          <button type="submit" disabled={loadingPasswordReset} className="save-button">
            {loadingPasswordReset ? 'Salvando...' : 'Salvar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}