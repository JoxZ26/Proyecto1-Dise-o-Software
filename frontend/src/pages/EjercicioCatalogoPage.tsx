import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type Ejercicio = {
    idEjercicio: number;
    nombre: string;
    grupoMuscular: string;
    descripcion: string | null;
    imagenUrl: string | null;
    videoUrl: string | null;
};

export default function EjercicioCatalogoPage() {
    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [modalAbierto, setModalAbierto] = useState(false);
    const [form, setForm] = useState({ nombre: '', grupoMuscular: '', descripcion: '', imagenUrl: '', videoUrl: '' });
    const [creando, setCreando] = useState(false);
    const [errorCrear, setErrorCrear] = useState('');
    const [puedeCrear, setPuedeCrear] = useState(false);

    const cargar = () => {
        setLoading(true);
        api
            .get<Ejercicio[]>('/ejercicios')
            .then(setEjercicios)
            .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar ejercicios'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        Promise.all([
            api.get<Ejercicio[]>('/ejercicios'),
            api.get<{ rol: 'MEMBER' | 'COACH' | 'ADMIN' }[]>('/usuarios/me/membresias'),
        ])
            .then(([ejs, mems]) => {
                setEjercicios(ejs);
                setPuedeCrear(mems.some((m) => m.rol === 'COACH' || m.rol === 'ADMIN'));
            })
            .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar ejercicios'))
            .finally(() => setLoading(false));
    }, []);

    const crear = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorCrear('');
        setCreando(true);
        try {
            await api.post('/ejercicios', form);
            setForm({ nombre: '', grupoMuscular: '', descripcion: '', imagenUrl: '', videoUrl: '' });
            setModalAbierto(false);
            cargar();
        } catch (err) {
            setErrorCrear(err instanceof Error ? err.message : 'Error al crear el ejercicio');
        } finally {
            setCreando(false);
        }
    };

    const filtrados = ejercicios.filter(
        (ej) =>
            ej.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            (ej.grupoMuscular ?? '').toLowerCase().includes(filtro.toLowerCase())
    );

    const set = (campo: keyof typeof form, valor: string) =>
        setForm((f) => ({ ...f, [campo]: valor }));

    return (
        <div className="flex flex-col gap-6">
            <Link to="/" className="btn btn-ghost btn-sm w-fit">← Mis gimnasios</Link>

            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-3xl font-bold">Catálogo de ejercicios</h2>
                {puedeCrear && (
                    <button className="btn btn-primary" onClick={() => setModalAbierto(true)}>
                        + Crear ejercicio
                    </button>
                )}
            </div>

            <input
                type="text"
                placeholder="Filtrar por nombre o grupo muscular..."
                className="input input-bordered w-full max-w-md"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
            />

            {loading ? (
                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            ) : error ? (
                <div role="alert" className="alert alert-error max-w-md"><span>{error}</span></div>
            ) : filtrados.length === 0 ? (
                filtro ? (
                    <p className="opacity-60">No hay ejercicios que coincidan con “{filtro}”.</p>
                ) : (
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="card bg-base-100 border border-base-300 shadow-xl max-w-md w-full">
                            <div className="card-body items-center text-center gap-4 p-10">
                                <div className="text-6xl">💪</div>
                                <h3 className="text-2xl font-bold">Aún no hay ejercicios</h3>
                                <p className="opacity-60">
                                    {puedeCrear
                                        ? 'Crea el primer ejercicio del catálogo para poder armar rutinas con él.'
                                        : 'Todavía no hay ejercicios en el catálogo.'}
                                </p>
                                {puedeCrear && (
                                    <button className="btn btn-primary btn-lg mt-2" onClick={() => setModalAbierto(true)}>
                                        + Crear ejercicio
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtrados.map((ej) => (
                        <div key={ej.idEjercicio} className="card bg-base-100 border border-base-300 shadow">
                            {ej.imagenUrl && (
                                <figure className="h-40 bg-base-300">
                                    <img
                                        src={ej.imagenUrl}
                                        alt={ej.nombre}
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </figure>
                            )}
                            <div className="card-body gap-2">
                                <h3 className="card-title">{ej.nombre}</h3>
                                {ej.grupoMuscular && <span className="badge badge-secondary w-fit">{ej.grupoMuscular}</span>}
                                {ej.descripcion && <p className="opacity-70 text-sm">{ej.descripcion}</p>}
                                {ej.videoUrl && (
                                    <a href={ej.videoUrl} target="_blank" rel="noreferrer" className="link link-primary text-sm w-fit">
                                        Ver video
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalAbierto && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="text-xl font-bold mb-4">Crear ejercicio</h3>

                        {errorCrear && (
                            <div role="alert" className="alert alert-error mb-4"><span>{errorCrear}</span></div>
                        )}

                        <form onSubmit={crear} className="flex flex-col gap-4">
                            <input className="input input-bordered w-full" placeholder="Nombre"
                                   value={form.nombre} onChange={(e) => set('nombre', e.target.value)} required />
                            <input className="input input-bordered w-full" placeholder="Grupo muscular"
                                   value={form.grupoMuscular} onChange={(e) => set('grupoMuscular', e.target.value)} required />
                            <textarea className="textarea textarea-bordered w-full" placeholder="Descripción"
                                      value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />
                            <input className="input input-bordered w-full" placeholder="URL de imagen (opcional)"
                                   value={form.imagenUrl} onChange={(e) => set('imagenUrl', e.target.value)} />
                            <input className="input input-bordered w-full" placeholder="URL de video (opcional)"
                                   value={form.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} />

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
            )}
        </div>
    );
}