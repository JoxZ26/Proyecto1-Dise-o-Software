import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';

const BG_GYM =
    'https://img.magnific.com/free-photo/strong-man-training-gym_1303-23478.jpg?semt=ais_hybrid&w=740&q=80';

export default function RegisterPage() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await api.post('/usuarios/registrar', { correo, password });
      // Registro correcto: enviar al login
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    }
  };

  return (
    <div className="flex flex-1 min-h-screen">
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
          <p className="mt-4 text-lg text-white/80">
          </p>
        </div>
      </div>

      {/* Mitad derecha: formulario de registro en tarjeta */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-base-200 p-6">
        <div className="card bg-base-100 shadow-2xl w-full max-w-md text-left border-2 border-primary/50 rounded-2xl">
          <div className="card-body gap-5 p-8">
            <div className="lg:hidden text-center mb-2">
              <h1 className="text-3xl font-bold text-primary">GymHub</h1>
            </div>

            <h2 className="card-title text-3xl justify-center mb-1">Crear cuenta</h2>
            <p className="text-center text-base-content/60 mb-2">Regístrate para empezar</p>

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
              <input
                type="password"
                placeholder="Confirmar contraseña"
                className="input input-bordered input-lg w-full"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-lg w-full">
                Registrarse
              </button>
            </form>

            <div className="text-center text-sm text-base-content/70">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="link link-primary font-medium">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}