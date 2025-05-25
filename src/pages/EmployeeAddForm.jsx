import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../hooks/api";

export default function EmployeeAddForm() {
    const navigate = useNavigate();

    return(
        <>
            <h2>Formulário adicionar novo Colaborador!!!</h2>
            <button onClick={() => navigate(-1)}>Voltar</button>
        </>
    );
}