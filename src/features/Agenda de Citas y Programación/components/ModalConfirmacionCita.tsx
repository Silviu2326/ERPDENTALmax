import { X, Calendar, User, Stethoscope, Clock, FileText, Check } from 'lucide-react';
import { Paciente, Profesional, Tratamiento, SlotDisponibilidad } from '../api/citasApi';

interface ModalConfirmacionCitaProps {
  paciente: Paciente | null;
  profesional: Profesional | null;
  tratamiento: Tratamiento | null;
  slot: SlotDisponibilidad | null;
  notas?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ModalConfirmacionCita({
  paciente,
  profesional,
  tratamiento,
  slot,
  notas,
  onConfirmar,
  onCancelar,
}: ModalConfirmacionCitaProps) {
  if (!paciente || !profesional || !slot) {
    return null;
  }

  const fechaInicio = new Date(slot.start);
  const fechaFin = new Date(slot.end);

  const formatFechaHora = (fecha: Date) => {
    return fecha.toLocaleString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuracion = () => {
    const minutos = Math.round((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60));
    return `${minutos} minutos`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Check className="w-6 h-6" />
            <span>Confirmar Cita</span>
          </h2>
          <button
            onClick={onCancelar}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Por favor, revisa los detalles de la cita antes de confirmar:
            </p>
          </div>

          <div className="space-y-3">
            {/* Paciente */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase font-medium">Paciente</p>
                <p className="text-gray-900 font-semibold">
                  {paciente.nombre} {paciente.apellidos}
                </p>
                {paciente.telefono && (
                  <p className="text-sm text-gray-600">Tel: {paciente.telefono}</p>
                )}
              </div>
            </div>

            {/* Profesional */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Stethoscope className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase font-medium">Profesional</p>
                <p className="text-gray-900 font-semibold">
                  {profesional.nombre} {profesional.apellidos}
                </p>
                <p className="text-sm text-gray-600">{profesional.rol}</p>
              </div>
            </div>

            {/* Tratamiento */}
            {tratamiento && (
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">Tratamiento</p>
                  <p className="text-gray-900 font-semibold">{tratamiento.nombre}</p>
                  <p className="text-sm text-gray-600">
                    Duración: {tratamiento.duracionEstimadaMinutos} minutos
                  </p>
                </div>
              </div>
            )}

            {/* Fecha y Hora */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase font-medium">Fecha y Hora</p>
                <p className="text-gray-900 font-semibold">
                  {formatFechaHora(fechaInicio)}
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-sm text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuracion()}
                  </p>
                </div>
              </div>
            </div>

            {/* Notas */}
            {notas && (
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">Notas</p>
                  <p className="text-gray-900 text-sm">{notas}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar Cita</span>
          </button>
        </div>
      </div>
    </div>
  );
}


