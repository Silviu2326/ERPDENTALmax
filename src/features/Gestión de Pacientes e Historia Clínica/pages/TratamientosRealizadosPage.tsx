import { useState, useEffect } from 'react';
import { ClipboardList, AlertCircle } from 'lucide-react';
import {
  obtenerTratamientosRealizados,
  FiltrosTratamientosRealizados,
  TratamientoRealizado,
} from '../api/tratamientosRealizadosApi';
import FiltrosHistorialTratamientos from '../components/FiltrosHistorialTratamientos';
import TablaTratamientosRealizados from '../components/TablaTratamientosRealizados';
import ModalDetalleTratamiento from '../components/ModalDetalleTratamiento';
import PaginacionListado from '../components/PaginacionListado';

interface TratamientosRealizadosPageProps {
  pacienteId: string;
}

export default function TratamientosRealizadosPage({
  pacienteId,
}: TratamientosRealizadosPageProps) {
  const [tratamientos, setTratamientos] = useState<TratamientoRealizado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosTratamientosRealizados>({
    page: 1,
    limit: 20,
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState<TratamientoRealizado | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Extraer lista única de odontólogos de los tratamientos
  const odontologos = Array.from(
    new Map(
      tratamientos.map((t) => [
        t.odontologo._id,
        {
          _id: t.odontologo._id,
          nombre: t.odontologo.nombre,
          apellidos: t.odontologo.apellidos,
        },
      ])
    ).values()
  );

  const cargarTratamientos = async () => {
    if (!pacienteId) return;

    setLoading(true);
    setError(null);
    try {
      const respuesta = await obtenerTratamientosRealizados(pacienteId, filtros);
      setTratamientos(respuesta.data);
      setPaginacion(respuesta.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los tratamientos realizados');
      setTratamientos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTratamientos();
  }, [pacienteId, filtros]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosTratamientosRealizados) => {
    setFiltros((prev) => ({
      ...prev,
      ...nuevosFiltros,
    }));
  };

  const handlePageChange = (page: number) => {
    setFiltros((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleVerDetalle = (tratamiento: TratamientoRealizado) => {
    setTratamientoSeleccionado(tratamiento);
    setMostrarModal(true);
  };

  const handleCloseModal = () => {
    setMostrarModal(false);
    setTratamientoSeleccionado(null);
  };

  const handleUpdate = () => {
    cargarTratamientos();
  };

  if (!pacienteId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ID de paciente no válido</h3>
            <p className="text-gray-600">Por favor, proporcione un ID de paciente válido</p>
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
                <ClipboardList size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Tratamientos Realizados
                </h1>
                <p className="text-gray-600">
                  Historial cronológico de todas las intervenciones clínicas completadas
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
          <FiltrosHistorialTratamientos
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
            odontologos={odontologos}
          />

          {/* Mensaje de error */}
          {error && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar los tratamientos</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          )}

          {/* Tabla de tratamientos */}
          <TablaTratamientosRealizados
            tratamientos={tratamientos}
            loading={loading}
            onVerDetalle={handleVerDetalle}
          />

          {/* Paginación */}
          {!loading && tratamientos.length > 0 && (
            <PaginacionListado
              paginacion={paginacion}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      {mostrarModal && tratamientoSeleccionado && (
        <ModalDetalleTratamiento
          tratamientoId={tratamientoSeleccionado._id}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

