import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Seu useAuth síncrono
import api from '../hooks/api';
import ProfileCard from '../components/ProfileCard/ProfileCard';

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAuth();

  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState(null);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [showPermissionDenied, setShowPermissionDenied] = useState(false);

  useEffect(() => {
    if (!user || user.id !== id) {
      setPageError("Você não tem permissão para ver este perfil ou o usuário não está logado.");
      setShowPermissionDenied(true);
      setTimeout(() => navigate('/'), 2000);
    } else {
      setPageError(null);
      setShowPermissionDenied(false);
    }
  }, [user, id, navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handlePasswordReset = async (newPassword, confirmNewPassword) => {
    setPasswordResetLoading(true);
    setPasswordResetError(null);
    setPasswordResetSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordResetError('As senhas não coincidem.');
      setPasswordResetLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordResetError('A senha deve ter no mínimo 6 caracteres.');
      setPasswordResetLoading(false);
      return;
    }

    try {
      // Endpoint da API para redefinir senha
      await api.put(`/users/update-password`, { newPassword, confirmNewPassword });
      setPasswordResetSuccess('Senha redefinida com sucesso!');
    } catch (err) {
      console.error('Erro ao redefinir senha:', err.response?.data || err);
      setPasswordResetError(`Erro ao redefinir senha: ${err.response?.data?.message || err.message}`);
    } finally {
      setPasswordResetLoading(false);
      setTimeout(() => {
        setPasswordResetSuccess(null);
        setPasswordResetError(null);
      }, 5000);
    }
  };

  if (showPermissionDenied) {
    return <p className="permission-denied-message">{pageError}</p>;
  }

  
  if (!user) {
    return <div className="loading-message">Redirecionando...</div>;
  }

  return (
    <ProfileCard
      user={user} // user é o objeto decodificado ou null
      onLogout={handleLogout}
      onBack={handleBack}
      onPasswordReset={handlePasswordReset}
      loadingPasswordReset={passwordResetLoading}
      passwordResetError={passwordResetError}
      passwordResetSuccess={passwordResetSuccess}
    />
  );
}