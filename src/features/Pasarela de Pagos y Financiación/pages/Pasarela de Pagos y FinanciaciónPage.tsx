import { useState, useEffect } from 'react';
import { CreditCard, Search, User, Loader2, AlertCircle, RefreshCw, Settings, Wallet, History } from 'lucide-react';
import { buscarPacientes } from '../../Agenda de Citas y Programación/api/citasApi';
import { obtenerDeudaPaciente, obtenerPagosPorPaciente, DeudaPaciente, Tratamiento } from '../api/pagoApi';
import ResumenDeudaPaciente from '../components/ResumenDeudaPaciente';
import HistorialPagosMiniatura from '../components/HistorialPagosMiniatura';
import FormularioProcesarPago from '../components/FormularioProcesarPago';
import GestionPlanesFinanciacionPage from './GestionPlanesFinanciacionPage';
import AsignarPlanFinanciacionPacientePage from './AsignarPlanFinanciacionPacientePage';
import HistorialPagosPage from './HistorialPagosPage';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  documentoIdentidad?: string;
}

export default function PasarelaDePagosYFinanciacionPage() {
  const [vista, setVista] = useState<'pagos' | 'historial-pagos' | 'gestion-planes' | 'asignar-plan'>('pagos');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [deuda, setDeuda] = useState<DeudaPaciente | null>(null);
  const [loadingDeuda, setLoadingDeuda] = useState(false);
  const [pagos, setPagos] = useState<any[]>([]);
  const [loadingPagos, setLoadingPagos] = useState(false);
  const [tratamientosSeleccionados, setTratamientosSeleccionados] = useState<string[]>([]);
  const [mostrarFormularioPago, setMostrarFormularioPago] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cambiar vista y resetear estado
  useEffect(() => {
    if (vista !== 'pagos') {
      setPacienteSeleccionado(null);
      setQuery('');
      setDeuda(null);
      setPagos([]);
      setTratamientosSeleccionados([]);
      setMostrarFormularioPago(false);
    }
  }, [vista]);

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

  // Cargar deuda cuando se selecciona un paciente
  useEffect(() => {
    if (pacienteSeleccionado) {
      cargarDeudaYPagos(pacienteSeleccionado._id);
    } else {
      setDeuda(null);
      setPagos([]);
      setTratamientosSeleccionados([]);
    }
  }, [pacienteSeleccionado]);

  const cargarDeudaYPagos = async (pacienteId: string) => {
    setLoadingDeuda(true);
    setLoadingPagos(true);
    setError(null);

    try {
      const [deudaData, pagosData] = await Promise.all([
        obtenerDeudaPaciente(pacienteId).catch(() => null),
        obtenerPagosPorPaciente(pacienteId).catch(() => []),
      ]);

      setDeuda(deudaData);
      setPagos(pagosData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos del paciente');
    } finally {
      setLoadingDeuda(false);
      setLoadingPagos(false);
    }
  };

  const handleSeleccionarPaciente = (paciente: Paciente) => {
    setPacienteSeleccionado(paciente);
    setQuery(`${paciente.nombre} ${paciente.apellidos}`);
    setMostrarResultados(false);
    setTratamientosSeleccionados([]);
    setMostrarFormularioPago(false);
  };

  const handleTratamientoToggle = (tratamientoId: string) => {
    setTratamientosSeleccionados((prev) =>
      prev.includes(tratamientoId)
        ? prev.filter((id) => id !== tratamientoId)
        : [...prev, tratamientoId]
    );
  };

  const handlePagoExitoso = () => {
    setMostrarFormularioPago(false);
    setTratamientosSeleccionados([]);
    if (pacienteSeleccionado) {
      cargarDeudaYPagos(pacienteSeleccionado._id);
    }
  };

  const getTratamientosSeleccionados = (): Tratamiento[] => {
    if (!deuda) return [];
    return deuda.tratamientos.filter((t) => tratamientosSeleccionados.includes(t._id));
  };

  const getTotalSeleccionado = (): number => {
    return getTratamientosSeleccionados().reduce((sum, t) => sum + (t.saldoPendiente || 0), 0);
  };

  // Renderizar vistas según el estado
  if (vista === 'historial-pagos') {
    return <HistorialPagosPage onVolver={() => setVista('pagos')} />;
  }

  if (vista === 'gestion-planes') {
    return <GestionPlanesFinanciacionPage />;
  }

  if (vista === 'asignar-plan') {
    return <AsignarPlanFinanciacionPacientePage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pasarela de Pagos y Financiación</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Procesa pagos de pacientes y gestiona sus saldos pendientes
                </p>
              </div>
            </div>
            {pacienteSeleccionado && (
              <button
                onClick={() => {
                  setPacienteSeleccionado(null);
                  setQuery('');
                  setTratamientosSeleccionados([]);
                  setMostrarFormularioPago(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Limpiar Selección
              </button>
            )}
          </div>

          {/* Navegación por pestañas */}
          <div className="flex items-center space-x-2 border-b border-gray-200">
            <button
              onClick={() => setVista('pagos')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                vista === 'pagos'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Procesar Pagos</span>
              </div>
            </button>
            <button
              onClick={() => setVista('historial-pagos')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                vista === 'historial-pagos'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>Historial de Pagos</span>
              </div>
            </button>
            <button
              onClick={() => setVista('asignar-plan')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                vista === 'asignar-plan'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span>Asignar Plan de Financiación</span>
              </div>
            </button>
            <button
              onClick={() => setVista('gestion-planes')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                vista === 'gestion-planes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Gestionar Planes</span>
              </div>
            </button>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda: Deuda y Tratamientos */}
            <div className="lg:col-span-2 space-y-6">
              <ResumenDeudaPaciente
                deuda={deuda}
                loading={loadingDeuda}
                tratamientosSeleccionados={tratamientosSeleccionados}
                onTratamientoToggle={handleTratamientoToggle}
              />

              {tratamientosSeleccionados.length > 0 && !mostrarFormularioPago && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Total Seleccionado: €{getTotalSeleccionado().toFixed(2)}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {tratamientosSeleccionados.length}{' '}
                        {tratamientosSeleccionados.length === 1 ? 'tratamiento' : 'tratamientos'} seleccionado
                        {tratamientosSeleccionados.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setMostrarFormularioPago(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Procesar Pago</span>
                    </button>
                  </div>
                </div>
              )}

              {mostrarFormularioPago && (
                <FormularioProcesarPago
                  pacienteId={pacienteSeleccionado._id}
                  tratamientosSeleccionados={getTratamientosSeleccionados()}
                  totalSeleccionado={getTotalSeleccionado()}
                  onPagoExitoso={handlePagoExitoso}
                  onCancelar={() => setMostrarFormularioPago(false)}
                />
              )}
            </div>

            {/* Columna derecha: Historial de Pagos */}
            <div>
              <HistorialPagosMiniatura
                pagos={pagos}
                loading={loadingPagos}
                onVerDetalle={(pagoId) => {
                  // TODO: Implementar vista de detalle
                  console.log('Ver detalle pago:', pagoId);
                }}
              />
              {pacienteSeleccionado && (
                <button
                  onClick={() => cargarDeudaYPagos(pacienteSeleccionado._id)}
                  className="mt-4 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Actualizar</span>
                </button>
              )}
            </div>
          </div>
        )}

        {!pacienteSeleccionado && (
          <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-200 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Selecciona un Paciente
            </h3>
            <p className="text-gray-600">
              Busca y selecciona un paciente para ver su deuda y procesar pagos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

