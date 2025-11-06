import { useState } from 'react';
import { History } from 'lucide-react';
import DienteSVG from './DienteSVG';
import ModalHistorialDiente from './ModalHistorialDiente';
import { Hallazgo } from '../../api/odontogramaApi';

interface DienteComponentProps {
  numero: number;
  nombre: string;
  hallazgos: Hallazgo[];
  onClick?: () => void;
  isSelected?: boolean;
  onVerHistorial?: () => void;
}

export default function DienteComponent({
  numero,
  nombre,
  hallazgos,
  onClick,
  isSelected = false,
  onVerHistorial,
}: DienteComponentProps) {
  const [showHistorial, setShowHistorial] = useState(false);

  const handleVerHistorial = () => {
    if (onVerHistorial) {
      onVerHistorial();
    } else {
      setShowHistorial(true);
    }
  };

  return (
    <div className="relative group">
      <DienteSVG
        numero={numero}
        nombre={nombre}
        hallazgos={hallazgos}
        onClick={onClick}
        isSelected={isSelected}
        size="medium"
      />
      
      {/* Botón de historial */}
      {hallazgos.length > 0 && (
        <button
          onClick={handleVerHistorial}
          className="absolute top-0 right-0 p-1 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700 shadow-md"
          title="Ver historial de tratamientos"
        >
          <History className="w-3 h-3" />
        </button>
      )}

      {/* Tooltip con información del diente */}
      {isSelected && (
        <div className="absolute z-10 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
          <p className="font-semibold">{nombre}</p>
          {hallazgos.length > 0 && (
            <p className="mt-1 text-gray-300">
              {hallazgos.length} {hallazgos.length === 1 ? 'hallazgo' : 'hallazgos'}
            </p>
          )}
        </div>
      )}

      {/* Modal de historial */}
      {showHistorial && (
        <ModalHistorialDiente
          isOpen={showHistorial}
          onClose={() => setShowHistorial(false)}
          dienteId={numero}
          dienteNombre={nombre}
          hallazgos={hallazgos}
        />
      )}
    </div>
  );
}


