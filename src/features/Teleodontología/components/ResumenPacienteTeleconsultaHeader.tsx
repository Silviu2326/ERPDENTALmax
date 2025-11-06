import { User, Phone, Mail, Calendar, FileText } from 'lucide-react';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: string;
  dni?: string;
}

interface Teleconsulta {
  motivoConsulta?: string;
  fechaHoraInicio: string;
}

interface ResumenPacienteTeleconsultaHeaderProps {
  paciente: Paciente;
  teleconsulta: Teleconsulta;
}

export default function ResumenPacienteTeleconsultaHeader({
  paciente,
  teleconsulta,
}: ResumenPacienteTeleconsultaHeaderProps) {
  const calcularEdad = (fechaNacimiento?: string): number | null => {
    if (!fechaNacimiento) return null;
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const formatearFecha = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const edad = calcularEdad(paciente.fechaNacimiento);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="bg-blue-600 rounded-full p-3 shadow-md">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {paciente.nombre} {paciente.apellidos}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {paciente.dni && (
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">DNI:</span>
                  <span>{paciente.dni}</span>
                </div>
              )}
              {edad !== null && (
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  <span>{edad} años</span>
                </div>
              )}
              {paciente.telefono && (
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  <span>{paciente.telefono}</span>
                </div>
              )}
              {paciente.email && (
                <div className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  <span>{paciente.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-blue-200">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Información de la Consulta</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600">Fecha y Hora:</span>
                <p className="text-gray-900">{formatearFecha(teleconsulta.fechaHoraInicio)}</p>
              </div>
              {teleconsulta.motivoConsulta && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Motivo de Consulta:</span>
                  <p className="text-gray-900">{teleconsulta.motivoConsulta}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


