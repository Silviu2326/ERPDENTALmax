import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { EstadoFabricacion } from '../api/fabricacionApi';

interface ModalActualizarEstadoProps {
  isOpen: boolean;
  onClose: () => void;
  estadoActual: EstadoFabricacion;
  onActualizar: (nuevoEstado: EstadoFabricacion, notas?: string) => void;
  loading?: boolean;
}

const estadosDisponibles: EstadoFabricacion[] = [
  'Pendiente de Aceptación',
  'Recibido en laboratorio',
  'En Proceso',
  'Diseño CAD',
  'Fresado/Impresión',
  'Acabado y Pulido',
  'Control de Calidad',
  'Enviado a clínica',
  'Lista para Entrega',
  'Recibido en Clínica',
  'Cancelada',
];

export default function ModalActualizarEstado({
  isOpen,
  onClose,
  estadoActual,
  onActualizar,
  loading = false,
}: ModalActualizarEstadoProps) {
  const [nuevoEstado, setNuevoEstado] = useState<EstadoFabricacion>(estadoActual);
  const [notas, setNotas] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nuevoEstado === estadoActual) {
      setError('Debes seleccionar un estado diferente al actual');
      return;
    }

    setError(null);
    onActualizar(nuevoEstado, notas.trim() || undefined);
  };

  const handleClose = () => {
    setNuevoEstado(estadoActual);
    setNotas('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Actualizar Estado de Fabricación</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Estado Actual */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estado Actual
            </label>
            <div className="p-3 bg-slate-50 rounded-xl ring-1 ring-slate-200">
              <p className="text-gray-900 font-medium">{estadoActual}</p>
            </div>
          </div>

          {/* Nuevo Estado */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nuevo Estado <span className="text-red-500">*</span>
            </label>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value as EstadoFabricacion)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              required
            >
              {estadosDisponibles.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          {/* Notas */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notas (Opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
              placeholder="Añade notas sobre el cambio de estado..."
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 resize-none"
            />
            <p className="text-xs text-gray-600 mt-1">
              Estas notas quedarán registradas en el historial de la orden
            </p>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || nuevoEstado === estadoActual}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Actualizar Estado</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



