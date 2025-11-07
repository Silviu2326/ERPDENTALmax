import { useState } from 'react';
import { FieldMetadata } from '../api/informesConfigurablesApi';
import { CheckSquare, Square } from 'lucide-react';

interface ColumnPickerProps {
  fields: FieldMetadata[];
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
}

export default function ColumnPicker({
  fields,
  selectedColumns,
  onColumnsChange,
}: ColumnPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFields = fields.filter((field) =>
    field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleColumn = (fieldName: string) => {
    if (selectedColumns.includes(fieldName)) {
      onColumnsChange(selectedColumns.filter((col) => col !== fieldName));
    } else {
      onColumnsChange([...selectedColumns, fieldName]);
    }
  };

  const selectAll = () => {
    onColumnsChange(fields.map((f) => f.name));
  };

  const deselectAll = () => {
    onColumnsChange([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Columnas a Mostrar</h3>
          <p className="text-sm text-gray-500">Selecciona las columnas que deseas incluir en el informe</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={selectAll}
            className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Seleccionar Todas
          </button>
          <button
            onClick={deselectAll}
            className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Deseleccionar
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar campo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredFields.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No se encontraron campos</p>
        ) : (
          filteredFields.map((field) => {
            const isSelected = selectedColumns.includes(field.name);
            return (
              <button
                key={field.name}
                onClick={() => toggleColumn(field.name)}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200
                  ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }
                `}
              >
                {isSelected ? (
                  <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-800">{field.label}</div>
                  <div className="text-xs text-gray-500">{field.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Tipo: {field.type}
                    {field.relation && ` • Relación: ${field.relation.model}`}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {selectedColumns.length} de {fields.length} columnas seleccionadas
        </p>
      </div>
    </div>
  );
}



