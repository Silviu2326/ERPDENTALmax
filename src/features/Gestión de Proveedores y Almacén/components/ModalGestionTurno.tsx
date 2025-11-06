import { useState, useEffect } from 'react';
import { X, Save, Trash2, Calendar, Clock, User, Building2, FileText } from 'lucide-react';
import {
  HorarioProfesional,
  crearHorario,
  actualizarHorario,
  eliminarHorario,
} from '../api/horariosApi';
import { obtenerProfesionales, Profesional } from '../../Agenda de Citas y Programación/api/citasApi';

interface ModalGestionTurnoProps {
  horario?: HorarioProfesional | null;
  fechaInicial?: Date;
  profesionalIdInicial?: string;
  sedeIdInicial?: string;
  onClose: () => void;
  onSave: () => void;
}

export default function ModalGestionTurno({
  horario,
  fechaInicial,
  profesionalIdInicial,
  sedeIdInicial,
  onClose,
  onSave,
}: ModalGestionTurnoProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);

  const [formData, setFormData] = useState({
    profesionalId: horario?.profesional._id || profesionalIdInicial || '',
    sedeId: horario?.sede._id || sedeIdInicial || '',
    fechaInicio: horario
      ? new Date(horario.fechaInicio).toISOString().slice(0, 16)
      : fechaInicial
      ? new Date(fechaInicial).toISOString().slice(0, 16)
      : '',
    fechaFin: horario
      ? new Date(horario.fechaFin).toISOString().slice(0, 16)
      : fechaInicial
      ? new Date(new Date(fechaInicial).setHours(new Date(fechaInicial).getHours() + 8))
          .toISOString()
          .slice(0, 16)
      : '',
    tipo: (horario?.tipo || 'trabajo') as 'trabajo' | 'ausencia_justificada' | 'vacaciones' | 'bloqueo',
    notas: horario?.notas || '',
  });

  // Mock de sedes
  const sedes = [
    { _id: '1', nombre: 'Sede Principal' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

  useEffect(() => {
    const cargarProfesionales = async () => {
      try {
        const profs = await obtenerProfesionales();
        setProfesionales(profs);
      } catch (error) {
        console.error('Error al cargar profesionales:', error);
      }
    };
    cargarProfesionales();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (horario?._id) {
        // Actualizar horario existente
        await actualizarHorario(horario._id, {
          fechaInicio: new Date(formData.fechaInicio).toISOString(),
          fechaFin: new Date(formData.fechaFin).toISOString(),
          tipo: formData.tipo,
          notas: formData.notas,
        });
      } else {
        // Crear nuevo horario
        await crearHorario({
          profesionalId: formData.profesionalId,
          sedeId: formData.sedeId,
          fechaInicio: new Date(formData.fechaInicio).toISOString(),
          fechaFin: new Date(formData.fechaFin).toISOString(),
          tipo: formData.tipo === 'ausencia_justificada' ? 'ausencia' : formData.tipo,
          notas: formData.notas,
        });
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el turno');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!horario?._id) return;

    if (!confirm('¿Está seguro de que desea eliminar este turno?')) return;

    setLoading(true);
    setError(null);

    try {
      await eliminarHorario(horario._id);
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el turno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">
              {horario ? 'Editar Turno' : 'Nuevo Turno'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Profesional */}
          {!profesionalIdInicial && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Profesional *</span>
              </label>
              <select
                value={formData.profesionalId}
                onChange={(e) => setFormData({ ...formData, profesionalId: e.target.value })}
                required
                disabled={loading || !!horario}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Seleccionar profesional</option>
                {profesionales.map((prof) => (
                  <option key={prof._id} value={prof._id}>
                    {prof.nombre} {prof.apellidos}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sede */}
          {!sedeIdInicial && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4" />
                <span>Sede *</span>
              </label>
              <select
                value={formData.sedeId}
                onChange={(e) => setFormData({ ...formData, sedeId: e.target.value })}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Seleccionar sede</option>
                {sedes.map((sede) => (
                  <option key={sede._id} value={sede._id}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Fecha y hora de inicio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              <span>Fecha y Hora de Inicio *</span>
            </label>
            <input
              type="datetime-local"
              value={formData.fechaInicio}
              onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Fecha y hora de fin */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              <span>Fecha y Hora de Fin *</span>
            </label>
            <input
              type="datetime-local"
              value={formData.fechaFin}
              onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              <span>Tipo *</span>
            </label>
            <select
              value={formData.tipo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipo: e.target.value as 'trabajo' | 'ausencia_justificada' | 'vacaciones' | 'bloqueo',
                })
              }
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="trabajo">Trabajo</option>
              <option value="ausencia_justificada">Ausencia Justificada</option>
              <option value="vacaciones">Vacaciones</option>
              <option value="bloqueo">Bloqueo</option>
            </select>
          </div>

          {/* Notas */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              <span>Notas</span>
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              disabled={loading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Notas adicionales sobre el turno..."
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              {horario?._id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


