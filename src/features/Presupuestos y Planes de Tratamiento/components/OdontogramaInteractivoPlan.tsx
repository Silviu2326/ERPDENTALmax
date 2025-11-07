import { useState } from 'react';
import { X } from 'lucide-react';

interface OdontogramaInteractivoPlanProps {
  piezaSeleccionada?: string;
  onPiezaSeleccionada?: (pieza: string) => void;
  onCaraSeleccionada?: (pieza: string, cara: string) => void;
}

// Componente simplificado de odontograma para selección de piezas dentales
export default function OdontogramaInteractivoPlan({
  piezaSeleccionada,
  onPiezaSeleccionada,
  onCaraSeleccionada,
}: OdontogramaInteractivoPlanProps) {
  const [piezaActual, setPiezaActual] = useState<string | null>(piezaSeleccionada || null);
  const [caraActual, setCaraActual] = useState<string | null>(null);

  const caras = ['V', 'L', 'M', 'D', 'O']; // Vestibular, Lingual, Mesial, Distal, Oclusal

  const piezasSuperiores = [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
  ];
  const piezasInferiores = [
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
  ];

  const handlePiezaClick = (pieza: number) => {
    const piezaStr = pieza.toString();
    setPiezaActual(piezaStr);
    if (onPiezaSeleccionada) {
      onPiezaSeleccionada(piezaStr);
    }
  };

  const handleCaraClick = (cara: string) => {
    if (piezaActual) {
      setCaraActual(cara);
      if (onCaraSeleccionada && piezaActual) {
        onCaraSeleccionada(piezaActual, cara);
      }
    }
  };

  const renderPieza = (numero: number) => {
    const piezaStr = numero.toString();
    const isSelected = piezaActual === piezaStr;

    return (
      <button
        key={numero}
        onClick={() => handlePiezaClick(numero)}
        className={`
          w-12 h-12 border-2 rounded-lg transition-all
          ${isSelected ? 'bg-blue-500 border-blue-700 text-white' : 'bg-white border-gray-300 hover:border-blue-400'}
          font-semibold text-sm
        `}
        title={`Pieza ${numero}`}
      >
        {numero}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Odontograma Interactivo</h3>
        {piezaActual && (
          <button
            onClick={() => {
              setPiezaActual(null);
              setCaraActual(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Odontograma Superior */}
      <div className="mb-6">
        <div className="text-xs text-gray-600 mb-2 font-medium">Arco Superior</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {piezasSuperiores.map((pieza) => renderPieza(pieza))}
        </div>
      </div>

      {/* Odontograma Inferior */}
      <div className="mb-6">
        <div className="text-xs text-gray-600 mb-2 font-medium">Arco Inferior</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {piezasInferiores.map((pieza) => renderPieza(pieza))}
        </div>
      </div>

      {/* Selector de Caras */}
      {piezaActual && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Pieza seleccionada: <span className="text-blue-600 font-bold">{piezaActual}</span>
          </div>
          <div className="flex gap-2">
            {caras.map((cara) => (
              <button
                key={cara}
                onClick={() => handleCaraClick(cara)}
                className={`
                  px-3 py-1 rounded text-sm font-medium transition-all
                  ${caraActual === cara ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'}
                `}
                title={
                  cara === 'V'
                    ? 'Vestibular'
                    : cara === 'L'
                    ? 'Lingual'
                    : cara === 'M'
                    ? 'Mesial'
                    : cara === 'D'
                    ? 'Distal'
                    : 'Oclusal'
                }
              >
                {cara}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-600">
            V: Vestibular | L: Lingual | M: Mesial | D: Distal | O: Oclusal
          </div>
        </div>
      )}

      {!piezaActual && (
        <div className="text-center text-sm text-gray-500 py-4">
          Selecciona una pieza dental para asociar el tratamiento
        </div>
      )}
    </div>
  );
}



