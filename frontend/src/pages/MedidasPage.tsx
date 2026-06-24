import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

type Medida = {
    id: number;
    peso: number | null;
    biceps: number | null;
    antebrazo: number | null;
    pecho: number | null;
    cintura: number | null;
    abdomen: number | null;
    cadera: number | null;
    muslo: number | null;
    pantorrilla: number | null;
    fecha: string | null;
};

const campos: { key: keyof Medida; label: string; min: number; max: number }[] = [
    { key: 'peso', label: 'Peso (kg)', min: 20, max: 500 },
    { key: 'biceps', label: 'Bíceps (cm)', min: 10, max: 100 },
    { key: 'antebrazo', label: 'Antebrazo (cm)', min: 10, max: 80 },
    { key: 'pecho', label: 'Pecho (cm)', min: 40, max: 200 },
    { key: 'cintura', label: 'Cintura (cm)', min: 40, max: 200 },
    { key: 'abdomen', label: 'Abdomen (cm)', min: 40, max: 200 },
    { key: 'cadera', label: 'Cadera (cm)', min: 40, max: 200 },
    { key: 'muslo', label: 'Muslo (cm)', min: 20, max: 120 },
    { key: 'pantorrilla', label: 'Pantorrilla (cm)', min: 15, max: 80 },
];

const hoy = () => new Date().toISOString().slice(0, 10);

const formVacio = {
    peso: '', biceps: '', antebrazo: '', pecho: '', cintura: '',
    abdomen: '', cadera: '', muslo: '', pantorrilla: '', fecha: hoy(),
};

export default function MedidasPage() {
    const { id } = useParams();
    const [historial, setHistorial] = useState<Medida[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [modalAbierto, setModalAbierto] = useState(false);
    const [form, setForm] = useState({ ...formVacio });
    const [guardando, setGuardando] = useState(false);
    const [errorGuardar, setErrorGuardar] = useState('');

    const cargar = () => {
        setLoading(true);
        api
            .get<Medida[]>('/medidas')
            .then((data) =>
                setHistorial([...data].sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? '')))
            )
            .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar el historial'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargar();
    }, []);

    const set = (campo: string, valor: string) => setForm((f) => ({ ...f, [campo]: valor }));

    const num = (v: string) => (v.trim() === '' ? null : Number(v));

    const registrar = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorGuardar('');
        setGuardando(true);
        try {
            await api.post('/medidas', {
                peso: num(form.peso),
                biceps: num(form.biceps),
                antebrazo: num(form.antebrazo),
                pecho: num(form.pecho),
                cintura: num(form.cintura),
                abdomen: num(form.abdomen),
                cadera: num(form.cadera),
                muslo: num(form.muslo),
                pantorrilla: num(form.pantorrilla),
                fecha: form.fecha,
            });
            setForm({ ...formVacio });
            setModalAbierto(false);
            cargar();
        } catch (err) {
            setErrorGuardar(err instanceof Error ? err.message : 'Error al registrar');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <Link to={`/gym/${id}`} className="btn btn-ghost btn-sm w-fit">← Volver al gimnasio</Link>

            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-3xl font-bold">Mis medidas</h2>
                <button className="btn btn-primary" onClick={() => setModalAbierto(true)}>
                    + Registrar medidas
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            ) : error ? (
                <div role="alert" className="alert alert-error max-w-md"><span>{error}</span></div>
            ) : historial.length === 0 ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="card bg-base-100 border border-base-300 shadow-xl max-w-md w-full">
                        <div className="card-body items-center text-center gap-4 p-10">
                            <h3 className="text-2xl font-bold">Aún no tienes medidas</h3>
                            <p className="opacity-60">Registra tus primeras medidas.</p>
                            <button className="btn btn-primary btn-lg mt-2" onClick={() => setModalAbierto(true)}>
                                + Registrar medidas
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card bg-base-100 border border-base-300">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Fecha</th>
                            {campos.map((c) => <th key={c.key}>{c.label}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {historial.map((m) => (
                            <tr key={m.id}>
                                <td className="font-medium">{m.fecha ?? '—'}</td>
                                {campos.map((c) => (
                                    <td key={c.key}>{m[c.key] ?? '—'}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalAbierto && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-xl">
                        <h3 className="text-xl font-bold mb-4">Registrar medidas</h3>

                        {errorGuardar && (
                            <div role="alert" className="alert alert-error mb-4"><span>{errorGuardar}</span></div>
                        )}

                        <form onSubmit={registrar} className="flex flex-col gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Fecha</span></label>
                                <input type="date" className="input input-bordered w-full"
                                       value={form.fecha} onChange={(e) => set('fecha', e.target.value)} required />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {campos.map((c) => (
                                    <div key={c.key} className="form-control">
                                        <label className="label py-1"><span className="label-text text-sm">{c.label}</span></label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min={c.min}
                                            max={c.max}
                                            className="input input-bordered input-sm w-full"
                                            value={(form as Record<string, string>)[c.key]}
                                            onChange={(e) => set(c.key, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost" onClick={() => setModalAbierto(false)} disabled={guardando}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={guardando}>
                                    {guardando ? 'Guardando...' : 'Guardar'}
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