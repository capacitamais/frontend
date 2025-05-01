import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckAuth from "./utils/CheckAuth";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Login from "./pages/Login";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        //Rotas foras do layout principal
        <Route path="/" element={<CheckAuth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />

        //Rotas dentro do layout pirncipal
        <Route element={<Layout />}>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
