import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const links = [
    { to: '/', label: 'Mis gimnasios' },
    { to: '/buscar', label: 'Buscar gimnasios' },
    { to: '/mi-rutina', label: 'Mi rutina' },
    { to: '/ejercicios', label: 'Catálogo' },
    { to: '/perfil', label: 'Perfil' },
];

export default function Navbar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');

    const logout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    const buscar = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/buscar?q=${encodeURIComponent(busqueda)}`);
    };

    return (
        <header className="w-full bg-primary shadow-lg">
            <div className="flex items-center gap-8 px-8 py-5">
                <Link to="/" className="text-3xl font-bold tracking-wide text-primary-content">
                    GymHub
                </Link>

                <nav className="flex items-center gap-2">
                    {links.map((l) => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className={`btn btn-lg btn-ghost text-lg text-primary-content ${
                                pathname === l.to ? 'bg-primary-content/20' : ''
                            }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Buscador */}
                <form onSubmit={buscar} className="flex items-center gap-2 ml-auto">
                    <input
                        type="text"
                        placeholder="Buscar gimnasios..."
                        className="input input-bordered w-64 bg-primary-content/10 text-primary-content placeholder:text-primary-content/60 border-primary-content/30"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <button type="submit" className="btn btn-lg btn-ghost text-primary-content">
                        Buscar
                    </button>
                </form>

                <button
                    className="btn btn-lg btn-ghost text-lg text-primary-content"
                    onClick={logout}
                >
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
}