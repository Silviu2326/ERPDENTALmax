import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, Loader2 } from 'lucide-react';
import {
  MaintenancePlan,
  NuevoMaintenancePlan,
} from '../api/maintenanceApi';
import { obtenerEquipos, EquipoClinico } from '../api/equiposApi';

interface MaintenancePlanFormProps {
  plan?: MaintenancePlan;
  onSubmit: (plan: NuevoMaintenancePlan) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function MaintenancePlanForm({
  plan,
  onSubmit,
  onCancel,
  loading = false,
}: MaintenancePlanFormProps) {
  const [formData, setFormData] = useState<NuevoMaintenancePlan>({
    name: plan?.name || '',
    description: plan?.description || '',
    equipment: plan?.equipment._id || '',
    frequencyType: plan?.frequencyType || 'MENSUAL',
    frequencyValue: plan?.frequencyValue || 1,
    tasks: plan?.tasks || [''],
    assignedTo: plan?.assignedTo._id || '',
  });

  const [equipos, setEquipos] = useState<EquipoClinico[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [loadingEquipos, setLoadingEquipos] = useState(false);

  useEffect(() => {
    cargarEquipos();
    cargarUsuarios();
  }, []);

  const cargarEquipos = async () => {
    setLoadingEquipos(true);
    try {
      const response = await obtenerEquipos({});
      setEquipos(response.equipos);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
    } finally {
      setLoadingEquipos(false);
    }
  };

  const cargarUsuarios = async () => {
    // TODO: Implementar carga de usuarios desde API
    // Por ahora usamos datos mock
    setUsers([
      { _id: '1', nombre: 'Juan', apellidos: 'Pérez' },
      { _id: '2', nombre: 'María', apellidos: 'García' },
      { _id: '3', nombre: 'Carlos', apellidos: 'López' },
    ]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'frequencyValue' ? parseInt(value) || 1 : value,
    }));
    // Limpiar error del campo
    if (errores[name]) {
      setErrores((prev) => {
        const nuevo = { ...prev };
        delete nuevo[name];
        return nuevo;
      });
    }
  };

  const handleTaskChange = (index: number, value: string) => {
    const nuevasTareas = [...formData.tasks];
    nuevasTareas[index] = value;
    setFormData((prev) => ({
      ...prev,
      tasks: nuevasTareas,
    }));
  };

  const agregarTarea = () => {
    setFormData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, ''],
    }));
  };

  const eliminarTarea = (index: number) => {
    const nuevasTareas = formData.tasks.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      tasks: nuevasTareas.length > 0 ? nuevasTareas : [''],
    }));
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.name.trim()) {
      nuevosErrores.name = 'El nombre del plan es obligatorio';
    }

    if (!formData.equipment) {
      nuevosErrores.equipment = 'Debe seleccionar un equipo';
    }

    if (!formData.assignedTo) {
      nuevosErrores.assignedTo = 'Debe asignar un responsable';
    }

    if (formData.frequencyValue <= 0) {
      nuevosErrores.frequencyValue = 'El valor de frecuencia debe ser mayor a 0';
    }

    if (formData.tasks.filter((t) => t.trim()).length === 0) {
      nuevosErrores.tasks = 'Debe agregar al menos una tarea';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    // Filtrar tareas vacías
    const tareasFiltradas = formData.tasks.filter((t) => t.trim());
    const datosEnviar = {
      ...formData,
      tasks: tareasFiltradas,
    };

    await onSubmit(datosEnviar);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {plan ? 'Editar Plan de Mantenimiento' : 'Nuevo Plan de Mantenimiento'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Plan *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: Mantenimiento Preventivo Sillón Dental 1"
              required
            />
            {errores.name && <p className="mt-1 text-sm text-red-600">{errores.name}</p>}
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción del plan de mantenimiento..."
            />
          </div>

          {/* Equipo */}
          <div>
            <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-2">
              Equipo *
            </label>
            <select
              id="equipment"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.equipment ? 'border-red-300' : 'border-gray-300'
              }`}
              required
              disabled={loadingEquipos}
            >
              <option value="">Seleccionar equipo...</option>
              {equipos.map((equipo) => (
                <option key={equipo._id} value={equipo._id}>
                  {equipo.nombre} - {equipo.marca} {equipo.modelo}
                </option>
              ))}
            </select>
            {errores.equipment && (
              <p className="mt-1 text-sm text-red-600">{errores.equipment}</p>
            )}
          </div>

          {/* Responsable */}
          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
              Responsable *
            </label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.assignedTo ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar responsable...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.nombre} {user.apellidos || ''}
                </option>
              ))}
            </select>
            {errores.assignedTo && (
              <p className="mt-1 text-sm text-red-600">{errores.assignedTo}</p>
            )}
          </div>

          {/* Tipo de Frecuencia */}
          <div>
            <label htmlFor="frequencyType" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Frecuencia *
            </label>
            <select
              id="frequencyType"
              name="frequencyType"
              value={formData.frequencyType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="DIARIO">Diario</option>
              <option value="SEMANAL">Semanal</option>
              <option value="MENSUAL">Mensual</option>
              <option value="TRIMESTRAL">Trimestral</option>
              <option value="ANUAL">Anual</option>
            </select>
          </div>

          {/* Valor de Frecuencia */}
          <div>
            <label
              htmlFor="frequencyValue"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Valor de Frecuencia *
            </label>
            <input
              type="number"
              id="frequencyValue"
              name="frequencyValue"
              value={formData.frequencyValue}
              onChange={handleChange}
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.frequencyValue ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Cada cuántos períodos (ej: cada 2 meses, cada 3 semanas)
            </p>
            {errores.frequencyValue && (
              <p className="mt-1 text-sm text-red-600">{errores.frequencyValue}</p>
            )}
          </div>

          {/* Tareas */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tareas de Mantenimiento *
            </label>
            <div className="space-y-2">
              {formData.tasks.map((task, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Lubricar turbina, Verificar presión de compresor..."
                  />
                  {formData.tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarTarea(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={agregarTarea}
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar Tarea
              </button>
            </div>
            {errores.tasks && <p className="mt-1 text-sm text-red-600">{errores.tasks}</p>}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          disabled={loading}
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar Plan
            </>
          )}
        </button>
      </div>
    </form>
  );
}

