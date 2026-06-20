import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

type Membresia = {
    gymId: number;
    nombreGym: string;
    rol: 'MEMBER' | 'COACH' | 'ADMIN';
    logoUrl: string | null;
    descripcion: string | null;
};

const seccionesPorRol: Record<string, { label: string; to: string }[]> = {
    ADMIN: [
        { label: 'Administrar gimnasio', to: 'administrar' },
        { label: 'Gestionar rutinas', to: 'rutinas' },
        { label: 'Ver miembros', to: 'miembros' },
        { label: 'Catálogo de ejercicios', to: 'ejercicios' },
    ],
    COACH: [
        { label: 'Mis rutinas asignadas', to: 'rutinas' },
        { label: 'Catálogo de ejercicios', to: 'ejercicios' },
    ],
    MEMBER: [
        { label: 'Mi rutina', to: 'mi-rutina' },
        { label: 'Mis medidas', to: 'medidas' },
    ],
};

const colorRol: Record<string, string> = {
    ADMIN: 'badge-primary',
    COACH: 'badge-secondary',
    MEMBER: 'badge-neutral',
};

export default function GymPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gym, setGym] = useState<Membresia | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        api
            .get<Membresia[]>('/usuarios/me/membresias')
            .then((mems) => {
                const encontrado = mems.find((m) => m.gymId === Number(id));
                if (encontrado) setGym(encontrado);
                else setError('No perteneces a este gimnasio.');
            })
            .catch(() => setError('Error al cargar el gimnasio.'))
            .finally(() => setLoading(false));
    }, [id]);

    const abandonar = async () => {
        if (!confirm('¿Seguro que quieres abandonar este gimnasio?')) return;
        try {
            await api.del(`/membresia/gym/${id}`);
            navigate('/');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al abandonar el gimnasio');
        }
    };

    if (loading) {
        return (
                <div className="flex flex-1 items-center justify-center">
                    <span className="loading loading-spinner loading-lg" />
                </div>
        );
    }

    if (error || !gym) {
        return (
            <div className="flex flex-col items-start gap-4">
                <div role="alert" className="alert alert-error max-w-md">
                    <span>{error || 'Gimnasio no encontrado.'}</span>
                </div>
                <Link to="/" className="btn btn-ghost">← Volver a mis gimnasios</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <Link to="/" className="btn btn-ghost btn-sm w-fit">← Mis gimnasios</Link>

            <div className="flex flex-col lg:flex-row gap-8 min-h-[65vh]">
                {/* Foto del gym (tamaño limitado, centrada) */}
                <div className="lg:w-1/2 flex items-center justify-center">
                    <div className="w-full max-w-xl aspect-square rounded-2xl overflow-hidden border border-base-300 bg-base-300">
                        {gym.logoUrl ? (
                            <img
                                src={gym.logoUrl}
                                alt={gym.nombreGym}
                                className="w-full h-full object-contain p-4"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center from-primary/40 to-base-300">
                                <span className="text-7xl font-bold text-primary-content uppercase">
                                    {gym.nombreGym.charAt(0)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Secciones por rol */}
                <div className="lg:w-1/2 flex flex-col gap-6">
                    <div>
                        <h2 className="text-3xl font-bold">{gym.nombreGym}</h2>
                        <span className={`badge ${colorRol[gym.rol] ?? 'badge-neutral'} mt-2`}>
                            {gym.rol}
                        </span>
                    </div>
                    {gym.descripcion && <p className="opacity-70">{gym.descripcion}</p>}

                    <div className="flex flex-col gap-3">
                        {(seccionesPorRol[gym.rol] ?? []).map((s) => (
                            <Link
                                key={s.to}
                                to={`/gym/${id}/${s.to}`}
                                className="btn btn-outline btn-lg justify-start w-full"
                            >
                                {s.label}
                            </Link>
                        ))}
                    </div>

                    {gym.rol !== 'ADMIN' && (
                        <button className="btn btn-outline btn-error w-fit mt-2" onClick={abandonar}>
                            Abandonar gimnasio
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}