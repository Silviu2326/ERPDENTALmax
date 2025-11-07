import { useState } from 'react';
import { X, Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { CategoriaDocumento, subirDocumento, formatearTamañoArchivo } from '../api/documentosApi';

interface ModalSubirDocumentoProps {
  pacienteId: string;
  onClose: () => void;
  onDocumentoSubido: () => void;
}

const CATEGORIAS: CategoriaDocumento[] = [
  'Radiografía',
  'Consentimiento',
  'Administrativo',
  'Informe Externo',
  'Fotografía',
  'Otro',
];

const TIPOS_PERMITIDOS = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'application/dicom',
  'application/x-dicom',
];

const TAMAÑO_MAXIMO_MB = 50;
const TAMAÑO_MAXIMO_BYTES = TAMAÑO_MAXIMO_MB * 1024 * 1024;

export default function ModalSubirDocumento({
  pacienteId,
  onClose,
  onDocumentoSubido,
}: ModalSubirDocumentoProps) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [categoria, setCategoria] = useState<CategoriaDocumento>('Otro');
  const [descripcion, setDescripcion] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setArchivo(null);
      return;
    }

    // Validar tipo de archivo
    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      setError(`Tipo de archivo no permitido. Tipos permitidos: PDF, imágenes (JPG, PNG, GIF) o DICOM`);
      setArchivo(null);
      return;
    }

    // Validar tamaño
    if (file.size > TAMAÑO_MAXIMO_BYTES) {
      setError(`El archivo es demasiado grande. Tamaño máximo: ${TAMAÑO_MAXIMO_MB}MB`);
      setArchivo(null);
      return;
    }

    setError(null);
    setArchivo(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!archivo) {
      setError('Por favor, seleccione un archivo');
      return;
    }

    if (!categoria) {
      setError('Por favor, seleccione una categoría');
      return;
    }

    setSubiendo(true);
    setError(null);

    try {
      await subirDocumento(pacienteId, {
        file: archivo,
        categoria,
        descripcion: descripcion.trim() || undefined,
      });
      onDocumentoSubido();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el documento');
    } finally {
      setSubiendo(false);
    }
  };

  const handleClose = () => {
    if (!subiendo) {
      setArchivo(null);
      setCategoria('Otro');
      setDescripcion('');
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Subir Documento</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={subiendo}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selector de archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="file-input"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.gif,.dcm"
                disabled={subiendo}
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer flex flex-col items-center"
              >
                {archivo ? (
                  <>
                    <FileText className="w-12 h-12 text-blue-600 mb-2" />
                    <p className="text-sm font-medium text-gray-900">{archivo.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatearTamañoArchivo(archivo.size)}
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="text-blue-600 font-medium">Haga clic para seleccionar</span>{' '}
                      o arrastre el archivo aquí
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, imágenes (JPG, PNG, GIF) o DICOM • Máximo {TAMAÑO_MAXIMO_MB}MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaDocumento)}
              disabled={subiendo}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={subiendo}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
              placeholder="Añada una descripción del documento..."
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={subiendo}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={subiendo || !archivo}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {subiendo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Subir Documento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



