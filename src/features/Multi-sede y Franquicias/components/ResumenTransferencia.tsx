import { Building2, User, ArrowRight, Calendar, FileText } from 'lucide-react';
import { PacienteGlobal, Sede } from '../api/transferenciaApi';

interface ResumenTransferenciaProps {
  paciente: PacienteGlobal;
  sedeOrigen: { _id: string; nombre: string };
  sedeDestino: Sede;
  motivo?: string;
}

export default function ResumenTransferencia({
  paciente,
  sedeOrigen,
  sedeDestino,
  motivo,
}: ResumenTransferenciaProps) {
  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <FileText size={20} className="text-blue-600" />
        <span>Resumen de la Transferencia</span>
      </h3>

      <div className="space-y-4">
        {/* Información del paciente */}
        <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <User size={18} className="text-blue-600" />
            <h4 className="font-medium text-gray-900">Paciente</h4>
          </div>
          <div className="pl-8 space-y-1">
            <p className="text-gray-900 font-semibold">
              {paciente.nombre} {paciente.apellidos}
            </p>
            {paciente.documentoIdentidad && (
              <p className="text-sm text-slate-600">DNI: {paciente.documentoIdentidad}</p>
            )}
            {paciente.telefono && (
              <p className="text-sm text-slate-600">Teléfono: {paciente.telefono}</p>
            )}
          </div>
        </div>

        {/* Transferencia de sedes */}
        <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <Building2 size={18} className="text-blue-600" />
            <h4 className="font-medium text-gray-900">Transferencia</h4>
          </div>
          <div className="pl-8">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-xs text-slate-600 mb-1">Sede Origen</p>
                <p className="font-semibold text-gray-900">{sedeOrigen.nombre}</p>
              </div>
              <ArrowRight size={20} className="text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-slate-600 mb-1">Sede Destino</p>
                <p className="font-semibold text-blue-600">{sedeDestino.nombre}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivo (si existe) */}
        {motivo && motivo.trim() && (
          <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
            <div className="flex items-center space-x-3 mb-2">
              <FileText size={18} className="text-blue-600" />
              <h4 className="font-medium text-gray-900">Motivo</h4>
            </div>
            <div className="pl-8">
              <p className="text-sm text-slate-700">{motivo}</p>
            </div>
          </div>
        )}

        {/* Información importante */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 ring-1 ring-yellow-200/70">
          <p className="text-sm text-yellow-800">
            <strong>Importante:</strong> Esta acción transferirá el historial completo del paciente
            incluyendo tratamientos, citas, planes de tratamiento, radiografías, documentos y estado
            financiero. La transferencia quedará registrada en el historial del paciente.
          </p>
        </div>
      </div>
    </div>
  );
}



