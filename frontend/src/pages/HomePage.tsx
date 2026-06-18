import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type Membresia = { gymId: number; nombreGym: string; rol: 'MEMBER' | 'COACH' | 'ADMIN' };

const opcionesPorRol: Record<string, string[]> = {
    ADMIN: ['Administrar gimnasio', 'Gestionar rutinas', 'Ver miembros'],
    COACH: ['Mis rutinas asignadas', 'Catálogo de ejercicios'],
    MEMBER: ['Mi rutina', 'Mis medidas'],
};

const colorRol: Record<string, string> = {
    ADMIN: 'badge-primary',
    COACH: 'badge-secondary',
    MEMBER: 'badge-neutral',
};

export default function HomePage() {
    const [membresias, setMembresias] = useState<Membresia[]>([]);
    const [gymActivo, setGymActivo] = useState<Membresia | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api
            .get<Membresia[]>('/usuarios/me/membresias')
            .then((mems) => {
                setMembresias(mems);
                if (mems.length === 1) setGymActivo(mems[0]);
            })
            .catch(() => setError('Error al cargar tus gimnasios.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div role="alert" className="alert alert-error">
                <span>{error}</span>
            </div>
        );
    }

    // Estado vacío: no pertenece a ningún gimnasio
    if (membresias.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="card bg-base-100 border border-base-300 shadow-xl max-w-md w-full">
                    <div className="card-body items-center text-center gap-4 p-10">
                        <div className="text-6xl">GymHub</div>
                        <h2 className="text-2xl font-bold">Aún no tienes gimnasios</h2>
                        <p className="opacity-60">
                            Únete a un gimnasio para ver tus rutinas, tu rol y tu progreso.
                        </p>
                        <Link to="/buscar" className="btn btn-primary btn-lg mt-2">
                            Buscar gimnasios
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Vista de un gym seleccionado
    if (gymActivo) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <div>
                        <h2 className="text-2xl font-semibold">{gymActivo.nombreGym}</h2>
                        <span className="badge badge-primary">{gymActivo.rol}</span>
                    </div>
                    {membresias.length > 1 && (
                        <button className="btn btn-ghost btn-sm ml-auto" onClick={() => setGymActivo(null)}>
                            Cambiar gimnasio
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    {(opcionesPorRol[gymActivo.rol] ?? []).map((opcion) => (
                        <button key={opcion} className="btn btn-outline justify-start w-full sm:w-72">
                            {opcion}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Lista de gimnasios a los que pertenece
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold">Mis gimnasios</h2>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {membresias.map((m) => (
                    <div
                        key={m.gymId}
                        className="card bg-base-100 shadow-lg cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all border border-base-300 hover:border-primary/50 min-h-[160px]"
                        onClick={() => setGymActivo(m)}
                    >
                        <div className="card-body flex-row items-center gap-5 p-8">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold">{m.nombreGym}</h3>
                                <span className={`badge ${colorRol[m.rol] ?? 'badge-neutral'} mt-2`}>
                  {m.rol}
                </span>
                            </div>
                            <span className="text-2xl opacity-40">→</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}