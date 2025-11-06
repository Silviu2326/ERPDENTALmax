import { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Diagnostico } from '../api/cargaInmediataApi';

interface FaseDiagnosticoFormProps {
  diagnostico?: Diagnostico;
  onGuardar: (diagnostico: Diagnostico) => void;
  onCancelar?: () => void;
}

export default function FaseDiagnosticoForm({
  diagnostico,
  onGuardar,
  onCancelar,
}: FaseDiagnosticoFormProps) {
  const [notas, setNotas] = useState(diagnostico?.notas || '');
  const [archivos, setArchivos] = useState<File[]>([]);
  const [archivosPreview, setArchivosPreview] = useState<string[]>(diagnostico?.archivos || []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nuevosArchivos = Array.from(e.target.files);
      setArchivos([...archivos, ...nuevosArchivos]);
    }
  };

  const handleEliminarArchivo = (index: number) => {
    const nuevosArchivos = archivos.filter((_, i) => i !== index);
    setArchivos(nuevosArchivos);
  };

  const handleEliminarArchivoPreview = (index: number) => {
    const nuevosPreview = archivosPreview.filter((_, i) => i !== index);
    setArchivosPreview(nuevosPreview);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({
      notas,
      archivos: archivosPreview,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-2">
          Notas de Diagnóstico
        </label>
        <textarea
          id="notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Registre las observaciones clínicas, hallazgos radiológicos, indicaciones y cualquier otra información relevante del diagnóstico..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Archivos Clínicos (CBCT, STL, Imágenes)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            id="archivos"
            multiple
            accept=".dcm,.dicom,.stl,.jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="archivos"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              Haga clic para subir archivos o arrastre y suelte
            </span>
            <span className="text-xs text-gray-500">
              Formatos soportados: DICOM, STL, JPG, PNG, PDF
            </span>
          </label>
        </div>

        {archivos.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Archivos nuevos a subir:</h4>
            {archivos.map((archivo, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{archivo.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(archivo.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleEliminarArchivo(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {archivosPreview.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Archivos existentes:</h4>
            {archivosPreview.map((url, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-700">{url}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleEliminarArchivoPreview(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Guardar Diagnóstico
        </button>
      </div>
    </form>
  );
}


