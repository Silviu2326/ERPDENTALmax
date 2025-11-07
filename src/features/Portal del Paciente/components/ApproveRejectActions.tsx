import { useState } from 'react';
import { Check, X, MessageSquare } from 'lucide-react';
import { PresupuestoPaciente, aprobarPresupuesto, rechazarPresupuesto } from '../api/presupuestosApi';
import ConfirmationModal from './ConfirmationModal';

interface ApproveRejectActionsProps {
  presupuesto: PresupuestoPaciente;
  onAprobado: (presupuesto: PresupuestoPaciente) => void;
  onRechazado: (presupuesto: PresupuestoPaciente) => void;
}

export default function ApproveRejectActions({
  presupuesto,
  onAprobado,
  onRechazado,
}: ApproveRejectActionsProps) {
  const [modalAprobarAbierto, setModalAprobarAbierto] = useState(false);
  const [modalRechazarAbierto, setModalRechazarAbierto] = useState(false);
  const [notasRechazo, setNotasRechazo] = useState('');
  const [cargando, setCargando] = useState(false);

  const puedeAprobar = presupuesto.estado === 'Pendiente';
  const puedeRechazar = presupuesto.estado === 'Pendiente';

  const handleAprobar = async () => {
    try {
      setCargando(true);
      const presupuestoActualizado = await aprobarPresupuesto(presupuesto._id);
      onAprobado(presupuestoActualizado);
      setModalAprobarAbierto(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al aprobar el presupuesto');
    } finally {
      setCargando(false);
    }
  };

  const handleRechazar = async () => {
    try {
      setCargando(true);
      const presupuestoActualizado = await rechazarPresupuesto(presupuesto._id, notasRechazo);
      onRechazado(presupuestoActualizado);
      setModalRechazarAbierto(false);
      setNotasRechazo('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al rechazar el presupuesto');
    } finally {
      setCargando(false);
    }
  };

  if (!puedeAprobar && !puedeRechazar) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        {puedeAprobar && (
          <button
            onClick={() => setModalAprobarAbierto(true)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium shadow-sm"
          >
            <Check size={20} />
            <span>Aprobar Presupuesto</span>
          </button>
        )}
        
        {puedeRechazar && (
          <button
            onClick={() => setModalRechazarAbierto(true)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium shadow-sm"
          >
            <X size={20} />
            <span>Rechazar Presupuesto</span>
          </button>
        )}
      </div>

      {/* Modal de Confirmación de Aprobación */}
      <ConfirmationModal
        isOpen={modalAprobarAbierto}
        onClose={() => setModalAprobarAbierto(false)}
        onConfirm={handleAprobar}
        title="Aprobar Presupuesto"
        message="¿Estás seguro de que deseas aprobar este presupuesto? Esta acción confirmará tu aceptación del plan de tratamiento y sus costos."
        confirmText="Sí, Aprobar"
        cancelText="Cancelar"
        variant="success"
        loading={cargando}
      />

      {/* Modal de Rechazo con Notas */}
      {modalRechazarAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-red-100">
                    <X size={24} className="text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Rechazar Presupuesto</h3>
                </div>
                <button
                  onClick={() => {
                    setModalRechazarAbierto(false);
                    setNotasRechazo('');
                  }}
                  disabled={cargando}
                  className="text-gray-400 hover:text-gray-600 transition-all disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que deseas rechazar este presupuesto? Puedes agregar una nota opcional para la clínica.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MessageSquare size={16} className="inline mr-1" />
                  Notas (opcional)
                </label>
                <textarea
                  value={notasRechazo}
                  onChange={(e) => setNotasRechazo(e.target.value)}
                  placeholder="Explica el motivo del rechazo..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-red-400 px-3 py-2.5 resize-none"
                  rows={4}
                  disabled={cargando}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setModalRechazarAbierto(false);
                    setNotasRechazo('');
                  }}
                  disabled={cargando}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRechazar}
                  disabled={cargando}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cargando ? 'Procesando...' : 'Confirmar Rechazo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



