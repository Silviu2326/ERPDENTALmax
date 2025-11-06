import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { obtenerPacientes, FiltrosBusquedaPacientes, Paciente, RespuestaListadoPacientes } from '../api/pacientesApi';
import FiltrosBusquedaPacientesComponent from '../components/FiltrosBusquedaPacientes';
import TablaListadoPacientes from '../components/TablaListadoPacientes';
import PaginacionListado from '../components/PaginacionListado';
import BotonNuevoPaciente from '../components/BotonNuevoPaciente';

interface GestionPacientesHistoriaClinicaPageProps {
  onVerPaciente?: (pacienteId: string) => void;
  onNuevoPaciente?: () => void;
}

export default function GestionPacientesHistoriaClinicaPage({ 
  onVerPaciente,
  onNuevoPaciente,
}: GestionPacientesHistoriaClinicaPageProps = {}) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosBusquedaPacientes>({
    page: 1,
    limit: 20,
    sortBy: 'apellidos',
    sortOrder: 'asc',
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const cargarPacientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta: RespuestaListadoPacientes = await obtenerPacientes(filtros);
      setPacientes(respuesta.data);
      setPaginacion(respuesta.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los pacientes');
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, [filtros]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosBusquedaPacientes) => {
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

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFiltros((prev) => ({
      ...prev,
      sortBy,
      sortOrder,
      page: 1, // Resetear a página 1 cuando cambia el orden
    }));
  };

  const handleVerPaciente = (pacienteId: string) => {
    if (onVerPaciente) {
      onVerPaciente(pacienteId);
    } else {
      console.log('Ver paciente:', pacienteId);
    }
  };

  const handleNuevaCita = (pacienteId: string) => {
    // TODO: Navegar a crear nueva cita con el paciente preseleccionado
    console.log('Nueva cita para paciente:', pacienteId);
    // Ejemplo: navigate(`/agenda/nueva-cita?pacienteId=${pacienteId}`);
  };

  const handleRegistrarPago = (pacienteId: string) => {
    // TODO: Abrir modal o navegar a registro de pago
    console.log('Registrar pago para paciente:', pacienteId);
  };

  const handleGenerarPresupuesto = (pacienteId: string) => {
    // TODO: Abrir modal o navegar a generación de presupuesto
    console.log('Generar presupuesto para paciente:', pacienteId);
  };

  const handleNuevoPaciente = () => {
    if (onNuevoPaciente) {
      onNuevoPaciente();
    } else {
      console.log('Nuevo paciente');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Pacientes e Historia Clínica
              </h1>
              <p className="text-gray-600 mt-1">
                Listado y gestión de pacientes de la clínica
              </p>
            </div>
          </div>
          <BotonNuevoPaciente onClick={handleNuevoPaciente} />
        </div>

        {/* Filtros */}
        <FiltrosBusquedaPacientesComponent
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
        />

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error al cargar los pacientes</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Tabla de pacientes */}
        <TablaListadoPacientes
          pacientes={pacientes}
          loading={loading}
          filtros={filtros}
          onSortChange={handleSortChange}
          onVerPaciente={handleVerPaciente}
          onNuevaCita={handleNuevaCita}
          onRegistrarPago={handleRegistrarPago}
          onGenerarPresupuesto={handleGenerarPresupuesto}
        />

        {/* Paginación */}
        {!loading && pacientes.length > 0 && (
          <PaginacionListado
            paginacion={paginacion}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

