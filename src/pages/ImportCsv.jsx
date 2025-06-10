// src/pages/ImportCsvPage.js
import React, { useState, useCallback } from 'react';
import api from '../hooks/api';
import { useAuth } from '../hooks/useAuth';

import ImportCsvDisplay from '../components/ImportCsvDisplay/ImportCsvDisplay';

export default function ImportCsv() {
    const { user } = useAuth(); // Assume que useAuth fornece o token ou informações para auth
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResults, setUploadResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSelect = useCallback((file) => {
        setSelectedFile(file);
        setUploadResults(null); // Limpa resultados anteriores
        setError(null); // Limpa erros anteriores
        // Automaticamente faz o upload quando um arquivo é selecionado
        handleUpload(file);
    }, []);

    const handleUpload = useCallback(async (fileToUpload) => {
        if (!fileToUpload) {
            setError("Por favor, selecione um arquivo CSV para importar.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', fileToUpload);

        try {
            // Inclua o token de autorização, se necessário
            const headers = {
                'Content-Type': 'multipart/form-data',
                // 'Authorization': `Bearer ${user?.token}`, // Descomente se precisar de autenticação
            };

            const response = await api.post('received-training/import', formData, { headers });
            setUploadResults(response.data);
            setSelectedFile(null); // Limpa o arquivo selecionado após o upload
        } catch (err) {
            console.error("Erro na importação do CSV:", err);
            const errorMessage = err.response?.data?.message || "Ocorreu um erro ao importar a planilha.";
            setError(errorMessage);
            setUploadResults(null); // Limpa resultados em caso de erro
        } finally {
            setIsLoading(false);
        }
    }, [/* user?.token */]); // Adicione user?.token aqui se for descomentar a linha de autenticação

    return (
        <ImportCsvDisplay
            onFileSelect={handleFileSelect}
            uploadResults={uploadResults}
            isLoading={isLoading}
            error={error}
        />
    );
}