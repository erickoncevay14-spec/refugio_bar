import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../../services/authService";
import "../../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const data = await loginService(formData.email, formData.password);
      console.log("Login exitoso:", data);

      // Redirigir según el rol del usuario
      const userRole = data.rol?.toLowerCase();
      if (userRole === "admin") {
        import("../../styles/admin.css");
        navigate("/admin");
      } else if (userRole === "mozo") {
        import("../../styles/mozo.css");
        navigate("/mozo");
      } else if (userRole === "bartender") {
        import("../../styles/bartender.css");
        navigate("/bartender");
      } else if (userRole === "cliente") {
        navigate("/cliente/reservar");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <section id="login">
      <div className="container">
        <form className="login-form" autoComplete="off" onSubmit={e => { e.preventDefault(); handleLogin(); }}>
          <h2>Iniciar Sesión</h2>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {/* icono mostrar/ocultar */}
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 15,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              ></i>
            </div>
          </div>

          <div className="form-group">
            <button type="button" className="cta-button" style={{ width: "100%" }} onClick={handleLogin}>
              Iniciar Sesión
            </button>
          </div>

          <div className="form-group">
            <button type="button" className="cta-button" style={{ width: "100%" }} onClick={() => navigate("/register")}>
              Registrar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
