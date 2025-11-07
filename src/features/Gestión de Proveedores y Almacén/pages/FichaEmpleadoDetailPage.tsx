import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Edit, User, Briefcase, FileText, MapPin, AlertCircle } from 'lucide-react';
import {
  Empleado,
  obtenerEmpleadoPorId,
  obtenerDocumentosEmpleado,
  DocumentoEmpleado,
} from '../api/empleadosApi';
import EmpleadoForm from '../components/EmpleadoForm';
import DocumentosEmpleadoSection from '../components/DocumentosEmpleadoSection';

type TabType = 'datos-personales' | 'datos-profesionales' | 'datos-contractuales' | 'documentos';

interface FichaEmpleadoDetailPageProps {
  empleadoId: string;
  onVolver?: () => void;
  clinicas?: Array<{ _id: string; nombre: string }>;
}

export default function FichaEmpleadoDetailPage({
  empleadoId,
  onVolver,
  clinicas = [],
}: FichaEmpleadoDetailPageProps) {
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoEmpleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('datos-personales');
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    const cargarEmpleado = async () => {
      if (!empleadoId) {
        setError('ID de empleado no proporcionado');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const empleadoData = await obtenerEmpleadoPorId(empleadoId);
        setEmpleado(empleadoData);

        // Cargar documentos
        try {
          const documentosData = await obtenerDocumentosEmpleado(empleadoId);
          setDocumentos(documentosData);
        } catch (err) {
          console.error('Error al cargar documentos:', err);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la ficha del empleado');
      } finally {
        setLoading(false);
      }
    };

    cargarEmpleado();
  }, [empleadoId]);

  const handleUpdate = (empleadoActualizado: Empleado) => {
    setEmpleado(empleadoActualizado);
    setModoEdicion(false);
  };

  const handleDocumentosActualizados = async () => {
    try {
      const documentosData = await obtenerDocumentosEmpleado(empleadoId);
      setDocumentos(documentosData);
    } catch (err) {
      console.error('Error al recargar documentos:', err);
    }
  };

  const tabs = [
    { id: 'datos-personales' as TabType, label: 'Datos Personales', icon: User },
    { id: 'datos-profesionales' as TabType, label: 'Datos Profesionales', icon: Briefcase },
    { id: 'datos-contractuales' as TabType, label: 'Datos Contractuales', icon: FileText },
    { id: 'documentos' as TabType, label: 'Documentos', icon: FileText },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando ficha del empleado...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !empleado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          {onVolver && (
            <button
              onClick={onVolver}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          )}
          <div className="bg-white shadow-sm p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error || 'Empleado no encontrado'}</p>
          </div>
        </div>
      </div>
    );
  }

  const nombreCompleto = `${empleado.nombre} ${empleado.apellidos}`;
  const email = empleado.contacto?.email || empleado.email || 'No especificado';
  const telefono = empleado.contacto?.telefono || empleado.telefono || 'No especificado';
  const rol = empleado.datosProfesionales?.rol || empleado.rol || 'No especificado';
  const especialidad = empleado.datosProfesionales?.especialidad || empleado.especialidad;
  const numeroColegiado = empleado.datosProfesionales?.numeroColegiado || empleado.numeroColegiado;
  const tipoContrato = empleado.datosContractuales?.tipoContrato || 'No especificado';
  const salario = empleado.datosContractuales?.salario;
  const fechaInicio = empleado.datosContractuales?.fechaInicio || empleado.fechaContratacion;
  const fechaFin = empleado.datosContractuales?.fechaFin;
  const activo = empleado.activo !== undefined ? empleado.activo : empleado.estado !== 'Inactivo';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-6"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <User size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {nombreCompleto}
                  </h1>
                  <p className="text-gray-600">
                    {rol}
                    {especialidad && ` • ${especialidad}`}
                    {empleado.dni && ` • DNI: ${empleado.dni}`}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
              {!modoEdicion && (
                <button
                  onClick={() => setModoEdicion(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={20} className="mr-2" />
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">

        {/* Modo Edición */}
        {modoEdicion ? (
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Editar Empleado</h2>
              <button
                onClick={() => setModoEdicion(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancelar
              </button>
            </div>
            <EmpleadoForm
              empleado={empleado}
              onSave={handleUpdate}
              onCancel={() => setModoEdicion(false)}
              clinicas={clinicas}
            />
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="bg-white shadow-sm p-0">
              <div className="px-4 py-3">
                <div
                  role="tablist"
                  aria-label="Secciones"
                  className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
                >
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contenido de las pestañas */}
              <div className="px-4 pb-4">
                {activeTab === 'datos-personales' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <p className="text-gray-900">{email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
                        <p className="text-gray-900">{telefono}</p>
                      </div>
                      {empleado.fechaNacimiento && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Fecha de Nacimiento
                          </label>
                          <p className="text-gray-900">
                            {new Date(empleado.fechaNacimiento).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      )}
                    </div>
                    {empleado.direccion && (
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                          <MapPin size={16} className="inline mr-1" />
                          Dirección
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {empleado.direccion.calle && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Calle</label>
                              <p className="text-gray-900">
                                {empleado.direccion.calle}
                                {empleado.direccion.numero && `, ${empleado.direccion.numero}`}
                              </p>
                            </div>
                          )}
                          {empleado.direccion.ciudad && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Ciudad</label>
                              <p className="text-gray-900">{empleado.direccion.ciudad}</p>
                            </div>
                          )}
                          {empleado.direccion.provincia && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Provincia</label>
                              <p className="text-gray-900">{empleado.direccion.provincia}</p>
                            </div>
                          )}
                          {empleado.direccion.codigoPostal && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Código Postal
                              </label>
                              <p className="text-gray-900">{empleado.direccion.codigoPostal}</p>
                            </div>
                          )}
                          {empleado.direccion.pais && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">País</label>
                              <p className="text-gray-900">{empleado.direccion.pais}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'datos-profesionales' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rol</label>
                        <p className="text-gray-900">{rol}</p>
                      </div>
                      {especialidad && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Especialidad</label>
                          <p className="text-gray-900">{especialidad}</p>
                        </div>
                      )}
                      {numeroColegiado && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Número de Colegiado
                          </label>
                          <p className="text-gray-900">{numeroColegiado}</p>
                        </div>
                      )}
                    </div>
                    {empleado.clinicasAsignadas && empleado.clinicasAsignadas.length > 0 && (
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Clínicas Asignadas
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {empleado.clinicasAsignadas.map((clinica) => (
                            <span
                              key={clinica._id}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {clinica.nombre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'datos-contractuales' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Tipo de Contrato
                        </label>
                        <p className="text-gray-900">{tipoContrato}</p>
                      </div>
                      {salario && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Salario</label>
                          <p className="text-gray-900">{salario.toLocaleString('es-ES')} €</p>
                        </div>
                      )}
                      {fechaInicio && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Inicio</label>
                          <p className="text-gray-900">
                            {new Date(fechaInicio).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      )}
                      {fechaFin && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Fin</label>
                          <p className="text-gray-900">
                            {new Date(fechaFin).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'documentos' && (
                  <DocumentosEmpleadoSection
                    empleadoId={empleadoId}
                    documentos={documentos}
                    onDocumentosActualizados={handleDocumentosActualizados}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}



