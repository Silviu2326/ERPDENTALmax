import { useState } from 'react';
import { Mail, RefreshCw, Settings } from 'lucide-react';
import { PlantillaCarta } from '../api/plantillasCartaApi';
import { generarPrevisualizacion, PrevisualizacionCarta } from '../api/cartasApi';
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
  const [previsualizacion, setPrevisualizacion] = useState<PrevisualizacionCarta | null>(null);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Cartas al Paciente</h1>
                <p className="text-gray-600 mt-1">
                  Crea y envía cartas personalizadas a tus pacientes usando plantillas
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMostrarGestionPlantillas(!mostrarGestionPlantillas)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Gestionar Plantillas</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {mostrarGestionPlantillas ? (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
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
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  1. Seleccionar Plantilla
                </h2>
                {plantillaSeleccionada ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-gray-900">{plantillaSeleccionada.nombre}</p>
                      <p className="text-sm text-gray-600 mt-1">{plantillaSeleccionada.asunto}</p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-600 text-white rounded">
                        {plantillaSeleccionada.tipo}
                      </span>
                    </div>
                    <button
                      onClick={() => setPlantillaSeleccionada(null)}
                      className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cambiar Plantilla
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setMostrarGestionPlantillas(true)}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600"
                  >
                    Seleccionar Plantilla
                  </button>
                )}
              </div>

              {/* Buscador de Paciente */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  2. Seleccionar Paciente
                </h2>
                <SelectorPacienteInput
                  pacienteSeleccionado={pacienteSeleccionado}
                  onPacienteSeleccionado={setPacienteSeleccionado}
                />
              </div>

              {/* Botón de Generar Previsualización */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <button
                  onClick={handleGenerarPrevisualizacion}
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
                      <Mail className="w-5 h-5" />
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
    </div>
  );
}


