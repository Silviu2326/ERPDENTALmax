import { useState, useEffect } from 'react';
import { Calendar, Loader2, Clock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Historial de Visitas
                </h1>
                <p className="text-gray-600">
                  Registro cronológico completo de todas las interacciones con la clínica
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Filtros */}
          <FiltrosHistorialVisitas
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
            profesionales={[]} // TODO: Obtener lista de profesionales
          />

          {/* Métricas/KPIs */}
          {visitas.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Total Visitas</h3>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">{paginacion.totalDocs}</span>
                </div>
                <p className="text-xs text-gray-600">
                  {visitas.filter(v => {
                    const fecha = new Date(v.fechaHoraInicio);
                    return fecha.getFullYear() === new Date().getFullYear();
                  }).length} este año
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Completadas</h3>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {visitas.filter(v => v.estado === 'completada').length}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {Math.round((visitas.filter(v => v.estado === 'completada').length / (visitas.length || 1)) * 100)}% del total
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Programadas</h3>
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {visitas.filter(v => v.estado === 'programada').length}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Pendientes</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Tratamientos</h3>
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {visitas.reduce((sum, v) => sum + (v.tratamientosRealizados?.length || 0), 0)}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Realizados</p>
              </div>
            </div>
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
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(paginacion.page - 1)}
                  disabled={paginacion.page === 1}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 hover:border-slate-300"
                >
                  Anterior
                </button>
                <span className="text-sm text-slate-600 px-4">
                  Página {paginacion.page} de {paginacion.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(paginacion.page + 1)}
                  disabled={paginacion.page === paginacion.totalPages}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 hover:border-slate-300"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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

