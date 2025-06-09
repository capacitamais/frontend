import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckAuth from "./utils/CheckAuth";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Login from "./pages/Login";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./components/Layout/Layout";
import Profile from "./pages/Profile";
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
import Training from "./pages/Training";
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
        {/* Rotas fora do layout principal */}
        <Route path="/" element={<CheckAuth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/*" element={<NotFound />} />

        {/* Rotas dentro do layout principal */}
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
              <PrivateRoute requiredRole="technician">
                <Report />
              </PrivateRoute>
            }
          />
          <Route path="/tasks" element={<Tasks />} />
          <Route
            path="/tasks/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <TaskForm />
              </PrivateRoute>
            }
          />
          <Route path="/tasks/:id" element={<Task />} />
          <Route
            path="/tasks/edit/:id"
            element={
              <PrivateRoute requiredRole="analyst">
                <TaskForm />
              </PrivateRoute>
            }
          />
          <Route path="/activities" element={<Activities />} />
          <Route
            path="/activities/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <ActivityForm />
              </PrivateRoute>
            }
          />
          <Route path="/activities/:id" element={<Activity />} />
          <Route
            path="/activities/edit/:id"
            element={
              <PrivateRoute requiredRole="analyst">
                <ActivityForm />
              </PrivateRoute>
            }
          />
          <Route path="/employees" element={<Employees />} />
          <Route
            path="/employees/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <EmployeeForm/>
              </PrivateRoute>
            }
          />
          <Route path="/employees/:id" element={<Employee />} />
          <Route
            path="/employees/edit/:id"
            element={
              <PrivateRoute requiredRole="analyst">
                <EmployeeForm />
              </PrivateRoute>
            }
          />
          <Route path="/trainings" element={<Trainings />} />
          <Route
            path="/trainings/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <TrainingForm />
              </PrivateRoute>
            }
          />
          <Route path="/trainings/:id" element={<Training />} />
          <Route
            path="/trainings/edit/:id"
            element={
              <PrivateRoute requiredRole="analyst">
                <TrainingForm />
              </PrivateRoute>
            }
          />
          <Route path="/health-examinations" element={<HealthExaminations />} />
          <Route
            path="/health-examinations/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <HealthExaminationForm />
              </PrivateRoute>
            }
          />
          <Route path="/health-examinations/:id" element={<HealthExamination />} />
          <Route
            path="/health-examinations/edit/:id"
            element={
              <PrivateRoute requiredRole="analyst">
                <HealthExaminationForm />
              </PrivateRoute>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route
            path="/users/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <UserForm />
              </PrivateRoute>
            }
          />
          <Route path="/users/:id" element={<User />} />
          <Route
            path="/users/edit/:id"
            element={
              <PrivateRoute requiredRole="analyst">
                <UserForm />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
