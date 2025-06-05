import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckAuth from "./utils/CheckAuth";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Login from "./pages/Login";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./components/Layout/Layout";
import Profile from "./components/Profile/Profile";
import Tasks from "./pages/Tasks";
import TaskForm from "./pages/TaskForm";
import Task from "./pages/Task";
import Activities from "./pages/Activities";
import ActivityForm from "./pages/ActivityForm";
import Activity from "./pages/Activity";
import Employees from "./pages/Employees";
import EmployeeForm from "./pages/EmployeeForm";
import Employee from "./pages/Employee";
import Trainings from "./pages/Trainings";
import TrainingForm from "./pages/TrainingForm";
import Training from "./components/Training/Training";
import HealthExaminations from "./pages/HealthExaminations";
import HealthExaminationForm from "./pages/HealthExaminationForm";
import HealthExamination from "./pages/HealthExamination";
import Users from "./pages/Users";
import UserForm from "./pages/UserForm";
import User from "./pages/User";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<CheckAuth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Rotas protegidas dentro do layout */}
        <Route element={<Layout />}>
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute requiredRole="analyst">
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/report"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <Report />
              </PrivateRoute>
            }
          />

          {/* Protegendo todas as rotas abaixo também */}
          <Route
            path="/tasks"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <Tasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <TaskForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <Task />
              </PrivateRoute>
            }
          />

          <Route
            path="/activities"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <Activities />
              </PrivateRoute>
            }
          />
          <Route
            path="/activities/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <ActivityForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/activities/:id"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <Activity />
              </PrivateRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <Employees />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <EmployeeForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <Employee />
              </PrivateRoute>
            }
          />

          <Route
            path="/trainings"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <Trainings />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainings/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <TrainingForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainings/:id"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <Training />
              </PrivateRoute>
            }
          />

          <Route
            path="/health-examinations"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <HealthExaminations />
              </PrivateRoute>
            }
          />
          <Route
            path="/health-examinations/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <HealthExaminationForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/health-examinations/:id"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <HealthExamination />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <UserForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <User />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Rota catch-all para página 404 - deve estar por último */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
