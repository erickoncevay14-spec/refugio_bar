import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Registro.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmarPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      const requisitos = validarPasswordFuerte(value);
      if (requisitos.length > 0) {
        setPasswordMsg(`La contraseña debe tener: ${requisitos.join(', ')}`);
      } else {
        setPasswordMsg('Contraseña válida');
      }
    }
  };

  const validarPasswordFuerte = (pw) => {
    const requisitos = [];
    if (!pw.match(/[A-Z]/)) requisitos.push('una mayúscula');
    if (!pw.match(/[a-z]/)) requisitos.push('una minúscula');
    if (!pw.match(/[0-9]/)) requisitos.push('un número');
    if (!pw.match(/[!@#$%^&*()_+\[\]{};':"|,.<>/?-]/)) requisitos.push('un símbolo');
    if (pw.length < 8) requisitos.push('mínimo 8 caracteres');
    return requisitos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      password: formData.password
    };
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        const data = await res.json();
        alert(data.message || data.error || 'Error al registrar usuario');
      }
    } catch (err) {
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="auth-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Registro</h2>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>
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
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i
              className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
              style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
          <div id="passwordMsg" style={{ color: passwordMsg.includes('válida') ? 'green' : 'red', fontSize: '0.875em', marginTop: '4px' }}>
            {passwordMsg}
          </div>
        </div>
        

        <div className="form-group">
          <button type="submit" className="cta-button" style={{ width: '100%' }}>
            Registrar
          </button>
        </div>
        <div className="form-group">
          <Link to="/login" className="cta-button" style={{ width: '100%', display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            Ir a Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
