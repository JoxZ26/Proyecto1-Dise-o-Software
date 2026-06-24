import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';

const BG_GYM =
    'https://img.magnific.com/free-photo/strong-man-training-gym_1303-23478.jpg?semt=ais_hybrid&w=740&q=80';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post<{ token: string }>('/auth/login', { correo, password });
      sessionStorage.setItem('token', res.token);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  return (
      <div className="flex flex-1 min-h-screen"> {/* División de la pantalla */}
        {/* Mitad izquierda: marca sobre la foto del gym (oculta en móvil) */}
        <div
            className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-cover bg-center"
            style={{ backgroundImage: `url(${BG_GYM})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-base-300/70 to-base-300/90" />

          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-wide text-white">GymHub</h1>
          </div>

          <div className="relative z-10 max-w-md">
          </div>
        </div>

        {/* Mitad derecha: formulario en tarjeta */}
        <div className="flex w-full lg:w-1/2 items-center justify-center bg-base-200 p-6">
          <div className="card bg-base-100 shadow-2xl w-full max-w-md text-left border-2 border-primary/50 rounded-2xl">
            <div className="card-body gap-5 p-8">

              <h2 className="card-title text-3xl justify-center mb-1">Iniciar sesión</h2>
              {error && (
                  <div role="alert" className="alert alert-error">
                    <span>{error}</span>
                  </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="input input-bordered input-lg w-full"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="input input-bordered input-lg w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary btn-lg w-full">
                  Entrar
                </button>
              </form>

              <div className="text-center text-sm text-base-content/70">
                ¿No tienes cuenta?{' '}
                <Link to="/registro" className="link link-primary font-medium">
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}