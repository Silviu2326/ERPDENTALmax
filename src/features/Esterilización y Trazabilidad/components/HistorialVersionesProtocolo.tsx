import { Protocolo } from '../api/protocolosApi';
import { X, Clock, User, FileText } from 'lucide-react';

interface HistorialVersionesProtocoloProps {
  protocolo: Protocolo;
  onCerrar: () => void;
}

export default function HistorialVersionesProtocolo({
  protocolo,
  onCerrar,
}: HistorialVersionesProtocoloProps) {
  const versiones = protocolo.versiones
    ? [...protocolo.versiones].sort((a, b) => b.version - a.version)
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Historial de Versiones</h2>
            <p className="text-sm text-gray-500 mt-1">{protocolo.titulo}</p>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lista de Versiones */}
        <div className="flex-1 overflow-y-auto p-6">
          {versiones.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay historial de versiones disponible</p>
            </div>
          ) : (
            <div className="space-y-4">
              {versiones.map((version, index) => {
                const esVersionActual = version.version === protocolo.versionActual;
                const fecha = new Date(version.fecha);

                return (
                  <div
                    key={version.version}
                    className={`border rounded-lg p-4 ${
                      esVersionActual
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            esVersionActual
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          v{version.version}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">
                              Versión {version.version}
                            </h3>
                            {esVersionActual && (
                              <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                                Actual
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{fecha.toLocaleDateString('es-ES')} {fecha.toLocaleTimeString('es-ES')}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>
                                {version.autor.nombre} {version.autor.apellidos || ''}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div
                        className="prose max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: version.contenido }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCerrar}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}



