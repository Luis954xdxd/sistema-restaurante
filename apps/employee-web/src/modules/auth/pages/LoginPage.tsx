// Importamos animaciones
import { motion } from 'framer-motion';

// Importamos iconos
import { BriefcaseBusiness, LockKeyhole, Mail } from 'lucide-react';

// Importamos estado y tipo de formulario
import { useState } from 'react';
import type { FormEvent } from 'react';

// Importamos helper de axios para detectar errores
import { isAxiosError } from 'axios';

// Importamos navegación
import { useNavigate } from 'react-router-dom';

// Importamos servicio de login
import { loginRequest } from '../services/auth.service';

// Importamos hook auth
import { useAuth } from '../../../hooks/useAuth';

// Importamos estilos
import '../styles/login.css';

// Página de login del empleado
function LoginPage() {
  // Hook para navegar
  const navigate = useNavigate();

  // Hook del contexto de auth
  const { login } = useAuth();

  // Estado del correo
  const [email, setEmail] = useState('empleado@restaurante.com');

  // Estado de contraseña
  const [password, setPassword] = useState('Empleado123*');

  // Estado de error
  const [error, setError] = useState('');

  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // Evitamos recarga del navegador
    event.preventDefault();

    // Limpiamos errores previos
    setError('');

    // Activamos loading
    setIsLoading(true);

    try {
      // Llamamos al backend
      const response = await loginRequest({ email, password });

      // Validamos que el rol sí sea empleado o admin
      if (response.user.role !== 'EMPLOYEE' && response.user.role !== 'ADMIN') {
        setError('Esta cuenta no tiene acceso al panel de empleado');
        setIsLoading(false);
        return;
      }

      // Guardamos sesión
      login(response);

      // Redirigimos al dashboard
      navigate('/dashboard');
    } catch (err: unknown) {
      // Si es error de axios, mostramos mensaje del backend
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || 'No se pudo iniciar sesión');
      } else {
        setError('No se pudo iniciar sesión');
      }
    } finally {
      // Quitamos loading
      setIsLoading(false);
    }
  };

  return (
    <div className="employee-login-page">
      <motion.div
        className="employee-login-hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="employee-login-badge">
          <BriefcaseBusiness size={18} />
          <span>Panel Operativo</span>
        </div>

        <h1>Gestiona pedidos e inventario del restaurante con rapidez.</h1>
        <p>
          Accede como empleado para revisar pedidos, cambiar estados y consultar
          el stock del día.
        </p>
      </motion.div>

      <motion.div
        className="employee-login-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <h1>Acceso de empleado</h1>
        <p>Inicia sesión para entrar al panel operativo</p>

        <form onSubmit={handleSubmit} className="employee-login-form">
          <label>
            Correo
            <div className="employee-login-input-wrap">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="empleado@restaurante.com"
              />
            </div>
          </label>

          <label>
            Contraseña
            <div className="employee-login-input-wrap">
              <LockKeyhole size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>
          </label>

          {error && <div className="employee-login-error">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default LoginPage;