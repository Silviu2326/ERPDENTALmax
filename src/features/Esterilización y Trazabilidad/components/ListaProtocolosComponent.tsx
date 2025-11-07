import { Protocolo } from '../api/protocolosApi';
import { FileText, Clock, CheckCircle2, AlertCircle, Edit, Archive, Loader2 } from 'lucide-react';

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
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (protocolos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay protocolos disponibles</h3>
        <p className="text-gray-600">No se encontraron protocolos con los filtros aplicados</p>
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
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Protocolos</h2>
        <p className="text-sm text-gray-600 mt-1">{protocolos.length} protocolo(s)</p>
      </div>
      <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
        {protocolos.map((protocolo) => {
          const seleccionado = protocoloSeleccionadoId === protocolo._id;
          const leido = tieneLecturaConfirmada(protocolo);
          const tieneNuevaVersion = protocolo.versiones && protocolo.versiones.length > 1;

          return (
            <div
              key={protocolo._id}
              className={`p-4 hover:bg-gray-50 transition-all cursor-pointer relative ${
                seleccionado ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
              onClick={() => onSeleccionarProtocolo(protocolo)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={18} className="text-blue-600 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 truncate">{protocolo.titulo}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-lg text-xs font-medium">
                      {protocolo.categoria}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>v{protocolo.versionActual}</span>
                    </span>
                  </div>
                  {protocolo.sedes && protocolo.sedes.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {protocolo.sedes.map((s) => s.nombre).join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-2">
                  {leido ? (
                    <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                  ) : tieneNuevaVersion ? (
                    <AlertCircle size={18} className="text-orange-600 flex-shrink-0" title="Nueva versión disponible" />
                  ) : null}
                </div>
              </div>
              {esAdmin && (
                <div
                  className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditar?.(protocolo);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit size={12} />
                    <span>Editar</span>
                  </button>
                  {onArchivar && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchivar(protocolo._id);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Archive size={12} />
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



