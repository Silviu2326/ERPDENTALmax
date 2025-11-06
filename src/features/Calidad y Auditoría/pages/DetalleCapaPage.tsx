import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Save, X, Calendar, User, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import {
  obtenerCapaPorId,
  actualizarCapa,
  subirAdjuntosCapa,
  Capa,
  ActualizarCapa,
  AccionCorrectiva,
  AccionPreventiva,
  VerificacionEfectividad,
} from '../api/capasApi';
import SeccionAnalisisCausaRaiz from '../components/SeccionAnalisisCausaRaiz';
import PlanDeAccionComponent from '../components/PlanDeAccionComponent';
import HistorialCapaTimeline from '../components/HistorialCapaTimeline';
import UploaderDocumentosCapa from '../components/UploaderDocumentosCapa';

interface DetalleCapaPageProps {
  capaId: string;
  onVolver: () => void;
}

const estadoBadgeClass = {
  Abierta: 'bg-yellow-100 text-yellow-800',
  'En Investigación': 'bg-blue-100 text-blue-800',
  'Acciones Definidas': 'bg-purple-100 text-purple-800',
  'En Implementación': 'bg-orange-100 text-orange-800',
  'Pendiente de Verificación': 'bg-indigo-100 text-indigo-800',
  Cerrada: 'bg-green-100 text-green-800',
};

const fuenteBadgeClass = {
  'Auditoría Interna': 'bg-blue-50 text-blue-700',
  'Queja de Paciente': 'bg-red-50 text-red-700',
  'Revisión de Equipo': 'bg-green-50 text-green-700',
  'Otro': 'bg-gray-50 text-gray-700',
};

export default function DetalleCapaPage({ capaId, onVolver }: DetalleCapaPageProps) {
  const [capa, setCapa] = useState<Capa | null>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responsables, setResponsables] = useState<
    Array<{ _id: string; nombre: string; apellidos?: string }>
  >([]);

  useEffect(() => {
    cargarCapa();
    cargarResponsables();
  }, [capaId]);

  const cargarCapa = async () => {
    try {
      setLoading(true);
      const capaData = await obtenerCapaPorId(capaId);
      setCapa(capaData);
    } catch (error) {
      console.error('Error al cargar CAPA:', error);
      setError('Error al cargar la CAPA');
    } finally {
      setLoading(false);
    }
  };

  const cargarResponsables = async () => {
    try {
      // TODO: Implementar llamada a API para obtener responsables
      setResponsables([
        { _id: '1', nombre: 'Juan', apellidos: 'Pérez' },
        { _id: '2', nombre: 'María', apellidos: 'García' },
      ]);
    } catch (error) {
      console.error('Error al cargar responsables:', error);
    }
  };

  const handleGuardar = async (datos: ActualizarCapa) => {
    if (!capa) return;

    try {
      setGuardando(true);
      await actualizarCapa(capa._id!, datos);
      await cargarCapa();
      setEditando(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      setError('Error al guardar los cambios');
      throw error;
    } finally {
      setGuardando(false);
    }
  };

  const handleSubirArchivos = async (archivos: File[]) => {
    if (!capa) return;
    await subirAdjuntosCapa(capa._id!, archivos);
    await cargarCapa();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando CAPA...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !capa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">{error || 'CAPA no encontrada'}</p>
            <button
              onClick={onVolver}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onVolver}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{capa.titulo}</h1>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    estadoBadgeClass[capa.estado]
                  }`}
                >
                  {capa.estado}
                </span>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    fuenteBadgeClass[capa.fuente]
                  }`}
                >
                  {capa.fuente}
                </span>
              </div>
              <p className="text-gray-600">
                ID: <span className="font-mono">{capa.id_capa}</span>
              </p>
            </div>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Editar
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información General
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del Incidente
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {capa.descripcion_incidente}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha de Detección
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {new Date(capa.fecha_deteccion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Responsable de Investigación
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {capa.responsable_investigacion
                          ? `${capa.responsable_investigacion.nombre} ${capa.responsable_investigacion.apellidos || ''}`
                          : 'Sin asignar'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Análisis de Causa Raíz */}
            {editando ? (
              <SeccionAnalisisCausaRaiz
                analisisCausaRaiz={capa.analisis_causa_raiz}
                onAnalisisChange={(analisis) => {
                  setCapa({ ...capa, analisis_causa_raiz: analisis });
                }}
              />
            ) : (
              <SeccionAnalisisCausaRaiz
                analisisCausaRaiz={capa.analisis_causa_raiz}
                onAnalisisChange={() => {}}
                readonly={true}
              />
            )}

            {/* Plan de Acción */}
            <PlanDeAccionComponent
              capa={capa}
              responsables={responsables}
              readonly={!editando}
            />

            {/* Verificación de Efectividad */}
            {capa.verificacion_efectividad && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Verificación de Efectividad
                    </h3>
                    <p className="text-sm text-gray-500">
                      Resultado de la verificación de las acciones implementadas
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {capa.verificacion_efectividad.descripcion}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Resultado:</span>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        capa.verificacion_efectividad.resultado === 'Efectiva'
                          ? 'bg-green-100 text-green-800'
                          : capa.verificacion_efectividad.resultado === 'No Efectiva'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {capa.verificacion_efectividad.resultado}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Documentos */}
            <UploaderDocumentosCapa
              documentos={capa.documentos_adjuntos}
              onSubirArchivos={handleSubirArchivos}
              readonly={!editando}
            />
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            {/* Historial */}
            <HistorialCapaTimeline historial={capa.historial || []} />
          </div>
        </div>

        {/* Botones de Acción */}
        {editando && (
          <div className="mt-6 flex items-center justify-end gap-4 bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <button
              onClick={() => {
                setEditando(false);
                cargarCapa();
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              disabled={guardando}
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
            <button
              onClick={async () => {
                try {
                  await handleGuardar({
                    analisis_causa_raiz: capa.analisis_causa_raiz,
                    accion_correctiva: capa.accion_correctiva,
                    accion_preventiva: capa.accion_preventiva,
                    verificacion_efectividad: capa.verificacion_efectividad,
                  });
                } catch (error) {
                  // Error ya manejado en handleGuardar
                }
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={guardando}
            >
              <Save className="w-5 h-5" />
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


