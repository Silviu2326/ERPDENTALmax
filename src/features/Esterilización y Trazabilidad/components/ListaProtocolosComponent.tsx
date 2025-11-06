import { Protocolo } from '../api/protocolosApi';
import { FileText, Clock, CheckCircle2, AlertCircle, Edit, Archive } from 'lucide-react';

interface ListaProtocolosComponentProps {
  protocolos: Protocolo[];
  loading: boolean;
  onSeleccionarProtocolo: (protocolo: Protocolo) => void;
  protocoloSeleccionadoId?: string;
  esAdmin: boolean;
  onEditar?: (protocolo: Protocolo) => void;
  onArchivar?: (protocoloId: string) => void;
}

export default function ListaProtocolosComponent({
  protocolos,
  loading,
  onSeleccionarProtocolo,
  protocoloSeleccionadoId,
  esAdmin,
  onEditar,
  onArchivar,
}: ListaProtocolosComponentProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (protocolos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No hay protocolos disponibles</p>
      </div>
    );
  }

  const tieneLecturaConfirmada = (protocolo: Protocolo) => {
    if (!protocolo.lecturasConfirmadas || protocolo.lecturasConfirmadas.length === 0) {
      return false;
    }
    return protocolo.lecturasConfirmadas.some(
      (lectura) => lectura.version === protocolo.versionActual
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Protocolos</h2>
        <p className="text-sm text-gray-500 mt-1">{protocolos.length} protocolo(s)</p>
      </div>
      <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
        {protocolos.map((protocolo) => {
          const seleccionado = protocoloSeleccionadoId === protocolo._id;
          const leido = tieneLecturaConfirmada(protocolo);
          const tieneNuevaVersion = protocolo.versiones && protocolo.versiones.length > 1;

          return (
            <div
              key={protocolo._id}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                seleccionado ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
              onClick={() => onSeleccionarProtocolo(protocolo)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 truncate">{protocolo.titulo}</h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                      {protocolo.categoria}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>v{protocolo.versionActual}</span>
                    </span>
                  </div>
                  {protocolo.sedes && protocolo.sedes.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {protocolo.sedes.map((s) => s.nombre).join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  {leido ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : tieneNuevaVersion ? (
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" title="Nueva versión disponible" />
                  ) : null}
                </div>
              </div>
              {esAdmin && (
                <div
                  className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditar?.(protocolo);
                    }}
                    className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                  {onArchivar && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchivar(protocolo._id);
                      }}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Archive className="w-3 h-3" />
                      <span>Archivar</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


