import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Briefcase, MapPin, GraduationCap, DollarSign, FileText } from 'lucide-react';
import {
  Empleado,
  Direccion,
  DatosProfesionales,
  DatosContractuales,
  crearEmpleado,
  actualizarEmpleado,
  NuevoEmpleado,
} from '../api/empleadosApi';

interface EmpleadoFormProps {
  empleado?: Empleado | null;
  onSave: (empleado: Empleado) => void;
  onCancel?: () => void;
  clinicas?: Array<{ _id: string; nombre: string }>;
}

export default function EmpleadoForm({
  empleado,
  onSave,
  onCancel,
  clinicas = [],
}: EmpleadoFormProps) {
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: empleado?.nombre || '',
    apellidos: empleado?.apellidos || '',
    dni: empleado?.dni || '',
    fechaNacimiento: empleado?.fechaNacimiento
      ? new Date(empleado.fechaNacimiento).toISOString().split('T')[0]
      : '',
    email: empleado?.contacto?.email || empleado?.email || '',
    telefono: empleado?.contacto?.telefono || empleado?.telefono || '',
    // Dirección
    calle: empleado?.direccion?.calle || '',
    numero: empleado?.direccion?.numero || '',
    ciudad: empleado?.direccion?.ciudad || '',
    provincia: empleado?.direccion?.provincia || '',
    codigoPostal: empleado?.direccion?.codigoPostal || '',
    pais: empleado?.direccion?.pais || 'España',
    // Datos profesionales
    rol: (empleado?.datosProfesionales?.rol || empleado?.rol || 'Asistente') as DatosProfesionales['rol'],
    especialidad: empleado?.datosProfesionales?.especialidad || empleado?.especialidad || '',
    numeroColegiado: empleado?.datosProfesionales?.numeroColegiado || empleado?.numeroColegiado || '',
    // Datos contractuales
    tipoContrato: empleado?.datosContractuales?.tipoContrato || 'Indefinido',
    salario: empleado?.datosContractuales?.salario?.toString() || '',
    fechaInicio: empleado?.datosContractuales?.fechaInicio
      ? new Date(empleado.datosContractuales.fechaInicio).toISOString().split('T')[0]
      : empleado?.fechaContratacion
        ? new Date(empleado.fechaContratacion).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    fechaFin: empleado?.datosContractuales?.fechaFin
      ? new Date(empleado.datosContractuales.fechaFin).toISOString().split('T')[0]
      : '',
    // Clínicas asignadas
    clinicasAsignadas: empleado?.clinicasAsignadas?.map((c) => c._id) || [],
    // Estado
    activo: empleado?.activo !== undefined ? empleado.activo : empleado?.estado !== 'Inactivo',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles = [
    { value: 'Odontologo' as const, label: 'Odontólogo' },
    { value: 'Asistente' as const, label: 'Asistente' },
    { value: 'Recepcionista' as const, label: 'Recepcionista' },
    { value: 'Higienista' as const, label: 'Higienista' },
    { value: 'RR.HH.' as const, label: 'RR.HH.' },
    { value: 'Gerente' as const, label: 'Gerente' },
  ];

  const tiposContrato = [
    { value: 'Indefinido' as const, label: 'Indefinido' },
    { value: 'Temporal' as const, label: 'Temporal' },
    { value: 'Practicas' as const, label: 'Prácticas' },
    { value: 'Otro' as const, label: 'Otro' },
  ];

  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleClinica = (clinicaId: string) => {
    setFormData((prev) => ({
      ...prev,
      clinicasAsignadas: prev.clinicasAsignadas.includes(clinicaId)
        ? prev.clinicasAsignadas.filter((id) => id !== clinicaId)
        : [...prev.clinicasAsignadas, clinicaId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Preparar datos según estructura nueva
      const direccion: Direccion = {
        calle: formData.calle || undefined,
        numero: formData.numero || undefined,
        ciudad: formData.ciudad || undefined,
        provincia: formData.provincia || undefined,
        codigoPostal: formData.codigoPostal || undefined,
        pais: formData.pais || undefined,
      };

      const datosProfesionales: DatosProfesionales = {
        rol: formData.rol,
        especialidad: formData.especialidad || undefined,
        numeroColegiado: formData.numeroColegiado || undefined,
      };

      const datosContractuales: DatosContractuales = {
        tipoContrato: formData.tipoContrato,
        salario: formData.salario ? parseFloat(formData.salario) : undefined,
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: formData.fechaFin ? new Date(formData.fechaFin).toISOString() : undefined,
      };

      const datosEnvio: Partial<Empleado> & NuevoEmpleado = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        dni: formData.dni,
        fechaNacimiento: formData.fechaNacimiento ? new Date(formData.fechaNacimiento).toISOString() : undefined,
        direccion: Object.keys(direccion).some((k) => direccion[k as keyof Direccion]) ? direccion : undefined,
        contacto: {
          email: formData.email,
          telefono: formData.telefono || undefined,
        },
        datosProfesionales,
        datosContractuales,
        clinicasAsignadas: formData.clinicasAsignadas.length > 0 ? formData.clinicasAsignadas.map((id) => ({
          _id: id,
          nombre: clinicas.find((c) => c._id === id)?.nombre || '',
        })) : undefined,
        activo: formData.activo,
        // Campos legacy para compatibilidad
        email: formData.email,
        telefono: formData.telefono || undefined,
        fechaContratacion: formData.fechaInicio,
        rol: formData.rol,
        especialidad: formData.especialidad || undefined,
        numeroColegiado: formData.numeroColegiado || undefined,
        estado: formData.activo ? 'Activo' : 'Inactivo',
      };

      let empleadoGuardado: Empleado;
      if (empleado?._id) {
        empleadoGuardado = await actualizarEmpleado(empleado._id, datosEnvio);
      } else {
        empleadoGuardado = await crearEmpleado(datosEnvio as NuevoEmpleado);
      }

      onSave(empleadoGuardado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el empleado');
    } finally {
      setLoading(false);
    }
  };

  const esOdontologo = formData.rol === 'Odontologo';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Sección: Datos Personales */}
      <div className="bg-white shadow-sm p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          Datos Personales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Apellidos *
            </label>
            <input
              type="text"
              required
              value={formData.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              DNI *
            </label>
            <input
              type="text"
              required
              value={formData.dni}
              onChange={(e) => handleChange('dni', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Mail size={16} className="inline mr-1" />
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Phone size={16} className="inline mr-1" />
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
        </div>

        {/* Dirección */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <MapPin size={16} className="inline mr-1 text-blue-600" />
            Dirección
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Calle
                </label>
                <input
                  type="text"
                  value={formData.calle}
                  onChange={(e) => handleChange('calle', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Número
                </label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => handleChange('numero', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={(e) => handleChange('ciudad', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Provincia
              </label>
              <input
                type="text"
                value={formData.provincia}
                onChange={(e) => handleChange('provincia', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Código Postal
              </label>
              <input
                type="text"
                value={formData.codigoPostal}
                onChange={(e) => handleChange('codigoPostal', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                País
              </label>
              <input
                type="text"
                value={formData.pais}
                onChange={(e) => handleChange('pais', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Datos Profesionales */}
      <div className="bg-white shadow-sm p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          Datos Profesionales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rol *
            </label>
            <select
              required
              value={formData.rol}
              onChange={(e) => handleChange('rol', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              {roles.map((rol) => (
                <option key={rol.value} value={rol.value}>
                  {rol.label}
                </option>
              ))}
            </select>
          </div>
          {esOdontologo && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <GraduationCap size={16} className="inline mr-1" />
                  Especialidad
                </label>
                <input
                  type="text"
                  value={formData.especialidad}
                  onChange={(e) => handleChange('especialidad', e.target.value)}
                  placeholder="Ej: Ortodoncia, Implantología..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Número de Colegiado
                </label>
                <input
                  type="text"
                  value={formData.numeroColegiado}
                  onChange={(e) => handleChange('numeroColegiado', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sección: Datos Contractuales */}
      <div className="bg-white shadow-sm p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          Datos Contractuales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Contrato *
            </label>
            <select
              required
              value={formData.tipoContrato}
              onChange={(e) => handleChange('tipoContrato', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              {tiposContrato.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <DollarSign size={16} className="inline mr-1" />
              Salario (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.salario}
              onChange={(e) => handleChange('salario', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Calendar size={16} className="inline mr-1" />
              Fecha de Inicio *
            </label>
            <input
              type="date"
              required
              value={formData.fechaInicio}
              onChange={(e) => handleChange('fechaInicio', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de Fin (si aplica)
            </label>
            <input
              type="date"
              value={formData.fechaFin}
              onChange={(e) => handleChange('fechaFin', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
        </div>
      </div>

      {/* Sección: Clínicas Asignadas */}
      {clinicas.length > 0 && (
        <div className="bg-white shadow-sm p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            Clínicas Asignadas
          </h3>
          <div className="space-y-2">
            {clinicas.map((clinica) => (
              <label
                key={clinica._id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.clinicasAsignadas.includes(clinica._id)}
                  onChange={() => handleToggleClinica(clinica._id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{clinica.nombre}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Estado */}
      {empleado && (
        <div className="bg-white shadow-sm p-6 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => handleChange('activo', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">Empleado Activo</span>
          </label>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : 'Guardar Empleado'}
        </button>
      </div>
    </form>
  );
}



