import { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Calendar, Briefcase, MapPin, GraduationCap } from 'lucide-react';
import { Empleado, NuevoEmpleado, crearEmpleado, actualizarEmpleado } from '../api/empleadosApi';

interface ModalGestionEmpleadoProps {
  empleado?: Empleado | null;
  onClose: () => void;
  onSave: () => void;
  sedes?: Array<{ _id: string; nombre: string }>;
}

export default function ModalGestionEmpleado({
  empleado,
  onClose,
  onSave,
  sedes = [],
}: ModalGestionEmpleadoProps) {
  const [formData, setFormData] = useState<NuevoEmpleado>({
    nombre: empleado?.nombre || '',
    apellidos: empleado?.apellidos || '',
    dni: empleado?.dni || '',
    email: empleado?.email || '',
    telefono: empleado?.telefono || '',
    fechaContratacion: empleado?.fechaContratacion
      ? new Date(empleado.fechaContratacion).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    rol: empleado?.rol || 'Asistente',
    sede: empleado?.sede?._id || '',
    estado: empleado?.estado || 'Activo',
    especialidad: empleado?.especialidad || '',
    numeroColegiado: empleado?.numeroColegiado || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles = [
    { value: 'Odontologo', label: 'Odontólogo' },
    { value: 'Asistente', label: 'Asistente' },
    { value: 'Recepcionista', label: 'Recepcionista' },
    { value: 'RR.HH.', label: 'RR.HH.' },
    { value: 'Gerente', label: 'Gerente' },
  ];

  const handleChange = (key: keyof NuevoEmpleado, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Preparar datos para enviar
      const datosEnvio: NuevoEmpleado = {
        ...formData,
        fechaContratacion: new Date(formData.fechaContratacion).toISOString(),
        sede: formData.sede || undefined,
        telefono: formData.telefono || undefined,
        especialidad: formData.especialidad || undefined,
        numeroColegiado: formData.numeroColegiado || undefined,
      };

      if (empleado?._id) {
        await actualizarEmpleado(empleado._id, datosEnvio);
      } else {
        await crearEmpleado(datosEnvio);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el empleado');
    } finally {
      setLoading(false);
    }
  };

  const esOdontologo = formData.rol === 'Odontologo';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {empleado ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos *
                </label>
                <input
                  type="text"
                  required
                  value={formData.apellidos}
                  onChange={(e) => handleChange('apellidos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DNI *
                </label>
                <input
                  type="text"
                  required
                  value={formData.dni}
                  onChange={(e) => handleChange('dni', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de Contratación *
                </label>
                <input
                  type="date"
                  required
                  value={formData.fechaContratacion}
                  onChange={(e) => handleChange('fechaContratacion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Información Profesional */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Información Profesional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  required
                  value={formData.rol}
                  onChange={(e) => handleChange('rol', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map((rol) => (
                    <option key={rol.value} value={rol.value}>
                      {rol.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Sede
                </label>
                <select
                  value={formData.sede || ''}
                  onChange={(e) => handleChange('sede', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sin sede asignada</option>
                  {sedes.map((sede) => (
                    <option key={sede._id} value={sede._id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {esOdontologo && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Especialidad
                    </label>
                    <input
                      type="text"
                      value={formData.especialidad}
                      onChange={(e) => handleChange('especialidad', e.target.value)}
                      placeholder="Ej: Ortodoncia, Implantología..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Colegiado
                    </label>
                    <input
                      type="text"
                      value={formData.numeroColegiado}
                      onChange={(e) => handleChange('numeroColegiado', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
              {empleado && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    required
                    value={formData.estado}
                    onChange={(e) => handleChange('estado', e.target.value as 'Activo' | 'Inactivo')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


