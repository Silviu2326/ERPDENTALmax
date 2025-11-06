import { useState, useEffect } from 'react';
import { Calendar, Loader2, Clock, CheckCircle, XCircle, DollarSign, TrendingUp, User, FileText } from 'lucide-react';
import {
  obtenerVisitasByPacienteId,
  Visita,
  FiltrosVisitas,
  DetalleVisita,
} from '../api/historialVisitasApi';
import VisitasTimeline from '../components/VisitasTimeline';
import FiltrosHistorialVisitas from '../components/FiltrosHistorialVisitas';
import VisorOdontogramaHistorico from '../components/VisorOdontogramaHistorico';
import ModalAdjuntarDocumentoVisita from '../components/ModalAdjuntarDocumentoVisita';

interface HistorialVisitasPageProps {
  pacienteId: string;
}

export default function HistorialVisitasPage({ pacienteId }: HistorialVisitasPageProps) {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosVisitas>({
    sort: 'fechaHoraInicio:desc',
  });
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 20,
    totalDocs: 0,
    totalPages: 0,
  });
  const [visitaSeleccionada, setVisitaSeleccionada] = useState<DetalleVisita | null>(null);
  const [mostrarOdontograma, setMostrarOdontograma] = useState(false);
  const [odontogramaId, setOdontogramaId] = useState<string>('');
  const [fechaOdontograma, setFechaOdontograma] = useState<string>('');
  const [mostrarModalDocumento, setMostrarModalDocumento] = useState(false);
  const [visitaIdParaDocumento, setVisitaIdParaDocumento] = useState<string>('');

  useEffect(() => {
    cargarVisitas();
  }, [pacienteId, filtros, paginacion.page]);

  const cargarVisitas = async () => {
    if (!pacienteId) return;

    setLoading(true);
    setError(null);

    try {
      const respuesta = await obtenerVisitasByPacienteId(
        pacienteId,
        paginacion.page,
        paginacion.limit,
        filtros
      );
      setVisitas(respuesta.visitas);
      setPaginacion({
        ...paginacion,
        totalDocs: respuesta.pagination.totalDocs,
        totalPages: respuesta.pagination.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial de visitas');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrosChange = (nuevosFiltros: FiltrosVisitas) => {
    setFiltros(nuevosFiltros);
    setPaginacion({ ...paginacion, page: 1 }); // Resetear a página 1 cuando cambian los filtros
  };

  const handleVerDetalleCompleto = (visita: DetalleVisita) => {
    setVisitaSeleccionada(visita);
  };

  const handleVerOdontograma = (id: string, fecha: string) => {
    setOdontogramaId(id);
    setFechaOdontograma(fecha);
    setMostrarOdontograma(true);
  };

  const handleAdjuntarDocumento = (visitaId: string) => {
    setVisitaIdParaDocumento(visitaId);
    setMostrarModalDocumento(true);
  };

  const handleDocumentoSubido = () => {
    cargarVisitas(); // Recargar visitas para mostrar el nuevo documento
  };

  const handlePageChange = (nuevaPage: number) => {
    setPaginacion({ ...paginacion, page: nuevaPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <p className="font-semibold">Error al cargar el historial</p>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Historial de Visitas
          </h2>
          <p className="text-gray-600 mt-1">
            Registro cronológico completo de todas las interacciones con la clínica
          </p>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosHistorialVisitas
        filtros={filtros}
        onFiltrosChange={handleFiltrosChange}
        profesionales={[]} // TODO: Obtener lista de profesionales
      />

      {/* Estadísticas de visitas */}
      {visitas.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Visitas</p>
                  <p className="text-2xl font-bold text-blue-600">{visitas.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {visitas.filter(v => {
                      const fecha = new Date(v.fechaHoraInicio);
                      return fecha.getFullYear() === new Date().getFullYear();
                    }).length} este año
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {visitas.filter(v => v.estado === 'completada').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((visitas.filter(v => v.estado === 'completada').length / visitas.length) * 100)}% del total
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Programadas</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {visitas.filter(v => v.estado === 'programada').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Pendientes</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tratamientos</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {visitas.reduce((sum, v) => sum + (v.tratamientosRealizados?.length || 0), 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Realizados</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </div>
          </div>
          
          {/* Estadísticas adicionales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documentos Adjuntos</p>
                  <p className="text-xl font-bold text-indigo-600">
                    {visitas.reduce((sum, v) => sum + (v.documentosAdjuntos?.length || 0), 0)}
                  </p>
                </div>
                <FileText className="w-6 h-6 text-indigo-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-teal-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pagos Asociados</p>
                  <p className="text-xl font-bold text-teal-600">
                    {visitas.reduce((sum, v) => sum + (v.pagosAsociados?.length || 0), 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {visitas.reduce((sum, v) => sum + (v.pagosAsociados?.reduce((s, p) => s + p.monto, 0) || 0), 0).toFixed(2)} €
                  </p>
                </div>
                <DollarSign className="w-6 h-6 text-teal-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-pink-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Profesionales</p>
                  <p className="text-xl font-bold text-pink-600">
                    {new Set(visitas.map(v => v.profesional._id)).size}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Únicos</p>
                </div>
                <User className="w-6 h-6 text-pink-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-cyan-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Visitas Recientes</p>
                  <p className="text-xl font-bold text-cyan-600">
                    {visitas.filter(v => {
                      const fecha = new Date(v.fechaHoraInicio);
                      const hace30Dias = new Date();
                      hace30Dias.setDate(hace30Dias.getDate() - 30);
                      return fecha >= hace30Dias;
                    }).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Últimos 30 días</p>
                </div>
                <Calendar className="w-6 h-6 text-cyan-500 opacity-50" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Timeline de visitas */}
      <VisitasTimeline
        visitas={visitas}
        loading={loading}
        onVerDetalleCompleto={handleVerDetalleCompleto}
        onVerOdontograma={handleVerOdontograma}
        onAdjuntarDocumento={handleAdjuntarDocumento}
      />

      {/* Paginación */}
      {paginacion.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-700">
            Mostrando página {paginacion.page} de {paginacion.totalPages} ({paginacion.totalDocs}{' '}
            visitas en total)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(paginacion.page - 1)}
              disabled={paginacion.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => handlePageChange(paginacion.page + 1)}
              disabled={paginacion.page === paginacion.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal de Odontograma Histórico */}
      {mostrarOdontograma && (
        <VisorOdontogramaHistorico
          odontogramaId={odontogramaId}
          fecha={fechaOdontograma}
          onCerrar={() => setMostrarOdontograma(false)}
        />
      )}

      {/* Modal para Adjuntar Documento */}
      {mostrarModalDocumento && (
        <ModalAdjuntarDocumentoVisita
          visitaId={visitaIdParaDocumento}
          onCerrar={() => {
            setMostrarModalDocumento(false);
            setVisitaIdParaDocumento('');
          }}
          onDocumentoSubido={handleDocumentoSubido}
        />
      )}
    </div>
  );
}

