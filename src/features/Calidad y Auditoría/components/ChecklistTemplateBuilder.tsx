import { useState } from 'react';
import { Plus, Trash2, GripVertical, Save, X } from 'lucide-react';
import { ChecklistItem, CreateAuditTemplateRequest } from '../api/auditTemplatesApi';

interface ChecklistTemplateBuilderProps {
  initialData?: {
    name: string;
    description: string;
    items: ChecklistItem[];
  };
  onSave: (template: CreateAuditTemplateRequest) => void;
  onCancel?: () => void;
}

export default function ChecklistTemplateBuilder({
  initialData,
  onSave,
  onCancel,
}: ChecklistTemplateBuilderProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [items, setItems] = useState<ChecklistItem[]>(
    initialData?.items || []
  );

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      type: 'checkbox',
      label: '',
      isRequired: false,
      order: items.length,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const updateItem = (itemId: string, updates: Partial<ChecklistItem>) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [
      newItems[targetIndex],
      newItems[index],
    ];

    // Actualizar orden
    newItems.forEach((item, idx) => {
      item.order = idx;
    });

    setItems(newItems);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Por favor, ingrese un nombre para la plantilla');
      return;
    }

    const itemsWithLabels = items.filter((item) => item.label.trim());
    if (itemsWithLabels.length === 0) {
      alert('Por favor, agregue al menos un ítem con etiqueta');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      items: itemsWithLabels.map((item, index) => ({
        ...item,
        order: index,
      })),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {initialData ? 'Editar Plantilla' : 'Nueva Plantilla de Auditoría'}
        </h2>
        <div className="flex gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-xl ring-1 ring-slate-300 hover:bg-slate-50 transition-all"
            >
              <X size={20} />
              Cancelar
            </button>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
          >
            <Save size={20} />
            Guardar Plantilla
          </button>
        </div>
      </div>

      {/* Información básica */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre de la Plantilla <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Checklist de Primera Visita"
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción de la plantilla y su propósito..."
            rows={3}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
          />
        </div>
      </div>

      {/* Lista de ítems */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Ítems del Checklist</h3>
          <button
            onClick={addItem}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all shadow-sm"
          >
            <Plus size={20} />
            Agregar Ítem
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl ring-1 ring-slate-200 border-2 border-dashed border-slate-300">
            <p className="text-slate-600">No hay ítems en la plantilla</p>
            <p className="text-sm text-slate-400 mt-2">
              Haga clic en "Agregar Ítem" para comenzar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="bg-slate-50 rounded-2xl ring-1 ring-slate-200 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-2">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === items.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Etiqueta <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            updateItem(item.id, { label: e.target.value })
                          }
                          placeholder="Ej: Verificar historial médico"
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 pr-3 py-2.5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Tipo
                        </label>
                        <select
                          value={item.type}
                          onChange={(e) =>
                            updateItem(item.id, {
                              type: e.target.value as ChecklistItem['type'],
                              options: e.target.value === 'select' ? ['Opción 1'] : undefined,
                            })
                          }
                          className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                        >
                          <option value="checkbox">Casilla de verificación</option>
                          <option value="text">Campo de texto</option>
                          <option value="select">Selección múltiple</option>
                          <option value="file">Carga de archivo</option>
                        </select>
                      </div>
                    </div>

                    {item.type === 'select' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Opciones (una por línea)
                        </label>
                        <textarea
                          value={item.options?.join('\n') || ''}
                          onChange={(e) =>
                            updateItem(item.id, {
                              options: e.target.value.split('\n').filter((o) => o.trim()),
                            })
                          }
                          placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
                          rows={3}
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.isRequired}
                          onChange={(e) =>
                            updateItem(item.id, { isRequired: e.target.checked })
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">Obligatorio</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



