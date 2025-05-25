import { useEffect, useState } from "react";
import api from "../hooks/api";
import AddCard from "../components/AddCard/AddCard";
import SearchBox from "../components/SearchBox/SearchBox";
import Table from "../components/Table/Table";

export default function HealthExaminations() {
  const [examinations, setExaminations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHealthExaminations = (searchFilter = "") => {
    api
      .get(`/health-examinations?title=${searchFilter}`)
      .then((response) => {
        const mappedExams = response.data.map((healthExamination) => ({
          id: healthExamination._id,
          title: healthExamination.title,
        }));
        setExaminations(mappedExams);
      })
      .catch((error) => console.error("Erro ao buscar os exames:", error));
  };

  useEffect(() => {
    fetchHealthExaminations();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchHealthExaminations(term);
  };

  return (
    <>
      <AddCard to="/health-examinations/add-form" label="Novo Exame" />
      <SearchBox onSearch={handleSearch} />
      <Table path="/health-examinations" data={examinations} label="Exames Ocupacionais"/>
    </>
  );
}
