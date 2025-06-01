import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import GenericForm from "../components/GenericForm/GenericForm";
import api from "../hooks/api";

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [technicians, setTechnicians] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
    technician: "",
    activities: [],
    employees: [],
  });

  const handleFormFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchInitialData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [techniciansRes, activitiesRes, employeesRes] = await Promise.all([
        api.get("/users?role=technician"),
        api.get("/activities"),
        api.get("/employees"),
      ]);

      const fetchedTechnicians = techniciansRes.data.map((user) => ({
        value: user._id,
        label: user.name,
      }));

      const fetchedActivities = activitiesRes.data.map((activity) => ({
        value: activity._id,
        label: activity.name,
      }));

      const fetchedEmployees = employeesRes.data.map((employee) => ({
        value: employee._id,
        label: employee.name,
      }));

      setTechnicians(fetchedTechnicians);
      setAllActivities(fetchedActivities);
      setAllEmployees(fetchedEmployees);

      if (id) {
        const taskRes = await api.get(`/tasks/${id}`);
        const task = taskRes.data;

        setFormData({
          name: task.name || "",
          description: task.description || "",
          dueDate: task.dueDate?.split("T")[0] || "",
          technician: task.technician?._id || "",
          activities: task.activities?.map((a) => a._id) || [],
          employees: task.employees?.map((e) => e._id) || [],
        });
      }

      setLoadingData(false);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setErrorData("Erro ao carregar dados. Verifique a conexão.");
      setLoadingData(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const activityMap = useMemo(() => {
    return allActivities.reduce((acc, item) => {
      acc[item.value] = item.label;
      return acc;
    }, {});
  }, [allActivities]);

  const employeeMap = useMemo(() => {
    return allEmployees.reduce((acc, item) => {
      acc[item.value] = item.label;
      return acc;
    }, {});
  }, [allEmployees]);

  const availableActivities = useMemo(() => {
    return allActivities.filter(
      (a) => !formData.activities.includes(a.value)
    );
  }, [allActivities, formData.activities]);

  const availableEmployees = useMemo(() => {
    return allEmployees.filter(
      (e) => !formData.employees.includes(e.value)
    );
  }, [allEmployees, formData.employees]);

  const handleAddActivity = (e) => {
    const id = e.target.value;
    if (id && !formData.activities.includes(id)) {
      setFormData((prev) => ({
        ...prev,
        activities: [...prev.activities, id],
      }));
    }
    e.target.value = "";
  };

  const handleRemoveActivity = (id) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.filter((a) => a !== id),
    }));
  };

  const handleAddEmployee = (e) => {
    const id = e.target.value;
    if (id && !formData.employees.includes(id)) {
      setFormData((prev) => ({
        ...prev,
        employees: [...prev.employees, id],
      }));
    }
    e.target.value = "";
  };

  const handleRemoveEmployee = (id) => {
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.filter((e) => e !== id),
    }));
  };

  const handleSubmit = async (data) => {
    try {
      if (id) {
        await api.put(`/tasks/${id}`, data);
        alert("Tarefa atualizada com sucesso.");
      } else {
        await api.post("/tasks", data);
        alert("Tarefa criada com sucesso.");
      }
      navigate("/tasks");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar tarefa.");
    }
  };

  if (loadingData) return <p>Carregando dados...</p>;
  if (errorData) return <p>{errorData}</p>;

  const displaySelectedActivities = formData.activities.map((id) => ({
    value: id,
    label: activityMap[id] || `Atividade (${id})`,
  }));

  const displaySelectedEmployees = formData.employees.map((id) => ({
    value: id,
    label: employeeMap[id] || `Funcionário (${id})`,
  }));

  return (
    <div className="task-form-container">
      <GenericForm
        entityName="Tarefa"
        fields={[
          { name: "name", label: "Nome", type: "text", required: true },
          { name: "description", label: "Descrição", type: "textarea", required: true },
          { name: "dueDate", label: "Prazo", type: "date", required: true },
          {
            name: "technician",
            label: "Técnico",
            type: "select",
            required: true,
            options: technicians,
          },
        ]}
        onSubmit={handleSubmit}
        apiUrl="/tasks"
        isEditing={!!id}
        currentFormData={formData}
        onFieldChange={handleFormFieldChange}
      >
        {/* Atividades */}
        <div className="form-group">
          <label htmlFor="activities-select">Atividades:</label>
          <select
            id="activities-select"
            onChange={handleAddActivity}
            value=""
            disabled={availableActivities.length === 0}
          >
            <option value="">Selecione atividades...</option>
            {availableActivities.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
          <div className="selected-items-list">
            {displaySelectedActivities.length ? (
              displaySelectedActivities.map((a) => (
                <div key={a.value} className="selected-item-tag">
                  {a.label}
                  <FaTimesCircle onClick={() => handleRemoveActivity(a.value)} />
                </div>
              ))
            ) : (
              <p>Sem atividades selecionadas.</p>
            )}
          </div>
        </div>

        {/* Colaboradores */}
        <div className="form-group">
          <label htmlFor="employees-select">Colaboradores:</label>
          <select
            id="employees-select"
            onChange={handleAddEmployee}
            value=""
            disabled={availableEmployees.length === 0}
          >
            <option value="">Selecione colaboradores...</option>
            {availableEmployees.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
          <div className="selected-items-list">
            {displaySelectedEmployees.length ? (
              displaySelectedEmployees.map((e) => (
                <div key={e.value} className="selected-item-tag">
                  {e.label}
                  <FaTimesCircle onClick={() => handleRemoveEmployee(e.value)} />
                </div>
              ))
            ) : (
              <p>Sem colaboradores selecionados.</p>
            )}
          </div>
        </div>
      </GenericForm>
    </div>
  );
}
