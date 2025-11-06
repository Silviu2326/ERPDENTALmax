import { useState, useRef } from 'react';
import { Scan, Users, Search, Upload, Eye } from 'lucide-react';
import GaleriaEstudiosPaciente from '../components/GaleriaEstudiosPaciente';
import VisorDicomPrincipal from '../components/VisorDicomPrincipal';
import BarraHerramientasVisor from '../components/BarraHerramientasVisor';
import ModalMetadatosDicom from '../components/ModalMetadatosDicom';
import SubidaImagenesPage from './SubidaImagenesPage';

type VistaActiva = 'subida' | 'visor';

interface IntegracionRadiologicaPageProps {
  pacienteId?: string;
}

export default function IntegracionRadiologicaPage({ pacienteId: pacienteIdProp }: IntegracionRadiologicaPageProps) {
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>('subida');
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [estudioSeleccionadoId, setEstudioSeleccionadoId] = useState<string | null>(null);
  const [herramientaActiva, setHerramientaActiva] = useState<'zoom' | 'medicion' | 'anotacion' | 'texto' | null>(null);
  const [mostrarMetadatos, setMostrarMetadatos] = useState(false);
  const [metadatos, setMetadatos] = useState<{ [key: string]: any }>({});
  const visorRef = useRef<{ zoomIn: () => void; zoomOut: () => void; rotate: () => void; reset: () => void; ajustarContraste: (inc: number) => void } | null>(null);

  const handleSeleccionarEstudio = (estudioId: string) => {
    setEstudioSeleccionadoId(estudioId);
  };

  const handleZoomIn = () => {
    // En una implementación real, esto controlaría el visor DICOM
    setHerramientaActiva('zoom');
  };

  const handleZoomOut = () => {
    setHerramientaActiva('zoom');
  };

  const handleRotate = () => {
    setHerramientaActiva(null);
  };

  const handleReset = () => {
    setHerramientaActiva(null);
  };

  const handleAjustarContraste = (incremento: number) => {
    setHerramientaActiva(null);
  };

  const handleHerramientaMedicion = () => {
    setHerramientaActiva(herramientaActiva === 'medicion' ? null : 'medicion');
  };

  const handleHerramientaAnotacion = () => {
    setHerramientaActiva(herramientaActiva === 'anotacion' ? null : 'anotacion');
  };

  const handleHerramientaTexto = () => {
    setHerramientaActiva(herramientaActiva === 'texto' ? null : 'texto');
  };

  const handleVerMetadatos = () => {
    // En una implementación real, se cargarían los metadatos DICOM del estudio actual
    setMetadatos({
      'Study Instance UID': '1.2.840.113619.2.55.3.1234567890',
      'Patient Name': 'PACIENTE, EJEMPLO',
      'Patient ID': '12345',
      'Study Date': '20240115',
      'Study Time': '143000',
      'Modality': 'DX',
      'Manufacturer': 'Ejemplo Corp',
      'Device Serial Number': 'SN123456',
    });
    setMostrarMetadatos(true);
  };

  const handleBuscarPaciente = () => {
    // En una implementación real, esto abriría un modal de búsqueda de pacientes
    const id = prompt('Ingrese el ID del paciente:');
    if (id) {
      setPacienteId(id);
      setEstudioSeleccionadoId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Scan className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Integración Radiológica</h1>
                <p className="text-sm text-gray-600">Gestión de imágenes y estudios radiológicos</p>
              </div>
            </div>
          </div>
          
          {/* Pestañas de navegación */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setVistaActiva('subida')}
              className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActiva === 'subida'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Subida de Imágenes</span>
              </div>
            </button>
            <button
              onClick={() => setVistaActiva('visor')}
              className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActiva === 'visor'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Visor DICOM</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      {vistaActiva === 'subida' ? (
        <SubidaImagenesPage />
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            {!pacienteId && (
              <button
                onClick={handleBuscarPaciente}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>Buscar Paciente</span>
              </button>
            )}
            {pacienteId && (
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Paciente ID: {pacienteId}</span>
              </div>
            )}
          </div>
          
          {!pacienteId ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Scan className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Seleccione un paciente</h2>
              <p className="text-gray-600 mb-6">
                Para visualizar estudios radiológicos, primero debe seleccionar un paciente
              </p>
              <button
                onClick={handleBuscarPaciente}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span>Buscar Paciente</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
              {/* Panel lateral - Galería de estudios */}
              <div className="col-span-3 bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
                <GaleriaEstudiosPaciente
                  pacienteId={pacienteId}
                  estudioSeleccionadoId={estudioSeleccionadoId || undefined}
                  onSeleccionarEstudio={handleSeleccionarEstudio}
                />
              </div>

              {/* Panel principal - Visor DICOM */}
              <div className="col-span-9 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
                {estudioSeleccionadoId ? (
                  <>
                    <BarraHerramientasVisor
                      onZoomIn={handleZoomIn}
                      onZoomOut={handleZoomOut}
                      onRotate={handleRotate}
                      onReset={handleReset}
                      onAjustarContraste={handleAjustarContraste}
                      onHerramientaMedicion={handleHerramientaMedicion}
                      onHerramientaAnotacion={handleHerramientaAnotacion}
                      onHerramientaTexto={handleHerramientaTexto}
                      onVerMetadatos={handleVerMetadatos}
                      herramientaActiva={herramientaActiva}
                    />
                    <div className="flex-1 overflow-hidden">
                      <VisorDicomPrincipal
                        estudioId={estudioSeleccionadoId}
                        onError={(error) => {
                          console.error('Error en visor:', error);
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <Scan className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Seleccione un estudio radiológico
                      </h3>
                      <p className="text-gray-600">
                        Haga clic en un estudio de la lista para visualizarlo
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de metadatos DICOM */}
      <ModalMetadatosDicom
        metadatos={metadatos}
        isOpen={mostrarMetadatos}
        onClose={() => setMostrarMetadatos(false)}
      />
    </div>
  );
}

