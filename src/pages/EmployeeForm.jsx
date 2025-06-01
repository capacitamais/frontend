import { useState, useEffect } from "react"; // Importa useState
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
      const fetchEmployee = async () => {
        if (!id) return;
        try {
          setLoading(true);
          const response = await api.get(`/employees/${id}`);
          const employee = response.data;
  
          setFormData({
            name: employee.name || "",
            registration: employee.registration || "",
          });
  
          setLoading(false);
        } catch (err) {
          console.error("Erro ao carregar colaborador:", err);
          setError("Erro ao carregar dados de colaborador.");
          setLoading(false);
        }
      };
  
      fetchEmployee();
    }, [id]);

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

  if (loading) return <p>Carregando colaborador...</p>;
  if (error) return <p>{error}</p>;

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
