import { AlertTriangle, Calendar, Phone, Mail, MapPin, FileText, DollarSign, Clock, CheckCircle, TrendingUp, User, Heart } from 'lucide-react';
import { PerfilCompletoPaciente } from '../api/pacienteApi';

interface PacienteHeaderProps {
  paciente: PerfilCompletoPaciente;
}

export default function PacienteHeader({ paciente }: PacienteHeaderProps) {
  const calcularEdad = (fechaNacimiento?: string): number | null => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const edad = calcularEdad(paciente.fechaNacimiento);
  const nombreCompleto = `${paciente.nombre} ${paciente.apellidos}`;
  
  // Calcular estadísticas rápidas
  const totalCitas = paciente.citas?.length || 0;
  const citasRealizadas = paciente.citas?.filter(c => c.estado === 'realizada' || c.estado === 'completada').length || 0;
  const planesActivos = paciente.planesTratamiento?.filter(p => p.estado === 'activo').length || 0;
  const totalDocumentos = paciente.documentos?.length || 0;
  const proximaCita = paciente.citas?.find(c => c.estado === 'programada' || c.estado === 'confirmada');
  
  // Calcular años como paciente
  const añosComoPaciente = paciente.fechaAlta 
    ? Math.floor((new Date().getTime() - new Date(paciente.fechaAlta).getTime()) / (1000 * 60 * 60 * 24 * 365))
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      {/* Header principal */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-xl shadow-lg">
              <span className="text-white text-2xl font-bold">
                {paciente.nombre.charAt(0).toUpperCase()}{paciente.apellidos.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{nombreCompleto}</h1>
              <div className="flex items-center gap-4 mt-1 text-gray-600 flex-wrap">
                {paciente.dni && (
                  <span className="text-sm">
                    <span className="font-semibold">DNI:</span> {paciente.dni}
                  </span>
                )}
                {edad !== null && (
                  <span className="text-sm">
                    <span className="font-semibold">Edad:</span> {edad} años
                  </span>
                )}
                {paciente.genero && (
                  <span className="text-sm">
                    <span className="font-semibold">Género:</span> {paciente.genero}
                  </span>
                )}
                {añosComoPaciente > 0 && (
                  <span className="text-sm">
                    <span className="font-semibold">Paciente desde:</span> {añosComoPaciente} {añosComoPaciente === 1 ? 'año' : 'años'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Datos de contacto */}
          <div className="flex flex-wrap gap-4 mt-4">
            {paciente.datosContacto?.telefono && (
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{paciente.datosContacto.telefono}</span>
              </div>
            )}
            {paciente.datosContacto?.email && (
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{paciente.datosContacto.email}</span>
              </div>
            )}
            {paciente.datosContacto?.direccion && (
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{paciente.datosContacto.direccion}</span>
              </div>
            )}
            {paciente.contactoEmergencia?.nombre && (
              <div className="flex items-center gap-2 text-gray-700">
                <Heart className="w-4 h-4 text-red-600" />
                <span className="text-sm">
                  Emergencia: {paciente.contactoEmergencia.nombre} ({paciente.contactoEmergencia.relacion || 'Contacto'})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Panel de estadísticas rápidas */}
        <div className="flex flex-col gap-2 ml-4">
          {/* Saldo pendiente */}
          {paciente.saldo !== undefined && paciente.saldo !== 0 && (
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              paciente.saldo > 0 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <span className="text-sm">Saldo:</span>
              <div className="text-lg">{paciente.saldo.toFixed(2)} €</div>
            </div>
          )}
          
          {/* Próxima cita */}
          {proximaCita && (
            <div className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700">
                <Calendar className="w-4 h-4" />
                <div>
                  <div className="text-xs font-medium">Próxima cita</div>
                  <div className="text-sm font-semibold">
                    {new Date(proximaCita.fecha_hora_inicio).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas rápidas en tarjetas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Citas</p>
              <p className="text-xl font-bold text-blue-600">{totalCitas}</p>
            </div>
            <Calendar className="w-5 h-5 text-blue-500 opacity-50" />
          </div>
          <p className="text-xs text-gray-500 mt-1">{citasRealizadas} realizadas</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Planes Activos</p>
              <p className="text-xl font-bold text-green-600">{planesActivos}</p>
            </div>
            <FileText className="w-5 h-5 text-green-500 opacity-50" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {paciente.planesTratamiento?.filter(p => p.estado === 'completado').length || 0} completados
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Documentos</p>
              <p className="text-xl font-bold text-purple-600">{totalDocumentos}</p>
            </div>
            <FileText className="w-5 h-5 text-purple-500 opacity-50" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {paciente.documentos?.filter(d => d.tipo === 'Radiografía').length || 0} radiografías
          </p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Evoluciones</p>
              <p className="text-xl font-bold text-orange-600">{paciente.historiaClinica?.length || 0}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-orange-500 opacity-50" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Notas clínicas</p>
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
        {/* Datos de seguro */}
        {paciente.datosSeguro?.aseguradora && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Seguro Médico</span>
            </div>
            <p className="text-sm text-gray-600">{paciente.datosSeguro.aseguradora}</p>
            {paciente.datosSeguro.numeroPoliza && (
              <p className="text-xs text-gray-500 mt-1">Póliza: {paciente.datosSeguro.numeroPoliza}</p>
            )}
            {paciente.datosSeguro.tipoPlan && (
              <p className="text-xs text-gray-500">Plan: {paciente.datosSeguro.tipoPlan}</p>
            )}
          </div>
        )}

        {/* Fecha de alta y última visita */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Información de Registro</span>
          </div>
          {paciente.fechaAlta && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Alta:</span>{' '}
              {new Date(paciente.fechaAlta).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          )}
          {paciente.citas && paciente.citas.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Última visita:</span>{' '}
              {new Date(paciente.citas[0].fecha_hora_inicio).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>

      {/* Alertas médicas */}
      {paciente.alertasMedicas && paciente.alertasMedicas.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mt-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Alertas Médicas Importantes</h3>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {paciente.alertasMedicas.map((alerta, index) => (
              <li key={index} className="text-sm text-red-800">{alerta}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Alergias destacadas */}
      {paciente.historialMedico?.alergias && paciente.historialMedico.alergias.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mt-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">Alergias Registradas</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {paciente.historialMedico.alergias.map((alergia, index) => (
              <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {alergia}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


