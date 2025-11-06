import { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Download, Eye, Trash2, X, File } from 'lucide-react';
import {
  DocumentoEmpleado,
  DatosSubirDocumentoEmpleado,
  obtenerDocumentosEmpleado,
  subirDocumentoEmpleado,
  eliminarDocumentoEmpleado,
} from '../api/empleadosApi';

interface DocumentosEmpleadoSectionProps {
  empleadoId: string;
  documentos?: DocumentoEmpleado[];
  onDocumentosActualizados?: () => void;
}

export default function DocumentosEmpleadoSection({
  empleadoId,
  documentos: documentosIniciales,
  onDocumentosActualizados,
}: DocumentosEmpleadoSectionProps) {
  const [documentos, setDocumentos] = useState<DocumentoEmpleado[]>(documentosIniciales || []);
  const [mostrarSubida, setMostrarSubida] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [eliminando, setEliminando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tipoDocumento, setTipoDocumento] = useState<'Contrato' | 'DNI' | 'Titulacion' | 'Otro'>('Contrato');

  const tiposDocumento = [
    { valor: 'Contrato' as const, label: 'Contrato' },
    { valor: 'DNI' as const, label: 'DNI' },
    { valor: 'Titulacion' as const, label: 'Titulación' },
    { valor: 'Otro' as const, label: 'Otro' },
  ];

  const cargarDocumentos = async () => {
    try {
      const docs = await obtenerDocumentosEmpleado(empleadoId);
      setDocumentos(docs);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err instanceof Error ? err.message : 'Error al cargar los documentos',
      });
    }
  };

  // Cargar documentos si no se pasaron como prop
  useEffect(() => {
    if (!documentosIniciales || documentosIniciales.length === 0) {
      cargarDocumentos();
    }
  }, [empleadoId]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendo(true);
    setMensaje(null);

    try {
      const datos: DatosSubirDocumentoEmpleado = {
        file,
        tipo: tipoDocumento,
      };
      const doc = await subirDocumentoEmpleado(empleadoId, datos);
      setDocumentos((prev) => [...prev, doc]);
      setMostrarSubida(false);
      setTipoDocumento('Contrato');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setMensaje({ tipo: 'success', texto: 'Documento subido correctamente' });
      setTimeout(() => setMensaje(null), 3000);
      onDocumentosActualizados?.();
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err instanceof Error ? err.message : 'Error al subir el documento',
      });
    } finally {
      setSubiendo(false);
    }
  };

  const handleEliminar = async (documentoId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este documento?')) {
      return;
    }

    setEliminando(documentoId);
    try {
      await eliminarDocumentoEmpleado(empleadoId, documentoId);
      setDocumentos((prev) => prev.filter((d) => d._id !== documentoId));
      setMensaje({ tipo: 'success', texto: 'Documento eliminado correctamente' });
      setTimeout(() => setMensaje(null), 3000);
      onDocumentosActualizados?.();
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err instanceof Error ? err.message : 'Error al eliminar el documento',
      });
    } finally {
      setEliminando(null);
    }
  };

  const handleDescargar = (documento: DocumentoEmpleado) => {
    window.open(documento.url, '_blank');
  };

  const handleVer = (documento: DocumentoEmpleado) => {
    window.open(documento.url, '_blank');
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Contrato':
        return <FileText className="w-5 h-5" />;
      case 'DNI':
        return <File className="w-5 h-5" />;
      case 'Titulacion':
        return <FileText className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Contrato':
        return 'bg-blue-100 text-blue-800';
      case 'DNI':
        return 'bg-green-100 text-green-800';
      case 'Titulacion':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Documentos del Empleado
        </h3>
        {!mostrarSubida && (
          <button
            onClick={() => setMostrarSubida(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Subir Documento
          </button>
        )}
      </div>

      {mensaje && (
        <div
          className={`p-3 rounded-lg ${
            mensaje.tipo === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {mostrarSubida && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Subir Nuevo Documento</h4>
            <button
              onClick={() => setMostrarSubida(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento
              </label>
              <select
                value={tipoDocumento}
                onChange={(e) =>
                  setTipoDocumento(e.target.value as 'Contrato' | 'DNI' | 'Titulacion' | 'Otro')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {tiposDocumento.map((tipo) => (
                  <option key={tipo.valor} value={tipo.valor}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                disabled={subiendo}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
            {subiendo && (
              <div className="text-sm text-gray-600">Subiendo documento...</div>
            )}
          </div>
        </div>
      )}

      {documentos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hay documentos subidos para este empleado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentos.map((documento) => (
            <div
              key={documento._id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTipoIcon(documento.tipo)}
                  <div>
                    <h4 className="font-medium text-gray-900 truncate max-w-[200px]">
                      {documento.nombre}
                    </h4>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getTipoColor(
                        documento.tipo
                      )}`}
                    >
                      {documento.tipo}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Subido: {formatearFecha(documento.fechaSubida)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleVer(documento)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
                  title="Ver documento"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
                <button
                  onClick={() => handleDescargar(documento)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors text-sm"
                  title="Descargar documento"
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </button>
                <button
                  onClick={() => handleEliminar(documento._id)}
                  disabled={eliminando === documento._id}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
                  title="Eliminar documento"
                >
                  {eliminando === documento._id ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

