import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Edit, User, Briefcase, FileText, MapPin } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando ficha del empleado...</p>
        </div>
      </div>
    );
  }

  if (error || !empleado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {onVolver && (
            <button
              onClick={onVolver}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          )}
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error al cargar la ficha</p>
            <p className="mt-1">{error || 'Empleado no encontrado'}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {onVolver && (
            <button
              onClick={onVolver}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Listado
            </button>
          )}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-xl shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{nombreCompleto}</h1>
                  <p className="text-gray-600 mt-1">
                    {rol}
                    {especialidad && ` • ${especialidad}`}
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
                    {empleado.dni && (
                      <span className="text-sm text-gray-600">DNI: {empleado.dni}</span>
                    )}
                  </div>
                </div>
              </div>
              {!modoEdicion && (
                <button
                  onClick={() => setModoEdicion(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modo Edición */}
        {modoEdicion ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Editar Empleado</h2>
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
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-600 text-blue-600 bg-white'
                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contenido de las pestañas */}
              <div className="p-6">
                {activeTab === 'datos-personales' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
                        <p className="text-gray-900">{email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Teléfono</h3>
                        <p className="text-gray-900">{telefono}</p>
                      </div>
                      {empleado.fechaNacimiento && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Fecha de Nacimiento
                          </h3>
                          <p className="text-gray-900">
                            {new Date(empleado.fechaNacimiento).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      )}
                    </div>
                    {empleado.direccion && (
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          Dirección
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {empleado.direccion.calle && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Calle</h4>
                              <p className="text-gray-900">
                                {empleado.direccion.calle}
                                {empleado.direccion.numero && `, ${empleado.direccion.numero}`}
                              </p>
                            </div>
                          )}
                          {empleado.direccion.ciudad && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Ciudad</h4>
                              <p className="text-gray-900">{empleado.direccion.ciudad}</p>
                            </div>
                          )}
                          {empleado.direccion.provincia && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Provincia</h4>
                              <p className="text-gray-900">{empleado.direccion.provincia}</p>
                            </div>
                          )}
                          {empleado.direccion.codigoPostal && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Código Postal
                              </h4>
                              <p className="text-gray-900">{empleado.direccion.codigoPostal}</p>
                            </div>
                          )}
                          {empleado.direccion.pais && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">País</h4>
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
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Rol</h3>
                        <p className="text-gray-900">{rol}</p>
                      </div>
                      {especialidad && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Especialidad</h3>
                          <p className="text-gray-900">{especialidad}</p>
                        </div>
                      )}
                      {numeroColegiado && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Número de Colegiado
                          </h3>
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
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                          Tipo de Contrato
                        </h3>
                        <p className="text-gray-900">{tipoContrato}</p>
                      </div>
                      {salario && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Salario</h3>
                          <p className="text-gray-900">{salario.toLocaleString('es-ES')} €</p>
                        </div>
                      )}
                      {fechaInicio && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Fecha de Inicio</h3>
                          <p className="text-gray-900">
                            {new Date(fechaInicio).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      )}
                      {fechaFin && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Fecha de Fin</h3>
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


