import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

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
    <div className="flex flex-1 items-center justify-center">
      <div className="card bg-base-100 shadow-xl w-full max-w-sm text-left">
        <div className="card-body gap-4">
          <h2 className="card-title text-2xl justify-center">Iniciar sesión</h2>

          {error && (
            <div role="alert" className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="input input-bordered w-full"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary w-full">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
