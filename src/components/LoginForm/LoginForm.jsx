import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

export default function LoginForm() {
  const [registration, setRegistration] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!registration.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/users/login`,
        { registration, password }
      );

      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Matrícula ou senha inválidos.");
      } else if (err.request) {
        setError("Servidor indisponível. Verifique sua conexão.");
      } else {
        setError("Erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="logo-capacita">
          Capacita<span className="plus">+</span>
        </h1>
        <p className="subtitle">Gestão de treinamentos</p>
      </div>

      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-title">Login</h2>

        <input
          type="text"
          placeholder="Matrícula"
          value={registration}
          onChange={(e) => setRegistration(e.target.value)}
          required
          className="login-input"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading && <span className="spinner"></span>}
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* Ondas no fundo */}
      <div className="waves">
        <svg viewBox="0 0 120 28" preserveAspectRatio="none">
          <path d="M0 24 Q30 12 60 24 T120 24 V30 H0 Z" fill="#64b5f6" opacity="0.8"/>

        </svg>
      </div>
    </div>
  );
}
