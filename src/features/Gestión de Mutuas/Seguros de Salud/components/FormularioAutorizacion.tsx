import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { NuevaAutorizacion, Autorizacion } from '../api/autorizacionesApi';

interface FormularioAutorizacionProps {
  autorizacion?: Autorizacion | null;
  onGuardar: (datos: NuevaAutorizacion) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
  pacientes?: Array<{ _id: string; nombre: string; apellidos: string }>;
  mutuas?: Array<{ _id: string; nombreComercial: string }>;
  tratamientos?: Array<{ _id: string; nombre: string; descripcion?: string }>;
}

export default function FormularioAutorizacion({
  autorizacion,
  onGuardar,
  onCancelar,
  loading = false,
  pacientes = [],
  mutuas = [],
  tratamientos = [],
}: FormularioAutorizacionProps) {
  const [formData, setFormData] = useState<NuevaAutorizacion>({
    pacienteId: autorizacion?.paciente._id || '',
    tratamientoPlanificadoId: autorizacion?.tratamientoPlanificado._id || '',
    mutuaId: autorizacion?.mutua._id || '',
    notas: autorizacion?.notas || '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autorizacion) {
      setFormData({
        pacienteId: autorizacion.paciente._id,
        tratamientoPlanificadoId: autorizacion.tratamientoPlanificado._id,
        mutuaId: autorizacion.mutua._id,
        notas: autorizacion.notas || '',
      });
    }
  }, [autorizacion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.pacienteId || !formData.tratamientoPlanificadoId || !formData.mutuaId) {
      setError('Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
      await onGuardar(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la autorización');
    }
  };

  const handleChange = (campo: keyof NuevaAutorizacion, valor: string) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {autorizacion ? 'Editar Autorización' : 'Nueva Autorización de Tratamiento'}
            </h2>
            <button
              onClick={onCancelar}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">Error</p>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Campo Paciente */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Paciente <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.pacienteId}
              onChange={(e) => handleChange('pacienteId', e.target.value)}
              disabled={loading || !!autorizacion}
              required
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="">Selecciona un paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente._id} value={paciente._id}>
                  {paciente.nombre} {paciente.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Tratamiento */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tratamiento Planificado <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tratamientoPlanificadoId}
              onChange={(e) => handleChange('tratamientoPlanificadoId', e.target.value)}
              disabled={loading || !!autorizacion}
              required
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="">Selecciona un tratamiento</option>
              {tratamientos.map((tratamiento) => (
                <option key={tratamiento._id} value={tratamiento._id}>
                  {tratamiento.nombre}
                </option>
              ))}
            </select>
            {formData.tratamientoPlanificadoId && (
              <p className="text-xs text-slate-600 mt-1">
                {tratamientos.find((t) => t._id === formData.tratamientoPlanificadoId)?.descripcion || ''}
              </p>
            )}
          </div>

          {/* Campo Mutua */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mutua/Seguro de Salud <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.mutuaId}
              onChange={(e) => handleChange('mutuaId', e.target.value)}
              disabled={loading || !!autorizacion}
              required
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="">Selecciona una mutua o seguro</option>
              {mutuas.map((mutua) => (
                <option key={mutua._id} value={mutua._id}>
                  {mutua.nombreComercial}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Notas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={formData.notas || ''}
              onChange={(e) => handleChange('notas', e.target.value)}
              disabled={loading}
              rows={4}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed resize-none placeholder-slate-400"
              placeholder="Añade cualquier información adicional relevante para la autorización..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancelar}
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



