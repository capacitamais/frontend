import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

export default function LoginForm() {
  const [registration, setRegistration] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/users/login`,
        {
          registration,
          password,
        }
      );
      console.log("Resposta da API:", response);
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      console.error("Erro ao autenticar:", err);
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="login-container">
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
        {error && <p className="login-error">{error}</p>} {/* Adiciona a classe para o erro */}
        <button type="submit" className="login-button">Entrar</button> {/* Adiciona a classe para o botão */}
      </form>
    </div>
  );
}
