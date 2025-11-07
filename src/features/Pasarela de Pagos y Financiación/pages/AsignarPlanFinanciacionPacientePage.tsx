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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <CreditCard size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Asignar Plan de Financiación
                  </h1>
                  <p className="text-gray-600">
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
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
                >
                  <ArrowLeft size={18} className="opacity-70" />
                  <span>Limpiar Selección</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Buscador de Pacientes */}
          <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-4">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-slate-400" />
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
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-10 py-2.5"
                    />
                    {loading && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <Loader2 size={18} className="text-slate-400 animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Resultados de búsqueda */}
              {mostrarResultados && resultados.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm max-h-60 overflow-y-auto z-10">
                  {resultados.map((paciente) => (
                    <button
                      key={paciente._id}
                      onClick={() => handleSeleccionarPaciente(paciente)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <User size={18} className="text-slate-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {paciente.nombre} {paciente.apellidos}
                          </p>
                          {paciente.documentoIdentidad && (
                            <p className="text-sm text-slate-600">{paciente.documentoIdentidad}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {pacienteSeleccionado && (
                <div className="rounded-2xl bg-blue-50 ring-1 ring-blue-200 p-4">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-blue-600" />
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
          </div>

          {error && (
            <div className="bg-red-50 ring-1 ring-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Contenido Principal */}
          {pacienteSeleccionado && (
            <div className="space-y-6">
              {/* Selección de Presupuesto */}
              {!presupuestoSeleccionado && (
                <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Presupuestos Aceptados</h2>
                  <div className="space-y-2">
                    {presupuestosMock
                      .filter((p) => p.estado === 'aceptado')
                      .map((presupuesto) => (
                        <button
                          key={presupuesto._id}
                          onClick={() => setPresupuestoSeleccionado(presupuesto)}
                          className="w-full p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {presupuesto.numero || `Presupuesto ${presupuesto._id}`}
                              </p>
                              <p className="text-sm text-slate-600">Total: €{presupuesto.total.toFixed(2)}</p>
                            </div>
                            <CreditCard size={20} className="text-blue-600" />
                          </div>
                        </button>
                      ))}
                  </div>
                  {presupuestosMock.filter((p) => p.estado === 'aceptado').length === 0 && (
                    <p className="text-sm text-slate-600 text-center py-4">
                      No hay presupuestos aceptados para este paciente
                    </p>
                  )}
                </div>
              )}

              {/* Botón para asignar nuevo plan */}
              {presupuestoSeleccionado && (
                <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Presupuesto: {presupuestoSeleccionado.numero || presupuestoSeleccionado._id}
                      </h3>
                      <p className="text-sm text-slate-600">Total: €{presupuestoSeleccionado.total.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => setMostrarModalAsignar(true)}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    >
                      <CreditCard size={20} />
                      <span>Asignar Plan de Financiación</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Financiaciones Existentes */}
              {loadingFinanciaciones ? (
                <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-8 text-center">
                  <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-600">Cargando financiaciones...</p>
                </div>
              ) : financiaciones.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Financiaciones Activas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-8 text-center">
                  <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay financiaciones activas
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Selecciona un presupuesto y asigna un plan de financiación para comenzar
                  </p>
                </div>
              )}

              {/* Detalle de Financiación */}
              {financiacionSeleccionada && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Detalle de Financiación</h2>
                    <button
                      onClick={() => setFinanciacionSeleccionada(null)}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
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
            <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-8 text-center">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona un Paciente</h3>
              <p className="text-gray-600 mb-4">
                Busca y selecciona un paciente para ver sus presupuestos y asignar un plan de financiación
              </p>
            </div>
          )}
        </div>
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



