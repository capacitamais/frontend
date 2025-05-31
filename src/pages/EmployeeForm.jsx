import { useState } from "react"; // Importa useState
import GenericForm from "../components/GenericForm/GenericForm";
import { useParams, useNavigate } from "react-router-dom";
import api from "../hooks/api";

export default function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    registration: "",
  });

  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (dataToSubmit) => {
    try {
      if (id) {
        await api.put(`/employees/${id}`, dataToSubmit);
        alert("Colaborador atualizado com sucesso!");
      } else {
        await api.post("/employees", dataToSubmit);
        alert("Colaborador criado com sucesso!");
      }
      navigate("/employees");
    } catch (err) {
      console.error("Erro ao salvar colaborador:", err.response?.data || err);
      throw err;
    }
  };

  const employeeFields = [
    {
      name: "name",
      label: "Nome",
      type: "text",
      required: true,
    },
    {
      name: "registration",
      label: "Matrícula",
      type: "text",
      required: true,
    },
  ];

  return (
    <GenericForm
      entityName="employees"
      fields={employeeFields}
      onSubmit={handleSubmit}
      apiUrl="/employees"
      isEditing={!!id}
      currentFormData={formData}
      onFieldChange={handleFormFieldChange}
    />
  );
}
