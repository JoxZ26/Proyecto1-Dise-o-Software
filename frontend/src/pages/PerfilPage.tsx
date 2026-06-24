import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type UserInfo = { idUsuario: number; correo: string };
type Perfil = {
    nombre: string | null;
    apellido1: string | null;
    apellido2: string | null;
    fechaNacimiento: string | null;
    altura: number | null;
    pesoInicial: number | null;
    fotoUrl: string | null;
};

export default function PerfilPage() {
    const [correo, setCorreo] = useState('');
    const [perfil, setPerfil] = useState<Perfil | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');

    const hoy = new Date();
    const maxFecha = new Date(hoy.getFullYear() - 13, hoy.getMonth(), hoy.getDate())
        .toISOString().slice(0, 10); // al menos 13 años
    const minFecha = new Date(hoy.getFullYear() - 100, hoy.getMonth(), hoy.getDate())
        .toISOString().slice(0, 10); // máximo 100 años

    useEffect(() => {
        Promise.all([api.get<UserInfo>('/auth/me'), api.get<Perfil>('/perfil')])
            .then(([me, p]) => {
                setCorreo(me.correo);
                setPerfil(p);
            })
            .catch((err) =>
                setError(err instanceof Error ? err.message : 'Error al cargar el perfil.')
            )
            .finally(() => setLoading(false));
    }, []);

    const guardar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!perfil) return;

        const alt = perfil.altura, p = perfil.pesoInicial;
        if ((alt != null && alt < 0) || (p != null && p < 0)) {
            setError('La altura y el peso no pueden ser negativos.');
            return;
        }

        setError('');
        setOk('');
        try {
            await api.put('/perfil', perfil);
            setOk('Perfil actualizado');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar');
        }
    };

    const set = (campo: keyof Perfil, valor: string) =>
        setPerfil((p) => (p ? { ...p, [campo]: valor === '' ? null : valor } : p));

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (!perfil) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div role="alert" className="alert alert-error max-w-md">
                    <span>{error || 'No se pudo cargar el perfil.'}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 items-center justify-center p-4">
            <div className="card bg-base-100 shadow-2xl w-full max-w-3xl border-2 border-primary/50 rounded-2xl">
                <div className="card-body p-8 gap-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold">Mi perfil</h2>
                        <p className="opacity-60">{correo}</p>
                    </div>

                    {error && (
                        <div role="alert" className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}
                    {ok && (
                        <div role="alert" className="alert alert-success">
                            <span>{ok}</span>
                        </div>
                    )}

                    <form onSubmit={guardar} className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Nombre</span></label>
                                <input className="input input-bordered input-lg w-full" placeholder="Nombre"
                                       value={perfil.nombre ?? ''} onChange={(e) => set('nombre', e.target.value)} />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Primer apellido</span></label>
                                <input className="input input-bordered input-lg w-full" placeholder="Primer apellido"
                                       value={perfil.apellido1 ?? ''} onChange={(e) => set('apellido1', e.target.value)} />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Segundo apellido</span></label>
                                <input className="input input-bordered input-lg w-full" placeholder="Segundo apellido"
                                       value={perfil.apellido2 ?? ''} onChange={(e) => set('apellido2', e.target.value)} />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Fecha de nacimiento</span></label>
                                <input
                                    type="date"
                                    className="input input-bordered input-lg w-full"
                                    min={minFecha}
                                    max={maxFecha}
                                    value={perfil.fechaNacimiento ?? ''}
                                    onChange={(e) => set('fechaNacimiento', e.target.value)}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Altura (m)</span></label>
                                <input type="number" step="0.01" min="0" max="3" className="input input-bordered input-lg w-full"
                                       placeholder="Altura (m)" value={perfil.altura ?? ''} onChange={(e) => set('altura', e.target.value)} />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Peso inicial (kg)</span></label>
                                {/* Peso inicial */}
                                <input type="number" step="0.01" min="0" max="500" className="input input-bordered input-lg w-full"
                                       placeholder="Peso inicial (kg)" value={perfil.pesoInicial ?? ''} onChange={(e) => set('pesoInicial', e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg w-full mt-2">
                            Guardar cambios
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}