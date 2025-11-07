import { useState, useEffect } from 'react';
import { Users, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Users size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Gestión de Pacientes e Historia Clínica
                  </h1>
                  <p className="text-gray-600">
                    Listado y gestión de pacientes de la clínica
                  </p>
                </div>
              </div>
              <BotonNuevoPaciente onClick={handleNuevoPaciente} />
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Filtros */}
          <FiltrosBusquedaPacientesComponent
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
          />

          {/* Mensaje de error */}
          {error && (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
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
    </div>
  );
}

