import { Hallazgo } from '../../api/odontogramaApi';

interface DienteSVGProps {
  numero: number;
  nombre: string;
  hallazgos: Hallazgo[];
  onClick?: () => void;
  isSelected?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const SUPERFICIES = {
  oclusal: { label: 'O', position: { cx: 50, cy: 20 } },
  mesial: { label: 'M', position: { cx: 20, cy: 50 } },
  distal: { label: 'D', position: { cx: 80, cy: 50 } },
  vestibular: { label: 'V', position: { cx: 50, cy: 80 } },
  lingual: { label: 'L', position: { cx: 50, cy: 50 } },
};

const COLORES_ESTADO: Record<string, string> = {
  diagnostico: '#fbbf24', // Amarillo
  planificado: '#3b82f6', // Azul
  realizado: '#10b981', // Verde
  en_progreso: '#f59e0b', // Naranja
  descartado: '#ef4444', // Rojo
  ausente: '#6b7280', // Gris
};

export default function DienteSVG({
  numero,
  nombre,
  hallazgos,
  onClick,
  isSelected = false,
  size = 'medium',
}: DienteSVGProps) {
  const sizeMap = {
    small: { width: 40, height: 50, fontSize: 10 },
    medium: { width: 60, height: 75, fontSize: 12 },
    large: { width: 80, height: 100, fontSize: 14 },
  };

  const dimensions = sizeMap[size];

  const getColorEstado = (estado: string): string => {
    return COLORES_ESTADO[estado] || '#9ca3af';
  };

  const getHallazgosPorSuperficie = () => {
    const porSuperficie: Record<string, Hallazgo[]> = {};
    hallazgos.forEach((hallazgo) => {
      hallazgo.superficies.forEach((superficie) => {
        if (!porSuperficie[superficie]) {
          porSuperficie[superficie] = [];
        }
        porSuperficie[superficie].push(hallazgo);
      });
    });
    return porSuperficie;
  };

  const hallazgosPorSuperficie = getHallazgosPorSuperficie();

  const getEstadoPrincipal = (): string | null => {
    // Prioridad: realizado > en_progreso > planificado > diagnostico > descartado
    const prioridades: Record<string, number> = {
      realizado: 5,
      en_progreso: 4,
      planificado: 3,
      diagnostico: 2,
      descartado: 1,
    };

    let maxPrioridad = 0;
    let estadoPrincipal: string | null = null;

    hallazgos.forEach((hallazgo) => {
      const prioridad = prioridades[hallazgo.estado] || 0;
      if (prioridad > maxPrioridad) {
        maxPrioridad = prioridad;
        estadoPrincipal = hallazgo.estado;
      }
    });

    return estadoPrincipal;
  };

  const estadoPrincipal = getEstadoPrincipal();
  const colorFondo = estadoPrincipal ? getColorEstado(estadoPrincipal) : '#ffffff';

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 100 100"
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      {/* Diente base */}
      <rect
        x="15"
        y="15"
        width="70"
        height="70"
        rx="8"
        fill={colorFondo}
        stroke={isSelected ? '#3b82f6' : '#374151'}
        strokeWidth={isSelected ? 3 : 2}
      />

      {/* Número del diente */}
      <text
        x="50"
        y="55"
        fontSize={dimensions.fontSize + 4}
        fontWeight="bold"
        textAnchor="middle"
        fill={estadoPrincipal ? '#ffffff' : '#374151'}
      >
        {numero}
      </text>

      {/* Superficies con hallazgos */}
      {Object.entries(SUPERFICIES).map(([superficie, config]) => {
        const hallazgosSuperficie = hallazgosPorSuperficie[superficie] || [];
        if (hallazgosSuperficie.length === 0) return null;

        const estadoSuperficie = hallazgosSuperficie[0].estado;
        const colorSuperficie = getColorEstado(estadoSuperficie);

        return (
          <circle
            key={superficie}
            cx={config.position.cx}
            cy={config.position.cy}
            r="8"
            fill={colorSuperficie}
            stroke="#ffffff"
            strokeWidth="1"
          />
        );
      })}

      {/* Indicador de múltiples hallazgos */}
      {hallazgos.length > 1 && (
        <circle cx="85" cy="15" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1">
          <title>{hallazgos.length} hallazgos</title>
        </circle>
      )}
    </svg>
  );
}


