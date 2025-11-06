import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Compare2, Calendar, FileText } from 'lucide-react';
import TimelineEtapasTratamiento from '../components/TimelineEtapasTratamiento';
import GaleriaDiagnosticoOrtodoncia from '../components/GaleriaDiagnosticoOrtodoncia';
import UploaderArchivosDiagnostico from '../components/UploaderArchivosDiagnostico';
import ComparadorImagenesSideBySide from '../components/ComparadorImagenesSideBySide';
import {
  obtenerDiagnosticosPorPaciente,
  crearDiagnosticoConArchivos,
  eliminarDiagnosticoCompleto,
  eliminarArchivo,
  actualizarMetadataArchivo,
  OrtodonciaDiagnostico,
} from '../api/ortodonciaDiagnosticoApi';

interface OrtodonciaDiagnosticoPageProps {
  pacienteId?: string;
  onVolver?: () => void;
}

export default function OrtodonciaDiagnosticoPage({
  pacienteId: pacienteIdProp,
  onVolver,
}: OrtodonciaDiagnosticoPageProps) {
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [diagnosticos, setDiagnosticos] = useState<OrtodonciaDiagnostico[]>([]);
  const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] = useState<string | null>(null);
  const [mostrarModalSubida, setMostrarModalSubida] = useState(false);
  const [mostrarComparador, setMostrarComparador] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para el formulario de nuevo diagnóstico
  const [nuevaFecha, setNuevaFecha] = useState(new Date().toISOString().split('T')[0]);
  const [nuevaEtapa, setNuevaEtapa] = useState<'Inicial' | 'Progreso' | 'Final' | 'Retención'>('Inicial');
  const [nuevasNotas, setNuevasNotas] = useState('');
  const [archivosParaSubir, setArchivosParaSubir] = useState<Array<{ file: File; tipo: string; subtipo?: string }>>([]);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (pacienteId) {
      cargarDiagnosticos();
    }
  }, [pacienteId]);

  const cargarDiagnosticos = async () => {
    if (!pacienteId) return;

    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerDiagnosticosPorPaciente(pacienteId);
      setDiagnosticos(datos);
      // Seleccionar el primer diagnóstico si existe
      if (datos.length > 0 && !diagnosticoSeleccionado) {
        setDiagnosticoSeleccionado(datos[0]._id || null);
      }
    } catch (err) {
      console.error('Error al cargar diagnósticos:', err);
      setError('Error al cargar los diagnósticos. Por favor, intente nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const handleCrearDiagnostico = async () => {
    if (!pacienteId) {
      setError('Debe seleccionar un paciente');
      return;
    }

    if (archivosParaSubir.length === 0) {
      setError('Debe seleccionar al menos un archivo');
      return;
    }

    setSubiendo(true);
    setError(null);
    try {
      const archivos = archivosParaSubir.map(item => item.file);
      const nuevoDiagnostico = await crearDiagnosticoConArchivos(pacienteId, {
        fecha: new Date(nuevaFecha),
        etapa: nuevaEtapa,
        notas: nuevasNotas || undefined,
        archivos,
      });

      // Actualizar metadata de los archivos si es necesario
      for (let i = 0; i < archivosParaSubir.length; i++) {
        const archivo = archivosParaSubir[i];
        if (archivo.tipo || archivo.subtipo) {
          const archivoCreado = nuevoDiagnostico.archivos[i];
          if (archivoCreado._id) {
            await actualizarMetadataArchivo(nuevoDiagnostico._id!, archivoCreado._id, {
              tipo: archivo.tipo,
              subtipo: archivo.subtipo,
            });
          }
        }
      }

      // Recargar diagnósticos
      await cargarDiagnosticos();
      
      // Limpiar formulario
      setArchivosParaSubir([]);
      setNuevaFecha(new Date().toISOString().split('T')[0]);
      setNuevaEtapa('Inicial');
      setNuevasNotas('');
      setMostrarModalSubida(false);
    } catch (err) {
      console.error('Error al crear diagnóstico:', err);
      setError('Error al crear el diagnóstico. Por favor, intente nuevamente.');
    } finally {
      setSubiendo(false);
    }
  };

  const handleEliminarDiagnostico = async (diagnosticoId: string) => {
    if (!confirm('¿Está seguro de eliminar este diagnóstico completo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await eliminarDiagnosticoCompleto(diagnosticoId);
      await cargarDiagnosticos();
      if (diagnosticoSeleccionado === diagnosticoId) {
        setDiagnosticoSeleccionado(null);
      }
    } catch (err) {
      console.error('Error al eliminar diagnóstico:', err);
      setError('Error al eliminar el diagnóstico. Por favor, intente nuevamente.');
    }
  };

  const handleEliminarArchivo = async (archivoId: string) => {
    const diagnostico = diagnosticos.find(d => d.archivos.some(a => a._id === archivoId));
    if (!diagnostico || !diagnostico._id) return;

    try {
      await eliminarArchivo(diagnostico._id, archivoId);
      await cargarDiagnosticos();
    } catch (err) {
      console.error('Error al eliminar archivo:', err);
      setError('Error al eliminar el archivo. Por favor, intente nuevamente.');
    }
  };

  const handleEditarArchivo = async (archivoId: string, metadata: { tipo?: string; subtipo?: string }) => {
    const diagnostico = diagnosticos.find(d => d.archivos.some(a => a._id === archivoId));
    if (!diagnostico || !diagnostico._id) return;

    try {
      await actualizarMetadataArchivo(diagnostico._id, archivoId, metadata);
      await cargarDiagnosticos();
    } catch (err) {
      console.error('Error al actualizar archivo:', err);
      setError('Error al actualizar el archivo. Por favor, intente nuevamente.');
    }
  };

  const diagnosticoActual = diagnosticos.find(d => d._id === diagnosticoSeleccionado);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Ortodoncia: Diagnóstico</h1>
                <p className="text-sm text-gray-600">Gestión de fotos, modelos y registros diagnósticos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMostrarComparador(true)}
                disabled={diagnosticos.length < 2}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Compare2 className="w-5 h-5" />
                <span>Comparar</span>
              </button>
              <button
                onClick={() => setMostrarModalSubida(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Añadir Registro</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {!pacienteId ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Por favor, seleccione un paciente para ver sus diagnósticos</p>
          </div>
        ) : cargando ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Cargando diagnósticos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda: Timeline */}
            <div className="lg:col-span-1">
              <TimelineEtapasTratamiento
                diagnosticos={diagnosticos}
                diagnosticoSeleccionado={diagnosticoSeleccionado || undefined}
                onSeleccionarDiagnostico={(id) => setDiagnosticoSeleccionado(id)}
                onEliminarDiagnostico={handleEliminarDiagnostico}
              />
            </div>

            {/* Columna derecha: Galería */}
            <div className="lg:col-span-2">
              {diagnosticoActual ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {diagnosticoActual.etapa}
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(diagnosticoActual.fecha).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{diagnosticoActual.archivos.length} archivo(s)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {diagnosticoActual.notas && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-700">{diagnosticoActual.notas}</p>
                      </div>
                    )}
                  </div>
                  <GaleriaDiagnosticoOrtodoncia
                    diagnostico={diagnosticoActual}
                    onEliminarArchivo={handleEliminarArchivo}
                    onEditarArchivo={handleEditarArchivo}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">
                    {diagnosticos.length === 0
                      ? 'No hay diagnósticos registrados. Haga clic en "Añadir Registro" para comenzar.'
                      : 'Seleccione un diagnóstico de la línea de tiempo para ver los archivos.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de subida de archivos */}
      {mostrarModalSubida && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Añadir Nuevo Registro de Diagnóstico</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Formulario */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={nuevaFecha}
                    onChange={(e) => setNuevaFecha(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etapa
                  </label>
                  <select
                    value={nuevaEtapa}
                    onChange={(e) => setNuevaEtapa(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Inicial">Inicial</option>
                    <option value="Progreso">Progreso</option>
                    <option value="Final">Final</option>
                    <option value="Retención">Retención</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={nuevasNotas}
                  onChange={(e) => setNuevasNotas(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Observaciones y notas sobre este diagnóstico..."
                />
              </div>

              {/* Uploader de archivos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivos
                </label>
                <UploaderArchivosDiagnostico
                  archivos={archivosParaSubir}
                  onArchivosChange={setArchivosParaSubir}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setMostrarModalSubida(false);
                  setArchivosParaSubir([]);
                  setNuevasNotas('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={subiendo}
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearDiagnostico}
                disabled={subiendo || archivosParaSubir.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {subiendo ? 'Subiendo...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparador de imágenes */}
      {mostrarComparador && (
        <ComparadorImagenesSideBySide
          diagnosticos={diagnosticos}
          onCerrar={() => setMostrarComparador(false)}
        />
      )}
    </div>
  );
}


