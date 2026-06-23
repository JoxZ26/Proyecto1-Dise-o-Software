import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

type Ejercicio = { idEjercicio: number; nombre: string; grupoMuscular: string };
type EjEnDia = { idEjercicio: number; sets: number | null; reps: number | null; descansoSegundos: number | null; notas: string | null };
type DiaLocal = { idRutinaDia: number; diaNumero: number; nombre: string; ejercicios: EjEnDia[] };
type RutinaLocal = { idRutina: number; nombre: string; descripcion: string };

const num = (v: string) => (v.trim() === '' ? null : Number(v));

export default function RutinasPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const personal = !id; // sin gym en la URL → rutina personal

    const [catalogo, setCatalogo] = useState<Ejercicio[]>([]);
    const [cargando, setCargando] = useState(true);

    const [rutina, setRutina] = useState<RutinaLocal | null>(null);
    const [dias, setDias] = useState<DiaLocal[]>([]);

    // crear rutina
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState('');
    const [creando, setCreando] = useState(false);

    // modal día
    const [modalDia, setModalDia] = useState(false);
    const [diaNombre, setDiaNombre] = useState('');

    // modal ejercicio
    const [diaActivo, setDiaActivo] = useState<number | null>(null);
    const [ejForm, setEjForm] = useState({ idEjercicio: '', sets: '', reps: '', descansoSegundos: '', notas: '' });


    useEffect(() => {
        api
            .get<Ejercicio[]>('/ejercicios')
            .then(setCatalogo)
            .catch(() => setError('Error al cargar el catálogo.'))
            .finally(() => setCargando(false));
    }, []);

    const crearRutina = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCreando(true);
        try {
            const r = await api.post<{ idRutina: number; nombre: string; descripcion: string }>(
                '/rutinas', { nombre, descripcion });
            setRutina({ idRutina: r.idRutina, nombre: r.nombre, descripcion: r.descripcion });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear la rutina');
        } finally {
            setCreando(false);
        }
    };

    const agregarDia = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rutina) return;
        const diaNumero = (dias.reduce((max, d) => Math.max(max, d.diaNumero), 0)) + 1;
        try {
            const d = await api.post<{ idRutinaDia: number; diaNumero: number; nombre: string }>(
                `/rutinas/${rutina.idRutina}/dias`, { diaNumero, nombre: diaNombre });
            setDias((prev) => [...prev, { idRutinaDia: d.idRutinaDia, diaNumero: d.diaNumero, nombre: d.nombre, ejercicios: [] }]);
            setDiaNombre('');
            setModalDia(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al agregar el día');
        }
    };

    const agregarEjercicio = async (e: React.FormEvent) => {
        e.preventDefault();
        if (diaActivo == null || !ejForm.idEjercicio) return;
        try {
            await api.post(`/rutinas/dias/${diaActivo}/ejercicios`, {
                idEjercicio: Number(ejForm.idEjercicio),
                sets: num(ejForm.sets),
                reps: num(ejForm.reps),
                descansoSegundos: num(ejForm.descansoSegundos),
                notas: ejForm.notas || null,
            });
            setDias((prev) =>
                prev.map((d) =>
                    d.idRutinaDia === diaActivo
                        ? { ...d, ejercicios: [...d.ejercicios, {
                                idEjercicio: Number(ejForm.idEjercicio),
                                sets: num(ejForm.sets), reps: num(ejForm.reps),
                                descansoSegundos: num(ejForm.descansoSegundos), notas: ejForm.notas || null,
                            }] }
                        : d
                )
            );
            setEjForm({ idEjercicio: '', sets: '', reps: '', descansoSegundos: '', notas: '' });
            setDiaActivo(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al agregar el ejercicio');
        }
    };

    const nombreEj = (idEj: number) =>
        catalogo.find((e) => e.idEjercicio === idEj)?.nombre ?? `Ejercicio #${idEj}`;

    if (cargando) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            <Link to={personal ? '/mi-rutina' : `/gym/${id}`} className="btn btn-ghost btn-sm w-fit">
                ← {personal ? 'Mi rutina' : 'Volver al gimnasio'}
            </Link>
            <h2 className="text-3xl font-bold">{personal ? 'Crear mi rutina' : 'Crear rutina'}</h2>

            {error && <div role="alert" className="alert alert-error"><span>{error}</span></div>}

            {/* Paso 1: crear rutina */}
            {!rutina ? (
                <div className="card bg-base-100 border border-base-300 shadow-lg">
                    <div className="card-body gap-4">
                        <h3 className="text-xl font-bold">Datos de la rutina</h3>
                        <form onSubmit={crearRutina} className="flex flex-col gap-4">
                            <input className="input input-bordered w-full" placeholder="Nombre"
                                   value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            <textarea className="textarea textarea-bordered w-full" placeholder="Descripción"
                                      value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                            <button type="submit" className="btn btn-primary" disabled={creando}>
                                {creando ? 'Creando...' : 'Crear y continuar'}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <>
                    {/* Cabecera de la rutina */}
                    <div className="card bg-base-100 border border-primary shadow-lg">
                        <div className="card-body">
                            <h3 className="text-2xl font-bold">{rutina.nombre}</h3>
                            {rutina.descripcion && <p className="opacity-70">{rutina.descripcion}</p>}
                        </div>
                    </div>

                    {catalogo.length === 0 && (
                        <div role="alert" className="alert">
                            <span>
                                No hay ejercicios en el catálogo
                                {!personal && (
                                    <> <Link to={`/gym/${id}/ejercicios`} className="link link-primary">Crea algunos primero</Link></>
                                )}
                                .
                            </span>
                        </div>
                    )}

                    {/* Días */}
                    <div className="flex flex-col gap-4">
                        {dias
                            .sort((a, b) => a.diaNumero - b.diaNumero)
                            .map((d) => (
                                <div key={d.idRutinaDia} className="rounded-xl border border-base-300 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold">Día {d.diaNumero}{d.nombre ? ` — ${d.nombre}` : ''}</h4>
                                        <button className="btn btn-xs btn-secondary" disabled={catalogo.length === 0}
                                                onClick={() => setDiaActivo(d.idRutinaDia)}>
                                            + Ejercicio
                                        </button>
                                    </div>
                                    {d.ejercicios.length === 0 ? (
                                        <p className="opacity-50 text-sm">Sin ejercicios.</p>
                                    ) : (
                                        <ul className="flex flex-col gap-1">
                                            {d.ejercicios.map((ej, i) => (
                                                <li key={i} className="text-sm">
                                                    <span className="font-medium">{nombreEj(ej.idEjercicio)}</span>{' '}
                                                    <span className="opacity-70">
                            {ej.sets ?? '?'} × {ej.reps ?? '?'}
                                                        {ej.descansoSegundos != null && ` · ${ej.descansoSegundos}s`}
                          </span>
                                                    {ej.notas && <span className="opacity-50 italic"> — {ej.notas}</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}

                        <button className="btn btn-outline w-fit" onClick={() => setModalDia(true)}>
                            + Agregar día
                        </button>
                    </div>

                    {/* Terminar */}
                    <button
                        className="btn btn-primary w-fit"
                        onClick={() => navigate(personal ? '/mi-rutina' : `/gym/${id}/rutinas`)}
                    >
                        {personal ? 'Listo, ver mi rutina' : 'Listo, volver a mis rutinas'}
                    </button>
                </>
            )}

            {/* Modal agregar día */}
            {modalDia && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="text-xl font-bold mb-4">Agregar día {dias.length + 1}</h3>
                        <form onSubmit={agregarDia} className="flex flex-col gap-4">
                            <input className="input input-bordered w-full" placeholder="Nombre del día (ej. Pecho y tríceps)"
                                   value={diaNombre} onChange={(e) => setDiaNombre(e.target.value)} />
                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost" onClick={() => setModalDia(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Agregar</button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={() => setModalDia(false)} />
                </div>
            )}

            {/* Modal agregar ejercicio */}
            {diaActivo != null && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="text-xl font-bold mb-4">Agregar ejercicio</h3>
                        <form onSubmit={agregarEjercicio} className="flex flex-col gap-4">
                            <select className="select select-bordered w-full" required
                                    value={ejForm.idEjercicio} onChange={(e) => setEjForm((f) => ({ ...f, idEjercicio: e.target.value }))}>
                                <option value="">Selecciona un ejercicio...</option>
                                {catalogo.map((ej) => (
                                    <option key={ej.idEjercicio} value={ej.idEjercicio}>{ej.nombre} ({ej.grupoMuscular})</option>
                                ))}
                            </select>
                            <div className="grid grid-cols-3 gap-3">
                                <input type="number" className="input input-bordered" placeholder="Sets"
                                       value={ejForm.sets} onChange={(e) => setEjForm((f) => ({ ...f, sets: e.target.value }))} />
                                <input type="number" className="input input-bordered" placeholder="Reps"
                                       value={ejForm.reps} onChange={(e) => setEjForm((f) => ({ ...f, reps: e.target.value }))} />
                                <input type="number" className="input input-bordered" placeholder="Descanso (s)"
                                       value={ejForm.descansoSegundos} onChange={(e) => setEjForm((f) => ({ ...f, descansoSegundos: e.target.value }))} />
                            </div>
                            <input className="input input-bordered w-full" placeholder="Notas (opcional)"
                                   value={ejForm.notas} onChange={(e) => setEjForm((f) => ({ ...f, notas: e.target.value }))} />
                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost" onClick={() => setDiaActivo(null)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Agregar</button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={() => setDiaActivo(null)} />
                </div>
            )}
        </div>
    );
}