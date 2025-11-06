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

export default function ProtocolosLimpiezaPage({ onTabChange, tabActiva = 'protocolos' }: ProtocolosLimpiezaPageProps = {}) {
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Tabs de Navegación (si se muestra desde la página principal) */}
        {onTabChange && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => onTabChange('lotes')}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  tabActiva === 'lotes'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Lotes de Esterilización</span>
              </button>
              <button
                onClick={() => onTabChange('protocolos')}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  tabActiva === 'protocolos'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Protocolos de Limpieza</span>
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Protocolos de Limpieza y Desinfección</h1>
              <p className="text-gray-600 mt-1">
                Gestión y consulta de protocolos estandarizados de higiene, limpieza y desinfección
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={cargarProtocolos}
                disabled={loading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
              {esAdmin && (
                <button
                  onClick={() => handleAbrirModalGestion()}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nuevo Protocolo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
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
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar protocolos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filtros.categoria || ''}
                onChange={(e) =>
                  setFiltros({ ...filtros, categoria: e.target.value || undefined })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.noLeidos || false}
                  onChange={(e) =>
                    setFiltros({ ...filtros, noLeidos: e.target.checked || undefined })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Solo no leídos</span>
              </label>
            )}
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
              <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
                <p className="text-gray-500 text-lg">Seleccione un protocolo para ver los detalles</p>
              </div>
            )}
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
    </div>
  );
}

