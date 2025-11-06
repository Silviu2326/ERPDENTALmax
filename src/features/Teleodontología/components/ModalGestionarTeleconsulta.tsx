import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText } from 'lucide-react';
import { Teleconsulta, CrearTeleconsultaData, ActualizarTeleconsultaData } from '../api/teleconsultasApi';

interface ModalGestionarTeleconsultaProps {
  isOpen: boolean;
  onClose: () => void;
  teleconsulta?: Teleconsulta | null;
  onGuardar: (datos: CrearTeleconsultaData | ActualizarTeleconsultaData) => Promise<void>;
  pacientes?: Array<{ _id: string; nombre: string; apellidos: string }>;
  odontologos?: Array<{ _id: string; nombre: string; apellidos: string }>;
}

export default function ModalGestionarTeleconsulta({
  isOpen,
  onClose,
  teleconsulta,
  onGuardar,
  pacientes = [],
  odontologos = [],
}: ModalGestionarTeleconsultaProps) {
  const [formData, setFormData] = useState<CrearTeleconsultaData | ActualizarTeleconsultaData>({
    pacienteId: '',
    odontologoId: '',
    fechaHoraInicio: '',
    motivoConsulta: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!teleconsulta;

  useEffect(() => {
    if (teleconsulta) {
      const fechaInicio = new Date(teleconsulta.fechaHoraInicio);
      const fechaLocal = fechaInicio.toISOString().slice(0, 16);
      setFormData({
        pacienteId: teleconsulta.pacienteId,
        odontologoId: teleconsulta.odontologoId,
        fechaHoraInicio: fechaLocal,
        motivoConsulta: teleconsulta.motivoConsulta || '',
        notasPrevias: teleconsulta.notasPrevias,
      });
    } else {
      // Resetear formulario para nueva teleconsulta
      const ahora = new Date();
      ahora.setMinutes(0);
      ahora.setSeconds(0);
      setFormData({
        pacienteId: '',
        odontologoId: '',
        fechaHoraInicio: ahora.toISOString().slice(0, 16),
        motivoConsulta: '',
      });
    }
    setError(null);
  }, [teleconsulta, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onGuardar(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la teleconsulta');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Editar Teleconsulta' : 'Nueva Teleconsulta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Paciente *
            </label>
            <select
              value={formData.pacienteId}
              onChange={(e) => setFormData({ ...formData, pacienteId: e.target.value })}
              required
              disabled={isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar paciente...</option>
              {pacientes.map((paciente) => (
                <option key={paciente._id} value={paciente._id}>
                  {paciente.nombre} {paciente.apellidos}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Odontólogo *
            </label>
            <select
              value={formData.odontologoId}
              onChange={(e) => setFormData({ ...formData, odontologoId: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar odontólogo...</option>
              {odontologos.map((odontologo) => (
                <option key={odontologo._id} value={odontologo._id}>
                  {odontologo.nombre} {odontologo.apellidos}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha y Hora *
            </label>
            <input
              type="datetime-local"
              value={formData.fechaHoraInicio}
              onChange={(e) => setFormData({ ...formData, fechaHoraInicio: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Motivo de Consulta
            </label>
            <textarea
              value={formData.motivoConsulta || ''}
              onChange={(e) => setFormData({ ...formData, motivoConsulta: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describa el motivo de la consulta..."
            />
          </div>

          {isEditMode && 'notasPrevias' in formData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Notas Previas
              </label>
              <textarea
                value={formData.notasPrevias || ''}
                onChange={(e) => setFormData({ ...formData, notasPrevias: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Agregar notas previas a la consulta..."
              />
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


