import { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Eye, Settings, Save } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Configuración de Plantillas</h2>
            <p className="text-gray-600 text-sm mt-1">
              Gestiona las plantillas de mensajes y la automatización de recordatorios
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            <button
              onClick={() => setVistaActiva('plantillas')}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                vistaActiva === 'plantillas'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              Plantillas de Mensajes
            </button>
            <button
              onClick={() => setVistaActiva('configuracion')}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                vistaActiva === 'configuracion'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              Configuración de Automatización
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {vistaActiva === 'plantillas' && (
            <div className="space-y-6">
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
                  <div className="flex justify-end">
                    <button
                      onClick={handleCrearPlantilla}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Nueva Plantilla
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : plantillas.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No hay plantillas creadas</p>
                      <button
                        onClick={handleCrearPlantilla}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Crear la primera plantilla
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {plantillas.map((plantilla) => (
                        <div
                          key={plantilla._id}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">{plantilla.nombre}</h3>
                              <div className="mt-2">{getTipoBadge(plantilla.tipo)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setPlantillaVistaPrevia(plantilla)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditarPlantilla(plantilla)}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => plantilla._id && handleEliminarPlantilla(plantilla._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                            {plantilla.cuerpo.substring(0, 100)}
                            {plantilla.cuerpo.length > 100 ? '...' : ''}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span
                              className={`px-2 py-1 rounded ${
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
            <div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : configuracion ? (
                <FormularioConfiguracionAutomatizacion
                  configuracion={configuracion}
                  plantillas={plantillas.filter((p) => p.activo)}
                  onGuardar={handleGuardarConfiguracion}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No se pudo cargar la configuración</p>
                </div>
              )}
            </div>
          )}
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


