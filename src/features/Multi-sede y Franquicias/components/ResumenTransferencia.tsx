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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <FileText className="h-5 w-5 text-blue-600" />
        <span>Resumen de la Transferencia</span>
      </h3>

      <div className="space-y-4">
        {/* Información del paciente */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <User className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-gray-800">Paciente</h4>
          </div>
          <div className="pl-8 space-y-1">
            <p className="text-gray-900 font-semibold">
              {paciente.nombre} {paciente.apellidos}
            </p>
            {paciente.documentoIdentidad && (
              <p className="text-sm text-gray-600">DNI: {paciente.documentoIdentidad}</p>
            )}
            {paciente.telefono && (
              <p className="text-sm text-gray-600">Teléfono: {paciente.telefono}</p>
            )}
          </div>
        </div>

        {/* Transferencia de sedes */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-gray-800">Transferencia</h4>
          </div>
          <div className="pl-8">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Sede Origen</p>
                <p className="font-semibold text-gray-900">{sedeOrigen.nombre}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Sede Destino</p>
                <p className="font-semibold text-blue-600">{sedeDestino.nombre}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivo (si existe) */}
        {motivo && motivo.trim() && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-gray-800">Motivo</h4>
            </div>
            <div className="pl-8">
              <p className="text-sm text-gray-700">{motivo}</p>
            </div>
          </div>
        )}

        {/* Información importante */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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


