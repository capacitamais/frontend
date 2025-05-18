import { useEffect, useState } from "react";
import api from "../hooks/api";
import Table from "../components/Table/Table";

export default function Trainings() {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    api
      .get("/trainings/")
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
  }, []);

  return (
    <>
      <h1>Treinamentos</h1>
      <Table path='/trainings' data={trainings} />
    </>
  );
}
