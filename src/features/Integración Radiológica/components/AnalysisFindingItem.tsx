import { MapPin, Tooth } from 'lucide-react';
import AnalysisConfidenceIndicator from './AnalysisConfidenceIndicator';

export interface HallazgoIA {
  tipo: string;
  coordenadas: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  confianza: number;
  descripcion?: string;
  dienteAfectado?: string;
}

interface AnalysisFindingItemProps {
  hallazgo: HallazgoIA;
  onCentrarVista?: (coordenadas: HallazgoIA['coordenadas']) => void;
}

const tiposHallazgo: { [key: string]: { label: string; color: string } } = {
  caries_interproximal: { label: 'Caries Interproximal', color: 'bg-red-100 text-red-800' },
  caries_oclusal: { label: 'Caries Oclusal', color: 'bg-red-100 text-red-800' },
  lesion_periapical: { label: 'Lesión Periapical', color: 'bg-orange-100 text-orange-800' },
  perdida_osea: { label: 'Pérdida Ósea', color: 'bg-yellow-100 text-yellow-800' },
  calculo_dental: { label: 'Cálculo Dental', color: 'bg-gray-100 text-gray-800' },
  reabsorcion: { label: 'Reabsorción', color: 'bg-purple-100 text-purple-800' },
  otra: { label: 'Otra Anomalía', color: 'bg-blue-100 text-blue-800' },
};

export default function AnalysisFindingItem({
  hallazgo,
  onCentrarVista,
}: AnalysisFindingItemProps) {
  const tipoInfo = tiposHallazgo[hallazgo.tipo] || tiposHallazgo.otra;

  const handleClick = () => {
    if (onCentrarVista) {
      onCentrarVista(hallazgo.coordenadas);
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer ${
        onCentrarVista ? 'hover:border-blue-400' : ''
      } border-gray-200`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${tipoInfo.color}`}
            >
              {tipoInfo.label}
            </span>
            <AnalysisConfidenceIndicator confianza={hallazgo.confianza} size="sm" />
          </div>
          {hallazgo.dienteAfectado && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <Tooth className="w-4 h-4" />
              <span className="font-medium">Diente: {hallazgo.dienteAfectado}</span>
            </div>
          )}
          {hallazgo.descripcion && (
            <p className="text-sm text-gray-700 mt-2">{hallazgo.descripcion}</p>
          )}
        </div>
      </div>
      {onCentrarVista && (
        <button
          className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <MapPin className="w-3 h-3" />
          <span>Centrar vista</span>
        </button>
      )}
    </div>
  );
}


