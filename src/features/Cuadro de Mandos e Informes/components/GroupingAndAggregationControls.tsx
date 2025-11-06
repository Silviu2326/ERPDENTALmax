import { useState } from 'react';
import { GroupingConfig, AggregationConfig, FieldMetadata } from '../api/informesConfigurablesApi';
import { Layers, Calculator } from 'lucide-react';

interface GroupingAndAggregationControlsProps {
  fields: FieldMetadata[];
  grouping: GroupingConfig[];
  aggregation: AggregationConfig[];
  onGroupingChange: (grouping: GroupingConfig[]) => void;
  onAggregationChange: (aggregation: AggregationConfig[]) => void;
}

const AGGREGATION_FUNCTIONS = [
  { value: 'sum', label: 'Suma' },
  { value: 'count', label: 'Contar' },
  { value: 'avg', label: 'Promedio' },
  { value: 'min', label: 'Mínimo' },
  { value: 'max', label: 'Máximo' },
] as const;

export default function GroupingAndAggregationControls({
  fields,
  grouping,
  aggregation,
  onGroupingChange,
  onAggregationChange,
}: GroupingAndAggregationControlsProps) {
  const numericFields = fields.filter((f) => f.type === 'number');
  const allFields = fields;

  const addGrouping = () => {
    const field = allFields[0];
    if (field) {
      onGroupingChange([
        ...grouping,
        {
          field: field.name,
          label: field.label,
        },
      ]);
    }
  };

  const removeGrouping = (index: number) => {
    onGroupingChange(grouping.filter((_, i) => i !== index));
  };

  const updateGrouping = (index: number, updates: Partial<GroupingConfig>) => {
    const newGrouping = [...grouping];
    newGrouping[index] = { ...newGrouping[index], ...updates };
    onGroupingChange(newGrouping);
  };

  const addAggregation = () => {
    const field = numericFields[0];
    if (field) {
      onAggregationChange([
        ...aggregation,
        {
          field: field.name,
          function: 'sum',
          label: `Suma de ${field.label}`,
        },
      ]);
    }
  };

  const removeAggregation = (index: number) => {
    onAggregationChange(aggregation.filter((_, i) => i !== index));
  };

  const updateAggregation = (index: number, updates: Partial<AggregationConfig>) => {
    const newAggregation = [...aggregation];
    newAggregation[index] = { ...newAggregation[index], ...updates };
    onAggregationChange(newAggregation);
  };

  return (
    <div className="space-y-6">
      {/* Agrupación */}
      <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">Agrupación</h3>
            <p className="text-sm text-gray-500">Agrupa los datos por uno o más campos</p>
          </div>
          <button
            onClick={addGrouping}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Agregar
          </button>
        </div>

        {grouping.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>No hay agrupaciones definidas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {grouping.map((group, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <select
                  value={group.field}
                  onChange={(e) => {
                    const field = allFields.find((f) => f.name === e.target.value);
                    updateGrouping(index, {
                      field: e.target.value,
                      label: field?.label || e.target.value,
                    });
                  }}
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {allFields.map((field) => (
                    <option key={field.name} value={field.name}>
                      {field.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeGrouping(index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agregaciones */}
      <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">Cálculos</h3>
            <p className="text-sm text-gray-500">Define cálculos agregados sobre campos numéricos</p>
          </div>
          <button
            onClick={addAggregation}
            disabled={numericFields.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar
          </button>
        </div>

        {numericFields.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>No hay campos numéricos disponibles para cálculos</p>
          </div>
        ) : aggregation.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>No hay cálculos definidos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {aggregation.map((agg, index) => {
              const field = numericFields.find((f) => f.name === agg.field);
              return (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <select
                      value={agg.field}
                      onChange={(e) => {
                        const selectedField = numericFields.find((f) => f.name === e.target.value);
                        updateAggregation(index, {
                          field: e.target.value,
                          label: `${AGGREGATION_FUNCTIONS.find((f) => f.value === agg.function)?.label || 'Suma'} de ${selectedField?.label || e.target.value}`,
                        });
                      }}
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {numericFields.map((field) => (
                        <option key={field.name} value={field.name}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={agg.function}
                      onChange={(e) => {
                        const func = e.target.value as AggregationConfig['function'];
                        const selectedField = numericFields.find((f) => f.name === agg.field);
                        updateAggregation(index, {
                          function: func,
                          label: `${AGGREGATION_FUNCTIONS.find((f) => f.value === func)?.label || 'Suma'} de ${selectedField?.label || agg.field}`,
                        });
                      }}
                      className="w-40 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {AGGREGATION_FUNCTIONS.map((func) => (
                        <option key={func.value} value={func.value}>
                          {func.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeAggregation(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Etiqueta (opcional)"
                    value={agg.label || ''}
                    onChange={(e) => updateAggregation(index, { label: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


