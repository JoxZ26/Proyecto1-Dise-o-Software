import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

type Miembro = {
    idUsuario: number;
    correo: string;
    rol: 'MEMBER' | 'COACH' | 'ADMIN';
};

const colorRol: Record<string, string> = {
    ADMIN: 'badge-primary',
    COACH: 'badge-secondary',
    MEMBER: 'badge-neutral',
};

export default function MiembrosPage() {
    const { id } = useParams();
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [promoviendo, setPromoviendo] = useState<number | null>(null);

    const cargar = () => {
        setLoading(true);
        api
            .get<Miembro[]>(`/gyms/${id}/usuarios`)
            .then(setMiembros)
            .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar los miembros'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargar();
    }, [id]);

    const promover = async (idUsuario: number) => {
        setPromoviendo(idUsuario);
        try {
            await api.put(`/membresia/${id}/coach/${idUsuario}`, {});
            cargar(); // refresca para que el rol pase a COACH y el botón desaparezca
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al promover');
        } finally {
            setPromoviendo(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <Link to={`/gym/${id}`} className="btn btn-ghost btn-sm w-fit">← Volver al gimnasio</Link>

            <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold">Miembros</h2>
                {!loading && !error && (
                    <span className="badge badge-neutral badge-lg">{miembros.length}</span>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            ) : error ? (
                <div role="alert" className="alert alert-error max-w-md">
                    <span>{error}</span>
                </div>
            ) : miembros.length === 0 ? (
                <p className="opacity-60">Este gimnasio no tiene miembros todavía.</p>
            ) : (
                <div className="card bg-base-100 border border-base-300 shadow-lg max-w-2xl">
                    <ul className="divide-y divide-base-300">
                        {miembros.map((m) => (
                            <li key={m.idUsuario} className="flex items-center gap-4 p-4">
                                <div className="avatar placeholder">
                                    <div className="w-10 rounded-full bg-primary text-primary-content">
                                        <span className="uppercase">{m.correo.charAt(0)}</span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <span>{m.correo}</span>
                                </div>

                                <span className={`badge ${colorRol[m.rol] ?? 'badge-neutral'}`}>{m.rol}</span>

                                {m.rol === 'MEMBER' && (
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        disabled={promoviendo === m.idUsuario}
                                        onClick={() => promover(m.idUsuario)}
                                    >
                                        {promoviendo === m.idUsuario ? 'Promoviendo...' : 'Promover a coach'}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}