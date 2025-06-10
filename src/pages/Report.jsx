// src/pages/Report.js

import { useState, useEffect, useCallback } from "react";
import api from "../hooks/api";
import { useAuth } from "../hooks/useAuth";

import ReportDisplay from "../components/ReportDisplay/ReportDisplay";

export default function Report() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(true);
  const [errorReport, setErrorReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const saveReportToLocalStorage = useCallback((data) => {
    try {
      localStorage.setItem("reportData", JSON.stringify(data));
      console.log("Relatório salvo no localStorage.");
    } catch (e) {
      console.error("Falha ao salvar relatório no localStorage:", e);
    }
  }, []);

  const loadReportFromLocalStorage = useCallback(() => {
    try {
      const storedReport = localStorage.getItem("reportData");
      if (storedReport) {
        const parsedReport = JSON.parse(storedReport);
        setReport(parsedReport);
        console.log("Relatório carregado do localStorage.");
        return true;
      }
    } catch (e) {
      console.error("Falha ao carregar relatório do localStorage:", e);
      localStorage.removeItem("reportData");
    }
    return false;
  }, []);

  const fetchReport = useCallback(async () => {
    setLoadingReport(true);
    setErrorReport(null);
    try {
      console.log("Tentando buscar relatório da API...");
      const response = await api.get(`/report`);
      const fetchedReport = response.data.report;
      setReport(fetchedReport);
      saveReportToLocalStorage(fetchedReport);
      console.log("Relatório buscado e atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao buscar o relatório da API:", err);
      setErrorReport("Não foi possível carregar o relatório. Verifique sua conexão ou tente novamente mais tarde.");
      setReport(prevReport => {
          if (!prevReport) {
              loadReportFromLocalStorage();
          }
          return prevReport;
      });
    } finally {
      setLoadingReport(false);
    }
  }, [saveReportToLocalStorage, loadReportFromLocalStorage]);

  // useEffect para carregar o relatório ao montar o componente
  useEffect(() => {
    const hasLoadedFromStorage = loadReportFromLocalStorage();
    if (!hasLoadedFromStorage || navigator.onLine) {
        fetchReport();
    } else {
        setLoadingReport(false);
    }
  }, [fetchReport, loadReportFromLocalStorage]);

  const checkEmployeeEligibility = useCallback((employee, activities, currentReportDate) => {
    const eligibleActivities = [];

    activities.forEach(activity => {
      let isActivityEligible = true;

      activity.requiredTraining.forEach(requiredTraining => {
        const receivedTraining = employee.trainingReceived.find(
          tr => tr.trainingTag === requiredTraining.trainingTag && tr.revision >= requiredTraining.revision
        );

        if (!receivedTraining) {
          isActivityEligible = false;
          return;
        }

        if (receivedTraining.dueDate && receivedTraining.dueDate !== "N/A") {
          const receivedDueDate = new Date(receivedTraining.dueDate);
          const reportDate = new Date(currentReportDate);

          if (receivedDueDate < reportDate) {
            isActivityEligible = false;
            return;
          }
        }
      });

      if (!isActivityEligible) {
        return;
      }

      employee.employeeHealthExamination.forEach(exam => {
        if (exam.dueDate) {
          const examDueDate = new Date(exam.dueDate);
          const reportDate = new Date(currentReportDate);

          if (examDueDate < reportDate) {
            isActivityEligible = false;
            return;
          }
        }
      });

      if (isActivityEligible) {
        eligibleActivities.push(activity.name);
      }
    });
    return eligibleActivities;
  }, []);

  if (loadingReport && !report) {
    return <div className="loading-message">Carregando relatório...</div>;
  }

  if (errorReport && !report) {
    return <div className="error-message">{errorReport}</div>;
  }

  if (!report || !report.task) {
    return <div className="no-data-message">Nenhum relatório disponível. Conecte-se à internet para baixar o relatório.</div>;
  }

  return (
    <ReportDisplay
      report={report}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      checkEmployeeEligibility={checkEmployeeEligibility}
    />
  );
}