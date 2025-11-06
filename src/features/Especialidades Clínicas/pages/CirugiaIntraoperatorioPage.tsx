import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Square, AlertCircle, User, Calendar, Stethoscope, FileText, Image as ImageIcon } from 'lucide-react';
import VitalSignsMonitor from '../components/intraoperatorio/VitalSignsMonitor';
import SurgicalPhaseTimer from '../components/intraoperatorio/SurgicalPhaseTimer';
import IntraopNoteTaker from '../components/intraoperatorio/IntraopNoteTaker';
import MaterialConsumptionLog from '../components/intraoperatorio/MaterialConsumptionLog';
import SurgicalSafetyChecklist from '../components/intraoperatorio/SurgicalSafetyChecklist';
import {
  obtenerDatosPreoperatorios,
  iniciarRegistroIntraoperatorio,
  actualizarRegistroIntraoperatorio,
  agregarEventoIntraoperatorio,
  agregarMaterialUtilizado,
  finalizarRegistroIntraoperatorio,
  Cirugia,
  RegistroIntraoperatorio,
  SignoVital,
  MaterialUtilizado,
} from '../api/cirugiaApi';

interface CirugiaIntraoperatorioPageProps {
  cirugiaId?: string;
  pacienteId?: string;
  onVolver?: () => void;
}

