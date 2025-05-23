import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../hooks/api";

export default function HealthExaminationForm() {
  const navigate = useNavigate();

  return (
    <>
      <h2>Formulario adicionar novo exame.</h2>
      <button onClick={() => navigate(-1)}>Voltar</button>
    </>
  );
}
