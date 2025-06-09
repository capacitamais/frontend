import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../hooks/api";
import EntityDetailsCard from "../components/EntityDetailsCard/EntityDetailsCard";

export default function User() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);

  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const response = await api.get(`/users/${id}`);
      setUser(response.data);
    } catch (err) {
      setErrorUser('Falha ao carregar dados do usuário.');
      console.error("Erro ao buscar o usuário:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const userFieldsToDisplay = useMemo(() => [
    { key: "name", label: "Nome" },
    { key: "registration", label: "Matrícula" },
    { key: "role", label: "Cargo" },
  ], []);

  if (loadingUser) {
    return <div className="loading-message">Carregando detalhes do usuário...</div>;
  }

  if (errorUser) {
    return <div className="error-message">{errorUser}</div>;
  }

  if (!user) {
    return <div className="no-data-message">Usuário não encontrado.</div>;
  }

  return (
    <div className="user-details-page-wrapper">
      <EntityDetailsCard
        entityData={user}
        entityName="Usuário"
        apiUrl="/users"
        fieldsToDisplay={userFieldsToDisplay}
        editUrl={`/users/edit/${user._id}`}
      />
    </div>
  );
}