// src/components/ImportCsvDisplay/ImportCsvDisplay.jsx
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './style.css'; // O CSS para este componente

export default function ImportCsvDisplay({ onFileSelect, uploadResults, isLoading, error }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="import-csv-container">
            <h2>Importar Controle de Treinamentos</h2>

            <div className="import-area card-like">
                <div
                    className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                >
                    <input
                        type="file"
                        accept=".csv"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }} // Esconde o input padrão
                    />
                    <p>Arraste e solte o arquivo CSV aqui</p>
                    <p>ou clique para selecionar</p>
                </div>

                {isLoading && <p className="loading-message">Enviando planilha...</p>}
                {error && <p className="error-message">{error}</p>}

                {uploadResults && (
                    <div className="upload-results">
                        <h3>Resultados da Importação:</h3>
                        <p>{uploadResults.message}</p>
                        {uploadResults.resultados && uploadResults.resultados.length > 0 ? (
                            <ul>
                                {uploadResults.resultados.map((result, index) => (
                                    <li
                                        key={index}
                                        className={result.status === "Importado com sucesso." ? 'success-item' : 'error-item'}
                                    >
                                        {result.matricula && `Matrícula: ${result.matricula}, `}
                                        {result.codigotreinamento && `Código Treinamento: ${result.codigotreinamento}, `}
                                        {result.revisao && `Revisão: ${result.revisao}, `}
                                        <strong>Status: {result.status}</strong>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhum resultado detalhado disponível.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

ImportCsvDisplay.propTypes = {
    onFileSelect: PropTypes.func.isRequired,
    uploadResults: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.string,
};