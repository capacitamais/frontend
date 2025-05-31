import { useState, useEffect, useCallback, useMemo } from 'react'; // Adicionado useMemo
import GenericForm from '../components/GenericForm/GenericForm';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../hooks/api';
import { FaTimesCircle } from 'react-icons/fa';

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Para modo de edição
  const [technicians, setTechnicians] = useState([]);
  const [allActivities, setAllActivities] = useState([]); // Todas as atividades carregadas
  const [allEmployees, setAllEmployees] = useState([]);   // Todos os funcionários carregados
  const [availableActivities, setAvailableActivities] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);

  // Estado completo do formulário
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    technician: '',
    activities: [], // Armazena apenas IDs
    employees: [],   // Armazena apenas IDs
  });

  // Funções de manipulação de campos simples
  const handleFormFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Callback para buscar todos os dados de dropdown e, se for edição, os dados da tarefa
  const fetchInitialData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [techniciansRes, activitiesRes, employeesRes] = await Promise.all([
        api.get('/users?role=technician'),
        api.get('/activities'),
        api.get('/employees'),
      ]);

      const fetchedTechnicians = techniciansRes.data.map(user => ({ value: user._id, label: user.name }));
      const fetchedAllActivities = activitiesRes.data.map(activity => ({ value: activity._id, label: activity.name }));
      const fetchedAllEmployees = employeesRes.data.map(employee => ({ value: employee._id, label: employee.name }));

      setTechnicians(fetchedTechnicians);
      setAllActivities(fetchedAllActivities); // Guarda todas as atividades
      setAllEmployees(fetchedAllEmployees);   // Guarda todos os funcionários

      let initialTaskData = {
        name: '',
        description: '',
        dueDate: '',
        technician: '',
        activities: [],
        employees: [],
      };

      if (id) {
        const taskRes = await api.get(`/tasks/${id}`);
        const taskData = taskRes.data;

        initialTaskData = {
          name: taskData.name || '',
          description: taskData.description || '',
          dueDate: taskData.dueDate ? taskData.dueDate.split('T')[0] : '',
          technician: taskData.technician || '',
          activities: taskData.activities || [],
          employees: taskData.employees || [],
        };
      }

      setFormData(initialTaskData);

      // Ajusta as listas de disponíveis para as atividades
      setAvailableActivities(fetchedAllActivities.filter(act => !initialTaskData.activities.includes(act.value)));

      // Ajusta as listas de disponíveis para os funcionários
      setAvailableEmployees(fetchedAllEmployees.filter(emp => !initialTaskData.employees.includes(emp.value)));

      setLoadingData(false);
    } catch (err) {
      setErrorData('Failed to load form data. Please check your backend connection.');
      console.error('Error fetching form data:', err);
      setLoadingData(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Cria um mapa de IDs para rótulos para busca rápida
  // Isso será usado para exibir os nomes dos itens selecionados
  const activityMap = useMemo(() => {
    return allActivities.reduce((map, activity) => {
      map[activity.value] = activity.label;
      return map;
    }, {});
  }, [allActivities]);

  const employeeMap = useMemo(() => {
    return allEmployees.reduce((map, employee) => {
      map[employee.value] = employee.label;
      return map;
    }, {});
  }, [allEmployees]);


  // Funções de manipulação para Activities
  const handleAddActivity = (e) => {
    const activityId = e.target.value;
    if (activityId && !formData.activities.includes(activityId)) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, activityId],
      }));
      setAvailableActivities(prev => prev.filter(a => a.value !== activityId));
      e.target.value = ''; // Reseta o select
    }
  };

  const handleRemoveActivity = (activityId) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter(id => id !== activityId),
    }));
    // Adiciona de volta à lista de disponíveis
    const activityToReturn = allActivities.find(a => a.value === activityId);
    if (activityToReturn) {
      setAvailableActivities(prev => [...prev, activityToReturn].sort((a, b) => a.label.localeCompare(b.label)));
    }
  };

  // Funções de manipulação para Employees
  const handleAddEmployee = (e) => {
    const employeeId = e.target.value;
    if (employeeId && !formData.employees.includes(employeeId)) {
      setFormData(prev => ({
        ...prev,
        employees: [...prev.employees, employeeId],
      }));
      setAvailableEmployees(prev => prev.filter(emp => emp.value !== employeeId));
      e.target.value = ''; // Reseta o select
    }
  };

  const handleRemoveEmployee = (employeeId) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.filter(id => id !== employeeId),
    }));
    // Adiciona de volta à lista de disponíveis
    const employeeToReturn = allEmployees.find(emp => emp.value === employeeId);
    if (employeeToReturn) {
      setAvailableEmployees(prev => [...prev, employeeToReturn].sort((a, b) => a.label.localeCompare(b.label)));
    }
  };

  const handleSubmit = async (dataToSubmit) => {
    try {
      if (id) {
        await api.put(`/tasks/${id}`, dataToSubmit);
        alert('Tarefa alterada com sucesso!');
      } else {
        await api.post('/tasks', dataToSubmit);
        alert('Tarefa criada com sucesso!');
      }
      navigate('/tasks');
    } catch (err) {
      console.error('Erro ao salvar tarefa:', err.response?.data || err);
      throw err;
    }
  };

  if (loadingData) {
    return <div className="loading-message">Iniciando formulário...</div>;
  }

  if (errorData) {
    return <div className="error-message">{errorData}</div>;
  }

  // Prepara os nomes/rótulos para exibição dos itens selecionados
  const displaySelectedActivities = formData.activities
    .map(activityId => ({
      value: activityId,
      label: activityMap[activityId] || `Unknown Activity (${activityId})`
    }));

  const displaySelectedEmployees = formData.employees
    .map(employeeId => ({
      value: employeeId,
      label: employeeMap[employeeId] || `Unknown Employee (${employeeId})`
    }));

  return (
    <div className="task-form-container">
      <GenericForm
        entityName="Tarefa"
        fields={[
          { name: 'name', label: 'Nome', type: 'text', required: true },
          { name: 'description', label: 'Descrição da tarefa', type: 'textarea', required: true },
          { name: 'dueDate', label: 'Prazo', type: 'date', required: true },
          {
            name: 'technician',
            label: 'Técnico',
            type: 'select',
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
        {/* Renderiza os campos customizados (Activities e Employees) como children */}
        <div className="form-group">
          <label htmlFor="activities-select">Atividades:</label>
          <select
            id="activities-select"
            value=""
            onChange={handleAddActivity}
            disabled={availableActivities.length === 0}
          >
            <option value="">Selecione atividades...</option>
            {availableActivities.map((activity) => (
              <option key={activity.value} value={activity.value}>
                {activity.label}
              </option>
            ))}
          </select>
          <div className="selected-items-list">
            {displaySelectedActivities.length > 0 ? (
              displaySelectedActivities.map((activity) => (
                <div key={activity.value} className="selected-item-tag">
                  {activity.label}
                  <FaTimesCircle
                    className="remove-item-icon"
                    onClick={() => handleRemoveActivity(activity.value)}
                  />
                </div>
              ))
            ) : (
              <p className="no-selection-message">Sem atividades selecionadas.</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="employees-select">Colaboradores:</label>
          <select
            id="employees-select"
            value=""
            onChange={handleAddEmployee}
            disabled={availableEmployees.length === 0}
          >
            <option value="">Selecione colaboradoes...</option>
            {availableEmployees.map((employee) => (
              <option key={employee.value} value={employee.value}>
                {employee.label}
              </option>
            ))}
          </select>
          <div className="selected-items-list">
            {displaySelectedEmployees.length > 0 ? (
              displaySelectedEmployees.map((employee) => (
                <div key={employee.value} className="selected-item-tag">
                  {employee.label}
                  <FaTimesCircle
                    className="remove-item-icon"
                    onClick={() => handleRemoveEmployee(employee.value)}
                  />
                </div>
              ))
            ) : (
              <p className="no-selection-message">Sem colaboradores selecionados.</p>
            )}
          </div>
        </div>
      </GenericForm>
    </div>
  );
}