import { useState, useEffect } from 'react';
import { Plus, RefreshCw, AlertCircle, Search, Filter, FileText, Package } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Protocolo,
  obtenerProtocolos,
  obtenerProtocoloPorId,
  crearProtocolo,
  actualizarProtocolo,
  archivarProtocolo,
  confirmarLecturaProtocolo,
  FiltrosProtocolos,
  NuevoProtocolo,
  ActualizarProtocolo,
} from '../api/protocolosApi';
import ListaProtocolosComponent from '../components/ListaProtocolosComponent';
import VisorProtocoloDetalleComponent from '../components/VisorProtocoloDetalleComponent';
import ModalGestionProtocolo from '../components/ModalGestionProtocolo';
import HistorialVersionesProtocolo from '../components/HistorialVersionesProtocolo';

interface ProtocolosLimpiezaPageProps {
  onTabChange?: (tab: 'lotes' | 'protocolos') => void;
  tabActiva?: 'lotes' | 'protocolos';
}

export default function ProtocolosLimpiezaPage({ onTabChange, tabActiva = 'protocolos' }: ProtocolosLimpiezaPageProps) {
  const { user } = useAuth();
  const [protocolos, setProtocolos] = useState<Protocolo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [protocoloSeleccionado, setProtocoloSeleccionado] = useState<Protocolo | null>(null);
  const [mostrarModalGestion, setMostrarModalGestion] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [protocoloEditando, setProtocoloEditando] = useState<Protocolo | null>(null);
  const [filtros, setFiltros] = useState<FiltrosProtocolos>({});
  const [busqueda, setBusqueda] = useState('');

  const esAdmin = user?.role === 'director' || user?.role === 'admin';

  useEffect(() => {
    cargarProtocolos();
  }, [filtros]);

  const cargarProtocolos = async () => {
    try {
      setLoading(true);
      setError(null);
      const datos = await obtenerProtocolos(filtros);
      setProtocolos(datos);
    } catch (err) {
      console.error('Error al cargar protocolos:', err);
      setError('Error al cargar los protocolos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = async (protocolo: Protocolo) => {
    try {
      const protocoloCompleto = await obtenerProtocoloPorId(protocolo._id);
      setProtocoloSeleccionado(protocoloCompleto);
    } catch (err) {
      console.error('Error al cargar detalle del protocolo:', err);
      setError('Error al cargar los detalles del protocolo');
    }
  };

  const handleCrearProtocolo = async (datos: NuevoProtocolo) => {
    try {
      setError(null);
      await crearProtocolo(datos);
      setMostrarModalGestion(false);
      await cargarProtocolos();
    } catch (err: any) {
      console.error('Error al crear protocolo:', err);
      setError(err.message || 'Error al crear el protocolo');
    }
  };

  const handleEditarProtocolo = async (id: string, datos: ActualizarProtocolo) => {
    try {
      setError(null);
      await actualizarProtocolo(id, datos);
      setMostrarModalGestion(false);
      setProtocoloEditando(null);
      await cargarProtocolos();
      if (protocoloSeleccionado?._id === id) {
        const protocoloActualizado = await obtenerProtocoloPorId(id);
        setProtocoloSeleccionado(protocoloActualizado);
      }
    } catch (err: any) {
      console.error('Error al actualizar protocolo:', err);
      setError(err.message || 'Error al actualizar el protocolo');
    }
  };

  const handleArchivarProtocolo = async (id: string) => {
    if (!confirm('¿Está seguro de que desea archivar este protocolo?')) {
      return;
    }

    try {
      setError(null);
      await archivarProtocolo(id);
      await cargarProtocolos();
      if (protocoloSeleccionado?._id === id) {
        setProtocoloSeleccionado(null);
      }
    } catch (err: any) {
      console.error('Error al archivar protocolo:', err);
      setError(err.message || 'Error al archivar el protocolo');
    }
  };

  const handleConfirmarLectura = async (protocoloId: string, version: number) => {
    try {
      setError(null);
      await confirmarLecturaProtocolo(protocoloId, version);
      await cargarProtocolos();
      if (protocoloSeleccionado?._id === protocoloId) {
        const protocoloActualizado = await obtenerProtocoloPorId(protocoloId);
        setProtocoloSeleccionado(protocoloActualizado);
      }
    } catch (err: any) {
      console.error('Error al confirmar lectura:', err);
      setError(err.message || 'Error al confirmar la lectura');
    }
  };

  const handleAbrirModalGestion = (protocolo?: Protocolo) => {
    if (protocolo) {
      setProtocoloEditando(protocolo);
    } else {
      setProtocoloEditando(null);
    }
    setMostrarModalGestion(true);
  };

  const protocolosFiltrados = protocolos.filter((protocolo) => {
    if (!busqueda) return true;
    const busquedaLower = busqueda.toLowerCase();
    return (
      protocolo.titulo.toLowerCase().includes(busquedaLower) ||
      protocolo.categoria.toLowerCase().includes(busquedaLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileText size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Protocolos de Limpieza y Desinfección
                  </h1>
                  <p className="text-gray-600">
                    Gestión y consulta de protocolos estandarizados de higiene, limpieza y desinfección
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Tabs de Navegación (si se muestra desde la página principal) */}
        {onTabChange && (
          <div className="p-0 bg-white shadow-sm rounded-lg mb-6">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                <button
                  onClick={() => onTabChange('lotes')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    tabActiva === 'lotes'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Package size={18} className={tabActiva === 'lotes' ? 'opacity-100' : 'opacity-70'} />
                  <span>Lotes de Esterilización</span>
                </button>
                <button
                  onClick={() => onTabChange('protocolos')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    tabActiva === 'protocolos'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <FileText size={18} className={tabActiva === 'protocolos' ? 'opacity-100' : 'opacity-70'} />
                  <span>Protocolos de Limpieza</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={cargarProtocolos}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                <span>Actualizar</span>
              </button>
              {esAdmin && (
                <button
                  onClick={() => handleAbrirModalGestion()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                >
                  <Plus size={20} />
                  <span>Nuevo Protocolo</span>
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {/* Filtros y Búsqueda */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="p-4 space-y-4">
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Buscar protocolos..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <select
                      value={filtros.categoria || ''}
                      onChange={(e) =>
                        setFiltros({ ...filtros, categoria: e.target.value || undefined })
                      }
                      className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    >
                      <option value="">Todas las categorías</option>
                      <option value="Limpieza de superficies">Limpieza de superficies</option>
                      <option value="Esterilización de instrumental">Esterilización de instrumental</option>
                      <option value="Limpieza de gabinetes">Limpieza de gabinetes</option>
                      <option value="Gestión de residuos">Gestión de residuos</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  {!esAdmin && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filtros.noLeidos || false}
                        onChange={(e) =>
                          setFiltros({ ...filtros, noLeidos: e.target.checked || undefined })
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Solo no leídos</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Protocolos */}
            <div className="lg:col-span-1">
              <ListaProtocolosComponent
                protocolos={protocolosFiltrados}
                loading={loading}
                onSeleccionarProtocolo={handleVerDetalle}
                protocoloSeleccionadoId={protocoloSeleccionado?._id}
                esAdmin={esAdmin}
                onEditar={handleAbrirModalGestion}
                onArchivar={handleArchivarProtocolo}
              />
            </div>

            {/* Visor de Detalle */}
            <div className="lg:col-span-2">
              {protocoloSeleccionado ? (
                <VisorProtocoloDetalleComponent
                  protocolo={protocoloSeleccionado}
                  esAdmin={esAdmin}
                  onConfirmarLectura={handleConfirmarLectura}
                  onVerHistorial={() => setMostrarHistorial(true)}
                  onEditar={handleAbrirModalGestion}
                  onArchivar={handleArchivarProtocolo}
                />
              ) : (
                <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccione un protocolo</h3>
                  <p className="text-gray-600">Seleccione un protocolo de la lista para ver los detalles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Gestión */}
      {mostrarModalGestion && (
        <ModalGestionProtocolo
          protocolo={protocoloEditando}
          onGuardar={protocoloEditando ? handleEditarProtocolo : handleCrearProtocolo}
          onCerrar={() => {
            setMostrarModalGestion(false);
            setProtocoloEditando(null);
          }}
        />
      )}

      {/* Modal de Historial */}
      {mostrarHistorial && protocoloSeleccionado && (
        <HistorialVersionesProtocolo
          protocolo={protocoloSeleccionado}
          onCerrar={() => setMostrarHistorial(false)}
        />
      )}
    </div>
  );
}

