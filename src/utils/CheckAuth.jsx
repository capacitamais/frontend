import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function CheckAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const { role, exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      if (role === "analyst") navigate("/home");
      else if (role === "technician") navigate("/report");
      else navigate("/access-denied");
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return null;
}
