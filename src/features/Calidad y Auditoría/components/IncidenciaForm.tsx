import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Incidencia, NuevaIncidencia, ActualizarIncidencia } from '../api/incidenciasApi';

interface IncidenciaFormProps {
  incidencia?: Incidencia;
  onGuardar: (datos: NuevaIncidencia | ActualizarIncidencia) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
  clinicaId?: string;
  usuarioId?: string;
}

export default function IncidenciaForm({
  incidencia,
  onGuardar,
  onCancelar,
  loading = false,
  clinicaId,
  usuarioId,
}: IncidenciaFormProps) {
  const [formData, setFormData] = useState({
    tipo: (incidencia?.tipo || 'Incidencia Clínica') as Incidencia['tipo'],
    descripcion_detallada: incidencia?.descripcion_detallada || '',
    fecha_deteccion: incidencia?.fecha_deteccion
      ? new Date(incidencia.fecha_deteccion).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    area_afectada: incidencia?.area_afectada || '',
  });

  const [error, setError] = useState<string | null>(null);

  const tipos = [
    'No Conformidad Producto',
    'Incidencia Clínica',
    'Queja Paciente',
    'Incidente Seguridad',
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.descripcion_detallada.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    try {
      if (incidencia) {
        // Actualizar incidencia existente
        await onGuardar({
          tipo: formData.tipo,
          descripcion_detallada: formData.descripcion_detallada,
          fecha_deteccion: formData.fecha_deteccion,
          area_afectada: formData.area_afectada || undefined,
        });
      } else {
        // Crear nueva incidencia
        if (!clinicaId || !usuarioId) {
          setError('Faltan datos necesarios (clínica o usuario)');
          return;
        }
        await onGuardar({
          tipo: formData.tipo,
          descripcion_detallada: formData.descripcion_detallada,
          fecha_deteccion: formData.fecha_deteccion,
          clinicaId,
          reportado_por: usuarioId,
          area_afectada: formData.area_afectada || undefined,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la incidencia');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tipo de Incidencia *
        </label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Incidencia['tipo'] })}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          required
        >
          {tipos.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Fecha de Detección *
        </label>
        <input
          type="date"
          value={formData.fecha_deteccion}
          onChange={(e) => setFormData({ ...formData, fecha_deteccion: e.target.value })}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Descripción Detallada *
        </label>
        <textarea
          value={formData.descripcion_detallada}
          onChange={(e) => setFormData({ ...formData, descripcion_detallada: e.target.value })}
          rows={6}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          placeholder="Describe detalladamente la incidencia o no conformidad detectada..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Área Afectada
        </label>
        <input
          type="text"
          value={formData.area_afectada}
          onChange={(e) => setFormData({ ...formData, area_afectada: e.target.value })}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          placeholder="Ej: Consultorio 1, Almacén, Recepción..."
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancelar}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 shadow-sm ring-1 ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={16} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {loading ? 'Guardando...' : incidencia ? 'Actualizar' : 'Crear Incidencia'}
        </button>
      </div>
    </form>
  );
}



