import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

type Membresia = {
    gymId: number;
    nombreGym: string;
    rol: 'MEMBER' | 'COACH' | 'ADMIN';
    logoUrl: string | null;
    descripcion: string | null;
};

const colorRol: Record<string, string> = {
    ADMIN: 'badge-primary',
    COACH: 'badge-secondary',
    MEMBER: 'badge-neutral',
};

export default function HomePage() {
    const navigate = useNavigate();
    const [membresias, setMembresias] = useState<Membresia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [modalAbierto, setModalAbierto] = useState(false);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [creando, setCreando] = useState(false);
    const [errorCrear, setErrorCrear] = useState('');

    const cargarMembresias = () => {
        setLoading(true);
        api
            .get<Membresia[]>('/usuarios/me/membresias')
            .then(setMembresias)
            .catch(() => setError('Error al cargar tus gimnasios.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargarMembresias();
    }, []);

    const crearGym = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorCrear('');
        setCreando(true);
        try {
            await api.post('/gyms', { nombre, descripcion, logoUrl });
            setNombre('');
            setDescripcion('');
            setLogoUrl('');
            setModalAbierto(false);
            cargarMembresias();
        } catch (err) {
            setErrorCrear(err instanceof Error ? err.message : 'Error al crear el gimnasio');
        } finally {
            setCreando(false);
        }
    };

    const modalCrear = modalAbierto && (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="text-xl font-bold mb-4">Crear gimnasio</h3>

                {errorCrear && (
                    <div role="alert" className="alert alert-error mb-4">
                        <span>{errorCrear}</span>
                    </div>
                )}

                <form onSubmit={crearGym} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Nombre del gimnasio"
                        className="input input-bordered w-full"
                        maxLength={50}
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Descripción"
                        className="textarea textarea-bordered w-full"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="URL del logo (opcional)"
                        className="input input-bordered w-full"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                    />

                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost" onClick={() => setModalAbierto(false)} disabled={creando}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={creando}>
                            {creando ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={() => setModalAbierto(false)} />
        </div>
    );

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

    if (membresias.length === 0) {
        return (
            <>
                {modalCrear}
                <div className="flex items-center justify-center min-h-[70vh]">
                    <div className="card bg-base-100 border border-base-300 shadow-xl max-w-md w-full">
                        <div className="card-body items-center text-center gap-4 p-10">
                            <div className="text-6xl">🏋️</div>
                            <h2 className="text-2xl font-bold">Aún no tienes gimnasios</h2>
                            <p className="opacity-60">
                                Únete a un gimnasio existente o crea el tuyo y conviértete en su administrador.
                            </p>
                            <div className="flex gap-3 mt-2">
                                <Link to="/buscar" className="btn btn-outline btn-lg">Buscar gimnasios</Link>
                                <button className="btn btn-primary btn-lg" onClick={() => setModalAbierto(true)}>
                                    Crear gimnasio
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {modalCrear}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h2 className="text-2xl font-semibold">Mis gimnasios</h2>
                    <button className="btn btn-primary" onClick={() => setModalAbierto(true)}>
                        + Crear gimnasio
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {membresias.map((m) => (
                        <div
                            key={m.gymId}
                            className="card bg-base-100 shadow-lg cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all border border-base-300 hover:border-primary/50 min-h-[160px]"
                            onClick={() => navigate(`/gym/${m.gymId}`)}
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
        </>
    );
}