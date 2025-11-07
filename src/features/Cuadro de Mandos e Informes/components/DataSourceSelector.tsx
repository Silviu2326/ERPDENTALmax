import { DataSourceMetadata } from '../api/informesConfigurablesApi';
import { Database } from 'lucide-react';

interface DataSourceSelectorProps {
  dataSources: DataSourceMetadata[];
  selectedDataSource: string | null;
  onSelect: (dataSource: string) => void;
  loading?: boolean;
}

export default function DataSourceSelector({
  dataSources,
  selectedDataSource,
  onSelect,
  loading = false,
}: DataSourceSelectorProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Fuente de Datos</h3>
          <p className="text-sm text-gray-500">Selecciona la fuente de datos principal para tu informe</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSources.map((source) => (
          <button
            key={source.dataSource}
            onClick={() => onSelect(source.dataSource)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${
                selectedDataSource === source.dataSource
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-800">{source.label}</span>
              {selectedDataSource === source.dataSource && (
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {source.fields.length} {source.fields.length === 1 ? 'campo disponible' : 'campos disponibles'}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}



