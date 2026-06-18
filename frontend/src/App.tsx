import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import BuscarGymsPage from './pages/BuscarGymsPage';
import PerfilPage from './pages/PerfilPage';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />

                {/* Rutas protegidas que comparten el navbar */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/" element={<HomePage />} />
                    <Route path="/buscar" element={<BuscarGymsPage />} />
                    <Route path="/perfil" element={<PerfilPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;