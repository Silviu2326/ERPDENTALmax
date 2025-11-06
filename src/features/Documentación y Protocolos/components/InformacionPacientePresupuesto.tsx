import { User, Phone, Mail, CreditCard } from 'lucide-react';
import { PresupuestoParaFirma } from '../api/presupuestosApi';

interface InformacionPacientePresupuestoProps {
  presupuesto: PresupuestoParaFirma;
}

export default function InformacionPacientePresupuesto({
  presupuesto,
}: InformacionPacientePresupuestoProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Información del Paciente</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Nombre Completo</p>
            <p className="text-gray-900 font-medium">
              {presupuesto.paciente.nombre} {presupuesto.paciente.apellidos}
            </p>
          </div>
        </div>

        {presupuesto.paciente.dni && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">DNI</p>
              <p className="text-gray-900 font-medium">{presupuesto.paciente.dni}</p>
            </div>
          </div>
        )}

        {presupuesto.paciente.telefono && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Teléfono</p>
              <p className="text-gray-900 font-medium">{presupuesto.paciente.telefono}</p>
            </div>
          </div>
        )}

        {presupuesto.paciente.email && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Email</p>
              <p className="text-gray-900 font-medium">{presupuesto.paciente.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


