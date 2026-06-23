import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type Ejercicio = { idEjercicio: number; nombre: string; grupoMuscular: string };
type RutinaEjercicio = {
    idEjercicio: number;
    sets: number | null;
    reps: number | null;
    descansoSegundos: number | null;
    notas: string | null;
};
type Dia = { idRutinaDia: number; diaNumero: number; nombre: string };
type DiaConEjercicios = { dia: Dia; ejercicios: RutinaEjercicio[] };
type Rutina = { idRutina: number; nombre: string; descripcion: string | null; activo: boolean };
type RutinaCompleta = { rutina: Rutina; dias: DiaConEjercicios[] };

export default function MiRutinaPage() {
    const [rutinas, setRutinas] = useState<RutinaCompleta[]>([]);
    const [ejercicios, setEjercicios] = useState<Record<number, Ejercicio>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [accion, setAccion] = useState<number | null>(null);

    const cargar = () => {
        setLoading(true);
        Promise.all([
            api.get<RutinaCompleta[]>('/rutinas/mias'),
            api.get<Ejercicio[]>('/ejercicios'),
        ])
            .then(([rs, ejs]) => {
                // activas primero
                setRutinas([...rs].sort((a, b) => Number(b.rutina.activo) - Number(a.rutina.activo)));
                const mapa: Record<number, Ejercicio> = {};
                ejs.forEach((e) => (mapa[e.idEjercicio] = e));
                setEjercicios(mapa);
            })
            .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar tus rutinas'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargar();
    }, []);

    const toggle = async (idRutina: number, activo: boolean) => {
        setAccion(idRutina);
        try {
            await api.put(`/rutinas/${idRutina}/${activo ? 'desactivar' : 'activar'}`, {});
            cargar();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al cambiar el estado');
        } finally {
            setAccion(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <Link to="/" className="btn btn-ghost btn-sm w-fit">← Mis gimnasios</Link>
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-3xl font-bold">Mi rutina</h2>
                <Link to="/crear-rutina" className="btn btn-primary">+ Crear rutina</Link>
            </div>


            {error ? (
                <div role="alert" className="alert alert-error max-w-md"><span>{error}</span></div>
            ) : rutinas.length === 0 ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="card bg-base-100 border border-base-300 shadow-xl max-w-md w-full">
                        <div className="card-body items-center text-center gap-4 p-10">
                            <h3 className="text-2xl font-bold">No tienes rutinas todavía</h3>
                            <p className="opacity-60">Cuando un coach te asigne una rutina, aparecerá aquí para que la actives.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {rutinas.map(({ rutina, dias }) => (
                        <div
                            key={rutina.idRutina}
                            className={`card bg-base-100 border shadow-lg ${
                                rutina.activo ? 'border-primary' : 'border-base-300'
                            }`}
                        >
                            <div className="card-body gap-4">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-2xl font-bold">{rutina.nombre}</h3>
                                            {rutina.activo && <span className="badge badge-primary">Activa</span>}
                                        </div>
                                        {rutina.descripcion && <p className="opacity-70 mt-1">{rutina.descripcion}</p>}
                                    </div>
                                    <button
                                        className={`btn btn-sm ${rutina.activo ? 'btn-outline' : 'btn-primary'}`}
                                        disabled={accion === rutina.idRutina}
                                        onClick={() => toggle(rutina.idRutina, rutina.activo)}
                                    >
                                        {accion === rutina.idRutina
                                            ? '...'
                                            : rutina.activo
                                                ? 'Desactivar'
                                                : 'Activar'}
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {[...dias]
                                        .sort((a, b) => a.dia.diaNumero - b.dia.diaNumero)
                                        .map(({ dia, ejercicios: ejs }) => (
                                            <div key={dia.idRutinaDia} className="rounded-xl border border-base-300 p-4">
                                                <h4 className="font-bold mb-2">
                                                    Día {dia.diaNumero}{dia.nombre ? ` — ${dia.nombre}` : ''}
                                                </h4>
                                                {ejs.length === 0 ? (
                                                    <p className="opacity-50 text-sm">Sin ejercicios.</p>
                                                ) : (
                                                    <ul className="flex flex-col gap-2">
                                                        {ejs.map((ej, i) => (
                                                            <li key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <span className="font-medium">
                                  {ejercicios[ej.idEjercicio]?.nombre ?? `Ejercicio #${ej.idEjercicio}`}
                                </span>
                                                                <span className="opacity-70 text-sm">
                                  {ej.sets ?? '?'} × {ej.reps ?? '?'}
                                                                    {ej.descansoSegundos != null && ` · ${ej.descansoSegundos}s descanso`}
                                </span>
                                                                {ej.notas && <span className="opacity-50 text-sm italic">{ej.notas}</span>}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}