export default function CirugiaIntraoperatorioPage({
  cirugiaId: cirugiaIdProp,
  pacienteId,
  onVolver,
}: CirugiaIntraoperatorioPageProps) {
  const [cirugiaId, setCirugiaId] = useState(cirugiaIdProp || '');
  const [cirugia, setCirugia] = useState<Cirugia | null>(null);
  const [registroIntraoperatorio, setRegistroIntraoperatorio] = useState<RegistroIntraoperatorio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cirugiaIniciada, setCirugiaIniciada] = useState(false);

  // Cargar datos preoperatorios
  useEffect(() => {
    if (cirugiaId) {
      cargarDatosPreoperatorios();
    }
  }, [cirugiaId]);

  const cargarDatosPreoperatorios = async () => {
    if (!cirugiaId) return;

    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerDatosPreoperatorios(cirugiaId);
      setCirugia(datos);
      if (datos.registroIntraoperatorio) {
        setRegistroIntraoperatorio(datos.registroIntraoperatorio);
        setCirugiaIniciada(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos de la cirugía');
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarCirugia = async () => {
    if (!cirugiaId) {
      alert('Por favor ingrese un ID de cirugía');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const registro = await iniciarRegistroIntraoperatorio(cirugiaId);
      setRegistroIntraoperatorio(registro);
      setCirugiaIniciada(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar la cirugía');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarCirugia = async () => {
    if (!cirugiaId || !registroIntraoperatorio) return;

    const confirmacion = window.confirm('¿Está seguro de que desea finalizar la cirugía? Esta acción no se puede deshacer.');
    if (!confirmacion) return;

    setLoading(true);
    setError(null);
    try {
      await finalizarRegistroIntraoperatorio(cirugiaId, registroIntraoperatorio);
      alert('Cirugía finalizada exitosamente');
      if (onVolver) {
        onVolver();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al finalizar la cirugía');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarSignoVital = async (signo: Omit<SignoVital, 'hora'>) => {
    if (!cirugiaId || !registroIntraoperatorio) return;

    const nuevosSignos = [
      ...registroIntraoperatorio.signosVitales,
      { ...signo, hora: new Date() },
    ];

    const registroActualizado = {
      ...registroIntraoperatorio,
      signosVitales: nuevosSignos,
    };

    setRegistroIntraoperatorio(registroActualizado);

    try {
      await actualizarRegistroIntraoperatorio(cirugiaId, registroActualizado);
    } catch (err) {
      console.error('Error al guardar signo vital:', err);
      alert('Error al guardar el signo vital');
    }
  };

  const handleAgregarEvento = async (descripcion: string) => {
    if (!cirugiaId) return;

    try {
      const eventos = await agregarEventoIntraoperatorio(cirugiaId, descripcion);
      setRegistroIntraoperatorio((prev) =>
        prev
          ? {
              ...prev,
              eventos: eventos.map((e) => ({
                ...e,
                hora: new Date(e.hora),
              })),
            }
          : null
      );
    } catch (err) {
      console.error('Error al agregar evento:', err);
      alert('Error al agregar el evento');
    }
  };

  const handleAgregarMaterial = async (productoId: string, cantidad: number) => {
    if (!cirugiaId) return;

    try {
      const materiales = await agregarMaterialUtilizado(cirugiaId, productoId, cantidad);
      setRegistroIntraoperatorio((prev) =>
        prev
          ? {
              ...prev,
              materialesUtilizados: materiales,
            }
          : null
      );
    } catch (err) {
      console.error('Error al agregar material:', err);
      alert('Error al agregar el material');
    }
  };

  const handleEliminarMaterial = (index: number) => {
    if (!registroIntraoperatorio) return;

    const nuevosMateriales = registroIntraoperatorio.materialesUtilizados.filter((_, i) => i !== index);
    setRegistroIntraoperatorio({
      ...registroIntraoperatorio,
      materialesUtilizados: nuevosMateriales,
    });

    // Actualizar en el servidor
    actualizarRegistroIntraoperatorio(cirugiaId, {
      materialesUtilizados: nuevosMateriales,
    }).catch((err) => {
      console.error('Error al eliminar material:', err);
    });
  };

  const handleNotasChange = async (notas: string) => {
    if (!cirugiaId || !registroIntraoperatorio) return;

    const registroActualizado = {
      ...registroIntraoperatorio,
      notas,
    };

    setRegistroIntraoperatorio(registroActualizado);
  };

  const handleAutoSave = async () => {
    if (!cirugiaId || !registroIntraoperatorio) return;

    try {
      await actualizarRegistroIntraoperatorio(cirugiaId, registroIntraoperatorio);
    } catch (err) {
      console.error('Error en autoguardado:', err);
    }
  };

  const handleChecklistChange = async (completado: boolean) => {
    if (!cirugiaId || !registroIntraoperatorio) return;

    const registroActualizado = {
      ...registroIntraoperatorio,
      checklistCompletado: completado,
    };

    setRegistroIntraoperatorio(registroActualizado);

    try {
      await actualizarRegistroIntraoperatorio(cirugiaId, registroActualizado);
    } catch (err) {
      console.error('Error al actualizar checklist:', err);
    }
  };

  if (loading && !cirugia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos de la cirugía...</p>
        </div>
      </div>
    );
  }

  if (!cirugiaId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cirugía Oral: Intraoperatorio</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">ID de la Cirugía</label>
              <input
                type="text"
                value={cirugiaId}
                onChange={(e) => setCirugiaId(e.target.value)}
                placeholder="Ingrese el ID de la cirugía"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={cargarDatosPreoperatorios}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cargar Cirugía
              </button>
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Volver
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-800">Cirugía Oral: Intraoperatorio</h1>
                <p className="text-sm text-gray-600">Registro en tiempo real del procedimiento quirúrgico</p>
              </div>
            </div>
            <div className="flex gap-3">
              {!cirugiaIniciada && (
                <button
                  onClick={handleIniciarCirugia}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  Iniciar Cirugía
                </button>
              )}
              {cirugiaIniciada && (
                <button
                  onClick={handleFinalizarCirugia}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Square className="w-4 h-4" />
                  Finalizar Cirugía
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {cirugia && (
          <>
            {/* Información del paciente */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Paciente</p>
                    <p className="font-semibold text-gray-800">
                      {cirugia.paciente.nombre} {cirugia.paciente.apellidos}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha Programada</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(cirugia.fechaProgramada).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Stethoscope className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Odontólogo</p>
                    <p className="font-semibold text-gray-800">
                      {cirugia.odontologo.nombre} {cirugia.odontologo.apellidos}
                    </p>
                  </div>
                </div>
              </div>

              {/* Alergias y medicación */}
              {(cirugia.paciente.alergias?.length || cirugia.paciente.medicacionCronica?.length) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cirugia.paciente.alergias && cirugia.paciente.alergias.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-red-700 mb-2">⚠️ Alergias</p>
                        <p className="text-sm text-gray-700">{cirugia.paciente.alergias.join(', ')}</p>
                      </div>
                    )}
                    {cirugia.paciente.medicacionCronica && cirugia.paciente.medicacionCronica.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">💊 Medicación Crónica</p>
                        <p className="text-sm text-gray-700">{cirugia.paciente.medicacionCronica.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Plan quirúrgico */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Plan Quirúrgico</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{cirugia.planQuirurgico}</p>
                  </div>
                </div>
              </div>

              {/* Imágenes diagnósticas */}
              {cirugia.imagenesDiagnosticas && cirugia.imagenesDiagnosticas.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                    <p className="text-sm font-semibold text-gray-700">Imágenes Diagnósticas</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {cirugia.imagenesDiagnosticas.map((img, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-2">
                        <p className="text-xs text-gray-600">{img.tipo}</p>
                        <p className="text-xs text-gray-500 truncate">{img.descripcion || 'Sin descripción'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Si la cirugía no ha sido iniciada */}
            {!cirugiaIniciada && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-600 mb-4">Presione "Iniciar Cirugía" para comenzar el registro intraoperatorio</p>
              </div>
            )}

            {/* Componentes intraoperatorios */}
            {cirugiaIniciada && registroIntraoperatorio && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Columna izquierda */}
                <div className="space-y-6">
                  <SurgicalSafetyChecklist
                    checklistCompletado={registroIntraoperatorio.checklistCompletado || false}
                    onChecklistChange={handleChecklistChange}
                  />
                  <VitalSignsMonitor
                    signosVitales={registroIntraoperatorio.signosVitales}
                    onAgregarSignoVital={handleAgregarSignoVital}
                  />
                  <SurgicalPhaseTimer
                    horaInicio={registroIntraoperatorio.horaInicio}
                    eventos={registroIntraoperatorio.eventos}
                    onAgregarEvento={handleAgregarEvento}
                  />
                </div>

                {/* Columna derecha */}
                <div className="space-y-6">
                  <IntraopNoteTaker
                    notas={registroIntraoperatorio.notas || ''}
                    onNotasChange={handleNotasChange}
                    onAutoSave={handleAutoSave}
                  />
                  <MaterialConsumptionLog
                    materialesUtilizados={registroIntraoperatorio.materialesUtilizados}
                    onAgregarMaterial={handleAgregarMaterial}
                    onEliminarMaterial={handleEliminarMaterial}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


