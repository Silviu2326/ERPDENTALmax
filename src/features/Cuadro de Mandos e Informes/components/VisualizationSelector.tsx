import { BarChart3, Table, PieChart, TrendingUp } from 'lucide-react';

export type VisualizationType = 'table' | 'bar' | 'line' | 'pie';

interface VisualizationSelectorProps {
  selectedType: VisualizationType;
  onSelect: (type: VisualizationType) => void;
  hasGrouping: boolean;
  hasAggregation: boolean;
}

const VISUALIZATION_OPTIONS: Array<{
  type: VisualizationType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  requiresGrouping?: boolean;
  requiresAggregation?: boolean;
}> = [
  {
    type: 'table',
    label: 'Tabla',
    icon: Table,
    description: 'Vista de tabla detallada con todas las filas',
  },
  {
    type: 'bar',
    label: 'Gráfico de Barras',
    icon: BarChart3,
    description: 'Ideal para comparar categorías',
    requiresGrouping: true,
  },
  {
    type: 'line',
    label: 'Gráfico de Líneas',
    icon: TrendingUp,
    description: 'Perfecto para mostrar tendencias temporales',
    requiresGrouping: true,
  },
  {
    type: 'pie',
    label: 'Gráfico Circular',
    icon: PieChart,
    description: 'Muestra proporciones de un total',
    requiresGrouping: true,
    requiresAggregation: true,
  },
];

export default function VisualizationSelector({
  selectedType,
  onSelect,
  hasGrouping,
  hasAggregation,
}: VisualizationSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">Tipo de Visualización</h3>
        <p className="text-sm text-gray-500">Selecciona cómo deseas visualizar los datos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {VISUALIZATION_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isDisabled =
            (option.requiresGrouping && !hasGrouping) ||
            (option.requiresAggregation && !hasAggregation);

          return (
            <button
              key={option.type}
              onClick={() => !isDisabled && onSelect(option.type)}
              disabled={isDisabled}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${
                  selectedType === option.type
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : isDisabled
                    ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon
                  className={`w-6 h-6 ${
                    selectedType === option.type ? 'text-blue-600' : 'text-gray-600'
                  }`}
                />
                <span
                  className={`font-semibold ${
                    selectedType === option.type ? 'text-blue-600' : 'text-gray-800'
                  }`}
                >
                  {option.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">{option.description}</p>
              {isDisabled && (
                <p className="text-xs text-red-500 mt-2">
                  {option.requiresGrouping && !hasGrouping
                    ? 'Requiere agrupación'
                    : option.requiresAggregation && !hasAggregation
                    ? 'Requiere cálculos'
                    : ''}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}


