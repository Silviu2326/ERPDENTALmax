import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, Briefcase, MapPin, GraduationCap, FileText, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Empleado, obtenerEmpleadoPorId } from '../api/empleadosApi';

interface ModalDetalleEmpleadoProps {
  empleadoId: string;
  onClose: () => void;
  onEdit?: () => void;
}

export default function ModalDetalleEmpleado({
  empleadoId,
  onClose,
  onEdit,
}: ModalDetalleEmpleadoProps) {
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        setLoading(true);
        const detalle = await obtenerEmpleadoPorId(empleadoId);
        setEmpleado(detalle);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el detalle del empleado');
      } finally {
        setLoading(false);
      }
    };

    cargarDetalle();
  }, [empleadoId]);

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

  if (error || !empleado) {
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
          <p className="text-red-600 mb-4">{error || 'No se pudo cargar el detalle del empleado'}</p>
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

  const fechaContratacion = new Date(empleado.fechaContratacion);
  const fechaFormateada = fechaContratacion.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getRolBadge = (rol: string) => {
    const colores: Record<string, { bg: string; text: string }> = {
      Odontologo: { bg: 'bg-blue-100', text: 'text-blue-800' },
      Asistente: { bg: 'bg-purple-100', text: 'text-purple-800' },
      Recepcionista: { bg: 'bg-green-100', text: 'text-green-800' },
      'RR.HH.': { bg: 'bg-orange-100', text: 'text-orange-800' },
      Gerente: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    };

    const color = colores[rol] || { bg: 'bg-gray-100', text: 'text-gray-800' };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color.bg} ${color.text}`}>
        {rol}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Detalle del Empleado</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header con avatar y estado */}
          <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {empleado.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {empleado.nombre} {empleado.apellidos}
              </h3>
              <p className="text-gray-600 mb-3">DNI: {empleado.dni}</p>
              <div className="flex items-center gap-3">
                {getRolBadge(empleado.rol)}
                {empleado.estado === 'Activo' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4" />
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <XCircle className="w-4 h-4" />
                    Inactivo
                  </span>
                )}
              </div>
            </div>
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
            )}
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Información de Contacto
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-800">{empleado.email}</p>
                </div>
              </div>
              {empleado.telefono && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="text-sm font-medium text-gray-800">{empleado.telefono}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información Profesional */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Información Profesional
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Fecha de Contratación</p>
                  <p className="text-sm font-medium text-gray-800">{fechaFormateada}</p>
                </div>
              </div>
              {empleado.sede && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Sede</p>
                    <p className="text-sm font-medium text-gray-800">{empleado.sede.nombre}</p>
                  </div>
                </div>
              )}
              {empleado.rol === 'Odontologo' && empleado.especialidad && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Especialidad</p>
                    <p className="text-sm font-medium text-gray-800">{empleado.especialidad}</p>
                  </div>
                </div>
              )}
              {empleado.rol === 'Odontologo' && empleado.numeroColegiado && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Número de Colegiado</p>
                    <p className="text-sm font-medium text-gray-800">{empleado.numeroColegiado}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información de Usuario */}
          {empleado.usuario && (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Acceso al Sistema
              </h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Usuario asociado</p>
                <p className="text-sm font-medium text-gray-800">{empleado.usuario.email}</p>
              </div>
            </div>
          )}

          {/* Botón de cerrar */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



