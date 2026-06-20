import { useParams, Link } from 'react-router-dom';

export default function RutinasPage() {
  const { id } = useParams();
  return (
    <div className="flex flex-col gap-4">
      <Link to={`/gym/${id}`} className="btn btn-ghost btn-sm w-fit">← Volver al gimnasio</Link>
      <h2 className="text-3xl font-bold">Gestionar rutinas</h2>
      <p className="opacity-60">En construcción.</p>
    </div>
  );
}