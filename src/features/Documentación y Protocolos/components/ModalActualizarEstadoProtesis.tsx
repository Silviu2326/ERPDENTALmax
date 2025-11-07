import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { EstadoProtesis, ActualizarEstadoProtesisData } from '../api/protesisApi';

interface ModalActualizarEstadoProtesisProps {
  estadoActual: EstadoProtesis;
  onActualizar: (data: ActualizarEstadoProtesisData) => Promise<void>;
  onCerrar: () => void;
  isOpen: boolean;
}

const estadosDisponibles: Record<EstadoProtesis, EstadoProtesis[]> = {
  Prescrita: ['Enviada a Laboratorio', 'Cancelada'],
  'Enviada a Laboratorio': ['Recibida de Laboratorio', 'Cancelada'],
  'Recibida de Laboratorio': ['Prueba en Paciente', 'Cancelada'],
  'Prueba en Paciente': ['Instalada', 'Ajustes en Laboratorio', 'Cancelada'],
  'Ajustes en Laboratorio': ['Recibida de Laboratorio', 'Cancelada'],
  Instalada: [],
  Cancelada: [],
};

export default function ModalActualizarEstadoProtesis({
  estadoActual,
  onActualizar,
  onCerrar,
  isOpen,
}: ModalActualizarEstadoProtesisProps) {
  const [nuevoEstado, setNuevoEstado] = useState<EstadoProtesis | ''>('');
  const [nota, setNota] = useState('');
  const [actualizando, setActualizando] = useState(false);

  if (!isOpen) return null;

  const estadosPermitidos = estadosDisponibles[estadoActual] || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoEstado || actualizando) return;

    setActualizando(true);
    try {
      await onActualizar({
        nuevoEstado: nuevoEstado as EstadoProtesis,
        nota: nota.trim() || undefined,
      });
      // Resetear formulario
      setNuevoEstado('');
      setNota('');
      onCerrar();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado. Por favor, inténtalo de nuevo.');
    } finally {
      setActualizando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Actualizar Estado de Prótesis
            </h2>
            <button
              onClick={onCerrar}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estado Actual
            </label>
            <div className="px-4 py-2.5 bg-slate-100 rounded-xl text-slate-900">
              {estadoActual}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nuevo Estado <span className="text-red-500">*</span>
            </label>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value as EstadoProtesis)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              required
            >
              <option value="">Seleccionar estado...</option>
              {estadosPermitidos.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            {estadosPermitidos.length === 0 && (
              <p className="text-sm text-gray-600 mt-2">
                No hay estados disponibles para cambiar desde este estado.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nota (opcional)
            </label>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={4}
              placeholder="Añade una nota sobre el cambio de estado..."
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all border border-slate-300 text-slate-700 hover:bg-slate-50"
              disabled={actualizando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!nuevoEstado || actualizando}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actualizando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
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



