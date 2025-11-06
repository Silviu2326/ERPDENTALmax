import { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { subirDocumentoVisita } from '../api/historialVisitasApi';

interface ModalAdjuntarDocumentoVisitaProps {
  visitaId: string;
  onCerrar: () => void;
  onDocumentoSubido?: () => void;
}

export default function ModalAdjuntarDocumentoVisita({
  visitaId,
  onCerrar,
  onDocumentoSubido,
}: ModalAdjuntarDocumentoVisitaProps) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tiposDocumento = [
    { value: 'radiografia', label: 'Radiografía' },
    { value: 'consentimiento', label: 'Consentimiento Informado' },
    { value: 'fotografia', label: 'Fotografía Clínica' },
    { value: 'prescripcion', label: 'Prescripción' },
    { value: 'otro', label: 'Otro' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivo(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!archivo || !tipoDocumento) {
      setError('Por favor, selecciona un archivo y un tipo de documento');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await subirDocumentoVisita(visitaId, archivo, tipoDocumento, descripcion || undefined);
      onDocumentoSubido?.();
      onCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el documento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Adjuntar Documento</h3>
          </div>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Tipo de documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Documento <span className="text-red-500">*</span>
            </label>
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecciona un tipo</option>
              {tiposDocumento.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
              <div className="space-y-1 text-center">
                {archivo ? (
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-medium">{archivo.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Selecciona un archivo</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*,application/pdf,.doc,.docx"
                        />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC hasta 10MB</p>
                  </>
                )}
              </div>
            </div>
            {archivo && (
              <button
                type="button"
                onClick={() => setArchivo(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Eliminar archivo
              </button>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Añade una descripción del documento..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !archivo || !tipoDocumento}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Subiendo...' : 'Subir Documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


