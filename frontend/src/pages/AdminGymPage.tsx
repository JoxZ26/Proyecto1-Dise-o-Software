import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

type Membresia = {
  gymId: number;
  nombreGym: string;
  rol: 'MEMBER' | 'COACH' | 'ADMIN';
  logoUrl: string | null;
  descripcion: string | null;
};

export default function AdminGymPage() {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [puedeEditar, setPuedeEditar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    api
      .get<Membresia[]>('/usuarios/me/membresias')
      .then((mems) => {
        const g = mems.find((m) => m.gymId === Number(id));
        if (!g) {
          setError('No perteneces a este gimnasio.');
        } else if (g.rol !== 'ADMIN') {
          setError('Solo el administrador puede editar el gimnasio.');
        } else {
          setNombre(g.nombreGym);
          setDescripcion(g.descripcion ?? '');
          setLogoUrl(g.logoUrl ?? '');
          setPuedeEditar(true);
        }
      })
      .catch(() => setError('Error al cargar el gimnasio.'))
      .finally(() => setLoading(false));
  }, [id]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOk('');
    setGuardando(true);
    try {
      await api.put(`/gyms/${id}`, { nombre, descripcion, logoUrl });
      setOk('Gimnasio actualizado correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!puedeEditar) {
    return (
      <div className="flex flex-col items-start gap-4">
        <div role="alert" className="alert alert-error max-w-md">
          <span>{error || 'No autorizado.'}</span>
        </div>
        <Link to={`/gym/${id}`} className="btn btn-ghost">← Volver al gimnasio</Link>
      </div>
    );
  }

  return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <Link to={`/gym/${id}`} className="btn btn-ghost btn-sm w-fit">← Volver al gimnasio</Link>

      <div className="card bg-base-100 shadow-2xl w-full max-w-2xl border-2 border-primary/50 rounded-2xl">
        <div className="card-body p-8 gap-6">
          <h2 className="text-3xl font-bold">Administrar gimnasio</h2>

          {error && <div role="alert" className="alert alert-error"><span>{error}</span></div>}
          {ok && <div role="alert" className="alert alert-success"><span>{ok}</span></div>}

          <form onSubmit={guardar} className="flex flex-col gap-5">
            <div className="form-control">
              <label className="label"><span className="label-text">Nombre</span></label>
              <input
                className="input input-bordered input-lg w-full"
                maxLength={50}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Descripción</span></label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">URL del logo</span></label>
              <input
                className="input input-bordered input-lg w-full"
                placeholder="https://..."
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
            </div>

            {logoUrl && (
              <div className="w-40 aspect-square rounded-xl overflow-hidden border border-base-300 bg-base-300">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}