import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Loader2, AlertCircle, FileImage, ChevronRight } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-sm rounded-xl p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando historial radiológico...</p>
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
            {onVolver && (
              <button
                onClick={onVolver}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Volver</span>
              </button>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileImage size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Historial Radiológico
                  </h1>
                  {pacienteNombre && (
                    <p className="text-gray-600">
                      Paciente: {pacienteNombre}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setMostrarModalCarga(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md"
            >
              <Plus size={20} />
              <span>Añadir Radiografía</span>
            </button>
          </div>

          {/* Filtros */}
          <FiltrosHistorialRadiologico
            filtros={filtros}
            onFiltrosChange={setFiltros}
          />

          {/* Error */}
          {error && (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          )}

          {/* Galería */}
          <GaleriaRadiologica
            radiologias={radiologias}
            loading={loading}
            onSeleccionarRadiografia={handleSeleccionarRadiografia}
            onEditar={handleEditarRadiografia}
            onEliminar={handleEliminarRadiografia}
            radiografiaSeleccionadaId={radiografiaSeleccionada?._id}
          />

          {/* Paginación */}
          {paginacion.totalPages > 1 && (
            <div className="bg-white shadow-sm rounded-xl p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-gray-600">
                  Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} -{' '}
                  {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de{' '}
                  {paginacion.total} radiografías
                </div>
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(paginacion.page - 1)}
                    disabled={paginacion.page === 1}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={16} />
                    <span>Anterior</span>
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Página {paginacion.page} de {paginacion.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(paginacion.page + 1)}
                    disabled={paginacion.page === paginacion.totalPages}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Siguiente</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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



