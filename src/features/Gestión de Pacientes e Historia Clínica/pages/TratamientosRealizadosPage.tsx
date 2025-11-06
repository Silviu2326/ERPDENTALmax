import { useState, useEffect } from 'react';
import { ClipboardList, Loader2 } from 'lucide-react';
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
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        ID de paciente no válido
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tratamientos Realizados</h2>
          <p className="text-gray-600 text-sm mt-1">
            Historial cronológico de todas las intervenciones clínicas completadas
          </p>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosHistorialTratamientos
        filtros={filtros}
        onFiltrosChange={handleFiltrosChange}
        odontologos={odontologos}
      />

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar los tratamientos</p>
          <p className="text-sm mt-1">{error}</p>
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

