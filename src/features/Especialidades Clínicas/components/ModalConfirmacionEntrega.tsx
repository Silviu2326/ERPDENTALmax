import { useState } from 'react';
import { X, CheckCircle, Calendar, FileText } from 'lucide-react';

interface ModalConfirmacionEntregaProps {
  tratamientoId: string;
  pacienteNombre: string;
  onConfirmar: (fechaEntrega: string, notasFinales?: string) => Promise<void>;
  onCancelar: () => void;
}

export default function ModalConfirmacionEntrega({
  pacienteNombre,
  onConfirmar,
  onCancelar,
}: ModalConfirmacionEntregaProps) {
  const [fechaEntrega, setFechaEntrega] = useState(new Date().toISOString().split('T')[0]);
  const [notasFinales, setNotasFinales] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fechaEntrega) {
      alert('Por favor, seleccione la fecha de entrega');
      return;
    }

    setGuardando(true);
    try {
      await onConfirmar(fechaEntrega, notasFinales.trim() || undefined);
    } catch (error) {
      // El error ya se maneja en el componente padre
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Confirmar Entrega de Prótesis</h3>
          </div>
          <button
            onClick={onCancelar}
            disabled={guardando}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Paciente:</span> {pacienteNombre}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Esta acción marcará la prótesis como entregada y actualizará el estado del tratamiento.
            </p>
          </div>

          {/* Fecha de entrega */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha de Entrega <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Notas finales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Notas Finales (Opcional)
            </label>
            <textarea
              value={notasFinales}
              onChange={(e) => setNotasFinales(e.target.value)}
              rows={4}
              placeholder="Observaciones finales sobre la entrega, instrucciones al paciente, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Advertencia */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Una vez confirmada la entrega, el estado del tratamiento se actualizará
              y puede desencadenar procesos administrativos y de facturación.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              <CheckCircle className="w-5 h-5" />
              {guardando ? 'Confirmando...' : 'Confirmar Entrega'}
            </button>
            <button
              type="button"
              onClick={onCancelar}
              disabled={guardando}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


