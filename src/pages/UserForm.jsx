import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../hooks/api";

export default function UserForm() {
    const navigate = useNavigate();

    return(
        <>
            <h2>Adicionar Usuário</h2>
            <button onClick={() => navigate(-1)}>Voltar</button>
        </>
    );
}