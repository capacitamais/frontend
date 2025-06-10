// src/components/RelationshipManager/RelationshipManager.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../hooks/api";
import { FaTimesCircle, FaPlusCircle } from "react-icons/fa";
import PropTypes from 'prop-types'; // Importar PropTypes
import "./style.css";

export default function RelationshipManager({
    mainEntityId,
    relationEntityName,
    getRelationshipsApiUrl,
    availableItemsApiUrl,
    mainEntityRelationField,
    relatedItemField,
    relatedItemDisplayKey,
    mainEntityPayloadField,
    relatedItemPayloadField,
    extraFields = [],
    relatedItemExtraFields = [],
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
            const formattedAllItems = allItemsRes.data.map((item) => ({
                value: item._id,
                label:
                    item[relatedItemDisplayKey] ||
                    item.name ||
                    item.title ||
                    item.trainingTag,
            }));
            setAvailableItems(formattedAllItems);

            const relatedRes = await api.get(
                `${getRelationshipsApiUrl}/${mainEntityId}`
            );
            setRelatedItems(relatedRes.data);

            const initialNewItemData = { [relatedItemPayloadField]: "" };
            extraFields.forEach((field) => {
                initialNewItemData[field.name] =
                    field.type === "date" ? "" : field.defaultValue || "";
            });
            setNewItemFormData(initialNewItemData);
        } catch (err) {
            console.error(`Erro ao buscar dados de ${relationEntityName}:`, err);
            setError(`Falha ao carregar dados de ${title}.`);
        } finally {
            setLoading(false);
        }
    }, [
        mainEntityId,
        relationEntityName,
        getRelationshipsApiUrl,
        availableItemsApiUrl,
        relatedItemDisplayKey,
        mainEntityPayloadField,
        relatedItemPayloadField,
        extraFields,
        title,
    ]);

    useEffect(() => {
        if (mainEntityId) {
            fetchRelationshipsAndAvailableItems();
        }
    }, [mainEntityId, fetchRelationshipsAndAvailableItems]);

    const handleNewItemFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewItemFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddRelationship = async (e) => {
        e.preventDefault();
        if (!newItemFormData[relatedItemPayloadField]) {
            alert("Selecione um item para adicionar.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const dataToSubmit = {
                ...newItemFormData,
                [mainEntityPayloadField]: mainEntityId,
                [relatedItemPayloadField]: newItemFormData[relatedItemPayloadField],
                isActive: true,
            };

            if (dataToSubmit.date) {
                // Converte para ISO string e pega apenas a parte da data (YYYY-MM-DD)
                dataToSubmit.date = new Date(dataToSubmit.date).toISOString().split('T')[0];
            }
            if (dataToSubmit.dueDate) {
                // Converte para ISO string e pega apenas a parte da data (YYYY-MM-DD)
                dataToSubmit.dueDate = new Date(dataToSubmit.dueDate).toISOString().split('T')[0];
            }

            await api.post(`/${relationEntityName}`, dataToSubmit);
            alert(
                `${
                    itemMap[newItemFormData[relatedItemPayloadField]] || "Item"
                } adicionado com sucesso!`
            );
            fetchRelationshipsAndAvailableItems();
        } catch (err) {
            console.error(
                `Erro ao adicionar relacionamento a ${relationEntityName}:`,
                err.response?.data || err
            );
            setError(
                `Falha ao adicionar relacionamento: ${
                    err.response?.data?.message || err.message || 'Erro desconhecido'
                }`
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveRelationship = async (relationshipId) => {
        if (
            !window.confirm("Tem certeza que deseja remover este relacionamento?")
        ) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await api.delete(`/${relationEntityName}/${relationshipId}`);
            alert("Relacionamento removido com sucesso!");
            fetchRelationshipsAndAvailableItems();
        } catch (err) {
            console.error(
                `Erro ao remover relacionamento de ${relationEntityName}:`,
                err.response?.data || err
            );
            setError(
                `Falha ao remover relacionamento: ${
                    err.response?.data?.message || err.message || 'Erro desconhecido'
                }`
            );
        } finally {
            setLoading(false);
        }
    };

    // Filtra itens disponíveis para não incluir os já relacionados
    const actualAvailableItems = availableItems.filter(
        (item) =>
            !relatedItems.some((rel) => rel[relatedItemField]?._id === item.value)
    );

    if (loading) {
        return <div className="loading-message">Carregando {title}...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="relationship-manager-container">
            <h3>{title}</h3>

            <div className="add-relationship-section">
                {/* Select de itens disponíveis */}
                <div className="form-group">
                    <label htmlFor={relatedItemPayloadField}>Selecione para adicionar:</label>
                    <select
                        id={relatedItemPayloadField}
                        value={newItemFormData[relatedItemPayloadField]}
                        onChange={handleNewItemFormChange}
                        name={relatedItemPayloadField}
                        disabled={actualAvailableItems.length === 0 || loading}
                    >
                        <option value="">-- Selecione --</option>
                        {actualAvailableItems.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Campos extras (Data realização, Data validade) */}
                {extraFields.map((field) => (
                    <div className="form-group" key={field.name}>
                        <label htmlFor={field.name} className="extra-field-label">
                            {field.label}:
                        </label>
                        {field.type === "date" ? (
                            <input
                                type="date"
                                id={field.name}
                                name={field.name}
                                // Assegura que a data esteja no formato YYYY-MM-DD para o input type="date"
                                value={newItemFormData[field.name] ? new Date(newItemFormData[field.name]).toISOString().split('T')[0] : ""}
                                onChange={handleNewItemFormChange}
                                required={field.required}
                                className="date-input"
                            />
                        ) : field.type === "checkbox" ? (
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
                                type={field.type || "text"}
                                id={field.name}
                                name={field.name}
                                value={newItemFormData[field.name] || ""}
                                onChange={handleNewItemFormChange}
                                required={field.required}
                            />
                        )}
                    </div>
                ))}

                <button
                    onClick={handleAddRelationship}
                    disabled={loading || !newItemFormData[relatedItemPayloadField]}
                >
                    <FaPlusCircle /> Adicionar
                </button>
            </div>

            <div className="related-items-list">
                {relatedItems.length === 0 ? (
                    <p className="no-items-message">
                        Nenhum {title.toLowerCase()} encontrado.
                    </p>
                ) : (
                    <ul>
                        {relatedItems.map((rel) => (
                            <li key={rel._id} className="related-item-tag">
                                <span className="item-main-display">
                                    {rel[relatedItemField]
                                        ? rel[relatedItemField][relatedItemDisplayKey] ||
                                          rel[relatedItemField].name ||
                                          rel[relatedItemField].title ||
                                          rel[relatedItemField].trainingTag // Fix: Use relatedItemField here
                                        : `Item desconhecido (${rel[relatedItemField]})`}
                                </span>

                                {extraFields.map((field) => (
                                    <span
                                        key={`rel-${rel._id}-${field.name}`}
                                        className="extra-field-display"
                                    >
                                        <strong>{field.label}:</strong>{" "}
                                        {field.type === "date" && rel[field.name]
                                            ? new Date(rel[field.name]).toLocaleDateString("pt-BR")
                                            : rel[field.name]}
                                    </span>
                                ))}

                                {relatedItemExtraFields.map((field) => (
                                    <span
                                        key={`item-${rel._id}-${field.key}`}
                                        className="extra-field-display"
                                    >
                                        <strong>{field.label}:</strong>{" "}
                                        {rel[relatedItemField] && rel[relatedItemField][field.key] !== undefined
                                            ? rel[relatedItemField][field.key]
                                            : "N/A"}
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

RelationshipManager.propTypes = {
    mainEntityId: PropTypes.string.isRequired,
    relationEntityName: PropTypes.string.isRequired,
    getRelationshipsApiUrl: PropTypes.string.isRequired,
    availableItemsApiUrl: PropTypes.string.isRequired,
    mainEntityRelationField: PropTypes.string.isRequired,
    relatedItemField: PropTypes.string.isRequired,
    relatedItemDisplayKey: PropTypes.string.isRequired,
    mainEntityPayloadField: PropTypes.string.isRequired,
    relatedItemPayloadField: PropTypes.string.isRequired,
    extraFields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.string,
            defaultValue: PropTypes.any,
            required: PropTypes.bool,
        })
    ),
    relatedItemExtraFields: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    title: PropTypes.string.isRequired,
};