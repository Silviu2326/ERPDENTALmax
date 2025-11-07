import { useState, useEffect } from 'react';
import { X, Save, Calendar, Wrench, FileText, DollarSign, Building2 } from 'lucide-react';
import {
  RevisionTecnica,
  NuevaRevisionTecnica,
  ActualizarRevisionTecnica,
  crearRevisionTecnica,
  actualizarRevisionTecnica,
} from '../api/revisionesTecnicasApi';

interface ModalFormRevisionTecnicaProps {
  revision?: RevisionTecnica | null;
  fechaSeleccionada?: Date;
  onClose: () => void;
  onSave: () => void;
  sedes?: Array<{ _id: string; nombre: string }>;
  equipos?: Array<{ _id: string; nombre: string; marca?: string; modelo?: string; sede?: { _id: string } }>;
}

export default function ModalFormRevisionTecnica({
  revision,
  fechaSeleccionada,
  onClose,
  onSave,
  sedes = [],
  equipos = [],
}: ModalFormRevisionTecnicaProps) {
  const [formData, setFormData] = useState<NuevaRevisionTecnica | ActualizarRevisionTecnica>({
    equipoId: revision?.equipo._id || '',
    sedeId: revision?.sede._id || '',
    fechaProgramada: revision?.fechaProgramada || '',
    tecnicoResponsable: revision?.tecnicoResponsable || '',
    descripcionTrabajo: revision?.descripcionTrabajo || '',
    notas: revision?.notas || '',
    costo: revision?.costo || undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [equiposFiltrados, setEquiposFiltrados] = useState(equipos);

  useEffect(() => {
    if (fechaSeleccionada) {
      setFormData((prev) => ({
        ...prev,
        fechaProgramada: fechaSeleccionada.toISOString(),
      }));
    }
  }, [fechaSeleccionada]);

  useEffect(() => {
    // Filtrar equipos por sede seleccionada
    if (formData.sedeId) {
      const filtrados = equipos.filter(
        (equipo) => equipo.sede?._id === formData.sedeId
      );
      setEquiposFiltrados(filtrados);
      // Si el equipo actual no pertenece a la sede seleccionada, limpiarlo
      if (formData.equipoId && !filtrados.find((e) => e._id === formData.equipoId)) {
        setFormData((prev) => ({
          ...prev,
          equipoId: '',
        }));
      }
    } else {
      setEquiposFiltrados(equipos);
    }
  }, [formData.sedeId, equipos]);

  const handleChange = (key: keyof typeof formData, value: string | number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.equipoId || !formData.sedeId || !formData.fechaProgramada || !formData.tecnicoResponsable) {
        throw new Error('Por favor complete todos los campos obligatorios');
      }

      if (revision?._id) {
        await actualizarRevisionTecnica(revision._id, formData as ActualizarRevisionTecnica);
      } else {
        await crearRevisionTecnica(formData as NuevaRevisionTecnica);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la revisión técnica');
    } finally {
      setLoading(false);
    }
  };

  const fechaProgramada = formData.fechaProgramada
    ? new Date(formData.fechaProgramada)
    : new Date();
  const fechaStr = fechaProgramada.toISOString().split('T')[0];
  const horaStr = `${fechaProgramada.getHours().toString().padStart(2, '0')}:${fechaProgramada.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200/60 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {revision ? 'Editar Revisión Técnica' : 'Nueva Revisión Técnica'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors p-2 hover:bg-slate-100 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Building2 size={16} className="inline mr-1" />
                Sede *
              </label>
              <select
                value={(formData as NuevaRevisionTecnica).sedeId || ''}
                onChange={(e) => handleChange('sedeId', e.target.value)}
                required
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Seleccione una sede</option>
                {sedes.map((sede) => (
                  <option key={sede._id} value={sede._id}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Wrench size={16} className="inline mr-1" />
                Equipo *
              </label>
              <select
                value={(formData as NuevaRevisionTecnica).equipoId || ''}
                onChange={(e) => handleChange('equipoId', e.target.value)}
                required
                disabled={!formData.sedeId}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500"
              >
                <option value="">Seleccione un equipo</option>
                {equiposFiltrados.map((equipo) => (
                  <option key={equipo._id} value={equipo._id}>
                    {equipo.nombre} {equipo.marca && equipo.modelo ? `(${equipo.marca} ${equipo.modelo})` : ''}
                  </option>
                ))}
              </select>
              {!formData.sedeId && (
                <p className="text-xs text-slate-500 mt-1">Seleccione primero una sede</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha Programada *
              </label>
              <input
                type="date"
                value={fechaStr}
                onChange={(e) => {
                  const nuevaFecha = new Date(e.target.value);
                  nuevaFecha.setHours(fechaProgramada.getHours(), fechaProgramada.getMinutes(), 0, 0);
                  handleChange('fechaProgramada', nuevaFecha.toISOString());
                }}
                required
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Hora
              </label>
              <input
                type="time"
                value={horaStr}
                onChange={(e) => {
                  const [hora, minuto] = e.target.value.split(':');
                  const nuevaFecha = new Date(fechaProgramada);
                  nuevaFecha.setHours(parseInt(hora || '0'), parseInt(minuto || '0'), 0, 0);
                  handleChange('fechaProgramada', nuevaFecha.toISOString());
                }}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Wrench size={16} className="inline mr-1" />
              Técnico Responsable *
            </label>
            <input
              type="text"
              value={formData.tecnicoResponsable || ''}
              onChange={(e) => handleChange('tecnicoResponsable', e.target.value)}
              required
              placeholder="Nombre del técnico"
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <FileText size={16} className="inline mr-1" />
              Descripción del Trabajo
            </label>
            <textarea
              value={formData.descripcionTrabajo || ''}
              onChange={(e) => handleChange('descripcionTrabajo', e.target.value)}
              rows={3}
              placeholder="Descripción del trabajo a realizar..."
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <DollarSign size={16} className="inline mr-1" />
              Costo (€)
            </label>
            <input
              type="number"
              value={formData.costo || ''}
              onChange={(e) => handleChange('costo', e.target.value ? parseFloat(e.target.value) : undefined)}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <FileText size={16} className="inline mr-1" />
              Notas
            </label>
            <textarea
              value={formData.notas || ''}
              onChange={(e) => handleChange('notas', e.target.value)}
              rows={3}
              placeholder="Notas adicionales..."
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>

          {revision && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha de Realización
                </label>
                <input
                  type="date"
                  value={revision.fechaRealizacion ? new Date(revision.fechaRealizacion).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const nuevaFecha = new Date(e.target.value);
                      handleChange('fechaRealizacion', nuevaFecha.toISOString());
                    } else {
                      handleChange('fechaRealizacion', undefined);
                    }
                  }}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={revision.estado || 'Programada'}
                  onChange={(e) => handleChange('estado', e.target.value as any)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="Programada">Programada</option>
                  <option value="Completada">Completada</option>
                  <option value="Retrasada">Retrasada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200/60">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              <span>{loading ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



