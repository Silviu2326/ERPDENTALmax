import { useState, useEffect } from 'react';
import { CreditCard, Search, User, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { buscarPacientes } from '../../Agenda de Citas y Programación/api/citasApi';
import { obtenerDeudaPaciente, DeudaPaciente, Tratamiento } from '../api/pagoApi';
import FormularioPagoTarjeta from '../components/FormularioPagoTarjeta';
import ModalPagoRapidoTratamiento from '../components/ModalPagoRapidoTratamiento';
import HistorialPagosList from '../components/HistorialPagosList';
import { obtenerPagosPorPaciente } from '../api/pagosApi';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  documentoIdentidad?: string;
}

interface ProcesarPagoTarjetaPageProps {
  onVolver?: () => void;
  pacienteIdInicial?: string;
}

export default function ProcesarPagoTarjetaPage({
  onVolver,
  pacienteIdInicial,
}: ProcesarPagoTarjetaPageProps) {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [deuda, setDeuda] = useState<DeudaPaciente | null>(null);
  const [loadingDeuda, setLoadingDeuda] = useState(false);
  const [tratamientosSeleccionados, setTratamientosSeleccionados] = useState<string[]>([]);
  const [mostrarFormularioPago, setMostrarFormularioPago] = useState(false);
  const [tratamientoRapido, setTratamientoRapido] = useState<Tratamiento | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pagoExitoso, setPagoExitoso] = useState(false);

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
      cargarDeuda(pacienteSeleccionado._id);
    } else {
      setDeuda(null);
      setTratamientosSeleccionados([]);
    }
  }, [pacienteSeleccionado]);

  const cargarDeuda = async (pacienteId: string) => {
    setLoadingDeuda(true);
    setError(null);

    try {
      const deudaData = await obtenerDeudaPaciente(pacienteId);
      setDeuda(deudaData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar deuda del paciente');
    } finally {
      setLoadingDeuda(false);
    }
  };

  const handleSeleccionarPaciente = (paciente: Paciente) => {
    setPacienteSeleccionado(paciente);
    setQuery(`${paciente.nombre} ${paciente.apellidos}`);
    setMostrarResultados(false);
    setTratamientosSeleccionados([]);
    setMostrarFormularioPago(false);
    setPagoExitoso(false);
  };

  const handleTratamientoToggle = (tratamientoId: string) => {
    setTratamientosSeleccionados((prev) =>
      prev.includes(tratamientoId)
        ? prev.filter((id) => id !== tratamientoId)
        : [...prev, tratamientoId]
    );
  };

  const handlePagoRapido = (tratamiento: Tratamiento) => {
    setTratamientoRapido(tratamiento);
    setMostrarFormularioPago(false);
    setTratamientosSeleccionados([]);
  };

  const handlePagoExitoso = (pagoId: string) => {
    setMostrarFormularioPago(false);
    setTratamientoRapido(null);
    setTratamientosSeleccionados([]);
    setPagoExitoso(true);
    if (pacienteSeleccionado) {
      cargarDeuda(pacienteSeleccionado._id);
    }
    // Ocultar mensaje de éxito después de 5 segundos
    setTimeout(() => setPagoExitoso(false), 5000);
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const getTratamientosSeleccionados = (): Tratamiento[] => {
    if (!deuda) return [];
    return deuda.tratamientos.filter((t) => tratamientosSeleccionados.includes(t._id));
  };

  const getTotalSeleccionado = (): number => {
    return getTratamientosSeleccionados().reduce((sum, t) => sum + (t.saldoPendiente || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                  >
                    <ArrowLeft size={20} className="text-gray-600" />
                  </button>
                )}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <CreditCard size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Procesar Pago con Tarjeta
                  </h1>
                  <p className="text-gray-600">
                    Procesa pagos de pacientes de forma segura con tarjeta de crédito o débito
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
                    setPagoExitoso(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Limpiar Selección
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Mensaje de éxito */}
          {pagoExitoso && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800 font-medium">
                ¡Pago procesado exitosamente!
              </p>
            </div>
          )}

          {/* Buscador de Pacientes */}
          <div className="bg-white shadow-sm rounded-xl">
            <div className="p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Search size={16} className="inline mr-1" />
                Buscar Paciente
              </label>
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
                <div className="mt-3 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                  {resultados.map((paciente) => (
                    <button
                      key={paciente._id}
                      onClick={() => handleSeleccionarPaciente(paciente)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
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
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <User size={20} className="text-blue-600" />
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
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          )}

          {/* Contenido Principal */}
          {pacienteSeleccionado && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna izquierda: Deuda y Tratamientos */}
              <div className="lg:col-span-2 space-y-6">
                {/* Lista de tratamientos con deuda */}
                {loadingDeuda ? (
                  <div className="bg-white shadow-sm rounded-xl p-8 text-center">
                    <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-600">Cargando deuda...</p>
                  </div>
                ) : deuda && deuda.tratamientos.length > 0 ? (
                  <div className="bg-white shadow-sm rounded-xl">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Tratamientos con Deuda</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Total pendiente: €{deuda.totalDeuda.toFixed(2)}
                      </p>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {deuda.tratamientos.map((tratamiento) => (
                        <div
                          key={tratamiento._id}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <input
                                type="checkbox"
                                checked={tratamientosSeleccionados.includes(tratamiento._id)}
                                onChange={() => handleTratamientoToggle(tratamiento._id)}
                                className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{tratamiento.nombre}</h4>
                                {tratamiento.descripcion && (
                                  <p className="text-sm text-gray-600 mt-1">{tratamiento.descripcion}</p>
                                )}
                                <p className="text-sm font-semibold text-gray-900 mt-2">
                                  Saldo pendiente: €{tratamiento.saldoPendiente.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handlePagoRapido(tratamiento)}
                              className="ml-4 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
                            >
                              Pago Rápido
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white shadow-sm rounded-xl p-8 text-center">
                    <CheckCircle2 size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay deudas pendientes</h3>
                    <p className="text-gray-600">El paciente no tiene tratamientos con saldo pendiente</p>
                  </div>
                )}

                {/* Resumen y botón de pago */}
                {tratamientosSeleccionados.length > 0 && !mostrarFormularioPago && (
                  <div className="bg-white shadow-sm rounded-xl p-6">
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
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                      >
                        <CreditCard size={20} />
                        <span>Procesar Pago</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Formulario de pago */}
                {mostrarFormularioPago && (
                  <div className="bg-white shadow-sm rounded-xl p-6">
                    <FormularioPagoTarjeta
                      monto={getTotalSeleccionado()}
                      moneda="EUR"
                      pacienteId={pacienteSeleccionado._id}
                      facturaIds={[]}
                      onPagoExitoso={handlePagoExitoso}
                      onError={handleError}
                      onCancelar={() => setMostrarFormularioPago(false)}
                    />
                  </div>
                )}
              </div>

              {/* Columna derecha: Historial de Pagos */}
              <div>
                <HistorialPagosList
                  pacienteId={pacienteSeleccionado._id}
                  onVerDetalle={(pago) => {
                    console.log('Ver detalle pago:', pago);
                  }}
                />
              </div>
            </div>
          )}

          {!pacienteSeleccionado && (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Selecciona un Paciente
              </h3>
              <p className="text-gray-600">
                Busca y selecciona un paciente para procesar un pago con tarjeta
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de pago rápido */}
      {tratamientoRapido && pacienteSeleccionado && (
        <ModalPagoRapidoTratamiento
          isOpen={true}
          onClose={() => setTratamientoRapido(null)}
          pacienteId={pacienteSeleccionado._id}
          pacienteNombre={`${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellidos}`}
          tratamiento={tratamientoRapido}
          onPagoExitoso={handlePagoExitoso}
        />
      )}
    </div>
  );
}



