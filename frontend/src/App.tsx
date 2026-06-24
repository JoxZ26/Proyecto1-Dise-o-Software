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
import MiRutinaPage from './pages/MiRutinaPage';
import GestionarRutinasPage from './pages/GestionarRutinasPage';
import { ToastContainer } from 'react-toastify';

function App() {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 99999 }}
          toastStyle={{
            width: "550px",
            minHeight: "125px",
            fontSize: "16px",
          }}
        />
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
                    <Route path="/gym/:id/rutinas" element={<GestionarRutinasPage />} />
                    <Route path="/gym/:id/rutinas/crear" element={<RutinasPage />} />
                    <Route path="/crear-rutina" element={<RutinasPage />} />
                    <Route path="/gym/:id/miembros" element={<MiembrosPage />} />
                    <Route path="/gym/:id/medidas" element={<MedidasPage />} />
                    <Route path="/buscar" element={<BuscarGymsPage />} />
                    <Route path="/ejercicios" element={<EjercicioCatalogoPage />} />
                    <Route path="/perfil" element={<PerfilPage />} />
                    <Route path="/mi-rutina" element={<MiRutinaPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
      </>
    );
}

export default App;