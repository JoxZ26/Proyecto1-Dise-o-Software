import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from 'react-toastify';

type Gym = { idGym: number; nombre: string; descripcion: string; logoUrl: string };

export default function BuscarGymsPage() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q') ?? '';

    const [gyms, setGyms] = useState<Gym[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [uniendo, setUniendo] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        setError('');
        api
            .get<Gym[]>(`/gyms/buscar?nombre=${encodeURIComponent(q)}`)
            .then(setGyms)
            .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar gimnasios'))
            .finally(() => setLoading(false));
    }, [q]);

    const unirse = async (idGym: number) => {
        setError('');
        setUniendo(idGym);
        try {
            await api.post(`/membresia/gym/${idGym}`, {});
            toast.success('Te uniste al gimnasio correctamente');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al unirse');
        } finally {
            setUniendo(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold">
                {q ? `Resultados para "${q}"` : 'Todos los gimnasios'}
            </h2>

            {error && (
                <div role="alert" className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            ) : gyms.length === 0 ? (
                <p className="opacity-60">No se encontraron gimnasios.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {gyms.map((g) => (
                        <div
                            key={g.idGym}
                            className="card bg-base-100 shadow-lg border border-base-300"
                        >
                            <div className="card-body flex-row items-center justify-between gap-5 p-8">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold">{g.nombre}</h3>
                                    {g.descripcion && (
                                        <p className="opacity-70 mt-1">{g.descripcion}</p>
                                    )}
                                </div>
                                <button
                                    className="btn btn-primary"
                                    disabled={uniendo === g.idGym}
                                    onClick={() => unirse(g.idGym)}
                                >
                                    {uniendo === g.idGym ? 'Uniendo...' : 'Unirse'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}