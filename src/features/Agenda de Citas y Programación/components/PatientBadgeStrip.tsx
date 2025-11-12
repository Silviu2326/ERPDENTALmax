import { Crown, Heart, Wheelchair } from 'lucide-react';
import { Cita } from '../api/citasApi';

interface PatientBadgeStripProps {
  cita: Cita;
  colors?: {
    vip?: string;
    ansioso?: string;
    movilidadReducida?: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

// Configuración por defecto de colores
const DEFAULT_COLORS = {
  vip: '#F59E0B', // Amber
  ansioso: '#EF4444', // Red
  movilidadReducida: '#3B82F6', // Blue
};

// Mapeo de tags a iconos y etiquetas
const TAG_CONFIG = {
  vip: {
    icon: Crown,
    label: 'Paciente VIP',
    defaultColor: DEFAULT_COLORS.vip,
  },
  ansioso: {
    icon: Heart,
    label: 'Paciente ansioso',
    defaultColor: DEFAULT_COLORS.ansioso,
  },
  movilidadReducida: {
    icon: Wheelchair,
    label: 'Movilidad reducida',
    defaultColor: DEFAULT_COLORS.movilidadReducida,
  },
};

// Función para detectar tags en la cita
function detectarTags(cita: Cita): Array<keyof typeof TAG_CONFIG> {
  const tags: Array<keyof typeof TAG_CONFIG> = [];
  const notas = cita.notas?.toLowerCase() || '';
  const pacienteNombre = `${cita.paciente.nombre} ${cita.paciente.apellidos}`.toLowerCase();

  // Detectar VIP
  if (
    notas.includes('vip') ||
    notas.includes('paciente preferido') ||
    notas.includes('atención prioritaria') ||
    pacienteNombre.includes('vip')
  ) {
    tags.push('vip');
  }

  // Detectar ansioso
  if (
    notas.includes('ansiedad') ||
    notas.includes('ansioso') ||
    notas.includes('nervioso') ||
    notas.includes('fobia dental') ||
    notas.includes('requiere atención especial')
  ) {
    tags.push('ansioso');
  }

  // Detectar movilidad reducida
  if (
    notas.includes('movilidad reducida') ||
    notas.includes('silla de ruedas') ||
    notas.includes('discapacidad') ||
    notas.includes('accesibilidad')
  ) {
    tags.push('movilidadReducida');
  }

  return tags;
}

export default function PatientBadgeStrip({
  cita,
  colors = {},
  size = 'sm',
}: PatientBadgeStripProps) {
  const tags = detectarTags(cita);

  if (tags.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;

  return (
    <div className="flex items-center gap-1 flex-wrap" role="group" aria-label="Etiquetas del paciente">
      {tags.map((tag) => {
        const config = TAG_CONFIG[tag];
        const Icon = config.icon;
        const color = colors[tag] || config.defaultColor;
        const label = config.label;

        return (
          <div
            key={tag}
            className="relative group/badge"
            role="img"
            aria-label={label}
          >
            <div
              className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-help`}
              style={{ backgroundColor: `${color}20`, border: `1.5px solid ${color}` }}
              title={label}
            >
              <Icon
                size={iconSize}
                style={{ color }}
                className="flex-shrink-0"
                aria-hidden="true"
              />
            </div>
            {/* Tooltip accesible */}
            <div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
              role="tooltip"
            >
              {label}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Función helper para obtener configuración de colores desde localStorage o configuración
export function obtenerConfiguracionColoresBadges(): typeof DEFAULT_COLORS {
  try {
    const stored = localStorage.getItem('patientBadgeColors');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_COLORS, ...parsed };
    }
  } catch (error) {
    console.warn('Error al cargar configuración de colores de badges:', error);
  }
  return DEFAULT_COLORS;
}

// Función helper para guardar configuración de colores
export function guardarConfiguracionColoresBadges(colors: Partial<typeof DEFAULT_COLORS>): void {
  try {
    const current = obtenerConfiguracionColoresBadges();
    const updated = { ...current, ...colors };
    localStorage.setItem('patientBadgeColors', JSON.stringify(updated));
  } catch (error) {
    console.warn('Error al guardar configuración de colores de badges:', error);
  }
}

