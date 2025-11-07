import { Calendar, User, FileText, Activity, CheckCircle, Clock } from 'lucide-react';
import { Postoperatorio } from '../api/postoperatorioApi';

interface PanelResumenCirugiaProps {
  postoperatorio: Postoperatorio;
}

export default function PanelResumenCirugia({ postoperatorio }: PanelResumenCirugiaProps) {
  const fechaInicio = new Date(postoperatorio.fechaInicio).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getEstadoColor = () => {
    return postoperatorio.estado === 'Activo'
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getEstadoIcon = () => {
    return postoperatorio.estado === 'Activo' ? (
      <Activity className="w-4 h-4" />
    ) : (
      <CheckCircle className="w-4 h-4" />
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Resumen de la Cirugía</h2>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getEstadoColor()}`}>
          {getEstadoIcon()}
          <span className="text-sm font-medium">{postoperatorio.estado}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Información del Paciente */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="bg-blue-100 p-2 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Paciente</p>
            <p className="text-sm font-semibold text-gray-900">
              {postoperatorio.paciente.nombre} {postoperatorio.paciente.apellidos || ''}
            </p>
          </div>
        </div>

        {/* Información del Tratamiento */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="bg-purple-100 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Tratamiento</p>
            <p className="text-sm font-semibold text-gray-900">
              {postoperatorio.tratamiento.nombre || postoperatorio.tratamiento.descripcion || 'Cirugía Oral'}
            </p>
          </div>
        </div>

        {/* Fecha de Inicio */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="bg-green-100 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Fecha de Inicio</p>
            <p className="text-sm font-semibold text-gray-900">{fechaInicio}</p>
          </div>
        </div>

        {/* Controles Realizados */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Controles Realizados</p>
            <p className="text-sm font-semibold text-gray-900">
              {postoperatorio.seguimientos?.length || 0} controles
            </p>
          </div>
        </div>
      </div>

      {/* Notas Iniciales */}
      {postoperatorio.notasIniciales && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 font-medium mb-2">Notas Iniciales</p>
          <p className="text-sm text-blue-900">{postoperatorio.notasIniciales}</p>
        </div>
      )}
    </div>
  );
}



