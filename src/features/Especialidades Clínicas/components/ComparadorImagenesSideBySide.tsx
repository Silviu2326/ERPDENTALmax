import { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { OrtodonciaDiagnostico, ArchivoDiagnostico } from '../api/ortodonciaDiagnosticoApi';

interface ComparadorImagenesSideBySideProps {
  diagnosticos: OrtodonciaDiagnostico[];
  onCerrar: () => void;
}

export default function ComparadorImagenesSideBySide({
  diagnosticos,
  onCerrar,
}: ComparadorImagenesSideBySideProps) {
  const [imagen1, setImagen1] = useState<{ diagnostico: OrtodonciaDiagnostico; archivo: ArchivoDiagnostico } | null>(null);
  const [imagen2, setImagen2] = useState<{ diagnostico: OrtodonciaDiagnostico; archivo: ArchivoDiagnostico } | null>(null);
  const [zoom1, setZoom1] = useState(1);
  const [zoom2, setZoom2] = useState(1);
  const [rotation1, setRotation1] = useState(0);
  const [rotation2, setRotation2] = useState(0);

  // Recopilar todos los archivos de imagen de los diagnósticos
  const archivosDisponibles = diagnosticos.flatMap(diagnostico =>
    diagnostico.archivos
      .filter(archivo => archivo.tipo !== 'Modelo 3D') // Solo imágenes
      .map(archivo => ({ diagnostico, archivo }))
  );

  const handleSeleccionarImagen1 = (item: { diagnostico: OrtodonciaDiagnostico; archivo: ArchivoDiagnostico }) => {
    setImagen1(item);
    setZoom1(1);
    setRotation1(0);
  };

  const handleSeleccionarImagen2 = (item: { diagnostico: OrtodonciaDiagnostico; archivo: ArchivoDiagnostico }) => {
    setImagen2(item);
    setZoom2(1);
    setRotation2(0);
  };

  if (!imagen1 || !imagen2) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Comparar Imágenes</h2>
            <button
              onClick={onCerrar}
              className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Selección de imagen 1 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Imagen 1 (Antes/Inicial)</h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {archivosDisponibles.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSeleccionarImagen1(item)}
                    className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {item.archivo.nombreArchivo}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.diagnostico.etapa} - {new Date(item.diagnostico.fecha).toLocaleDateString('es-ES')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selección de imagen 2 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Imagen 2 (Después/Progreso)</h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {archivosDisponibles.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSeleccionarImagen2(item)}
                    className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {item.archivo.nombreArchivo}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.diagnostico.etapa} - {new Date(item.diagnostico.fecha).toLocaleDateString('es-ES')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Barra de herramientas */}
      <div className="bg-gray-800 bg-opacity-75 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-1">
            <div className="text-white text-sm font-medium">Imagen 1: {imagen1.archivo.nombreArchivo}</div>
            <div className="text-gray-300 text-xs">
              {imagen1.diagnostico.etapa} - {new Date(imagen1.diagnostico.fecha).toLocaleDateString('es-ES')}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoom1(Math.max(0.5, zoom1 - 0.25))}
              className="p-2 hover:bg-gray-700 rounded text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-white text-sm min-w-[50px] text-center">{Math.round(zoom1 * 100)}%</span>
            <button
              onClick={() => setZoom1(Math.min(5, zoom1 + 0.25))}
              className="p-2 hover:bg-gray-700 rounded text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRotation1((rotation1 + 90) % 360)}
              className="p-2 hover:bg-gray-700 rounded text-white"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="w-px h-8 bg-gray-600 mx-4" />

        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-1">
            <div className="text-white text-sm font-medium">Imagen 2: {imagen2.archivo.nombreArchivo}</div>
            <div className="text-gray-300 text-xs">
              {imagen2.diagnostico.etapa} - {new Date(imagen2.diagnostico.fecha).toLocaleDateString('es-ES')}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoom2(Math.max(0.5, zoom2 - 0.25))}
              className="p-2 hover:bg-gray-700 rounded text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-white text-sm min-w-[50px] text-center">{Math.round(zoom2 * 100)}%</span>
            <button
              onClick={() => setZoom2(Math.min(5, zoom2 + 0.25))}
              className="p-2 hover:bg-gray-700 rounded text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRotation2((rotation2 + 90) % 360)}
              className="p-2 hover:bg-gray-700 rounded text-white"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={onCerrar}
          className="p-2 hover:bg-red-600 rounded text-white ml-4"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Contenedor de imágenes lado a lado */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-900">
          <img
            src={imagen1.archivo.url}
            alt={imagen1.archivo.nombreArchivo}
            style={{
              transform: `scale(${zoom1}) rotate(${rotation1}deg)`,
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
        <div className="w-px bg-gray-700" />
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-900">
          <img
            src={imagen2.archivo.url}
            alt={imagen2.archivo.nombreArchivo}
            style={{
              transform: `scale(${zoom2}) rotate(${rotation2}deg)`,
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    </div>
  );
}


