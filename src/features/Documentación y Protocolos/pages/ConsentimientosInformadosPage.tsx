import { useState, useEffect } from 'react';
import { FileText, Plus, Settings, RefreshCw, Eye, Download } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  obtenerPlantillas,
  obtenerConsentimientosPorPaciente,
  generarConsentimiento,
  firmarConsentimiento,
  obtenerConsentimientoPorId,
  crearPlantilla,
  actualizarPlantilla,
  eliminarPlantilla,
  ConsentimientoPlantilla,
  ConsentimientoPaciente,
  NuevaPlantilla,
} from '../api/consentimientosApi';
import TablaConsentimientos from '../components/TablaConsentimientos';
import BuscadorPacientesConsentimientos from '../components/BuscadorPacientesConsentimientos';
import EditorPlantillasConsentimiento from '../components/EditorPlantillasConsentimiento';
import ModalFirmaDigital from '../components/ModalFirmaDigital';
import VisorConsentimientoPDF from '../components/VisorConsentimientoPDF';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  dni?: string;
}

type Vista = 'principal' | 'gestion-plantillas' | 'ver-consentimiento';

export default function ConsentimientosInformadosPage() {
  const { user } = useAuth();
  const [vista, setVista] = useState<Vista>('principal');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [plantillas, setPlantillas] = useState<ConsentimientoPlantilla[]>([]);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<ConsentimientoPlantilla | null>(null);
  const [consentimientos, setConsentimientos] = useState<ConsentimientoPaciente[]>([]);
  const [consentimientoActual, setConsentimientoActual] = useState<ConsentimientoPaciente | null>(null);
  const [mostrarModalFirma, setMostrarModalFirma] = useState(false);
  const [mostrarEditorPlantilla, setMostrarEditorPlantilla] = useState(false);
  const [plantillaEditando, setPlantillaEditando] = useState<ConsentimientoPlantilla | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'odontologo';

  // Cargar plantillas al montar
  useEffect(() => {
    cargarPlantillas();
  }, []);

  // Cargar consentimientos cuando se selecciona un paciente
  useEffect(() => {
    if (pacienteSeleccionado) {
      cargarConsentimientosPaciente();
    } else {
      setConsentimientos([]);
    }
  }, [pacienteSeleccionado]);

  const cargarPlantillas = async () => {
    try {
      const datos = await obtenerPlantillas();
      setPlantillas(datos.filter((p) => p.activo));
    } catch (err) {
      setError('Error al cargar plantillas');
      console.error(err);
    }
  };

  const cargarConsentimientosPaciente = async () => {
    if (!pacienteSeleccionado) return;

    setLoading(true);
    try {
      const datos = await obtenerConsentimientosPorPaciente(pacienteSeleccionado._id);
      setConsentimientos(datos);
    } catch (err) {
      setError('Error al cargar consentimientos del paciente');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarConsentimiento = async () => {
    if (!plantillaSeleccionada || !pacienteSeleccionado) {
      setError('Por favor, selecciona una plantilla y un paciente');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const nuevoConsentimiento = await generarConsentimiento({
        pacienteId: pacienteSeleccionado._id,
        plantillaId: plantillaSeleccionada._id!,
      });

      setConsentimientoActual(nuevoConsentimiento);
      setMostrarModalFirma(true);
      await cargarConsentimientosPaciente();
    } catch (err) {
      setError('Error al generar el consentimiento. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFirmar = async (firmaBase64: string) => {
    if (!consentimientoActual) return;

    setLoading(true);
    setError(null);
    try {
      await firmarConsentimiento(consentimientoActual._id!, { firmaDigital: firmaBase64 });
      setMostrarModalFirma(false);
      await cargarConsentimientosPaciente();
      setConsentimientoActual(null);
      alert('Consentimiento firmado correctamente');
    } catch (err) {
      setError('Error al firmar el consentimiento. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerConsentimiento = async (id: string) => {
    setLoading(true);
    try {
      const consentimiento = await obtenerConsentimientoPorId(id);
      setConsentimientoActual(consentimiento);
      setVista('ver-consentimiento');
    } catch (err) {
      setError('Error al cargar el consentimiento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarPlantilla = async (plantilla: NuevaPlantilla) => {
    setLoading(true);
    try {
      if (plantillaEditando) {
        await actualizarPlantilla(plantillaEditando._id!, plantilla);
      } else {
        await crearPlantilla(plantilla);
      }
      await cargarPlantillas();
      setMostrarEditorPlantilla(false);
      setPlantillaEditando(undefined);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaPlantilla = () => {
    setPlantillaEditando(undefined);
    setMostrarEditorPlantilla(true);
  };

  const handleEditarPlantilla = (plantilla: ConsentimientoPlantilla) => {
    setPlantillaEditando(plantilla);
    setMostrarEditorPlantilla(true);
  };

  const handleDescargarPDF = async (id: string) => {
    // Esta funcionalidad se implementaría en el backend
    alert('Funcionalidad de descarga de PDF pendiente de implementar en el backend');
  };

  if (vista === 'ver-consentimiento' && consentimientoActual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => setVista('principal')}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
            >
              ← Volver a la lista
            </button>
          </div>
          <VisorConsentimientoPDF
            contenido={consentimientoActual.contenido_final}
            nombrePaciente={`${consentimientoActual.paciente.nombre} ${consentimientoActual.paciente.apellidos}`}
            nombrePlantilla={consentimientoActual.plantilla_origen?.nombre}
            estado={consentimientoActual.estado}
            fechaFirma={consentimientoActual.fecha_firma}
            firmaDigitalUrl={consentimientoActual.firma_digital_url}
            onCerrar={() => setVista('principal')}
            onDescargarPDF={() => handleDescargarPDF(consentimientoActual._id!)}
            onImprimir={() => window.print()}
          />
        </div>
      </div>
    );
  }

  if (vista === 'gestion-plantillas' || mostrarEditorPlantilla) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Gestión de Plantillas</h1>
                  <p className="text-gray-600 mt-1">Crear y editar plantillas de consentimiento</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setVista('principal');
                  setMostrarEditorPlantilla(false);
                  setPlantillaEditando(undefined);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Volver
              </button>
            </div>
          </div>

          {mostrarEditorPlantilla ? (
            <EditorPlantillasConsentimiento
              plantilla={plantillaEditando}
              onGuardar={handleGuardarPlantilla}
              onCancelar={() => {
                setMostrarEditorPlantilla(false);
                setPlantillaEditando(undefined);
              }}
              loading={loading}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Plantillas Disponibles</h2>
                <button
                  onClick={handleNuevaPlantilla}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nueva Plantilla</span>
                </button>
              </div>

              <div className="space-y-3">
                {plantillas.map((plantilla) => (
                  <div
                    key={plantilla._id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{plantilla.nombre}</h3>
                      {plantilla.descripcion && (
                        <p className="text-sm text-gray-600 mt-1">{plantilla.descripcion}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleEditarPlantilla(plantilla)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                    >
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Consentimientos Informados</h1>
                <p className="text-gray-600 mt-1">
                  Gestiona los consentimientos informados de los pacientes
                </p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => setVista('gestion-plantillas')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Gestionar Plantillas</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel izquierdo: Selección */}
          <div className="lg:col-span-1 space-y-6">
            {/* Buscador de Paciente */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Seleccionar Paciente</h2>
              <BuscadorPacientesConsentimientos
                pacienteSeleccionado={pacienteSeleccionado}
                onPacienteSeleccionado={setPacienteSeleccionado}
              />
            </div>

            {/* Selector de Plantilla */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Seleccionar Plantilla</h2>
              <div className="space-y-2">
                {plantillas.map((plantilla) => (
                  <button
                    key={plantilla._id}
                    onClick={() => setPlantillaSeleccionada(plantilla)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      plantillaSeleccionada?._id === plantilla._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{plantilla.nombre}</div>
                    {plantilla.descripcion && (
                      <div className="text-sm text-gray-600 mt-1">{plantilla.descripcion}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Botón de Generar */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <button
                onClick={handleGenerarConsentimiento}
                disabled={!plantillaSeleccionada || !pacienteSeleccionado || loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Generar Consentimiento</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Panel derecho: Lista de Consentimientos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Consentimientos del Paciente
                {pacienteSeleccionado && (
                  <span className="text-gray-600 font-normal ml-2">
                    - {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
                  </span>
                )}
              </h2>
              <TablaConsentimientos
                consentimientos={consentimientos}
                onVerConsentimiento={handleVerConsentimiento}
                onDescargarPDF={handleDescargarPDF}
                loading={loading}
              />
            </div>
          </div>
        </div>

        {/* Modal de Firma Digital */}
        <ModalFirmaDigital
          isOpen={mostrarModalFirma}
          onClose={() => {
            setMostrarModalFirma(false);
            setConsentimientoActual(null);
          }}
          onFirmar={handleFirmar}
          nombrePaciente={
            consentimientoActual
              ? `${consentimientoActual.paciente.nombre} ${consentimientoActual.paciente.apellidos}`
              : undefined
          }
          loading={loading}
        />
      </div>
    </div>
  );
}


