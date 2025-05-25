import { useEffect, useState } from "react";
import api from "../hooks/api";
import AddCard from "../components/AddCard/AddCard";
import SearchBox from "../components/SearchBox/SearchBox";
import Table from "../components/Table/Table";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = (searchFilter = "") => {
    api.get(`/users?nameOrRegistration=${searchFilter}`).then((response) => {
      const mappedUsers = response.data.map((user) => ({
        id: user._id,
        name: user.name,
        registration: user.registration,
      }));
      setUsers(mappedUsers);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchUsers(term);
  };

  return (
    <>
      <AddCard to="/users/add-form" label="Novo Usuário" />
      <SearchBox onSearch={handleSearch} />
      <Table path="/users" data={users} label="Usuários" />
    </>
  );
}
