import { useState, useEffect } from 'react';
import { Shield, RefreshCw } from 'lucide-react';
import {
  obtenerRegistrosDeAcceso,
  FiltrosRegistroAccesos,
  AccesoLog,
  PaginacionLogs,
} from '../api/accesosApi';
import FiltrosRegistroAccesos from '../components/FiltrosRegistroAccesos';
import TablaRegistroAccesos from '../components/TablaRegistroAccesos';
import ModalDetalleAcceso from '../components/ModalDetalleAcceso';

export default function RegistroAccesosPage() {
  const [logs, setLogs] = useState<AccesoLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginacion, setPaginacion] = useState<PaginacionLogs>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20,
  });
  const [logSeleccionado, setLogSeleccionado] = useState<AccesoLog | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Inicializar filtros con los últimos 7 días
  const [filtros, setFiltros] = useState<FiltrosRegistroAccesos>(() => {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 7);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);

    return {
      page: 1,
      limit: 20,
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
      sortBy: 'timestamp',
      sortOrder: 'desc',
    };
  });

  // Datos mock para usuarios y sedes (en producción vendrían de APIs)
  const usuarios = [
    { _id: '1', nombre: 'Juan', apellidos: 'Pérez' },
    { _id: '2', nombre: 'María', apellidos: 'García' },
    { _id: '3', nombre: 'Carlos', apellidos: 'López' },
  ];

  const sedes = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

  const cargarLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const respuesta = await obtenerRegistrosDeAcceso(filtros);
      setLogs(respuesta.logs);
      setPaginacion(respuesta.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los registros de acceso');
      console.error('Error al cargar logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLogs();
  }, [filtros]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosRegistroAccesos) => {
    setFiltros({ ...nuevosFiltros, page: 1 });
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setFiltros({ ...filtros, page: nuevaPagina });
  };

  const handleVerDetalle = (log: AccesoLog) => {
    setLogSeleccionado(log);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setLogSeleccionado(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Registro de Accesos</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Bitácora de auditoría de todas las acciones realizadas en el sistema
                </p>
              </div>
            </div>
            <button
              onClick={cargarLogs}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <FiltrosRegistroAccesos
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          usuarios={usuarios}
          sedes={sedes}
        />

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Tabla de Registros */}
        <TablaRegistroAccesos logs={logs} loading={loading} onVerDetalle={handleVerDetalle} />

        {/* Paginación */}
        {!loading && paginacion.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {((paginacion.currentPage - 1) * paginacion.limit) + 1} a{' '}
                {Math.min(paginacion.currentPage * paginacion.limit, paginacion.totalItems)} de{' '}
                {paginacion.totalItems} registros
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCambiarPagina(paginacion.currentPage - 1)}
                  disabled={paginacion.currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-4 py-1 text-sm text-gray-700">
                  Página {paginacion.currentPage} de {paginacion.totalPages}
                </span>
                <button
                  onClick={() => handleCambiarPagina(paginacion.currentPage + 1)}
                  disabled={paginacion.currentPage === paginacion.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Detalle */}
        {mostrarModal && logSeleccionado && (
          <ModalDetalleAcceso log={logSeleccionado} onClose={handleCerrarModal} />
        )}
      </div>
    </div>
  );
}


