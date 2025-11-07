import { useState } from 'react';
import { Mail, RefreshCw, Settings } from 'lucide-react';
import { PlantillaCarta } from '../api/plantillasCartaApi';
import { generarPrevisualizacion, PrevisualizacionCarta as PrevisualizacionCartaType } from '../api/cartasApi';
import GestionPlantillasCartas from '../components/GestionPlantillasCartas';
import SelectorPacienteInput from '../components/SelectorPacienteInput';
import PrevisualizacionCarta from '../components/PrevisualizacionCarta';
import ModalEnvioCarta from '../components/ModalEnvioCarta';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  email?: string;
  dni?: string;
}

export default function CartasPacientePage() {
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<PlantillaCarta | null>(null);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [previsualizacion, setPrevisualizacion] = useState<PrevisualizacionCartaType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalEnvio, setMostrarModalEnvio] = useState(false);
  const [mostrarGestionPlantillas, setMostrarGestionPlantillas] = useState(false);

  const handleGenerarPrevisualizacion = async () => {
    if (!plantillaSeleccionada || !pacienteSeleccionado) {
      setError('Por favor, selecciona una plantilla y un paciente');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resultado = await generarPrevisualizacion({
        plantillaId: plantillaSeleccionada._id!,
        pacienteId: pacienteSeleccionado._id,
      });

      setPrevisualizacion(resultado);
    } catch (err) {
      setError('Error al generar la previsualización. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarEmail = () => {
    if (!plantillaSeleccionada || !pacienteSeleccionado) {
      setError('Por favor, selecciona una plantilla y un paciente');
      return;
    }
    setMostrarModalEnvio(true);
  };

  const handleEnviarImprimir = () => {
    if (!plantillaSeleccionada || !pacienteSeleccionado) {
      setError('Por favor, selecciona una plantilla y un paciente');
      return;
    }
    setMostrarModalEnvio(true);
  };

  const handleGenerarPDF = () => {
    // Esta funcionalidad se implementaría en el backend
    alert('Funcionalidad de generación de PDF pendiente de implementar en el backend');
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleCartaEnviada = () => {
    setMostrarModalEnvio(false);
    setPrevisualizacion(null);
    setPlantillaSeleccionada(null);
    setPacienteSeleccionado(null);
    alert('Carta enviada correctamente');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Mail size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Cartas al Paciente
                  </h1>
                  <p className="text-gray-600">
                    Crea y envía cartas personalizadas a tus pacientes usando plantillas
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setMostrarGestionPlantillas(!mostrarGestionPlantillas)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  <Settings size={20} />
                  <span>Gestionar Plantillas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {mostrarGestionPlantillas ? (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <GestionPlantillasCartas
                onPlantillaSeleccionada={(plantilla) => {
                  setPlantillaSeleccionada(plantilla);
                  setMostrarGestionPlantillas(false);
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Panel izquierdo: Selección */}
              <div className="lg:col-span-1 space-y-6">
                {/* Selector de Plantilla */}
                <div className="bg-white shadow-sm rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    1. Seleccionar Plantilla
                  </h2>
                  {plantillaSeleccionada ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-xl ring-1 ring-blue-200/70">
                        <p className="font-semibold text-gray-900">{plantillaSeleccionada.nombre}</p>
                        <p className="text-sm text-gray-600 mt-1">{plantillaSeleccionada.asunto}</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded">
                          {plantillaSeleccionada.tipo}
                        </span>
                      </div>
                      <button
                        onClick={() => setPlantillaSeleccionada(null)}
                        className="w-full px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                      >
                        Cambiar Plantilla
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setMostrarGestionPlantillas(true)}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-600"
                    >
                      Seleccionar Plantilla
                    </button>
                  )}
                </div>

                {/* Buscador de Paciente */}
                <div className="bg-white shadow-sm rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    2. Seleccionar Paciente
                  </h2>
                  <SelectorPacienteInput
                    pacienteSeleccionado={pacienteSeleccionado}
                    onPacienteSeleccionado={setPacienteSeleccionado}
                  />
                </div>

                {/* Botón de Generar Previsualización */}
                <div className="bg-white shadow-sm rounded-lg p-4">
                  <button
                    onClick={handleGenerarPrevisualizacion}
                    disabled={!plantillaSeleccionada || !pacienteSeleccionado || loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        <span>Generando...</span>
                      </>
                    ) : (
                      <>
                        <Mail size={20} />
                        <span>Generar Previsualización</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Panel derecho: Vista Previa */}
              <div className="lg:col-span-2">
                <PrevisualizacionCarta
                  asunto={previsualizacion?.asunto || plantillaSeleccionada?.asunto || ''}
                  cuerpoHTML={previsualizacion?.cuerpoHTML || plantillaSeleccionada?.cuerpoHTML || ''}
                  nombrePaciente={pacienteSeleccionado?.nombre}
                  onEnviarEmail={handleEnviarEmail}
                  onImprimir={handleImprimir}
                  onGenerarPDF={handleGenerarPDF}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Envío */}
      {mostrarModalEnvio && plantillaSeleccionada && pacienteSeleccionado && (
        <ModalEnvioCarta
          plantillaId={plantillaSeleccionada._id!}
          paciente={pacienteSeleccionado}
          onEnviado={handleCartaEnviada}
          onCancelar={() => setMostrarModalEnvio(false)}
        />
      )}
    </div>
  );
}



