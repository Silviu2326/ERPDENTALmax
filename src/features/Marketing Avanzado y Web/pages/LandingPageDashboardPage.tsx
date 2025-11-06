import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter, FileText } from 'lucide-react';
import { LandingPage, obtenerLandingPages, eliminarLandingPage } from '../api/landingPagesApi';
import LandingPageCard from '../components/LandingPageCard';

interface LandingPageDashboardPageProps {
  onNuevaLandingPage?: () => void;
  onEditarLandingPage?: (id: string) => void;
}

export default function LandingPageDashboardPage({
  onNuevaLandingPage,
  onEditarLandingPage,
}: LandingPageDashboardPageProps) {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'borrador' | 'publicada'>('todos');

  useEffect(() => {
    cargarLandingPages();
  }, []);

  const cargarLandingPages = async () => {
    try {
      setLoading(true);
      const paginas = await obtenerLandingPages();
      setLandingPages(paginas);
      setError(null);
    } catch (err) {
      setError('Error al cargar las landing pages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta landing page?')) {
      return;
    }

    try {
      await eliminarLandingPage(id);
      setLandingPages(landingPages.filter((lp) => lp._id !== id));
    } catch (err) {
      alert('Error al eliminar la landing page');
      console.error(err);
    }
  };

  const landingPagesFiltradas = landingPages.filter((lp) => {
    const coincideBusqueda = lp.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'todos' || lp.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar landing pages..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as 'todos' | 'borrador' | 'publicada')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos los estados</option>
              <option value="borrador">Borrador</option>
              <option value="publicada">Publicada</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando landing pages...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : landingPagesFiltradas.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay landing pages</h3>
          <p className="text-gray-600 mb-4">
            {landingPages.length === 0
              ? 'Crea tu primera landing page para comenzar'
              : 'No se encontraron landing pages con los filtros aplicados'}
          </p>
          {landingPages.length === 0 && onNuevaLandingPage && (
            <button
              onClick={onNuevaLandingPage}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Landing Page</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {landingPagesFiltradas.map((landingPage) => (
            <LandingPageCard
              key={landingPage._id}
              landingPage={landingPage}
              onEditar={() => onEditarLandingPage?.(landingPage._id)}
              onEliminar={() => handleEliminar(landingPage._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

