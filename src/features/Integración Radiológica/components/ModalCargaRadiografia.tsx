import { useState, useRef } from 'react';
import { X, Upload, FileImage, Calendar, FileText, Loader2 } from 'lucide-react';
import { crearRadiologia, DatosCargaRadiografia, Radiologia } from '../api/radiologiaApi';

interface ModalCargaRadiografiaProps {
  pacienteId: string;
  isOpen: boolean;
  onClose: () => void;
  onRadiografiaCreada: (radiologia: Radiologia) => void;
}

const TIPOS_RADIOGRAFIA: Radiologia['tipoRadiografia'][] = [
  'Periapical',
  'Bitewing',
  'Oclusal',
  'Panorámica',
  'CBCT',
];

const TIPOS_PERMITIDOS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/dicom',
  'application/x-dicom',
];

const TAMAÑO_MAXIMO_MB = 100;
const TAMAÑO_MAXIMO_BYTES = TAMAÑO_MAXIMO_MB * 1024 * 1024;

export default function ModalCargaRadiografia({
  pacienteId,
  isOpen,
  onClose,
  onRadiografiaCreada,
}: ModalCargaRadiografiaProps) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [tipoRadiografia, setTipoRadiografia] = useState<Radiologia['tipoRadiografia']>('Periapical');
  const [fechaToma, setFechaToma] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notas, setNotas] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progreso, setProgreso] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const formatearTamañoArchivo = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (file: File) => {
    setError(null);

    // Validar tipo de archivo
    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      setError(`Tipo de archivo no permitido. Tipos permitidos: JPG, PNG o DICOM`);
      setArchivo(null);
      return;
    }

    // Validar tamaño
    if (file.size > TAMAÑO_MAXIMO_BYTES) {
      setError(`El archivo es demasiado grande. Tamaño máximo: ${TAMAÑO_MAXIMO_MB}MB`);
      setArchivo(null);
      return;
    }

    setArchivo(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!archivo) {
      setError('Por favor, seleccione un archivo');
      return;
    }

    if (!tipoRadiografia) {
      setError('Por favor, seleccione el tipo de radiografía');
      return;
    }

    if (!fechaToma) {
      setError('Por favor, seleccione la fecha de toma');
      return;
    }

    setSubiendo(true);
    setError(null);
    setProgreso(0);

    try {
      const datos: DatosCargaRadiografia = {
        file: archivo,
        tipoRadiografia,
        fechaToma,
        notas: notas || undefined,
      };

      // Simular progreso (en producción, esto se manejaría con XMLHttpRequest o fetch con eventos)
      const progressInterval = setInterval(() => {
        setProgreso((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const nuevaRadiologia = await crearRadiologia(pacienteId, datos);
      
      clearInterval(progressInterval);
      setProgreso(100);

      // Resetear formulario
      setArchivo(null);
      setTipoRadiografia('Periapical');
      setFechaToma(new Date().toISOString().split('T')[0]);
      setNotas('');
      setProgreso(0);

      onRadiografiaCreada(nuevaRadiologia);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la radiografía');
    } finally {
      setSubiendo(false);
    }
  };

  const handleClose = () => {
    if (!subiendo) {
      setArchivo(null);
      setError(null);
      setProgreso(0);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Añadir Radiografía</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={subiendo}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Área de carga de archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo de Imagen <span className="text-red-500">*</span>
            </label>
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : archivo
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.dcm,.dicom"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
                disabled={subiendo}
              />
              {archivo ? (
                <div className="flex flex-col items-center">
                  <FileImage className="w-12 h-12 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">{archivo.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatearTamañoArchivo(archivo.size)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setArchivo(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                    disabled={subiendo}
                  >
                    Eliminar archivo
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="text-blue-600 font-medium">Haga clic para seleccionar</span>{' '}
                    o arrastre el archivo aquí
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG o DICOM • Máximo {TAMAÑO_MAXIMO_MB}MB
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={subiendo}
                  >
                    Seleccionar archivo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tipo de radiografía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Radiografía <span className="text-red-500">*</span>
            </label>
            <select
              value={tipoRadiografia}
              onChange={(e) => setTipoRadiografia(e.target.value as Radiologia['tipoRadiografia'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={subiendo}
            >
              {TIPOS_RADIOGRAFIA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de toma */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Fecha de Toma <span className="text-red-500">*</span></span>
              </div>
            </label>
            <input
              type="date"
              value={fechaToma}
              onChange={(e) => setFechaToma(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={subiendo}
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>Notas (opcional)</span>
              </div>
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Añada notas o comentarios sobre esta radiografía..."
              disabled={subiendo}
            />
          </div>

          {/* Barra de progreso */}
          {subiendo && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subiendo archivo...</span>
                <span className="text-gray-600">{progreso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={subiendo}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={subiendo || !archivo}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {subiendo ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Guardar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



