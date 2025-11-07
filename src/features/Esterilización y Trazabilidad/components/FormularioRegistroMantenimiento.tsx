import { useState } from 'react';
import { X, Upload, FileText, Calendar, Wrench, User, DollarSign, AlertCircle } from 'lucide-react';
import { registrarMantenimiento, NuevoMantenimiento } from '../api/mantenimientoAutoclaveApi';

interface FormularioRegistroMantenimientoProps {
  autoclaveId: string;
  onGuardar: () => void;
  onCancelar: () => void;
}

export default function FormularioRegistroMantenimiento({
  autoclaveId,
  onGuardar,
  onCancelar,
}: FormularioRegistroMantenimientoProps) {
  const [formData, setFormData] = useState<Omit<NuevoMantenimiento, 'documentosAdjuntos'>>({
    fecha: new Date().toISOString().split('T')[0],
    tipoMantenimiento: 'preventivo',
    descripcion: '',
    tecnicoResponsable: '',
    costo: 0,
  });
  const [archivos, setArchivos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'costo' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nuevosArchivos = Array.from(e.target.files);
      setArchivos((prev) => [...prev, ...nuevosArchivos]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const mantenimiento: NuevoMantenimiento = {
        ...formData,
        documentosAdjuntos: archivos.length > 0 ? archivos : undefined,
      };

      await registrarMantenimiento(autoclaveId, mantenimiento);
      onGuardar();
    } catch (err: any) {
      console.error('Error al registrar mantenimiento:', err);
      setError(err.message || 'Error al registrar el mantenimiento. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Registrar Mantenimiento</h3>
          <button
            onClick={onCancelar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Fecha del Mantenimiento
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Wrench size={16} className="inline mr-1" />
              Tipo de Mantenimiento
            </label>
            <select
              name="tipoMantenimiento"
              value={formData.tipoMantenimiento}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            >
              <option value="preventivo">Preventivo</option>
              <option value="correctivo">Correctivo</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción del Mantenimiento
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Describa los trabajos realizados, cambios de piezas, calibraciones, etc."
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <User size={16} className="inline mr-1" />
              Técnico Responsable
            </label>
            <input
              type="text"
              name="tecnicoResponsable"
              value={formData.tecnicoResponsable}
              onChange={handleInputChange}
              required
              placeholder="Nombre del técnico"
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <DollarSign size={16} className="inline mr-1" />
              Costo (€)
            </label>
            <input
              type="number"
              name="costo"
              value={formData.costo}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Upload size={16} className="inline mr-1" />
            Documentos Adjuntos (Opcional)
          </label>
          <div className="mt-2">
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-500 transition-colors bg-slate-50">
              <div className="text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">
                  Haga clic para seleccionar archivos o arrastre y suelte
                </p>
                <p className="text-xs text-slate-500 mt-1">PDF, imágenes, documentos</p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </label>
          </div>

          {archivos.length > 0 && (
            <div className="mt-4 space-y-2">
              {archivos.map((archivo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg ring-1 ring-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700">{archivo.name}</span>
                    <span className="text-xs text-slate-500">
                      ({(archivo.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancelar}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Wrench className="w-4 h-4" />
                <span>Registrar Mantenimiento</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}



