import { useState, useCallback } from 'react';
import { Upload, CheckCircle2, AlertCircle, Scan } from 'lucide-react';
import { PacienteSimplificado, subirImagenes, MetadataImagen } from '../api/imagenesApi';
import PatientSearchAutocomplete from '../components/PatientSearchAutocomplete';
import UploaderArea from '../components/UploaderArea';
import ImagePreviewCard, { ImagenConMetadata } from '../components/ImagePreviewCard';
import UploadProgressBar, { EstadoSubida } from '../components/UploadProgressBar';

const TIPOS_IMAGEN = [
  'Panorámica',
  'Periapical',
  'CBCT',
  'Intraoral',
  'Extraoral',
  'Cefalometría',
  'Oclusal',
  'Aleta de mordida',
];

export default function SubidaImagenesPage() {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteSimplificado | null>(null);
  const [imagenes, setImagenes] = useState<ImagenConMetadata[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [estadosSubida, setEstadosSubida] = useState<EstadoSubida[]>([]);
  const [mostrarProgreso, setMostrarProgreso] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((files: File[]) => {
    const nuevasImagenes: ImagenConMetadata[] = files.map((file) => {
      const id = `${Date.now()}-${Math.random()}`;
      const preview = URL.createObjectURL(file);
      
      return {
        id,
        file,
        preview,
        tipoImagen: '',
        notas: '',
      };
    });

    setImagenes((prev) => [...prev, ...nuevasImagenes]);
    setError(null);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImagenes((prev) => {
      const imagen = prev.find((img) => img.id === id);
      if (imagen && imagen.preview) {
        URL.revokeObjectURL(imagen.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const handleMetadataChange = useCallback((id: string, tipoImagen: string, notas: string) => {
    setImagenes((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, tipoImagen, notas } : img
      )
    );
  }, []);

  const validarImagenes = (): boolean => {
    if (imagenes.length === 0) {
      setError('Debe seleccionar al menos una imagen para subir');
      return false;
    }

    const imagenesSinTipo = imagenes.filter((img) => !img.tipoImagen);
    if (imagenesSinTipo.length > 0) {
      setError(`Debe especificar el tipo de imagen para ${imagenesSinTipo.length} imagen(es)`);
      return false;
    }

    return true;
  };

  const handleSubirImagenes = async () => {
    if (!pacienteSeleccionado) {
      setError('Debe seleccionar un paciente antes de subir imágenes');
      return;
    }

    if (!validarImagenes()) {
      return;
    }

    setSubiendo(true);
    setError(null);
    setMensajeExito(null);
    setMostrarProgreso(true);

    // Inicializar estados de subida
    const estadosIniciales: EstadoSubida[] = imagenes.map((img) => ({
      id: img.id,
      nombreArchivo: img.file.name,
      progreso: 0,
      estado: 'pendiente',
    }));
    setEstadosSubida(estadosIniciales);

    try {
      // Preparar metadatos
      const metadatos: MetadataImagen[] = imagenes.map((img) => ({
        nombreOriginal: img.file.name,
        tipoImagen: img.tipoImagen,
        notas: img.notas || undefined,
      }));

      // Preparar archivos
      const archivos = imagenes.map((img) => img.file);

      // Actualizar estados a "subiendo"
      setEstadosSubida((prev) =>
        prev.map((estado) => ({ ...estado, estado: 'subiendo' as const, progreso: 0 }))
      );

      // Subir imágenes
      const resultado = await subirImagenes(pacienteSeleccionado._id, archivos, metadatos);

      // Actualizar estados a "completado"
      setEstadosSubida((prev) =>
        prev.map((estado) => ({ ...estado, estado: 'completado' as const, progreso: 100 }))
      );

      setMensajeExito(`Se subieron ${resultado.imagenes.length} imagen(es) correctamente`);
      
      // Limpiar imágenes después de 3 segundos
      setTimeout(() => {
        imagenes.forEach((img) => {
          if (img.preview) {
            URL.revokeObjectURL(img.preview);
          }
        });
        setImagenes([]);
        setMostrarProgreso(false);
        setEstadosSubida([]);
      }, 3000);
    } catch (err) {
      const mensajeError = err instanceof Error ? err.message : 'Error al subir las imágenes';
      setError(mensajeError);
      
      // Actualizar estados a "error"
      setEstadosSubida((prev) =>
        prev.map((estado) => ({
          ...estado,
          estado: 'error' as const,
          error: mensajeError,
        }))
      );
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Scan size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Subida de Imágenes Radiológicas
                </h1>
                <p className="text-gray-600">
                  Sube y gestiona imágenes radiológicas para tus pacientes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Búsqueda de paciente */}
          <div className="bg-white shadow-sm rounded-xl p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Buscar Paciente</h2>
            <PatientSearchAutocomplete
              pacienteSeleccionado={pacienteSeleccionado}
              onPacienteSeleccionado={setPacienteSeleccionado}
              disabled={subiendo}
            />
            {pacienteSeleccionado && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm font-medium text-blue-900">
                  Paciente seleccionado: <span className="font-bold">{pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}</span>
                </p>
                <p className="text-xs text-blue-700 mt-1">DNI: {pacienteSeleccionado.dni}</p>
              </div>
            )}
          </div>

          {/* Área de subida */}
          {pacienteSeleccionado && (
            <div className="bg-white shadow-sm rounded-xl p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Imágenes</h2>
              <UploaderArea
                onFilesSelected={handleFilesSelected}
                disabled={subiendo}
              />
            </div>
          )}

          {/* Previsualización de imágenes */}
          {imagenes.length > 0 && (
            <div className="bg-white shadow-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Previsualización ({imagenes.length} imagen{imagenes.length !== 1 ? 'es' : ''})
                </h2>
                <button
                  onClick={() => {
                    imagenes.forEach((img) => {
                      if (img.preview) {
                        URL.revokeObjectURL(img.preview);
                      }
                    });
                    setImagenes([]);
                    setError(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                  disabled={subiendo}
                >
                  Limpiar todas
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {imagenes.map((imagen) => (
                  <ImagePreviewCard
                    key={imagen.id}
                    imagen={imagen}
                    onRemove={handleRemoveImage}
                    onMetadataChange={handleMetadataChange}
                    tiposImagen={TIPOS_IMAGEN}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Barra de progreso */}
          {mostrarProgreso && estadosSubida.length > 0 && (
            <UploadProgressBar estados={estadosSubida} />
          )}

          {/* Mensajes de éxito/error */}
          {mensajeExito && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm font-medium text-green-800">{mensajeExito}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Botón de subida */}
          {pacienteSeleccionado && imagenes.length > 0 && !mostrarProgreso && (
            <div className="bg-white shadow-sm rounded-xl p-4">
              <button
                onClick={handleSubirImagenes}
                disabled={subiendo || imagenes.length === 0}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {subiendo ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Subiendo imágenes...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Subir {imagenes.length} Imagen{imagenes.length !== 1 ? 'es' : ''}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



