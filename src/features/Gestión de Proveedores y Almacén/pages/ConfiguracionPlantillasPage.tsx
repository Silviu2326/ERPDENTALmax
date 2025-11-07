import { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Eye, Settings, Save, Loader2, Package, AlertCircle } from 'lucide-react';
import {
  RecordatorioPlantilla,
  ConfiguracionRecordatorio,
} from '../api/recordatoriosApi';
import EditorPlantillasMensajes from '../components/EditorPlantillasMensajes';
import FormularioConfiguracionAutomatizacion from '../components/FormularioConfiguracionAutomatizacion';
import ModalVistaPreviaMensaje from '../components/ModalVistaPreviaMensaje';

type VistaActiva = 'plantillas' | 'configuracion';

export default function ConfiguracionPlantillasPage() {
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>('plantillas');
  const [plantillas, setPlantillas] = useState<RecordatorioPlantilla[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionRecordatorio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [plantillaEditando, setPlantillaEditando] = useState<RecordatorioPlantilla | undefined>();
  const [plantillaVistaPrevia, setPlantillaVistaPrevia] = useState<RecordatorioPlantilla | null>(
    null
  );

  useEffect(() => {
    if (vistaActiva === 'plantillas') {
      cargarPlantillas();
    } else {
      cargarConfiguracion();
    }
  }, [vistaActiva]);

  const cargarPlantillas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos completos de plantillas
      const data: RecordatorioPlantilla[] = [
        {
          _id: '1',
          nombre: 'Recordatorio SMS 24h',
          tipo: 'SMS',
          cuerpo: 'Recordatorio: Tienes una cita mañana a las {{hora}} con {{profesional}}. Confirma tu asistencia respondiendo CONFIRMAR.',
          variables: ['hora', 'profesional', 'fecha', 'paciente'],
          activo: true,
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-02-15T14:30:00Z',
        },
        {
          _id: '2',
          nombre: 'Recordatorio Email 48h',
          tipo: 'Email',
          asunto: 'Recordatorio de cita - {{fecha}}',
          cuerpo: 'Estimado/a {{paciente}},\n\nLe recordamos que tiene una cita programada el {{fecha}} a las {{hora}} con {{profesional}}.\n\nPor favor, confirme su asistencia respondiendo a este email.\n\nSaludos cordiales,\nEquipo Clínica Dental',
          variables: ['paciente', 'fecha', 'hora', 'profesional'],
          activo: true,
          createdAt: '2024-01-12T10:00:00Z',
          updatedAt: '2024-03-01T11:20:00Z',
        },
        {
          _id: '3',
          nombre: 'Recordatorio WhatsApp 24h',
          tipo: 'WhatsApp',
          cuerpo: '👋 Hola {{paciente}}!\n\nTe recordamos que tienes una cita mañana a las {{hora}} con {{profesional}}.\n\n¿Confirmas tu asistencia? Responde SÍ o NO.',
          variables: ['paciente', 'hora', 'profesional', 'fecha'],
          activo: true,
          createdAt: '2024-01-15T11:30:00Z',
          updatedAt: '2024-02-20T16:45:00Z',
        },
        {
          _id: '4',
          nombre: 'Recordatorio SMS 48h',
          tipo: 'SMS',
          cuerpo: 'Recordatorio: Tienes una cita el {{fecha}} a las {{hora}}. Confirma respondiendo CONFIRMAR o CANCELAR.',
          variables: ['fecha', 'hora', 'paciente'],
          activo: true,
          createdAt: '2024-01-20T08:00:00Z',
          updatedAt: '2024-02-25T10:15:00Z',
        },
        {
          _id: '5',
          nombre: 'Recordatorio Email Semanal',
          tipo: 'Email',
          asunto: 'Recordatorio: Cita próxima semana',
          cuerpo: 'Estimado/a {{paciente}},\n\nLe recordamos que tiene una cita programada para el {{fecha}} a las {{hora}}.\n\nSi necesita cambiar o cancelar su cita, por favor contáctenos con al menos 24 horas de antelación.\n\nSaludos,\nClínica Dental',
          variables: ['paciente', 'fecha', 'hora', 'profesional'],
          activo: false,
          createdAt: '2024-01-25T12:00:00Z',
          updatedAt: '2024-02-10T09:30:00Z',
        },
        {
          _id: '6',
          nombre: 'Recordatorio WhatsApp 48h',
          tipo: 'WhatsApp',
          cuerpo: 'Hola {{paciente}} 👋\n\nRecordatorio: Cita el {{fecha}} a las {{hora}} con {{profesional}}.\n\nConfirma con SÍ o cancela con NO.',
          variables: ['paciente', 'fecha', 'hora', 'profesional'],
          activo: true,
          createdAt: '2024-02-01T10:00:00Z',
          updatedAt: '2024-03-05T13:20:00Z',
        },
        {
          _id: '7',
          nombre: 'Recordatorio Email Urgente',
          tipo: 'Email',
          asunto: 'URGENTE: Recordatorio de cita hoy',
          cuerpo: 'Estimado/a {{paciente}},\n\nURGENTE: Le recordamos que tiene una cita HOY a las {{hora}} con {{profesional}}.\n\nPor favor, confirme su asistencia lo antes posible.\n\nGracias.',
          variables: ['paciente', 'hora', 'profesional'],
          activo: true,
          createdAt: '2024-02-05T14:00:00Z',
          updatedAt: '2024-02-28T15:00:00Z',
        },
        {
          _id: '8',
          nombre: 'Recordatorio SMS Urgente',
          tipo: 'SMS',
          cuerpo: 'URGENTE: Cita HOY a las {{hora}}. Confirma con CONFIRMAR.',
          variables: ['hora', 'paciente'],
          activo: true,
          createdAt: '2024-02-08T09:00:00Z',
          updatedAt: '2024-03-01T10:30:00Z',
        },
      ];
      
      setPlantillas(data);
    } catch (err) {
      setError('Error al cargar las plantillas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Datos falsos de configuración
      const data: ConfiguracionRecordatorio = {
        activado: true,
        reglas_envio: [
          {
            tiempo_antes: 24,
            unidad: 'horas',
            plantillaId: '1',
          },
          {
            tiempo_antes: 48,
            unidad: 'horas',
            plantillaId: '2',
          },
          {
            tiempo_antes: 7,
            unidad: 'dias',
            plantillaId: '2',
          },
        ],
        canales_activos: ['SMS', 'Email', 'WhatsApp'],
        plantilla_defecto_id: '1',
        webhooks: {
          twilio_sid: 'AC1234567890abcdef',
        },
      };
      
      setConfiguracion(data);
    } catch (err) {
      setError('Error al cargar la configuración');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearPlantilla = () => {
    setPlantillaEditando(undefined);
    setMostrarEditor(true);
  };

  const handleEditarPlantilla = (plantilla: RecordatorioPlantilla) => {
    setPlantillaEditando(plantilla);
    setMostrarEditor(true);
  };

  const handleEliminarPlantilla = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) {
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simular eliminación
        console.log('Eliminando plantilla:', id);
        cargarPlantillas();
      } catch (err: any) {
        alert(err.message || 'Error al eliminar la plantilla');
        console.error(err);
      }
    }
  };

  const handleGuardarPlantilla = async (
    plantilla: Omit<RecordatorioPlantilla, '_id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (plantillaEditando?._id) {
        // Simular actualización
        console.log('Actualizando plantilla:', plantillaEditando._id, plantilla);
      } else {
        // Simular creación
        console.log('Creando nueva plantilla:', plantilla);
      }
      setMostrarEditor(false);
      setPlantillaEditando(undefined);
      cargarPlantillas();
    } catch (err: any) {
      alert(err.message || 'Error al guardar la plantilla');
      console.error(err);
    }
  };

  const handleGuardarConfiguracion = async (
    nuevaConfiguracion: Partial<ConfiguracionRecordatorio>
  ) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 600));
      // Simular actualización
      console.log('Guardando configuración:', nuevaConfiguracion);
      await cargarConfiguracion();
      alert('Configuración guardada correctamente');
    } catch (err: any) {
      alert(err.message || 'Error al guardar la configuración');
      console.error(err);
    }
  };

  const getTipoBadge = (tipo: string) => {
    const tipos: Record<string, { label: string; className: string }> = {
      SMS: { label: 'SMS', className: 'bg-blue-100 text-blue-800 border-blue-300' },
      Email: { label: 'Email', className: 'bg-green-100 text-green-800 border-green-300' },
      WhatsApp: {
        label: 'WhatsApp',
        className: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      },
    };
    const config = tipos[tipo] || tipos.SMS;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Settings size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Configuración de Plantillas
                </h1>
                <p className="text-gray-600">
                  Gestiona las plantillas de mensajes y la automatización de recordatorios
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Tabs */}
        <div className="bg-white shadow-sm p-0 rounded-lg">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              <button
                onClick={() => setVistaActiva('plantillas')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  vistaActiva === 'plantillas'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <FileText size={18} className={vistaActiva === 'plantillas' ? 'opacity-100' : 'opacity-70'} />
                <span>Plantillas de Mensajes</span>
              </button>
              <button
                onClick={() => setVistaActiva('configuracion')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  vistaActiva === 'configuracion'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Settings size={18} className={vistaActiva === 'configuracion' ? 'opacity-100' : 'opacity-70'} />
                <span>Configuración de Automatización</span>
              </button>
            </div>
          </div>

          <div className="px-4 pb-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {vistaActiva === 'plantillas' && (
              <div className="mt-6 space-y-6">
                {mostrarEditor ? (
                  <EditorPlantillasMensajes
                    plantilla={plantillaEditando}
                    onGuardar={handleGuardarPlantilla}
                    onCancelar={() => {
                      setMostrarEditor(false);
                      setPlantillaEditando(undefined);
                    }}
                  />
                ) : (
                  <>
                    {/* Toolbar */}
                    <div className="flex items-center justify-end">
                      <button
                        onClick={handleCrearPlantilla}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Plus size={20} />
                        Nueva Plantilla
                      </button>
                    </div>

                    {/* Estados de carga y vacío */}
                    {loading ? (
                      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-600">Cargando...</p>
                      </div>
                    ) : plantillas.length === 0 ? (
                      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                        <Package size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay plantillas creadas</h3>
                        <p className="text-gray-600 mb-4">Comienza creando tu primera plantilla de mensaje</p>
                        <button
                          onClick={handleCrearPlantilla}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Plus size={20} />
                          Crear la primera plantilla
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plantillas.map((plantilla) => (
                          <div
                            key={plantilla._id}
                            className="bg-white shadow-sm rounded-lg p-4 h-full flex flex-col transition-shadow hover:shadow-md overflow-hidden"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{plantilla.nombre}</h3>
                                <div>{getTipoBadge(plantilla.tipo)}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setPlantillaVistaPrevia(plantilla)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  aria-label="Vista previa"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleEditarPlantilla(plantilla)}
                                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                  aria-label="Editar"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => plantilla._id && handleEliminarPlantilla(plantilla._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  aria-label="Eliminar"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                              {plantilla.cuerpo.substring(0, 100)}
                              {plantilla.cuerpo.length > 100 ? '...' : ''}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                              <span
                                className={`px-2 py-1 rounded-full font-medium ${
                                  plantilla.activo
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {plantilla.activo ? 'Activa' : 'Inactiva'}
                              </span>
                              <span>
                                {plantilla.variables?.length || 0} variables
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {vistaActiva === 'configuracion' && (
              <div className="mt-6">
                {loading ? (
                  <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                    <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-600">Cargando...</p>
                  </div>
                ) : configuracion ? (
                  <FormularioConfiguracionAutomatizacion
                    configuracion={configuracion}
                    plantillas={plantillas.filter((p) => p.activo)}
                    onGuardar={handleGuardarConfiguracion}
                  />
                ) : (
                  <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
                    <p className="text-gray-600 mb-4">No se pudo cargar la configuración</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de vista previa */}
      {plantillaVistaPrevia && (
        <ModalVistaPreviaMensaje
          plantilla={plantillaVistaPrevia}
          onCerrar={() => setPlantillaVistaPrevia(null)}
        />
      )}
    </div>
  );
}


