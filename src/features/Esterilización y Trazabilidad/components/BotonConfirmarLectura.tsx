import { useState } from 'react';
import { Protocolo } from '../api/protocolosApi';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface BotonConfirmarLecturaProps {
  protocolo: Protocolo;
  onConfirmar: () => void;
}

export default function BotonConfirmarLectura({
  protocolo,
  onConfirmar,
}: BotonConfirmarLecturaProps) {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const tieneLecturaConfirmada = () => {
    if (!protocolo.lecturasConfirmadas || protocolo.lecturasConfirmadas.length === 0) {
      return false;
    }
    return protocolo.lecturasConfirmadas.some(
      (lectura) => lectura.version === protocolo.versionActual
    );
  };

  if (tieneLecturaConfirmada()) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle2 className="w-5 h-5" />
        <span className="text-sm font-medium">Lectura confirmada</span>
      </div>
    );
  }

  if (mostrarConfirmacion) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800 mb-3">
              ¿Confirma que ha leído y comprendido este protocolo?
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={onConfirmar}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Sí, confirmo
              </button>
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setMostrarConfirmacion(true)}
      className="flex items-center space-x-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
    >
      <CheckCircle2 className="w-5 h-5" />
      <span>He leído y comprendido este protocolo</span>
    </button>
  );
}


