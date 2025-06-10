// src/components/ResetPassword/ResetPassword.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../hooks/api';
import './style.css';

export default function ResetPassword({ userId }) {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleOpenModal = () => {
        setMessage('');
        setIsError(false);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsLoading(false);
        setMessage('');
        setIsError(false);
    };

    const handleConfirmReset = async () => {
        setIsLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const response = await api.put(`/users/reset-password/${userId}`);
            setMessage(response.data.message || 'Senha redefinida com sucesso!');
            setIsError(false);
        } catch (err) {
            console.error("Erro ao redefinir senha:", err);
            setMessage(err.response?.data?.message || 'Falha ao redefinir a senha.');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                className="reset-password-button"
                onClick={handleOpenModal}
                disabled={isLoading}
            >
                Reiniciar Senha
            </button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content card-like">
                        <h3>Confirmar Reinício de Senha</h3>
                        <p>Tem certeza que deseja reiniciar a senha deste usuário? A senha será redefinida para um valor padrão.</p>

                        {isLoading && <p className="loading-message">Reiniciando senha...</p>}
                        {message && (
                            <p className={isError ? 'error-message' : 'success-message'}>{message}</p>
                        )}

                        <div className="modal-actions">
                            {message.includes('sucesso!') ? (
                                <button
                                    className="modal-button confirm-button"
                                    onClick={handleCloseModal}
                                >
                                    Fechar
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="modal-button confirm-button"
                                        onClick={handleConfirmReset}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Enviando...' : 'Confirmar'}
                                    </button>
                                    <button
                                        className="modal-button cancel-button"
                                        onClick={handleCloseModal}
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

ResetPassword.propTypes = {
    userId: PropTypes.string.isRequired,
};