import { useState } from 'react';
import { Protocolo, confirmarLecturaProtocolo } from '../api/protocolosApi';
import { CheckCircle2, History, Edit, Archive, X, AlertCircle } from 'lucide-react';
import BotonConfirmarLectura from './BotonConfirmarLectura';

interface VisorProtocoloDetalleComponentProps {
  protocolo: Protocolo;
  esAdmin: boolean;
  onConfirmarLectura: (protocoloId: string, version: number) => void;
  onVerHistorial: () => void;
  onEditar?: (protocolo: Protocolo) => void;
  onArchivar?: (protocoloId: string) => void;
}

export default function VisorProtocoloDetalleComponent({
  protocolo,
  esAdmin,
  onConfirmarLectura,
  onVerHistorial,
  onEditar,
  onArchivar,
}: VisorProtocoloDetalleComponentProps) {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const tieneLecturaConfirmada = () => {
    if (!protocolo.lecturasConfirmadas || protocolo.lecturasConfirmadas.length === 0) {
      return false;
    }
    return protocolo.lecturasConfirmadas.some(
      (lectura) => lectura.version === protocolo.versionActual
    );
  };

  const versionActual = protocolo.versiones?.find(
    (v) => v.version === protocolo.versionActual
  );

  const handleConfirmarLectura = async () => {
    try {
      await onConfirmarLectura(protocolo._id, protocolo.versionActual);
      setMostrarConfirmacion(false);
    } catch (error) {
      console.error('Error al confirmar lectura:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{protocolo.titulo}</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {protocolo.categoria}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Versión {protocolo.versionActual}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
              <span>
                Autor: {protocolo.autor.nombre} {protocolo.autor.apellidos || ''}
              </span>
              {protocolo.sedes && protocolo.sedes.length > 0 && (
                <span>
                  Sedes: {protocolo.sedes.map((s) => s.nombre).join(', ')}
                </span>
              )}
            </div>
          </div>
          {esAdmin && (
            <div className="flex items-center space-x-2 ml-4">
              {onEditar && (
                <button
                  onClick={() => onEditar(protocolo)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar protocolo"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              {onArchivar && (
                <button
                  onClick={() => onArchivar(protocolo._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Archivar protocolo"
                >
                  <Archive className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {versionActual ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: versionActual.contenido }}
          />
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontró el contenido de esta versión</p>
          </div>
        )}
      </div>

      {/* Footer con acciones */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {protocolo.versiones && protocolo.versiones.length > 1 && (
              <button
                onClick={onVerHistorial}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <History className="w-5 h-5" />
                <span>Ver Historial de Versiones</span>
              </button>
            )}
            {tieneLecturaConfirmada() && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Lectura confirmada</span>
              </div>
            )}
          </div>
          {!esAdmin && !tieneLecturaConfirmada() && (
            <BotonConfirmarLectura
              protocolo={protocolo}
              onConfirmar={handleConfirmarLectura}
            />
          )}
        </div>

        {/* Panel de Auditoría para Admin */}
        {esAdmin && protocolo.lecturasConfirmadas && protocolo.lecturasConfirmadas.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Confirmaciones de Lectura</h3>
            <div className="space-y-2">
              {protocolo.lecturasConfirmadas
                .filter((l) => l.version === protocolo.versionActual)
                .map((lectura, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">
                        {lectura.usuario.nombre} {lectura.usuario.apellidos || ''}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(lectura.fecha).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


