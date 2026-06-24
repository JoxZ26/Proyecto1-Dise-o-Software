import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import Swal from 'sweetalert2';

type Ejercicio = { idEjercicio: number; nombre: string; grupoMuscular: string };
type EjEnDia = { idEjercicio: number; sets: number | null; reps: number | null; descansoSegundos: number | null; notas: string | null };
type Dia = { idRutinaDia: number; diaNumero: number; nombre: string };
type DiaConEjercicios = { dia: Dia; ejercicios: EjEnDia[] };
type Rutina = { idRutina: number; nombre: string; descripcion: string | null };
type RutinaCompleta = { rutina: Rutina; dias: DiaConEjercicios[] };
type Miembro = { idUsuario: number; correo: string; rol: string };

export default function GestionarRutinasPage() {
    const { id } = useParams();
    const [rutinas, setRutinas] = useState<RutinaCompleta[]>([]);
    const [catalogo, setCatalogo] = useState<Record<number, Ejercicio>>({});
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [seleccion, setSeleccion] = useState<Record<number, string>>({});
    const [asignando, setAsignando] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState<Record<number, string>>({});

    const cargar = () => {
        setLoading(true);
        Promise.all([
            api.get<RutinaCompleta[]>('/rutinas/mias'),
            api.get<Ejercicio[]>('/ejercicios'),
            api.get<Miembro[]>(`/gyms/${id}/usuarios`),
        ])
            .then(([rs, ejs, mems]) => {
                setRutinas(rs);
                const mapa: Record<number, Ejercicio> = {};
                ejs.forEach((e) => (mapa[e.idEjercicio] = e));
                setCatalogo(mapa);
                setMiembros(mems.filter((m) => m.rol === 'MEMBER'));
            })
            .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar las rutinas'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargar();
    }, [id]);

    const asignar = async (idRutina: number) => {
        const idMiembro = seleccion[idRutina];
        if (!idMiembro) return;
        setAsignando(idRutina);
        setMensaje((m) => ({ ...m, [idRutina]: '' }));
        try {
            await api.put(`/rutinas/${idRutina}/asignar/${idMiembro}`, {});
            const m = miembros.find((x) => x.idUsuario === Number(idMiembro));
            setMensaje((prev) => ({ ...prev, [idRutina]: `Asignada a ${m?.correo ?? 'el miembro'}.` }));
            setSeleccion((prev) => ({ ...prev, [idRutina]: '' }));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al asignar');
        } finally {
            setAsignando(null);
        }
    };

    const eliminar = async (idRutina: number, nombre: string) => {
        const r = await Swal.fire({
            title: `¿Eliminar "${nombre}"?`,
            theme: 'dark',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!r.isConfirmed) return;
        try {
            await api.del(`/rutinas/${idRutina}`);
            cargar();
        } catch (err) {
            Swal.fire({ title: 'Error', theme: 'dark', icon: 'error',
                text: err instanceof Error ? err.message : 'Error al eliminar' });
        }
    };

    const nombreEj = (idEj: number) => catalogo[idEj]?.nombre ?? `Ejercicio #${idEj}`;

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            <Link to={`/gym/${id}`} className="btn btn-ghost btn-sm w-fit">← Volver al gimnasio</Link>

            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-3xl font-bold">Gestionar rutinas</h2>
                <Link to={`/gym/${id}/rutinas/crear`} className="btn btn-primary">+ Crear rutina</Link>
            </div>

            {error && <div role="alert" className="alert alert-error"><span>{error}</span></div>}

            {rutinas.length === 0 ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="card bg-base-100 border border-base-300 shadow-xl max-w-md w-full">
                        <div className="card-body items-center text-center gap-4 p-10">
                            <h3 className="text-2xl font-bold">No has creado rutinas</h3>
                            <p className="opacity-60">Crea una rutina para poder asignarla a tus miembros.</p>
                            <Link to={`/gym/${id}/rutinas/crear`} className="btn btn-primary btn-lg mt-2">+ Crear rutina</Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {rutinas.map(({ rutina, dias }) => (
                        <div key={rutina.idRutina} className="card bg-base-100 border border-base-300 shadow-lg">
                            <div className="card-body gap-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-2xl font-bold">{rutina.nombre}</h3>
                                        {rutina.descripcion && <p className="opacity-70">{rutina.descripcion}</p>}
                                    </div>
                                    <button
                                        className="btn btn-sm btn-outline btn-error"
                                        onClick={() => eliminar(rutina.idRutina, rutina.nombre)}
                                    >
                                        Eliminar
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {[...dias]
                                        .sort((a, b) => a.dia.diaNumero - b.dia.diaNumero)
                                        .map(({ dia, ejercicios }) => (
                                            <div key={dia.idRutinaDia} className="rounded-xl border border-base-300 p-3">
                                                <h4 className="font-bold text-sm mb-1">
                                                    Día {dia.diaNumero}{dia.nombre ? ` — ${dia.nombre}` : ''}
                                                </h4>
                                                {ejercicios.length === 0 ? (
                                                    <p className="opacity-50 text-sm">Sin ejercicios.</p>
                                                ) : (
                                                    <ul className="flex flex-col gap-1">
                                                        {ejercicios.map((ej, i) => (
                                                            <li key={i} className="text-sm">
                                                                <span className="font-medium">{nombreEj(ej.idEjercicio)}</span>{' '}
                                                                <span className="opacity-70">
                                  {ej.sets ?? '?'} × {ej.reps ?? '?'}
                                                                    {ej.descansoSegundos != null && ` · ${ej.descansoSegundos}s`}
                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                </div>

                                {/* Asignar */}
                                <div className="border-t border-base-300 pt-4 flex flex-col gap-2">
                                    {mensaje[rutina.idRutina] && (
                                        <div role="alert" className="alert alert-success py-2">
                                            <span>{mensaje[rutina.idRutina]}</span>
                                        </div>
                                    )}
                                    <div className="flex gap-2 flex-wrap">
                                        <select
                                            className="select select-bordered flex-1"
                                            value={seleccion[rutina.idRutina] ?? ''}
                                            onChange={(e) => setSeleccion((s) => ({ ...s, [rutina.idRutina]: e.target.value }))}
                                        >
                                            <option value="">Asignar a un miembro...</option>
                                            {miembros.map((m) => (
                                                <option key={m.idUsuario} value={m.idUsuario}>{m.correo}</option>
                                            ))}
                                        </select>
                                        <button
                                            className="btn btn-primary"
                                            disabled={!seleccion[rutina.idRutina] || asignando === rutina.idRutina}
                                            onClick={() => asignar(rutina.idRutina)}
                                        >
                                            {asignando === rutina.idRutina ? 'Asignando...' : 'Asignar'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}