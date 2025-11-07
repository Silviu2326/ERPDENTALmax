import { useState } from 'react';
import { Plus, X, Calendar, Edit2 } from 'lucide-react';
import { Habito } from '../api/fichasPediatricasAPI';

interface SeccionHabitosYControlProps {
  habitos: Habito[];
  onChange: (habitos: Habito[]) => void;
  readonly?: boolean;
}

const HABITOS_COMUNES = [
  'Succión digital (dedo)',
  'Uso de chupete',
  'Uso de biberón',
  'Bruxismo',
  'Onicofagia (morderse las uñas)',
  'Respiración bucal',
  'Deglución atípica',
  'Interposición lingual',
  'Mordida de objetos',
];

export default function SeccionHabitosYControl({
  habitos,
  onChange,
  readonly = false,
}: SeccionHabitosYControlProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [habitoEditando, setHabitoEditando] = useState<number | null>(null);
  const [nuevoHabito, setNuevoHabito] = useState<Partial<Habito>>({
    nombre: '',
    activo: true,
    observaciones: '',
    fechaInicio: '',
    fechaFin: '',
  });

  const handleAgregarHabito = () => {
    if (!nuevoHabito.nombre?.trim()) return;

    const habitoCompleto: Habito = {
      nombre: nuevoHabito.nombre.trim(),
      activo: nuevoHabito.activo ?? true,
      observaciones: nuevoHabito.observaciones,
      fechaInicio: nuevoHabito.fechaInicio || undefined,
      fechaFin: nuevoHabito.fechaFin || undefined,
    };

    if (habitoEditando !== null) {
      // Editar hábito existente
      const updated = [...habitos];
      updated[habitoEditando] = habitoCompleto;
      onChange(updated);
      setHabitoEditando(null);
    } else {
      // Agregar nuevo hábito
      onChange([...habitos, habitoCompleto]);
    }

    // Resetear formulario
    setNuevoHabito({
      nombre: '',
      activo: true,
      observaciones: '',
      fechaInicio: '',
      fechaFin: '',
    });
    setMostrarFormulario(false);
  };

  const handleEliminarHabito = (index: number) => {
    if (readonly) return;
    const updated = habitos.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleEditarHabito = (index: number) => {
    if (readonly) return;
    const habito = habitos[index];
    setNuevoHabito({
      nombre: habito.nombre,
      activo: habito.activo,
      observaciones: habito.observaciones || '',
      fechaInicio: habito.fechaInicio || '',
      fechaFin: habito.fechaFin || '',
    });
    setHabitoEditando(index);
    setMostrarFormulario(true);
  };

  const handleCancelar = () => {
    setNuevoHabito({
      nombre: '',
      activo: true,
      observaciones: '',
      fechaInicio: '',
      fechaFin: '',
    });
    setHabitoEditando(null);
    setMostrarFormulario(false);
  };

  const toggleHabitoActivo = (index: number) => {
    if (readonly) return;
    const updated = [...habitos];
    updated[index].activo = !updated[index].activo;
    if (!updated[index].activo && !updated[index].fechaFin) {
      updated[index].fechaFin = new Date().toISOString().split('T')[0];
    }
    onChange(updated);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Hábitos Bucales</h3>
        {!readonly && (
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={20} />
            {habitoEditando !== null ? 'Editando...' : 'Agregar Hábito'}
          </button>
        )}
      </div>

      {mostrarFormulario && (
        <div className="mb-6 p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre del Hábito
              </label>
              <select
                value={nuevoHabito.nombre || ''}
                onChange={(e) => setNuevoHabito({ ...nuevoHabito, nombre: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Seleccionar hábito común...</option>
                {HABITOS_COMUNES.map((habito) => (
                  <option key={habito} value={habito}>
                    {habito}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={nuevoHabito.nombre || ''}
                onChange={(e) => setNuevoHabito({ ...nuevoHabito, nombre: e.target.value })}
                placeholder="O escribir un hábito personalizado"
                className="mt-2 w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={nuevoHabito.fechaInicio || ''}
                  onChange={(e) => setNuevoHabito({ ...nuevoHabito, fechaInicio: e.target.value })}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Fecha de Fin (si ya no está activo)
                </label>
                <input
                  type="date"
                  value={nuevoHabito.fechaFin || ''}
                  onChange={(e) => setNuevoHabito({ ...nuevoHabito, fechaFin: e.target.value })}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={nuevoHabito.activo ?? true}
                  onChange={(e) => setNuevoHabito({ ...nuevoHabito, activo: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Hábito activo actualmente</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={nuevoHabito.observaciones || ''}
                onChange={(e) => setNuevoHabito({ ...nuevoHabito, observaciones: e.target.value })}
                rows={3}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Observaciones sobre el hábito..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAgregarHabito}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {habitoEditando !== null ? 'Actualizar' : 'Agregar'}
              </button>
              <button
                onClick={handleCancelar}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {habitos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay hábitos registrados</p>
        ) : (
          habitos.map((habito, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ring-1 ${
                habito.activo
                  ? 'bg-green-50 ring-green-200'
                  : 'bg-slate-50 ring-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{habito.nombre}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        habito.activo
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {habito.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  {(habito.fechaInicio || habito.fechaFin) && (
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                      {habito.fechaInicio && (
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          Inicio: {new Date(habito.fechaInicio).toLocaleDateString('es-ES')}
                        </span>
                      )}
                      {habito.fechaFin && (
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          Fin: {new Date(habito.fechaFin).toLocaleDateString('es-ES')}
                        </span>
                      )}
                    </div>
                  )}
                  {habito.observaciones && (
                    <p className="text-sm text-slate-600">{habito.observaciones}</p>
                  )}
                </div>
                {!readonly && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleHabitoActivo(index)}
                      className={`p-2 rounded-lg transition-colors ${
                        habito.activo
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-green-200 text-green-700 hover:bg-green-300'
                      }`}
                      title={habito.activo ? 'Marcar como inactivo' : 'Marcar como activo'}
                    >
                      {habito.activo ? '✓' : '○'}
                    </button>
                    <button
                      onClick={() => handleEditarHabito(index)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleEliminarHabito(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



