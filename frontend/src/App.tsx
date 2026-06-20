import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import GymPage from './pages/GymPage';
import BuscarGymsPage from './pages/BuscarGymsPage';
import PerfilPage from './pages/PerfilPage';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminGymPage from './pages/AdminGymPage';
import MiembrosPage from './pages/MiembrosPage';
import RutinasPage from './pages/RutinasPage';
import EjercicioCatalogoPage from './pages/EjercicioCatalogoPage';
import MedidasPage from './pages/MedidasPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/" element={<HomePage />} />
                    <Route path="/gym/:id" element={<GymPage />} />
                    <Route path="/gym/:id/administrar" element={<AdminGymPage />} />
                    <Route path="/gym/:id/rutinas" element={<RutinasPage />} />
                    <Route path="/gym/:id/miembros" element={<MiembrosPage />} />
                    <Route path="/gym/:id/medidas" element={<MedidasPage />} />
                    <Route path="/gym/:id/ejercicios" element={<EjercicioCatalogoPage />} />
                    <Route path="/buscar" element={<BuscarGymsPage />} />
                    <Route path="/perfil" element={<PerfilPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;