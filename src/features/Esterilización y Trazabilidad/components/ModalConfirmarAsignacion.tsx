import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { PacienteActivo, BandejaEsteril } from '../api/trazabilidadApi';

interface ModalConfirmarAsignacionProps {
  paciente: PacienteActivo;
  bandeja: BandejaEsteril;
  onConfirmar: () => void;
  onCancelar: () => void;
  loading?: boolean;
}

export default function ModalConfirmarAsignacion({
  paciente,
  bandeja,
  onConfirmar,
  onCancelar,
  loading = false,
}: ModalConfirmarAsignacionProps) {
  const fechaVencimiento = new Date(bandeja.fechaVencimiento);
  const ahora = new Date();
  const estaVencida = fechaVencimiento < ahora;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Confirmar Asignación</h3>
            <button
              onClick={onCancelar}
              disabled={loading}
              className="p-1 text-slate-400 hover:text-slate-600 transition-all rounded-lg disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Advertencia si está vencida */}
          {estaVencida && (
            <div className="mb-4 p-3 bg-red-50 ring-1 ring-red-200 rounded-2xl flex items-start space-x-2">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Bandeja vencida</p>
                <p className="text-sm text-red-700">
                  Esta bandeja ha vencido y no debería ser asignada. ¿Desea continuar?
                </p>
              </div>
            </div>
          )}

          {/* Información de la asignación */}
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-xl ring-1 ring-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-2">Paciente</p>
              <p className="text-lg font-semibold text-blue-900">
                {paciente.nombre} {paciente.apellidos}
              </p>
              {paciente.dni && <p className="text-sm text-blue-700 mt-1">DNI: {paciente.dni}</p>}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
              <p className="text-sm font-medium text-gray-800 mb-2">Bandeja</p>
              <p className="text-lg font-semibold text-gray-900">{bandeja.nombre}</p>
              <p className="text-sm text-gray-600 mt-1">Código: {bandeja.codigoUnico}</p>
              <p className="text-sm text-gray-600">
                Vence: {fechaVencimiento.toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>

          {/* Mensaje de confirmación */}
          <div className="mb-6 p-4 bg-yellow-50 ring-1 ring-yellow-200 rounded-2xl">
            <div className="flex items-start space-x-2">
              <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  ¿Está seguro de asignar esta bandeja al paciente?
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Esta acción registrará la asignación y cambiará el estado de la bandeja a 'En uso'.
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={onCancelar}
              disabled={loading}
              className="flex-1 px-4 py-2.5 ring-1 ring-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              disabled={loading || estaVencida}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>Confirmar Asignación</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



