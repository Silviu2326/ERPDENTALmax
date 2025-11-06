import { useState, useEffect } from 'react';
import { Search, User, Loader2, AlertCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { buscarPacientes } from '../../Agenda de Citas y Programación/api/citasApi';
import { obtenerFinanciacionesPorPaciente, FinanciacionPaciente } from '../api/financiacionApi';
import ModalAsignarPlan from '../components/ModalAsignarPlan';
import CardResumenFinanciacionPaciente from '../components/CardResumenFinanciacionPaciente';
import TablaAmortizacionDetallada from '../components/TablaAmortizacionDetallada';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  documentoIdentidad?: string;
}

interface Presupuesto {
  _id: string;
  numero?: string;
  total: number;
  estado: string;
}

export default function AsignarPlanFinanciacionPacientePage() {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState<Presupuesto | null>(null);
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [financiaciones, setFinanciaciones] = useState<FinanciacionPaciente[]>([]);
  const [loadingFinanciaciones, setLoadingFinanciaciones] = useState(false);
  const [mostrarModalAsignar, setMostrarModalAsignar] = useState(false);
  const [financiacionSeleccionada, setFinanciacionSeleccionada] = useState<FinanciacionPaciente | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Datos mock de presupuestos (en producción vendrían de una API)
  const presupuestosMock: Presupuesto[] = [
    { _id: '1', numero: 'PRES-001', total: 3500, estado: 'aceptado' },
    { _id: '2', numero: 'PRES-002', total: 1200, estado: 'aceptado' },
  ];

  // Buscar pacientes
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const pacientes = await buscarPacientes(query);
        setResultados(pacientes);
        setMostrarResultados(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar pacientes');
        setResultados([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Cargar financiaciones cuando se selecciona un paciente
  useEffect(() => {
    if (pacienteSeleccionado) {
      cargarFinanciaciones();
    } else {
      setFinanciaciones([]);
    }
  }, [pacienteSeleccionado]);

  const cargarFinanciaciones = async () => {
    if (!pacienteSeleccionado) return;

    setLoadingFinanciaciones(true);
    setError(null);

    try {
      const financiacionesData = await obtenerFinanciacionesPorPaciente(pacienteSeleccionado._id);
      setFinanciaciones(financiacionesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las financiaciones');
    } finally {
      setLoadingFinanciaciones(false);
    }
  };

  const handleSeleccionarPaciente = (paciente: Paciente) => {
    setPacienteSeleccionado(paciente);
    setQuery(`${paciente.nombre} ${paciente.apellidos}`);
    setMostrarResultados(false);
    setPresupuestoSeleccionado(null);
    setFinanciacionSeleccionada(null);
  };

  const handleAsignacionExitosa = () => {
    cargarFinanciaciones();
    setPresupuestoSeleccionado(null);
  };

  const handleVerDetalleFinanciacion = (financiacion: FinanciacionPaciente) => {
    setFinanciacionSeleccionada(financiacion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Asignar Plan de Financiación</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Selecciona un paciente y asigna un plan de financiación a su presupuesto
                </p>
              </div>
            </div>
            {pacienteSeleccionado && (
              <button
                onClick={() => {
                  setPacienteSeleccionado(null);
                  setQuery('');
                  setPresupuestoSeleccionado(null);
                  setFinanciacionSeleccionada(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Limpiar Selección</span>
              </button>
            )}
          </div>
        </div>

        {/* Buscador de Pacientes */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar Paciente
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (pacienteSeleccionado) {
                  setPacienteSeleccionado(null);
                }
              }}
              onFocus={() => {
                if (resultados.length > 0) {
                  setMostrarResultados(true);
                }
              }}
              placeholder="Buscar por nombre, apellidos, DNI o teléfono..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {loading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              </div>
            )}
          </div>

          {/* Resultados de búsqueda */}
          {mostrarResultados && resultados.length > 0 && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
              {resultados.map((paciente) => (
                <button
                  key={paciente._id}
                  onClick={() => handleSeleccionarPaciente(paciente)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {paciente.nombre} {paciente.apellidos}
                      </p>
                      {paciente.documentoIdentidad && (
                        <p className="text-sm text-gray-500">{paciente.documentoIdentidad}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {pacienteSeleccionado && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">
                    {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
                  </p>
                  {pacienteSeleccionado.documentoIdentidad && (
                    <p className="text-sm text-blue-700">{pacienteSeleccionado.documentoIdentidad}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Contenido Principal */}
        {pacienteSeleccionado && (
          <div className="space-y-6">
            {/* Selección de Presupuesto */}
            {!presupuestoSeleccionado && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Presupuestos Aceptados</h2>
                <div className="space-y-2">
                  {presupuestosMock
                    .filter((p) => p.estado === 'aceptado')
                    .map((presupuesto) => (
                      <button
                        key={presupuesto._id}
                        onClick={() => setPresupuestoSeleccionado(presupuesto)}
                        className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {presupuesto.numero || `Presupuesto ${presupuesto._id}`}
                            </p>
                            <p className="text-sm text-gray-600">Total: €{presupuesto.total.toFixed(2)}</p>
                          </div>
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                      </button>
                    ))}
                </div>
                {presupuestosMock.filter((p) => p.estado === 'aceptado').length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay presupuestos aceptados para este paciente
                  </p>
                )}
              </div>
            )}

            {/* Botón para asignar nuevo plan */}
            {presupuestoSeleccionado && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Presupuesto: {presupuestoSeleccionado.numero || presupuestoSeleccionado._id}
                    </h3>
                    <p className="text-sm text-gray-600">Total: €{presupuestoSeleccionado.total.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => setMostrarModalAsignar(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Asignar Plan de Financiación</span>
                  </button>
                </div>
              </div>
            )}

            {/* Financiaciones Existentes */}
            {loadingFinanciaciones ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                <p className="mt-4 text-gray-600">Cargando financiaciones...</p>
              </div>
            ) : financiaciones.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Financiaciones Activas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {financiaciones.map((financiacion) => (
                    <CardResumenFinanciacionPaciente
                      key={financiacion._id}
                      financiacion={financiacion}
                      onClick={() => handleVerDetalleFinanciacion(financiacion)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-200 text-center">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay financiaciones activas
                </h3>
                <p className="text-gray-600">
                  Selecciona un presupuesto y asigna un plan de financiación para comenzar
                </p>
              </div>
            )}

            {/* Detalle de Financiación */}
            {financiacionSeleccionada && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Detalle de Financiación</h2>
                  <button
                    onClick={() => setFinanciacionSeleccionada(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cerrar Detalle
                  </button>
                </div>
                <TablaAmortizacionDetallada
                  tablaAmortizacion={financiacionSeleccionada.tablaAmortizacion}
                />
              </div>
            )}
          </div>
        )}

        {!pacienteSeleccionado && (
          <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-200 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Selecciona un Paciente</h3>
            <p className="text-gray-600">
              Busca y selecciona un paciente para ver sus presupuestos y asignar un plan de financiación
            </p>
          </div>
        )}
      </div>

      {/* Modal de Asignar Plan */}
      {mostrarModalAsignar && pacienteSeleccionado && presupuestoSeleccionado && (
        <ModalAsignarPlan
          isOpen={mostrarModalAsignar}
          onClose={() => setMostrarModalAsignar(false)}
          pacienteId={pacienteSeleccionado._id}
          presupuestoId={presupuestoSeleccionado._id}
          montoPresupuesto={presupuestoSeleccionado.total}
          onAsignacionExitosa={handleAsignacionExitosa}
        />
      )}
    </div>
  );
}


