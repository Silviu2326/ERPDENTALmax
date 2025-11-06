import { useState } from 'react';
import { X, DollarSign, User, CreditCard, FileText } from 'lucide-react';
import { NuevoAnticipo } from '../api/anticiposApi';
import { PacienteSimplificado } from '../api/facturacionApi';
import SelectorPacienteAnticipo from './SelectorPacienteAnticipo';

interface ModalRegistrarAnticipoProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (datos: NuevoAnticipo) => Promise<void>;
}

export default function ModalRegistrarAnticipo({
  isOpen,
  onClose,
  onSubmit,
}: ModalRegistrarAnticipoProps) {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteSimplificado | null>(null);
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Efectivo');
  const [observacion, setObservacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setPacienteSeleccionado(null);
    setMonto('');
    setMetodoPago('Efectivo');
    setObservacion('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!pacienteSeleccionado) {
      setError('Debe seleccionar un paciente');
      return;
    }

    const montoNumero = parseFloat(monto);
    if (isNaN(montoNumero) || montoNumero <= 0) {
      setError('El monto debe ser un número mayor a 0');
      return;
    }

    setLoading(true);
    try {
      const datos: NuevoAnticipo = {
        pacienteId: pacienteSeleccionado._id,
        monto: montoNumero,
        metodoPago,
        observacion: observacion.trim() || undefined,
      };

      await onSubmit(datos);
      resetForm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el anticipo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Registrar Nuevo Anticipo</h2>
              <p className="text-sm text-gray-600">Registre un pago por adelantado de un paciente</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Selector de Paciente */}
          <div>
            <SelectorPacienteAnticipo
              pacienteSeleccionado={pacienteSeleccionado}
              onPacienteSeleccionado={setPacienteSeleccionado}
            />
          </div>

          {/* Monto y Método de Pago */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Método de Pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value as 'Efectivo' | 'Tarjeta' | 'Transferencia')}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Observaciones</span>
            </label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              rows={3}
              placeholder="Notas adicionales sobre el anticipo (opcional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !pacienteSeleccionado || !monto}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  <span>Registrar Anticipo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


