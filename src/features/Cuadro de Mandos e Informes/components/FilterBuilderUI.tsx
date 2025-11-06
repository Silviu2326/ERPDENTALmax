import { useState } from 'react';
import { FilterGroup, FilterCondition, FilterOperator, FieldMetadata } from '../api/informesConfigurablesApi';
import { Filter, Plus, X, Trash2 } from 'lucide-react';

interface FilterBuilderUIProps {
  fields: FieldMetadata[];
  filters: FilterGroup[];
  onFiltersChange: (filters: FilterGroup[]) => void;
}

const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'Igual a',
  not_equals: 'Diferente de',
  greater_than: 'Mayor que',
  less_than: 'Menor que',
  greater_equal: 'Mayor o igual que',
  less_equal: 'Menor o igual que',
  contains: 'Contiene',
  not_contains: 'No contiene',
  between: 'Entre',
  in: 'En lista',
  not_in: 'No en lista',
};

const OPERATORS_BY_TYPE: Record<string, FilterOperator[]> = {
  string: ['equals', 'not_equals', 'contains', 'not_contains', 'in', 'not_in'],
  number: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'between', 'in', 'not_in'],
  date: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'between'],
  boolean: ['equals', 'not_equals'],
};

export default function FilterBuilderUI({
  fields,
  filters,
  onFiltersChange,
}: FilterBuilderUIProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([0]));

  const toggleGroup = (index: number) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedGroups(newExpanded);
  };

  const addGroup = () => {
    const newGroup: FilterGroup = {
      conditions: [],
      logic: 'AND',
    };
    onFiltersChange([...filters, newGroup]);
    setExpandedGroups(new Set([...expandedGroups, filters.length]));
  };

  const removeGroup = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    onFiltersChange(newFilters);
    const newExpanded = new Set(expandedGroups);
    newExpanded.delete(index);
    setExpandedGroups(newExpanded);
  };

  const addCondition = (groupIndex: number) => {
    const newFilters = [...filters];
    const field = fields[0];
    if (!field) return;

    const newCondition: FilterCondition = {
      field: field.name,
      operator: OPERATORS_BY_TYPE[field.type]?.[0] || 'equals',
      value: '',
    };

    newFilters[groupIndex].conditions.push(newCondition);
    onFiltersChange(newFilters);
  };

  const removeCondition = (groupIndex: number, conditionIndex: number) => {
    const newFilters = [...filters];
    newFilters[groupIndex].conditions.splice(conditionIndex, 1);
    onFiltersChange(newFilters);
  };

  const updateCondition = (
    groupIndex: number,
    conditionIndex: number,
    updates: Partial<FilterCondition>
  ) => {
    const newFilters = [...filters];
    newFilters[groupIndex].conditions[conditionIndex] = {
      ...newFilters[groupIndex].conditions[conditionIndex],
      ...updates,
    };
    onFiltersChange(newFilters);
  };

  const updateGroupLogic = (groupIndex: number, logic: 'AND' | 'OR') => {
    const newFilters = [...filters];
    newFilters[groupIndex].logic = logic;
    onFiltersChange(newFilters);
  };

  const getFieldType = (fieldName: string): string => {
    const field = fields.find((f) => f.name === fieldName);
    return field?.type || 'string';
  };

  const getAvailableOperators = (fieldName: string): FilterOperator[] => {
    const type = getFieldType(fieldName);
    return OPERATORS_BY_TYPE[type] || OPERATORS_BY_TYPE.string;
  };

  const renderValueInput = (
    condition: FilterCondition,
    groupIndex: number,
    conditionIndex: number
  ) => {
    const fieldType = getFieldType(condition.field);
    const needsTwoValues = condition.operator === 'between' || condition.operator === 'in' || condition.operator === 'not_in';

    if (needsTwoValues && (condition.operator === 'in' || condition.operator === 'not_in')) {
      return (
        <div className="flex-1">
          <input
            type="text"
            placeholder="Valores separados por comas"
            value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value || ''}
            onChange={(e) => {
              const values = e.target.value.split(',').map((v) => v.trim()).filter(Boolean);
              updateCondition(groupIndex, conditionIndex, { value: values });
            }}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
      );
    }

    if (needsTwoValues && condition.operator === 'between') {
      return (
        <div className="flex-1 flex space-x-2">
          <input
            type={fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text'}
            placeholder="Desde"
            value={condition.value || ''}
            onChange={(e) =>
              updateCondition(groupIndex, conditionIndex, { value: e.target.value })
            }
            className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <input
            type={fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text'}
            placeholder="Hasta"
            value={condition.value2 || ''}
            onChange={(e) =>
              updateCondition(groupIndex, conditionIndex, { value2: e.target.value })
            }
            className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
      );
    }

    if (fieldType === 'boolean') {
      return (
        <select
          value={condition.value || ''}
          onChange={(e) =>
            updateCondition(groupIndex, conditionIndex, { value: e.target.value === 'true' })
          }
          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="">Seleccionar...</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      );
    }

    return (
      <input
        type={fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text'}
        placeholder="Valor"
        value={condition.value || ''}
        onChange={(e) =>
          updateCondition(groupIndex, conditionIndex, { value: e.target.value })
        }
        className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
      />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
          <Filter className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">Filtros</h3>
          <p className="text-sm text-gray-500">Define condiciones para filtrar los datos</p>
        </div>
        <button
          onClick={addGroup}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Grupo</span>
        </button>
      </div>

      {filters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay filtros definidos</p>
          <button
            onClick={addGroup}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Agregar primer filtro
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filters.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleGroup(groupIndex)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    {expandedGroups.has(groupIndex) ? '▼' : '▶'}
                  </button>
                  <span className="font-medium text-gray-700">Grupo {groupIndex + 1}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateGroupLogic(groupIndex, 'AND')}
                      className={`px-2 py-1 text-xs rounded ${
                        group.logic === 'AND'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Y
                    </button>
                    <button
                      onClick={() => updateGroupLogic(groupIndex, 'OR')}
                      className={`px-2 py-1 text-xs rounded ${
                        group.logic === 'OR'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      O
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {filters.length > 1 && (
                    <button
                      onClick={() => removeGroup(groupIndex)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {expandedGroups.has(groupIndex) && (
                <div className="space-y-3">
                  {group.conditions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p className="mb-2">No hay condiciones en este grupo</p>
                      <button
                        onClick={() => addCondition(groupIndex)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Agregar condición
                      </button>
                    </div>
                  ) : (
                    <>
                      {group.conditions.map((condition, conditionIndex) => (
                        <div
                          key={conditionIndex}
                          className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <select
                            value={condition.field}
                            onChange={(e) => {
                              const field = fields.find((f) => f.name === e.target.value);
                              const operators = getAvailableOperators(e.target.value);
                              updateCondition(groupIndex, conditionIndex, {
                                field: e.target.value,
                                operator: operators[0],
                                value: '',
                                value2: undefined,
                              });
                            }}
                            className="w-48 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                          >
                            {fields.map((field) => (
                              <option key={field.name} value={field.name}>
                                {field.label}
                              </option>
                            ))}
                          </select>

                          <select
                            value={condition.operator}
                            onChange={(e) =>
                              updateCondition(groupIndex, conditionIndex, {
                                operator: e.target.value as FilterOperator,
                                value: '',
                                value2: undefined,
                              })
                            }
                            className="w-40 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                          >
                            {getAvailableOperators(condition.field).map((op) => (
                              <option key={op} value={op}>
                                {OPERATOR_LABELS[op]}
                              </option>
                            ))}
                          </select>

                          {renderValueInput(condition, groupIndex, conditionIndex)}

                          {group.conditions.length > 1 && (
                            <button
                              onClick={() => removeCondition(groupIndex, conditionIndex)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        onClick={() => addCondition(groupIndex)}
                        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar condición</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


