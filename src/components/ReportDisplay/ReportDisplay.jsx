// src/components/ReportDisplay/ReportDisplay.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

export default function ReportDisplay({ report, searchTerm, onSearch, checkEmployeeEligibility }) {
    if (!report || !report.task) {
        return <div className="no-data-message">Nenhum relatório disponível para exibição.</div>;
    }

    const { task } = report;

    const isReportOutdated = () => {
        if (!report.date) return false;

        const reportDate = new Date(report.date);
        const currentDate = new Date();
        const diffHours = Math.abs(currentDate - reportDate) / (1000 * 60 * 60);

        return diffHours > 24 && !navigator.onLine;
    };

    const isDueDateExpired = (dueDate, comparisonDate) => {
        if (!dueDate || dueDate === "N/A") {
            return false;
        }
        const due = new Date(dueDate);
        const comparison = new Date(comparisonDate);
        return due < comparison;
    };

    const filteredEmployees = task.employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.registration.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="report-container">
            <h2>Relatório da Tarefa</h2>
            <div className="task-details card-like">
                <h3>{task.name}</h3>
                <p><strong>Descrição:</strong> {task.description}</p>
                <p><strong>Local:</strong> {task.site}</p>
                <p><strong>Prazo:</strong> {new Date(task.dueDate).toLocaleDateString('pt-BR')}</p>
                <p><strong>Relatório baixado em:</strong> {new Date(report.date).toLocaleString('pt-BR')}</p>
                {isReportOutdated() && (
                    <p className="outdated-message">Os dados deste relatório podem estar desatualizados.</p>
                )}

                {/* Nova seção para listar as atividades */}
                {task.activities && task.activities.length > 0 && (
                    <div className="task-activities">
                        <h4>Atividades da Tarefa:</h4>
                        <ul>
                            {task.activities.map(activity => (
                                <li key={activity.id}>{activity.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="search-box-wrapper">
                {onSearch && <input
                    type="text"
                    placeholder="Procurar colaborador..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="search-input-field"
                />}
            </div>

            <div className="employees-list">
                <h3>Colaboradores:</h3>
                {filteredEmployees && filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => {
                        const eligibleActivities = checkEmployeeEligibility(employee, task.activities, report.date);
                        const canActMessageClass = eligibleActivities.length === 0 ? 'cannot-act-message' : '';

                        return (
                            <div key={employee.registration} className="employee-card card-like">
                                <h4>{employee.name} ({employee.registration})</h4>
                                <p className={canActMessageClass}>
                                    <strong>Pode atuar nas atividades:</strong>{" "}
                                    {eligibleActivities.length > 0
                                        ? eligibleActivities.join(", ")
                                        : "Nenhuma atividade devido a treinamentos/exames pendentes ou vencidos."}
                                </p>
                                <div className="employee-details">
                                    <h5>Treinamentos Recebidos:</h5>
                                    <ul>
                                        {employee.trainingReceived.length > 0 ? (
                                            employee.trainingReceived.map(tr => (
                                                <li
                                                    key={tr.id}
                                                    className={isDueDateExpired(tr.dueDate, report.date) ? 'expired-item' : ''}
                                                >
                                                    {tr.trainingTag} - {tr.name || 'Nome Indisponível'} (Rev {tr.revision})
                                                    {tr.dueDate && tr.dueDate !== "N/A" && (
                                                        <> - Vencimento: {new Date(tr.dueDate).toLocaleDateString('pt-BR')}</>
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <li>Nenhum treinamento registrado.</li>
                                        )}
                                    </ul>
                                    <h5>Exames de Saúde:</h5>
                                    <ul>
                                        {employee.employeeHealthExamination.length > 0 ? (
                                            employee.employeeHealthExamination.map(exam => (
                                                <li
                                                    key={exam.id}
                                                    className={isDueDateExpired(exam.dueDate, report.date) ? 'expired-item' : ''}
                                                >
                                                    {exam.title} - Vencimento: {new Date(exam.dueDate).toLocaleDateString('pt-BR')}
                                                </li>
                                            ))
                                        ) : (
                                            <li>Nenhum exame registrado.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>Nenhum colaborador encontrado com o termo de pesquisa.</p>
                )}
            </div>
        </div>
    );
}

ReportDisplay.propTypes = {
    report: PropTypes.object,
    searchTerm: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    checkEmployeeEligibility: PropTypes.func.isRequired,
};