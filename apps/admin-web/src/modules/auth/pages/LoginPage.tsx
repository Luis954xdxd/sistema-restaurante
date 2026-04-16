import { motion } from 'framer-motion';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../services/auth.service';
import { useAuth } from '../../../hooks/useAuth';
import '../styles/login.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@restaurante.com');
  const [password, setPassword] = useState('Admin123*');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginRequest({ email, password });
      login(response);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || 'No se pudo iniciar sesión');
      } else {
        setError('No se pudo iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <motion.div
        className="login-hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="login-hero-badge">
          <ShieldCheck size={18} />
          <span>Sistema Restaurante</span>
        </div>

        <h1>Administra pedidos, productos, inventario y reportes en un solo lugar.</h1>
        <p>
          Un panel moderno para controlar la operación diaria de tu restaurante
          con rapidez, orden y claridad.
        </p>

        <div className="login-hero-points">
          <div className="login-hero-point">Dashboard con métricas</div>
          <div className="login-hero-point">Gestión de productos e imágenes</div>
          <div className="login-hero-point">Control de stock y movimientos</div>
        </div>
      </motion.div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
      >
        <div className="login-card-header">
          <h1>Panel Administrativo</h1>
          <p>Inicia sesión para administrar el restaurante</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Correo
            <div className="login-input-wrap">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@restaurante.com"
              />
            </div>
          </label>

          <label>
            Contraseña
            <div className="login-input-wrap">
              <LockKeyhole size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default LoginPage;