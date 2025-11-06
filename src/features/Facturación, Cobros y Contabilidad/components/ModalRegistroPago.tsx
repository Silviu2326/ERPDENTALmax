import { useState, useEffect } from 'react';
import { X, Search, AlertTriangle, Loader2 } from 'lucide-react';
import {
  NuevoPagoData,
  FacturaPendiente,
  buscarPacientesParaPago,
  obtenerFacturasPendientes,
  crearPago,
} from '../api/pagosApi';

interface ModalRegistroPagoProps {
  isOpen: boolean;
  onClose: () => void;
  onPagoRegistrado: (pagoId: string) => void;
}

const METODOS_PAGO = [
  'Efectivo',
  'Tarjeta de Crédito',
  'Tarjeta de Débito',
  'Transferencia',
  'Cheque',
  'Otro',
] as const;

export default function ModalRegistroPago({
  isOpen,
  onClose,
  onPagoRegistrado,
}: ModalRegistroPagoProps) {
  const [busquedaPaciente, setBusquedaPaciente] = useState('');
  const [pacientesEncontrados, setPacientesEncontrados] = useState<Array<{
    _id: string;
    nombre: string;
    apellidos: string;
    documentoIdentidad?: string;
  }>>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<{
    _id: string;
    nombre: string;
    apellidos: string;
  } | null>(null);
  const [facturasPendientes, setFacturasPendientes] = useState<FacturaPendiente[]>([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<FacturaPendiente | null>(null);
  const [formData, setFormData] = useState<Omit<NuevoPagoData, 'pacienteId' | 'facturaId'>>({
    monto: 0,
    metodoPago: 'Efectivo',
    fechaPago: new Date().toISOString().split('T')[0],
    notas: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buscandoPacientes, setBuscandoPacientes] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Resetear estado al abrir el modal
      setBusquedaPaciente('');
      setPacientesEncontrados([]);
      setPacienteSeleccionado(null);
      setFacturasPendientes([]);
      setFacturaSeleccionada(null);
      setFormData({
        monto: 0,
        metodoPago: 'Efectivo',
        fechaPago: new Date().toISOString().split('T')[0],
        notas: '',
      });
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const buscarPacientes = async () => {
      if (busquedaPaciente.trim().length < 2) {
        setPacientesEncontrados([]);
        return;
      }

      setBuscandoPacientes(true);
      try {
        const resultados = await buscarPacientesParaPago(busquedaPaciente);
        setPacientesEncontrados(resultados);
      } catch (err) {
        console.error('Error al buscar pacientes:', err);
        setPacientesEncontrados([]);
      } finally {
        setBuscandoPacientes(false);
      }
    };

    const timeoutId = setTimeout(buscarPacientes, 300);
    return () => clearTimeout(timeoutId);
  }, [busquedaPaciente]);

  useEffect(() => {
    const cargarFacturas = async () => {
      if (!pacienteSeleccionado) {
        setFacturasPendientes([]);
        return;
      }

      try {
        const facturas = await obtenerFacturasPendientes(pacienteSeleccionado._id);
        setFacturasPendientes(facturas);
        if (facturas.length > 0) {
          setFacturaSeleccionada(facturas[0]);
          setFormData((prev) => ({
            ...prev,
            monto: Math.min(facturas[0].saldoPendiente, facturas[0].total),
          }));
        }
      } catch (err) {
        console.error('Error al cargar facturas:', err);
        setFacturasPendientes([]);
      }
    };

    cargarFacturas();
  }, [pacienteSeleccionado]);

  useEffect(() => {
    if (facturaSeleccionada) {
      setFormData((prev) => ({
        ...prev,
        monto: Math.min(prev.monto || facturaSeleccionada.saldoPendiente, facturaSeleccionada.saldoPendiente),
      }));
    }
  }, [facturaSeleccionada]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pacienteSeleccionado) {
      setError('Debe seleccionar un paciente');
      return;
    }

    if (!facturaSeleccionada) {
      setError('Debe seleccionar una factura');
      return;
    }

    if (formData.monto <= 0) {
      setError('El monto debe ser mayor a cero');
      return;
    }

    if (formData.monto > facturaSeleccionada.saldoPendiente) {
      setError('El monto no puede ser mayor al saldo pendiente');
      return;
    }

    setLoading(true);

    try {
      const nuevoPago: NuevoPagoData = {
        pacienteId: pacienteSeleccionado._id,
        facturaId: facturaSeleccionada._id,
        monto: formData.monto,
        metodoPago: formData.metodoPago,
        fechaPago: new Date(formData.fechaPago).toISOString(),
        notas: formData.notas || undefined,
      };

      const pago = await crearPago(nuevoPago);
      onPagoRegistrado(pago._id!);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Registrar Nuevo Pago</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Búsqueda de Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Paciente
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={busquedaPaciente}
                onChange={(e) => setBusquedaPaciente(e.target.value)}
                placeholder="Buscar por nombre, apellido o DNI..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Lista de pacientes encontrados */}
            {busquedaPaciente.trim().length >= 2 && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg">
                {buscandoPacientes ? (
                  <div className="p-4 text-center text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Buscando...
                  </div>
                ) : pacientesEncontrados.length > 0 ? (
                  pacientesEncontrados.map((paciente) => (
                    <button
                      key={paciente._id}
                      type="button"
                      onClick={() => {
                        setPacienteSeleccionado({
                          _id: paciente._id,
                          nombre: paciente.nombre,
                          apellidos: paciente.apellidos,
                        });
                        setBusquedaPaciente(`${paciente.nombre} ${paciente.apellidos}`);
                        setPacientesEncontrados([]);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {paciente.nombre} {paciente.apellidos}
                      </div>
                      {paciente.documentoIdentidad && (
                        <div className="text-sm text-gray-500">{paciente.documentoIdentidad}</div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No se encontraron pacientes</div>
                )}
              </div>
            )}

            {/* Paciente seleccionado */}
            {pacienteSeleccionado && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  Paciente seleccionado: {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
                </p>
              </div>
            )}
          </div>

          {/* Selección de Factura */}
          {pacienteSeleccionado && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Factura Pendiente
              </label>
              {facturasPendientes.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  Este paciente no tiene facturas pendientes
                </div>
              ) : (
                <select
                  value={facturaSeleccionada?._id || ''}
                  onChange={(e) => {
                    const factura = facturasPendientes.find((f) => f._id === e.target.value);
                    setFacturaSeleccionada(factura || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione una factura</option>
                  {facturasPendientes.map((factura) => (
                    <option key={factura._id} value={factura._id}>
                      Factura #{factura.numeroFactura} - Saldo: {formatearMoneda(factura.saldoPendiente)} / {formatearMoneda(factura.total)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Información de la factura seleccionada */}
          {facturaSeleccionada && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Factura</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatearMoneda(facturaSeleccionada.total)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Saldo Pendiente</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatearMoneda(facturaSeleccionada.saldoPendiente)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto del Pago *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max={facturaSeleccionada?.saldoPendiente || 0}
              value={formData.monto || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  monto: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {facturaSeleccionada && (
              <p className="mt-1 text-sm text-gray-500">
                Máximo: {formatearMoneda(facturaSeleccionada.saldoPendiente)}
              </p>
            )}
          </div>

          {/* Método de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pago *
            </label>
            <select
              value={formData.metodoPago}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  metodoPago: e.target.value as NuevoPagoData['metodoPago'],
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {METODOS_PAGO.map((metodo) => (
                <option key={metodo} value={metodo}>
                  {metodo}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Pago *
            </label>
            <input
              type="date"
              value={formData.fechaPago}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fechaPago: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={formData.notas || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notas: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notas adicionales sobre el pago..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !pacienteSeleccionado || !facturaSeleccionada}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : (
                <span>Registrar Pago</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


