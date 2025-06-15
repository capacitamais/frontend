import { useEffect, useState } from "react";
import api from "../hooks/api";
import AddCard from "../components/AddCard/AddCard";
import SearchBox from "../components/SearchBox/SearchBox";
import Table from "../components/Table/Table";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTasks = (searchFilter = "") => {
    api
      .get(`/tasks?name=${searchFilter}&isActive=true`)
      .then((response) => {
        const mappedTasks = response.data.map((task) => ({
          id: task._id,
          name: task.name,
          description: task.description,
        }));
        setTasks(mappedTasks);
      })
      .catch((error) => console.error("Erro ao buscar as tarefas:", error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchTasks(term);
  };

  return (
    <>
      <AddCard to="/tasks/add-form" label="Nova Tarefa" />
      <SearchBox onSearch={handleSearch} />
      <Table path="/tasks" data={tasks} label="Tarefas"/>
    </>
  );
}
