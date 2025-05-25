import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../hooks/api";

export default function ActivityAddForm() {
    const navigate = useNavigate();

    return(
        <>
            <h2>Formulário adicionar nova Atividade!!!</h2>
            <button onClick={() => navigate(-1)}>Voltar</button>
        </>
    );
}