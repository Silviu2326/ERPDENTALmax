import { useState } from 'react';
import { X, Calendar, FileText, Upload, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { AgregarSeguimientoRequest } from '../api/postoperatorioApi';

interface ModalNuevoSeguimientoProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (seguimiento: AgregarSeguimientoRequest) => Promise<void>;
  loading?: boolean;
}

export default function ModalNuevoSeguimiento({
  isOpen,
  onClose,
  onGuardar,
  loading = false,
}: ModalNuevoSeguimientoProps) {
  const { user } = useAuth();
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 16));
  const [notasEvolucion, setNotasEvolucion] = useState('');
  const [archivos, setArchivos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fecha || !notasEvolucion.trim()) {
      setError('Por favor, complete todos los campos obligatorios');
      return;
    }

    if (!user?._id) {
      setError('No se pudo identificar al usuario actual');
      return;
    }

    try {
      // En producción, aquí se subirían los archivos a un servicio de almacenamiento
      // y se obtendrían las URLs. Por ahora, usamos URLs temporales.
      const adjuntos: string[] = [];
      
      // TODO: Implementar subida de archivos a servicio de almacenamiento (S3, Cloud Storage, etc.)
      // Por ahora, los adjuntos se guardan como array vacío
      // archivos.forEach(async (file) => {
      //   const url = await subirArchivo(file);
      //   adjuntos.push(url);
      // });

      const seguimiento: AgregarSeguimientoRequest = {
        fecha: new Date(fecha).toISOString(),
        notasEvolucion: notasEvolucion.trim(),
        profesionalId: user._id,
        adjuntos,
      };

      await onGuardar(seguimiento);

      // Limpiar formulario
      setFecha(new Date().toISOString().slice(0, 16));
      setNotasEvolucion('');
      setArchivos([]);
      setError(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el seguimiento');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setArchivos((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Nuevo Seguimiento Postoperatorio</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Fecha del Seguimiento */}
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Fecha y Hora del Seguimiento *
            </label>
            <input
              type="datetime-local"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
              required
            />
          </div>

          {/* Notas de Evolución */}
          <div>
            <label htmlFor="notas" className="block text-sm font-medium text-slate-700 mb-2">
              <FileText size={16} className="inline mr-1" />
              Notas de Evolución *
            </label>
            <textarea
              id="notas"
              value={notasEvolucion}
              onChange={(e) => setNotasEvolucion(e.target.value)}
              rows={6}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5 resize-none"
              placeholder="Describa la evolución del paciente, estado de la cicatrización, síntomas, signos clínicos observados..."
              required
            />
          </div>

          {/* Archivos Adjuntos */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Upload size={16} className="inline mr-1" />
              Archivos Adjuntos (Opcional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center py-4"
              >
                <Upload size={32} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  <span className="text-blue-600 font-medium">Haga clic para subir</span> o arrastre archivos aquí
                </p>
                <p className="text-xs text-gray-500 mt-1">Fotografías, radiografías, documentos (PDF, imágenes)</p>
              </label>

              {/* Lista de archivos seleccionados */}
              {archivos.length > 0 && (
                <div className="mt-4 space-y-2">
                  {archivos.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="ml-2 text-red-600 hover:text-red-700 transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Nota: La funcionalidad de subida de archivos será implementada en el backend
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} className="flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !fecha || !notasEvolucion.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Guardando...' : 'Guardar Seguimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



