import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Loader2, AlertCircle } from 'lucide-react';
import {
  obtenerRadiologiasPorPaciente,
  eliminarRadiologia,
  actualizarRadiologia,
  FiltrosRadiologias,
  Radiologia,
} from '../api/radiologiaApi';
import GaleriaRadiologica from '../components/GaleriaRadiologica';
import VisorDicomDetallado from '../components/VisorDicomDetallado';
import ModalCargaRadiografia from '../components/ModalCargaRadiografia';
import FiltrosHistorialRadiologico from '../components/FiltrosHistorialRadiologico';

interface HistorialRadiologicoPacientePageProps {
  pacienteId: string;
  pacienteNombre?: string;
  onVolver?: () => void;
}

export default function HistorialRadiologicoPacientePage({
  pacienteId,
  pacienteNombre,
  onVolver,
}: HistorialRadiologicoPacientePageProps) {
  const [radiologias, setRadiologias] = useState<Radiologia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosRadiologias>({
    page: 1,
    limit: 20,
  });
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [mostrarModalCarga, setMostrarModalCarga] = useState(false);
  const [radiografiaSeleccionada, setRadiografiaSeleccionada] = useState<Radiologia | null>(null);
  const [mostrarVisor, setMostrarVisor] = useState(false);
  const [radiografiaAEditar, setRadiografiaAEditar] = useState<Radiologia | null>(null);

  useEffect(() => {
    cargarRadiologias();
  }, [pacienteId, filtros]);

  const cargarRadiologias = async () => {
    if (!pacienteId) return;

    setLoading(true);
    setError(null);

    try {
      const respuesta = await obtenerRadiologiasPorPaciente(pacienteId, filtros);
      setRadiologias(respuesta.radiologias);
      setPaginacion(respuesta.paginacion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las radiografías');
    } finally {
      setLoading(false);
    }
  };

  const handleRadiografiaCreada = (nuevaRadiologia: Radiologia) => {
    // Recargar la lista
    cargarRadiologias();
  };

  const handleSeleccionarRadiografia = (radiologia: Radiologia) => {
    setRadiografiaSeleccionada(radiologia);
    setMostrarVisor(true);
  };

  const handleEliminarRadiografia = async (radiologiaId: string) => {
    try {
      await eliminarRadiologia(radiologiaId);
      // Recargar la lista
      cargarRadiologias();
      // Si la radiografía eliminada estaba seleccionada, cerrar el visor
      if (radiografiaSeleccionada?._id === radiologiaId) {
        setMostrarVisor(false);
        setRadiografiaSeleccionada(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar la radiografía');
    }
  };

  const handleEditarRadiografia = (radiologia: Radiologia) => {
    setRadiografiaAEditar(radiologia);
    // Por ahora, abrimos el visor. En el futuro se podría abrir un modal de edición
    setRadiografiaSeleccionada(radiologia);
    setMostrarVisor(true);
  };

  const handleAnteriorRadiografia = () => {
    if (!radiografiaSeleccionada) return;
    const indiceActual = radiologias.findIndex((r) => r._id === radiografiaSeleccionada._id);
    if (indiceActual > 0) {
      setRadiografiaSeleccionada(radiologias[indiceActual - 1]);
    }
  };

  const handleSiguienteRadiografia = () => {
    if (!radiografiaSeleccionada) return;
    const indiceActual = radiologias.findIndex((r) => r._id === radiografiaSeleccionada._id);
    if (indiceActual < radiologias.length - 1) {
      setRadiografiaSeleccionada(radiologias[indiceActual + 1]);
    }
  };

  const handlePageChange = (nuevaPagina: number) => {
    setFiltros((prev) => ({ ...prev, page: nuevaPagina }));
  };

  if (loading && radiologias.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando historial radiológico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          {onVolver && (
            <button
              onClick={onVolver}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Historial Radiológico
              </h1>
              {pacienteNombre && (
                <p className="text-gray-600">Paciente: {pacienteNombre}</p>
              )}
            </div>
            <button
              onClick={() => setMostrarModalCarga(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Añadir Radiografía</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <FiltrosHistorialRadiologico
            filtros={filtros}
            onFiltrosChange={setFiltros}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Galería */}
        <div className="mb-6">
          <GaleriaRadiologica
            radiologias={radiologias}
            loading={loading}
            onSeleccionarRadiografia={handleSeleccionarRadiografia}
            onEditar={handleEditarRadiografia}
            onEliminar={handleEliminarRadiografia}
            radiografiaSeleccionadaId={radiografiaSeleccionada?._id}
          />
        </div>

        {/* Paginación */}
        {paginacion.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-600">
              Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} -{' '}
              {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de{' '}
              {paginacion.total} radiografías
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(paginacion.page - 1)}
                disabled={paginacion.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-gray-700">
                Página {paginacion.page} de {paginacion.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(paginacion.page + 1)}
                disabled={paginacion.page === paginacion.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Modal de carga */}
        <ModalCargaRadiografia
          pacienteId={pacienteId}
          isOpen={mostrarModalCarga}
          onClose={() => setMostrarModalCarga(false)}
          onRadiografiaCreada={handleRadiografiaCreada}
        />

        {/* Visor de imagen detallada */}
        {radiografiaSeleccionada && mostrarVisor && (
          <VisorDicomDetallado
            radiologia={radiografiaSeleccionada}
            isOpen={mostrarVisor}
            onClose={() => {
              setMostrarVisor(false);
              setRadiografiaSeleccionada(null);
            }}
            onAnterior={
              radiologias.findIndex((r) => r._id === radiografiaSeleccionada._id) > 0
                ? handleAnteriorRadiografia
                : undefined
            }
            onSiguiente={
              radiologias.findIndex((r) => r._id === radiografiaSeleccionada._id) <
              radiologias.length - 1
                ? handleSiguienteRadiografia
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}


