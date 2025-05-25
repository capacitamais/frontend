import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../hooks/api";

export default function TrainingAddForm() {
  const navigate = useNavigate();

  return (
    <>
      <h2>Formulario adicionar novo treinamento.</h2>
      <button onClick={() => navigate(-1)}>Voltar</button>
    </>
  );
}
