import { useState } from 'react';
import { Save, Plus, Trash2, Clock, Calendar, FileText } from 'lucide-react';
import { PlantillaHorario, crearPlantillaHorario } from '../api/horariosApi';

interface FormularioPlantillaHorarioProps {
  onGuardado: () => void;
  onCancelar: () => void;
}

const diasSemana = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export default function FormularioPlantillaHorario({
  onGuardado,
  onCancelar,
}: FormularioPlantillaHorarioProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    sedeId: '',
    turnos: [] as Array<{
      diaSemana: number;
      horaInicio: string;
      horaFin: string;
    }>,
  });

  // Mock de sedes
  const sedes = [
    { _id: '1', nombre: 'Sede Principal' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

  const agregarTurno = () => {
    setFormData({
      ...formData,
      turnos: [
        ...formData.turnos,
        {
          diaSemana: 1, // Lunes por defecto
          horaInicio: '09:00',
          horaFin: '14:00',
        },
      ],
    });
  };

  const eliminarTurno = (index: number) => {
    setFormData({
      ...formData,
      turnos: formData.turnos.filter((_, i) => i !== index),
    });
  };

  const actualizarTurno = (index: number, campo: string, valor: string | number) => {
    const nuevosTurnos = [...formData.turnos];
    nuevosTurnos[index] = {
      ...nuevosTurnos[index],
      [campo]: valor,
    };
    setFormData({
      ...formData,
      turnos: nuevosTurnos,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.turnos.length === 0) {
      setError('Debe agregar al menos un turno a la plantilla');
      setLoading(false);
      return;
    }

    try {
      await crearPlantillaHorario({
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        turnos: formData.turnos,
        sedeId: formData.sedeId || undefined,
      });
      onGuardado();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la plantilla');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
          <Calendar size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Nueva Plantilla de Horario</h3>
          <p className="text-sm text-gray-600">Crea una plantilla reutilizable para asignar horarios</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Nombre */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <FileText size={16} className="inline" />
            <span>Nombre de la Plantilla *</span>
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
            disabled={loading}
            placeholder="Ej: Horario de Mañana"
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <FileText size={16} className="inline" />
            <span>Descripción</span>
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            disabled={loading}
            rows={3}
            placeholder="Descripción opcional de la plantilla..."
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100"
          />
        </div>

        {/* Sede (opcional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Sede (opcional)
          </label>
          <select
            value={formData.sedeId}
            onChange={(e) => setFormData({ ...formData, sedeId: e.target.value })}
            disabled={loading}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100"
          >
            <option value="">Todas las sedes</option>
            {sedes.map((sede) => (
              <option key={sede._id} value={sede._id}>
                {sede.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Turnos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Clock size={16} className="inline" />
              <span>Turnos *</span>
            </label>
            <button
              type="button"
              onClick={agregarTurno}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              <Plus size={16} />
              Agregar Turno
            </button>
          </div>

          {formData.turnos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
              <Clock size={32} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No hay turnos agregados. Haz clic en "Agregar Turno" para comenzar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {formData.turnos.map((turno, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200"
                >
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    {/* Día de la semana */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Día</label>
                      <select
                        value={turno.diaSemana}
                        onChange={(e) =>
                          actualizarTurno(index, 'diaSemana', parseInt(e.target.value))
                        }
                        disabled={loading}
                        className="w-full px-2 py-1.5 text-sm rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-100"
                      >
                        {diasSemana.map((dia) => (
                          <option key={dia.value} value={dia.value}>
                            {dia.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Hora inicio */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Hora Inicio
                      </label>
                      <input
                        type="time"
                        value={turno.horaInicio}
                        onChange={(e) => actualizarTurno(index, 'horaInicio', e.target.value)}
                        disabled={loading}
                        className="w-full px-2 py-1.5 text-sm rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-100"
                      />
                    </div>

                    {/* Hora fin */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Hora Fin</label>
                      <input
                        type="time"
                        value={turno.horaFin}
                        onChange={(e) => actualizarTurno(index, 'horaFin', e.target.value)}
                        disabled={loading}
                        className="w-full px-2 py-1.5 text-sm rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => eliminarTurno(index)}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancelar}
            disabled={loading}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || formData.turnos.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <Save size={16} />
            {loading ? 'Guardando...' : 'Guardar Plantilla'}
          </button>
        </div>
      </form>
    </div>
  );
}



