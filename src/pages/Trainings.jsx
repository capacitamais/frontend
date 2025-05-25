import { useEffect, useState } from "react";
import api from "../hooks/api";
import Table from "../components/Table/Table";
import SearchBox from "../components/SearchBox/SearchBox";
import AddCard from "../components/AddCard/AddCard";

export default function Trainings() {
  const [trainings, setTrainings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTrainings = (searchFilter = '') => {
    // A função agora aceita um filtro de pesquisa
    api
      .get(`/trainings?titleOrTag=${searchFilter}`) // Passa o filtro na query string
      .then((response) => {
        const mappedTrainings = response.data.map((training) => ({
          id: training._id,
          tag: training.trainingTag,
          title: training.title,
        }));
        setTrainings(mappedTrainings);
      })
      .catch((error) =>
        console.error("Erro ao buscar os treinamentos:", error)
      );
  };

  useEffect(() => {
    fetchTrainings(); // Carrega todos os treinamentos na montagem inicial
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);       // Atualiza o estado do termo de busca
    fetchTrainings(term); // Chama fetchTrainings com o termo de busca
  };

  return (
    <>
      <AddCard to="/trainings/add-form" label="Novo Treinamento" />
      <SearchBox onSearch={handleSearch}/>
      <Table path="/trainings" data={trainings} label="Treinamentos"/>
    </>
  );
}
