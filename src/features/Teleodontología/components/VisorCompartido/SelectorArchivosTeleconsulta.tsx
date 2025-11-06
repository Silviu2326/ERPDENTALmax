import { useState, useEffect } from 'react';
import { Upload, FileImage, FileText, X, Loader2 } from 'lucide-react';
import {
  obtenerDocumentosPaciente,
  seleccionarDocumento,
  subirDocumento,
  DocumentoPaciente,
} from '../../api/sesionTeleconsultaApi';

interface SelectorArchivosTeleconsultaProps {
  sesionId: string;
  pacienteId: string;
  documentoActivo?: string;
  onDocumentoSeleccionado: (documento: DocumentoPaciente) => void;
  onDocumentoSubido?: (documento: DocumentoPaciente) => void;
}

export default function SelectorArchivosTeleconsulta({
  sesionId,
  pacienteId,
  documentoActivo,
  onDocumentoSeleccionado,
  onDocumentoSubido,
}: SelectorArchivosTeleconsultaProps) {
  const [documentos, setDocumentos] = useState<DocumentoPaciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDocumentos();
  }, [sesionId, pacienteId]);

  const cargarDocumentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await obtenerDocumentosPaciente(sesionId);
      setDocumentos(docs);
    } catch (err: any) {
      setError(err.message || 'Error al cargar documentos');
      console.error('Error al cargar documentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarDocumento = async (documento: DocumentoPaciente) => {
    try {
      await seleccionarDocumento(sesionId, documento.id);
      onDocumentoSeleccionado(documento);
    } catch (err: any) {
      setError(err.message || 'Error al seleccionar documento');
      console.error('Error al seleccionar documento:', err);
    }
  };

  const handleSubirArchivo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;

    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!tiposPermitidos.includes(archivo.type)) {
      setError('Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, GIF) y PDF.');
      return;
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (archivo.size > maxSize) {
      setError('El archivo es demasiado grande. El tamaño máximo es 10MB.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const nuevoDocumento = await subirDocumento(sesionId, archivo);
      setDocumentos((prev) => [nuevoDocumento, ...prev]);
      onDocumentoSubido?.(nuevoDocumento);
      
      // Limpiar el input
      event.target.value = '';
    } catch (err: any) {
      setError(err.message || 'Error al subir archivo');
      console.error('Error al subir archivo:', err);
    } finally {
      setUploading(false);
    }
  };

  const getIconoPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'radiografia':
      case 'foto':
      case 'cbct':
        return <FileImage className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileImage className="w-5 h-5" />;
    }
  };

  const getEtiquetaTipo = (tipo: string) => {
    switch (tipo) {
      case 'radiografia':
        return 'Radiografía';
      case 'foto':
        return 'Foto';
      case 'cbct':
        return 'CBCT';
      case 'pdf':
        return 'PDF';
      default:
        return tipo;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Cargando documentos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Documentos del Paciente</h3>
        <label className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm font-medium">
          <Upload className="w-4 h-4" />
          Subir Archivo
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleSubirArchivo}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {uploading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Subiendo archivo...
        </div>
      )}

      {documentos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileImage className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No hay documentos disponibles</p>
          <p className="text-sm mt-1">Sube un archivo para compartirlo</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {documentos.map((documento) => (
            <button
              key={documento.id}
              onClick={() => handleSeleccionarDocumento(documento)}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                documentoActivo === documento.id
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              {documentoActivo === documento.id && (
                <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-1">
                  <X className="w-3 h-3" />
                </div>
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className={`mb-2 ${
                  documentoActivo === documento.id ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {getIconoPorTipo(documento.tipo)}
                </div>
                
                {documento.urlMiniatura ? (
                  <img
                    src={documento.urlMiniatura}
                    alt={documento.nombreArchivo}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-20 bg-gray-100 rounded mb-2 flex items-center justify-center">
                    {getIconoPorTipo(documento.tipo)}
                  </div>
                )}
                
                <p className="text-xs font-medium text-gray-900 truncate w-full">
                  {documento.nombreArchivo}
                </p>
                <span className="text-xs text-gray-500 mt-1">
                  {getEtiquetaTipo(documento.tipo)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


