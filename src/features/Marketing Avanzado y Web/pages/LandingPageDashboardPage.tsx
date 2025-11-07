import { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Globe, Loader2, AlertCircle } from 'lucide-react';
import { LandingPage, obtenerLandingPages, eliminarLandingPage } from '../api/landingPagesApi';
import LandingPageCard from '../components/LandingPageCard';

interface LandingPageDashboardPageProps {
  onNuevaLandingPage?: () => void;
  onEditarLandingPage?: (id: string) => void;
  embedded?: boolean; // Si es true, no muestra el header y el fondo completo
}

export default function LandingPageDashboardPage({
  onNuevaLandingPage,
  onEditarLandingPage,
  embedded = false,
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

  const filtrosActivos = (busqueda ? 1 : 0) + (filtroEstado !== 'todos' ? 1 : 0);

  const content = (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      {onNuevaLandingPage && (
        <div className="flex items-center justify-end">
          <button
            onClick={onNuevaLandingPage}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200"
          >
            <Plus size={20} />
            <span>Nueva Landing Page</span>
          </button>
        </div>
      )}

      {/* Sistema de Filtros */}
      <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 mb-6">
        <div className="p-4 space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              {/* Input de búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar landing pages..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              
              {/* Selector de estado */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-400" />
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value as 'todos' | 'borrador' | 'publicada')}
                  className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 text-sm font-medium"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="borrador">Borrador</option>
                  <option value="publicada">Publicada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resumen de resultados */}
          {filtrosActivos > 0 && (
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{landingPagesFiltradas.length} resultado{landingPagesFiltradas.length !== 1 ? 's' : ''} encontrado{landingPagesFiltradas.length !== 1 ? 's' : ''}</span>
              <span>{filtrosActivos} filtro{filtrosActivos !== 1 ? 's' : ''} aplicado{filtrosActivos !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido Principal */}
      {loading ? (
        <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando landing pages...</p>
        </div>
      ) : error ? (
        <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={cargarLandingPages}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200"
          >
            Reintentar
          </button>
        </div>
      ) : landingPagesFiltradas.length === 0 ? (
        <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay landing pages</h3>
          <p className="text-gray-600 mb-4">
            {landingPages.length === 0
              ? 'Crea tu primera landing page para comenzar'
              : 'No se encontraron landing pages con los filtros aplicados'}
          </p>
          {landingPages.length === 0 && onNuevaLandingPage && (
            <button
              onClick={onNuevaLandingPage}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200"
            >
              <Plus size={20} />
              <span>Crear Landing Page</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

  if (embedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Globe size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Landing Pages
                </h1>
                <p className="text-gray-600">
                  Gestiona y crea landing pages para tus campañas de marketing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {content}
      </div>
    </div>
  );
}

