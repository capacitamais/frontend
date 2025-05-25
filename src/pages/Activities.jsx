import { useEffect, useState } from "react";
import api from "../hooks/api";
import AddCard from "../components/AddCard/AddCard";
import SearchBox from "../components/SearchBox/SearchBox";
import Table from "../components/Table/Table";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchActivities = (searchFilter = "") => {
    api
      .get(`/activities?name=${searchFilter}`)
      .then((response) => {
        const mappedActivities = response.data.map((activity) => ({
          id: activity._id,
          name: activity.name,
          description: activity.description,
        }));
        setActivities(mappedActivities);
      })
      .catch((error) => console.error("Erro ao buscar as atividades:", error));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchActivities(term);
  };

  return (
    <>
      <AddCard to="/activities/add-form" label="Nova Atividade" />
      <SearchBox onSearch={handleSearch} />
      <Table path="/activities" data={activities} label="Atividades" />
    </>
  );
}
