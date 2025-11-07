import { useState, useEffect } from 'react';
import { X, Clock, User, Stethoscope, MapPin, FileText, Edit, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Cita, obtenerDetalleCita } from '../api/citasApi';

interface ModalDetalleCitaProps {
  citaId: string;
  onClose: () => void;
  onEdit?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function ModalDetalleCita({
  citaId,
  onClose,
  onEdit,
  onConfirm,
  onCancel,
}: ModalDetalleCitaProps) {
  const [cita, setCita] = useState<Cita | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        setLoading(true);
        const detalle = await obtenerDetalleCita(citaId);
        setCita(detalle);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el detalle de la cita');
      } finally {
        setLoading(false);
      }
    };

    cargarDetalle();
  }, [citaId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center text-gray-600">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (error || !cita) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Error</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-red-600 mb-4">{error || 'No se pudo cargar el detalle de la cita'}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const fechaInicio = new Date(cita.fecha_hora_inicio);
  const fechaFin = new Date(cita.fecha_hora_fin);
  
  const fechaFormateada = fechaInicio.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const horaInicio = fechaInicio.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const horaFin = fechaFin.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      programada: 'bg-blue-100 text-blue-800',
      confirmada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
      realizada: 'bg-gray-100 text-gray-800',
      'no-asistio': 'bg-orange-100 text-orange-800',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      programada: 'Programada',
      confirmada: 'Confirmada',
      cancelada: 'Cancelada',
      realizada: 'Realizada',
      'no-asistio': 'No Asistió',
    };
    return labels[estado] || estado;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Detalle de Cita</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Fecha y Hora</p>
                <p className="font-semibold text-gray-800">{fechaFormateada}</p>
                <p className="text-gray-600">{horaInicio} - {horaFin}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Duración: {cita.duracion_minutos || Math.round((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60))} minutos
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Estado</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(cita.estado)}`}>
                {getEstadoLabel(cita.estado)}
              </span>
            </div>
          </div>

          {/* Paciente */}
          <div className="flex items-start space-x-3">
            <User className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Paciente</p>
              <p className="font-semibold text-gray-800">
                {cita.paciente.nombre} {cita.paciente.apellidos}
              </p>
              {cita.paciente.telefono && (
                <p className="text-sm text-gray-600 mt-1">Tel: {cita.paciente.telefono}</p>
              )}
              {cita.paciente.email && (
                <p className="text-sm text-gray-600">Email: {cita.paciente.email}</p>
              )}
            </div>
          </div>

          {/* Profesional */}
          {cita.profesional && (
            <div className="flex items-start space-x-3">
              <Stethoscope className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Profesional</p>
                <p className="font-semibold text-gray-800">
                  {cita.profesional.nombre} {cita.profesional.apellidos}
                </p>
              </div>
            </div>
          )}

          {/* Sede y Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cita.sede && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Sede</p>
                  <p className="font-semibold text-gray-800">{cita.sede.nombre}</p>
                </div>
              </div>
            )}

            {cita.box_asignado && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Box / Gabinete</p>
                  <p className="font-semibold text-gray-800">Box {cita.box_asignado}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tratamiento */}
          {cita.tratamiento && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Tratamiento</p>
              <p className="font-semibold text-gray-800">{cita.tratamiento.nombre}</p>
            </div>
          )}

          {/* Notas */}
          {cita.notas && (
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">Notas</p>
                <p className="text-gray-700 whitespace-pre-wrap">{cita.notas}</p>
              </div>
            </div>
          )}

          {/* Historial de Cambios */}
          {cita.historial_cambios && cita.historial_cambios.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-3 font-medium">Historial de Cambios</p>
              <div className="space-y-2">
                {cita.historial_cambios.map((cambio, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">
                      {new Date(cambio.fecha).toLocaleString('es-ES')} - {cambio.usuario}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{cambio.cambio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información de Creación */}
          {cita.creadoPor && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Creado por: {cita.creadoPor.nombre}
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex flex-wrap gap-3">
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>

          {cita.estado === 'programada' && onConfirm && (
            <button
              onClick={onConfirm}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirmar</span>
            </button>
          )}

          {cita.estado !== 'cancelada' && onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancelar Cita</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}



