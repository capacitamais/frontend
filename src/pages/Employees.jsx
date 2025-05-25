import { useEffect, useState } from "react";
import api from "../hooks/api";
import AddCard from "../components/AddCard/AddCard";
import SearchBox from "../components/SearchBox/SearchBox";
import Table from "../components/Table/Table";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmployees = (searchFilter = "") =>{
    api.get(`/employees?nameOrRegistration=${searchFilter}`).then((response) => {
        const mappedEmployees = response.data.map((employee) => ({
            id: employee._id,
            name: employee.name,
            registration: employee.registration,
        }));
        setEmployees(mappedEmployees);

    })
    .catch((error) => console.error("Erro ao buscar os colaboradores:", error))
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchEmployees(term);
  };

  return (
    <>
      <AddCard to="/employees/add-form" label="Novo Colaborador" />
      <SearchBox onSearch={handleSearch} />
      <Table path="/employees" data={employees} label="Colaboradores"/>
    </>
  );
}
