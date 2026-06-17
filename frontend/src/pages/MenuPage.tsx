import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

type UserInfo = { idUsuario: number; correo: string };
type Membresia = { gymId: number; nombreGym: string; rol: 'MEMBER' | 'COACH' | 'ADMIN' };

const opcionesPorRol: Record<string, string[]> = {
  ADMIN: ['Administrar gimnasio', 'Gestionar rutinas', 'Ver miembros'],
  COACH: ['Mis rutinas asignadas', 'Catálogo de ejercicios'],
  MEMBER: ['Mi rutina', 'Mis medidas'],
};

export default function MenuPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [gymActivo, setGymActivo] = useState<Membresia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [me, mems] = await Promise.all([
          api.get<UserInfo>('/auth/me'),
          api.get<Membresia[]>('/usuarios/me/membresias'),
        ]);
        setUserInfo(me);
        setMembresias(mems);
        if (mems.length === 1) setGymActivo(mems[0]);
      } catch {
        setError('Error al cargar datos. Intenta volver a iniciar sesión.');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const logout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
        <button className="btn btn-ghost mt-4" onClick={logout}>
          Volver al login
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-6 text-left">
      {/* Barra superior */}
      <div className="flex justify-between items-center">
        <span className="text-sm opacity-60">{userInfo?.correo}</span>
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      {/* Selector de gym — solo si hay varios y ninguno activo aún */}
      {!gymActivo && (
        <>
          <h2 className="text-xl font-semibold">Selecciona un gimnasio</h2>

          {membresias.length === 0 && (
            <p className="opacity-60">No perteneces a ningún gimnasio todavía.</p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {membresias.map((m) => (
              <div
                key={m.gymId}
                className="card bg-base-100 shadow cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setGymActivo(m)}
              >
                <div className="card-body">
                  <h3 className="card-title">{m.nombreGym}</h3>
                  <span className="badge badge-neutral">{m.rol}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Vista del gym activo */}
      {gymActivo && (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold">{gymActivo.nombreGym}</h2>
              <span className="badge badge-primary">{gymActivo.rol}</span>
            </div>
            {membresias.length > 1 && (
              <button
                className="btn btn-ghost btn-sm ml-auto"
                onClick={() => setGymActivo(null)}
              >
                Cambiar gimnasio
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {(opcionesPorRol[gymActivo.rol] ?? []).map((opcion) => (
              <button
                key={opcion}
                className="btn btn-outline justify-start w-full sm:w-72"
              >
                {opcion}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
