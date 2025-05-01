import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckAuth from "./utils/CheckAuth";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Login from "./pages/Login";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Activities from "./pages/Activities";
import Employees from "./pages/Employees";
import Trainings from "./pages/Trainings";
import HealthExaminations from "./pages/HealthExaminations";
import Users from "./pages/Users";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas fora do layout principal */}
        <Route path="/" element={<CheckAuth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />

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
          <Route path="/activities" element={<Activities />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/health-examinations" element={<HealthExaminations />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
