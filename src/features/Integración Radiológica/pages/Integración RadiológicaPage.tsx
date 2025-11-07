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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Scan size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Integración Radiológica
                </h1>
                <p className="text-gray-600">
                  Gestión de imágenes y estudios radiológicos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal con tabs */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <div className="bg-white shadow-sm rounded-xl p-0">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              <button
                onClick={() => setVistaActiva('subida')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  vistaActiva === 'subida'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Upload size={18} className={vistaActiva === 'subida' ? 'opacity-100' : 'opacity-70'} />
                <span>Subida de Imágenes</span>
              </button>
              <button
                onClick={() => setVistaActiva('visor')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  vistaActiva === 'visor'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Eye size={18} className={vistaActiva === 'visor' ? 'opacity-100' : 'opacity-70'} />
                <span>Visor DICOM</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="mt-6">
          {vistaActiva === 'subida' ? (
            <SubidaImagenesPage />
          ) : (
            <div className="space-y-6">
              {/* Toolbar superior */}
              <div className="flex items-center justify-end">
                {!pacienteId && (
                  <button
                    onClick={handleBuscarPaciente}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Search size={20} />
                    <span>Buscar Paciente</span>
                  </button>
                )}
                {pacienteId && (
                  <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl ring-1 ring-slate-200">
                    <Users size={20} className="text-slate-600" />
                    <span className="text-slate-700 font-medium text-sm">Paciente ID: {pacienteId}</span>
                  </div>
                )}
              </div>
              
              {!pacienteId ? (
                <div className="bg-white shadow-sm rounded-xl p-8 text-center">
                  <Scan size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccione un paciente</h3>
                  <p className="text-gray-600 mb-4">
                    Para visualizar estudios radiológicos, primero debe seleccionar un paciente
                  </p>
                  <button
                    onClick={handleBuscarPaciente}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Search size={20} />
                    <span>Buscar Paciente</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
                  {/* Panel lateral - Galería de estudios */}
                  <div className="col-span-3 bg-white shadow-sm rounded-xl p-4 overflow-y-auto">
                    <GaleriaEstudiosPaciente
                      pacienteId={pacienteId}
                      estudioSeleccionadoId={estudioSeleccionadoId || undefined}
                      onSeleccionarEstudio={handleSeleccionarEstudio}
                    />
                  </div>

                  {/* Panel principal - Visor DICOM */}
                  <div className="col-span-9 bg-white shadow-sm rounded-xl flex flex-col overflow-hidden">
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
                          <Scan size={48} className="mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
        </div>
      </div>

      {/* Modal de metadatos DICOM */}
      <ModalMetadatosDicom
        metadatos={metadatos}
        isOpen={mostrarMetadatos}
        onClose={() => setMostrarMetadatos(false)}
      />
    </div>
  );
}

