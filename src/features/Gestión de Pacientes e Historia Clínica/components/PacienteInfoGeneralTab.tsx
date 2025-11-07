import { useState } from 'react';
import { Edit2, Save, X, User, Calendar, Phone, Mail, MapPin, AlertTriangle, Pill, TrendingUp, DollarSign } from 'lucide-react';
import { PerfilCompletoPaciente, InformacionGeneralPaciente, actualizarInformacionGeneral } from '../api/pacienteApi';

// Extender la interfaz para incluir campos adicionales
interface InformacionGeneralPacienteExtendida extends InformacionGeneralPaciente {
  contactoEmergencia?: {
    nombre?: string;
    telefono?: string;
    relacion?: string;
  };
  datosSeguro?: {
    aseguradora?: string;
    numeroPoliza?: string;
    tipoPlan?: string;
  };
}

interface PacienteInfoGeneralTabProps {
  paciente: PerfilCompletoPaciente;
  onUpdate: (paciente: PerfilCompletoPaciente) => void;
}

export default function PacienteInfoGeneralTab({ paciente, onUpdate }: PacienteInfoGeneralTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<InformacionGeneralPacienteExtendida>({
    nombre: paciente.nombre,
    apellidos: paciente.apellidos,
    fechaNacimiento: paciente.fechaNacimiento,
    genero: paciente.genero,
    dni: paciente.dni,
    datosContacto: {
      email: paciente.datosContacto?.email || '',
      telefono: paciente.datosContacto?.telefono || '',
      direccion: paciente.datosContacto?.direccion || '',
    },
    historialMedico: {
      alergias: paciente.historialMedico?.alergias || [],
      enfermedades: paciente.historialMedico?.enfermedades || [],
      medicacionActual: paciente.historialMedico?.medicacionActual || [],
    },
    alertasMedicas: paciente.alertasMedicas || [],
    notasAdministrativas: paciente.notasAdministrativas || '',
    contactoEmergencia: (paciente as any).contactoEmergencia || {},
    datosSeguro: (paciente as any).datosSeguro || {},
  });

  const handleSave = async () => {
    if (!paciente._id) return;

    setLoading(true);
    setError(null);

    try {
      const pacienteActualizado = await actualizarInformacionGeneral(paciente._id, formData);
      onUpdate(pacienteActualizado);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: paciente.nombre,
      apellidos: paciente.apellidos,
      fechaNacimiento: paciente.fechaNacimiento,
      genero: paciente.genero,
      dni: paciente.dni,
      datosContacto: {
        email: paciente.datosContacto?.email || '',
        telefono: paciente.datosContacto?.telefono || '',
        direccion: paciente.datosContacto?.direccion || '',
      },
      historialMedico: {
        alergias: paciente.historialMedico?.alergias || [],
        enfermedades: paciente.historialMedico?.enfermedades || [],
        medicacionActual: paciente.historialMedico?.medicacionActual || [],
      },
      alertasMedicas: paciente.alertasMedicas || [],
      notasAdministrativas: paciente.notasAdministrativas || '',
    });
    setIsEditing(false);
    setError(null);
  };

  const addAlergia = () => {
    const nueva = prompt('Ingrese la alergia:');
    if (nueva && nueva.trim()) {
      setFormData((prev) => ({
        ...prev,
        historialMedico: {
          ...prev.historialMedico,
          alergias: [...(prev.historialMedico?.alergias || []), nueva.trim()],
        },
      }));
    }
  };

  const removeAlergia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      historialMedico: {
        ...prev.historialMedico,
        alergias: prev.historialMedico?.alergias?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const addEnfermedad = () => {
    const nueva = prompt('Ingrese la enfermedad:');
    if (nueva && nueva.trim()) {
      setFormData((prev) => ({
        ...prev,
        historialMedico: {
          ...prev.historialMedico,
          enfermedades: [...(prev.historialMedico?.enfermedades || []), nueva.trim()],
        },
      }));
    }
  };

  const removeEnfermedad = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      historialMedico: {
        ...prev.historialMedico,
        enfermedades: prev.historialMedico?.enfermedades?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const addMedicacion = () => {
    const nueva = prompt('Ingrese la medicación:');
    if (nueva && nueva.trim()) {
      setFormData((prev) => ({
        ...prev,
        historialMedico: {
          ...prev.historialMedico,
          medicacionActual: [...(prev.historialMedico?.medicacionActual || []), nueva.trim()],
        },
      }));
    }
  };

  const removeMedicacion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      historialMedico: {
        ...prev.historialMedico,
        medicacionActual: prev.historialMedico?.medicacionActual?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Botones de acción */}
      <div className="flex justify-end">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 ring-1 ring-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Información personal */}
      <div className="bg-white shadow-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User size={20} className="text-blue-600" />
          Información Personal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            ) : (
              <p className="text-gray-900">{paciente.nombre}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Apellidos</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.apellidos}
                onChange={(e) => setFormData((prev) => ({ ...prev, apellidos: e.target.value }))}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            ) : (
              <p className="text-gray-900">{paciente.apellidos}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Nacimiento</label>
            {isEditing ? (
              <input
                type="date"
                value={formData.fechaNacimiento || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, fechaNacimiento: e.target.value }))}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            ) : (
              <p className="text-gray-900">
                {paciente.fechaNacimiento
                  ? new Date(paciente.fechaNacimiento).toLocaleDateString('es-ES')
                  : 'No especificada'}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">DNI</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.dni || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, dni: e.target.value }))}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            ) : (
              <p className="text-gray-900">{paciente.dni || 'No especificado'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Género</label>
            {isEditing ? (
              <select
                value={formData.genero || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, genero: e.target.value }))}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            ) : (
              <p className="text-gray-900">{paciente.genero || 'No especificado'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Datos de contacto */}
      <div className="bg-white shadow-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Phone size={20} className="text-blue-600" />
          Datos de Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.datosContacto.telefono}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    datosContacto: { ...prev.datosContacto, telefono: e.target.value },
                  }))
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            ) : (
              <p className="text-gray-900">{paciente.datosContacto?.telefono || 'No especificado'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.datosContacto.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    datosContacto: { ...prev.datosContacto, email: e.target.value },
                  }))
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            ) : (
              <p className="text-gray-900">{paciente.datosContacto?.email || 'No especificado'}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Dirección</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.datosContacto.direccion}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    datosContacto: { ...prev.datosContacto, direccion: e.target.value },
                  }))
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            ) : (
              <p className="text-gray-900">{paciente.datosContacto?.direccion || 'No especificada'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Anamnesis */}
      <div className="bg-white shadow-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Pill size={20} className="text-blue-600" />
          Anamnesis
        </h3>

        {/* Alergias */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Alergias</label>
            {isEditing && (
              <button
                onClick={addAlergia}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Añadir
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.historialMedico?.alergias?.length ? (
              formData.historialMedico.alergias.map((alergia, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {alergia}
                  {isEditing && (
                    <button
                      onClick={() => removeAlergia(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No hay alergias registradas</p>
            )}
          </div>
        </div>

        {/* Enfermedades */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Enfermedades</label>
            {isEditing && (
              <button
                onClick={addEnfermedad}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Añadir
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.historialMedico?.enfermedades?.length ? (
              formData.historialMedico.enfermedades.map((enfermedad, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                >
                  {enfermedad}
                  {isEditing && (
                    <button
                      onClick={() => removeEnfermedad(index)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No hay enfermedades registradas</p>
            )}
          </div>
        </div>

        {/* Medicación actual */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Medicación Actual</label>
            {isEditing && (
              <button
                onClick={addMedicacion}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Añadir
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.historialMedico?.medicacionActual?.length ? (
              formData.historialMedico.medicacionActual.map((medicacion, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {medicacion}
                  {isEditing && (
                    <button
                      onClick={() => removeMedicacion(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No hay medicación registrada</p>
            )}
          </div>
        </div>
      </div>

      {/* Contacto de emergencia */}
      <div className="bg-white shadow-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Contacto de Emergencia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.contactoEmergencia?.nombre || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactoEmergencia: { ...prev.contactoEmergencia, nombre: e.target.value },
                  }))
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Nombre del contacto"
              />
            ) : (
              <p className="text-gray-900">{paciente.contactoEmergencia?.nombre || 'No especificado'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.contactoEmergencia?.telefono || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactoEmergencia: { ...prev.contactoEmergencia, telefono: e.target.value },
                  }))
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Teléfono de emergencia"
              />
            ) : (
              <p className="text-gray-900">{paciente.contactoEmergencia?.telefono || 'No especificado'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Relación</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.contactoEmergencia?.relacion || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactoEmergencia: { ...prev.contactoEmergencia, relacion: e.target.value },
                  }))
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Ej: Cónyuge, Hijo/a, etc."
              />
            ) : (
              <p className="text-gray-900">{paciente.contactoEmergencia?.relacion || 'No especificado'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Datos de seguro */}
      <div className="bg-white shadow-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-green-600" />
          Datos de Seguro
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Aseguradora</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.datosSeguro?.aseguradora || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    datosSeguro: { ...prev.datosSeguro, aseguradora: e.target.value },
                  }))
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Nombre de la aseguradora"
              />
            ) : (
              <p className="text-gray-900">{paciente.datosSeguro?.aseguradora || 'No especificado'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Número de Póliza</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.datosSeguro?.numeroPoliza || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    datosSeguro: { ...prev.datosSeguro, numeroPoliza: e.target.value },
                  }))
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Número de póliza"
              />
            ) : (
              <p className="text-gray-900">{paciente.datosSeguro?.numeroPoliza || 'No especificado'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Plan</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.datosSeguro?.tipoPlan || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    datosSeguro: { ...prev.datosSeguro, tipoPlan: e.target.value },
                  }))
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Tipo de plan"
              />
            ) : (
              <p className="text-gray-900">{paciente.datosSeguro?.tipoPlan || 'No especificado'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas del paciente */}
      <div className="bg-white shadow-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Estadísticas y Resumen
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Total de Visitas</p>
            <p className="text-2xl font-bold text-blue-600">{paciente.citas?.length || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {paciente.citas?.filter(c => c.estado === 'realizada' || c.estado === 'completada').length || 0} realizadas
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Planes Activos</p>
            <p className="text-2xl font-bold text-green-600">
              {paciente.planesTratamiento?.filter(p => p.estado === 'activo').length || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {paciente.planesTratamiento?.filter(p => p.estado === 'completado').length || 0} completados
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Documentos</p>
            <p className="text-2xl font-bold text-purple-600">{paciente.documentos?.length || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {paciente.documentos?.filter(d => d.tipo === 'Radiografía').length || 0} radiografías
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Última Visita</p>
            <p className="text-sm font-semibold text-orange-600">
              {paciente.citas && paciente.citas.length > 0
                ? new Date(paciente.citas[0].fecha_hora_inicio).toLocaleDateString('es-ES')
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {paciente.citas && paciente.citas.length > 0
                ? `${Math.floor((new Date().getTime() - new Date(paciente.citas[0].fecha_hora_inicio).getTime()) / (1000 * 60 * 60 * 24))} días`
                : 'Sin visitas'}
            </p>
          </div>
        </div>
        
        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <p className="text-sm text-gray-600 mb-1">Citas Programadas</p>
            <p className="text-xl font-bold text-indigo-600">
              {paciente.citas?.filter(c => c.estado === 'programada' || c.estado === 'confirmada').length || 0}
            </p>
          </div>
          <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
            <p className="text-sm text-gray-600 mb-1">Evoluciones Clínicas</p>
            <p className="text-xl font-bold text-pink-600">
              {paciente.historiaClinica?.length || 0}
            </p>
          </div>
          <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
            <p className="text-sm text-gray-600 mb-1">Años como Paciente</p>
            <p className="text-xl font-bold text-teal-600">
              {paciente.fechaAlta 
                ? Math.floor((new Date().getTime() - new Date(paciente.fechaAlta).getTime()) / (1000 * 60 * 60 * 24 * 365))
                : 0}
            </p>
          </div>
        </div>

        {/* Estadísticas avanzadas de tratamientos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
            <p className="text-sm text-gray-600 mb-1">Tratamientos Completados</p>
            <p className="text-xl font-bold text-cyan-600">
              {paciente.planesTratamiento?.reduce((sum, plan) => {
                return sum + (plan.tratamientos?.filter((t: any) => t.estado === 'completado').length || 0);
              }, 0) || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">En todos los planes</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <p className="text-sm text-gray-600 mb-1">Tratamientos Pendientes</p>
            <p className="text-xl font-bold text-amber-600">
              {paciente.planesTratamiento?.reduce((sum, plan) => {
                return sum + (plan.tratamientos?.filter((t: any) => t.estado === 'pendiente').length || 0);
              }, 0) || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Por realizar</p>
          </div>
          <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
            <p className="text-sm text-gray-600 mb-1">Total Invertido</p>
            <p className="text-xl font-bold text-rose-600">
              {paciente.planesTratamiento?.reduce((sum, plan) => {
                if (!plan.tratamientos) return sum;
                return sum + plan.tratamientos.reduce((s: number, t: any) => {
                  return s + ((t.estado === 'completado' || t.estado === 'en-proceso') ? (t.costo || 0) : 0);
                }, 0);
              }, 0).toFixed(0) || 0}€
            </p>
            <p className="text-xs text-gray-500 mt-1">En tratamientos</p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <p className="text-sm text-gray-600 mb-1">Profesionales Únicos</p>
            <p className="text-xl font-bold text-violet-600">
              {new Set(paciente.citas?.map(c => c.profesional?._id).filter(Boolean) || []).size}
            </p>
            <p className="text-xs text-gray-500 mt-1">Que han atendido</p>
          </div>
        </div>

        {/* Resumen financiero rápido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Saldo Actual
                </p>
                <p className={`text-2xl font-bold ${(paciente.saldo || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(paciente.saldo || 0) >= 0 ? '+' : ''}
                  {(paciente.saldo || 0).toFixed(2)} €
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(paciente.saldo || 0) >= 0 ? 'A favor del paciente' : 'Pendiente de pago'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Próxima Cita
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {paciente.citas && paciente.citas.length > 0 && paciente.citas.find(c => c.estado === 'programada' || c.estado === 'confirmada')
                    ? new Date(paciente.citas.find(c => c.estado === 'programada' || c.estado === 'confirmada')!.fecha_hora_inicio).toLocaleDateString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Sin citas programadas'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {paciente.citas && paciente.citas.length > 0 && paciente.citas.find(c => c.estado === 'programada' || c.estado === 'confirmada')
                    ? `${Math.floor((new Date(paciente.citas.find(c => c.estado === 'programada' || c.estado === 'confirmada')!.fecha_hora_inicio).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días`
                    : ''}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Gráfico de evolución de visitas (últimos 6 meses) */}
        {paciente.citas && paciente.citas.length > 0 && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Evolución de Visitas (Últimos 6 meses)</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1, 0].map((mesesAtras) => {
                const fecha = new Date();
                fecha.setMonth(fecha.getMonth() - mesesAtras);
                const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
                const visitasMes = paciente.citas?.filter(c => {
                  const fechaCita = new Date(c.fecha_hora_inicio);
                  return fechaCita.getMonth() === fecha.getMonth() && fechaCita.getFullYear() === fecha.getFullYear();
                }).length || 0;
                const maxVisitas = Math.max(...[5, 4, 3, 2, 1, 0].map(m => {
                  const f = new Date();
                  f.setMonth(f.getMonth() - m);
                  return paciente.citas?.filter(c => {
                    const fechaCita = new Date(c.fecha_hora_inicio);
                    return fechaCita.getMonth() === f.getMonth() && fechaCita.getFullYear() === f.getFullYear();
                  }).length || 0;
                }), 1);
                const porcentaje = (visitasMes / maxVisitas) * 100;
                
                return (
                  <div key={mesKey} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">
                        {fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                      </span>
                      <span className="text-gray-900 font-semibold">{visitasMes} {visitasMes === 1 ? 'visita' : 'visitas'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Notas administrativas */}
      <div className="bg-white shadow-sm rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Notas Administrativas</h3>
        {isEditing ? (
          <textarea
            value={formData.notasAdministrativas || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, notasAdministrativas: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingrese notas administrativas..."
          />
        ) : (
          <div className="space-y-2">
            <p className="text-gray-900 whitespace-pre-wrap">
              {paciente.notasAdministrativas || 'No hay notas administrativas'}
            </p>
            {paciente.fechaAlta && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Fecha de alta:</span>{' '}
                  {new Date(paciente.fechaAlta).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Alertas médicas destacadas */}
      {paciente.alertasMedicas && paciente.alertasMedicas.length > 0 && (
        <div className="bg-red-50 rounded-lg shadow p-6 border-2 border-red-200">
          <h3 className="text-xl font-semibold text-red-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Alertas Médicas Importantes
          </h3>
          <div className="space-y-2">
            {paciente.alertasMedicas.map((alerta, index) => (
              <div key={index} className="flex items-start gap-2 bg-white rounded-lg p-3 border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 font-medium">{alerta}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

