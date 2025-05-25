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
import TaskAddForm from "./pages/TaskAddForm";
import Task from "./pages/Task";
import Activities from "./pages/Activities";
import ActivityAddForm from "./pages/ActivityAddForm";
import Activity from "./pages/Activity";
import Employees from "./pages/Employees";
import EmployeeAddForm from "./pages/EmployeeAddForm";
import Employee from "./pages/Employee";
import Trainings from "./pages/Trainings";
import TrainingAddForm from "./pages/TrainingAddForm";
import Training from "./pages/Training";
import HealthExaminations from "./pages/HealthExaminations";
import HealthExaminationAddForm from "./pages/HealthExaminationAddForm";
import HealthExamination from "./pages/HealthExamination";
import Users from "./pages/Users";
import UserAddForm from "./pages/UserAddForm";
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
              <PrivateRoute requiredRole={["analyst", "technician"]}>
                <Report />
              </PrivateRoute>
            }
          />
          <Route path="/tasks" element={<Tasks />} />
          <Route
            path="/tasks/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <TaskAddForm />
              </PrivateRoute>
            }
          />
          <Route path="/tasks/:id" element={<Task />} />
          <Route path="/activities" element={<Activities />} />
          <Route
            path="/activities/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <ActivityAddForm />
              </PrivateRoute>
            }
          />
          <Route path="/activities/:id" element={<Activity />} />
          <Route path="/employees" element={<Employees />} />
          <Route
            path="/employees/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <EmployeeAddForm/>
              </PrivateRoute>
            }
          />
          <Route path="/employees/:id" element={<Employee />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route
            path="/trainings/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <TrainingAddForm />
              </PrivateRoute>
            }
          />
          <Route path="/trainings/:id" element={<Training />} />
          <Route path="/health-examinations" element={<HealthExaminations />} />
          <Route
            path="/health-examinations/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <HealthExaminationAddForm />
              </PrivateRoute>
            }
          />
          <Route path="/health-examinations/:id" element={<HealthExamination />} />
          <Route path="/users" element={<Users />} />
          <Route
            path="/users/add-form"
            element={
              <PrivateRoute requiredRole="analyst">
                <UserAddForm />
              </PrivateRoute>
            }
          />
          <Route path="/users/:id" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
