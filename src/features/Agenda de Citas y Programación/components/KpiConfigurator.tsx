import { useState, useEffect } from 'react';
import { X, Settings, BarChart3, TrendingUp } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export interface KpiConfig {
  // KPIs básicos
  total: boolean;
  confirmadas: boolean;
  programadas: boolean;
  duracionPromedio: boolean;
  citasHoy: boolean;
  citasUrgentes: boolean;
  realizadas: boolean;
  canceladas: boolean;
  
  // KPIs secundarios
  pacientesUnicos: boolean;
  profesionalesUnicos: boolean;
  sedesUnicas: boolean;
  citasConNotas: boolean;
  citasManana: boolean;
  citasProximos3Dias: boolean;
  citasProximas: boolean;
  horaMasOcupada: boolean;
  duracionMinMax: boolean;
  profesionalMasOcupado: boolean;
  sedeMasOcupada: boolean;
  
  // KPIs avanzados
  tasaNoShow: boolean;
  ingresosPorHora: boolean;
}

const DEFAULT_CONFIG: KpiConfig = {
  // KPIs básicos - todos activos por defecto
  total: true,
  confirmadas: true,
  programadas: true,
  duracionPromedio: true,
  citasHoy: true,
  citasUrgentes: true,
  realizadas: true,
  canceladas: true,
  
  // KPIs secundarios - algunos activos
  pacientesUnicos: true,
  profesionalesUnicos: true,
  sedesUnicas: true,
  citasConNotas: false,
  citasManana: true,
  citasProximos3Dias: true,
  citasProximas: true,
  horaMasOcupada: false,
  duracionMinMax: false,
  profesionalMasOcupado: false,
  sedeMasOcupada: false,
  
  // KPIs avanzados - desactivados por defecto
  tasaNoShow: false,
  ingresosPorHora: false,
};

const STORAGE_KEY_PREFIX = 'agenda_kpi_config_';

interface KpiConfiguratorProps {
  isOpen: boolean;
  onClose: () => void;
  config: KpiConfig;
  onConfigChange: (config: KpiConfig) => void;
}

export default function KpiConfigurator({
  isOpen,
  onClose,
  config,
  onConfigChange,
}: KpiConfiguratorProps) {
  const { user } = useAuth();
  const [localConfig, setLocalConfig] = useState<KpiConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof KpiConfig) => {
    const newConfig = { ...localConfig, [key]: !localConfig[key] };
    setLocalConfig(newConfig);
  };

  const handleSave = () => {
    onConfigChange(localConfig);
    
    // Persistir en localStorage por usuario
    if (user?.id) {
      try {
        const storageKey = `${STORAGE_KEY_PREFIX}${user.id}`;
        localStorage.setItem(storageKey, JSON.stringify(localConfig));
      } catch (error) {
        console.warn('Error al guardar configuración de KPIs:', error);
      }
    }
    
    onClose();
  };

  const handleReset = () => {
    setLocalConfig(DEFAULT_CONFIG);
  };

  const kpiGroups = [
    {
      title: 'KPIs Básicos',
      description: 'Métricas fundamentales de la agenda',
      kpis: [
        { key: 'total' as const, label: 'Total de Citas', icon: '📊' },
        { key: 'confirmadas' as const, label: 'Confirmadas', icon: '✅' },
        { key: 'programadas' as const, label: 'Programadas', icon: '📅' },
        { key: 'duracionPromedio' as const, label: 'Duración Promedio', icon: '⏱️' },
        { key: 'citasHoy' as const, label: 'Citas Hoy', icon: '📆' },
        { key: 'citasUrgentes' as const, label: 'Urgentes', icon: '🚨' },
        { key: 'realizadas' as const, label: 'Realizadas', icon: '✓' },
        { key: 'canceladas' as const, label: 'Canceladas', icon: '❌' },
      ],
    },
    {
      title: 'KPIs Secundarios',
      description: 'Métricas adicionales de análisis',
      kpis: [
        { key: 'pacientesUnicos' as const, label: 'Pacientes Únicos', icon: '👥' },
        { key: 'profesionalesUnicos' as const, label: 'Profesionales Activos', icon: '👨‍⚕️' },
        { key: 'sedesUnicas' as const, label: 'Sedes Activas', icon: '📍' },
        { key: 'citasConNotas' as const, label: 'Citas con Notas', icon: '📝' },
        { key: 'citasManana' as const, label: 'Citas Mañana', icon: '🌅' },
        { key: 'citasProximos3Dias' as const, label: 'Próximos 3 Días', icon: '📈' },
        { key: 'citasProximas' as const, label: 'Próximas 2 Horas', icon: '⏰' },
        { key: 'horaMasOcupada' as const, label: 'Hora Pico', icon: '📊' },
        { key: 'duracionMinMax' as const, label: 'Rango de Duraciones', icon: '⏳' },
        { key: 'profesionalMasOcupado' as const, label: 'Profesional Más Ocupado', icon: '👤' },
        { key: 'sedeMasOcupada' as const, label: 'Sede Más Ocupada', icon: '🏢' },
      ],
    },
    {
      title: 'KPIs Avanzados',
      description: 'Métricas avanzadas para análisis detallado',
      kpis: [
        { key: 'tasaNoShow' as const, label: 'Tasa No-Show', icon: '📉', advanced: true },
        { key: 'ingresosPorHora' as const, label: 'Ingresos por Hora', icon: '💰', advanced: true },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Configurar KPIs</h2>
              <p className="text-sm text-gray-600">Selecciona qué métricas mostrar en el panel superior</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {kpiGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
                    {group.kpis.some(k => k.advanced) && (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                        Avanzado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{group.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.kpis.map((kpi) => (
                    <label
                      key={kpi.key}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        localConfig[kpi.key]
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={localConfig[kpi.key]}
                        onChange={() => handleToggle(kpi.key)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-xl">{kpi.icon}</span>
                      <span className="flex-1 text-sm font-medium text-gray-700">
                        {kpi.label}
                      </span>
                      {kpi.advanced && (
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Restaurar por Defecto
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Función helper para cargar configuración desde localStorage
export function loadKpiConfig(userId?: string): KpiConfig {
  if (!userId) return DEFAULT_CONFIG;
  
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validar que todos los campos existan
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (error) {
    console.warn('Error al cargar configuración de KPIs:', error);
  }
  
  return DEFAULT_CONFIG;
}

