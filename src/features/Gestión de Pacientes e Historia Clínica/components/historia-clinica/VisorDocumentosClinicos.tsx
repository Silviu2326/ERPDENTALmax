import { useState, useRef } from 'react';
import { FileImage, Upload, Download, Eye, Trash2, X } from 'lucide-react';
import {
  DocumentoClinico,
  obtenerDocumentosClinicos,
  subirDocumentoClinico,
} from '../../api/historiaClinicaApi';

interface VisorDocumentosClinicosProps {
  pacienteId: string;
  documentos: DocumentoClinico[];
  onDocumentoAgregado: (doc: DocumentoClinico) => void;
}

export default function VisorDocumentosClinicos({
  pacienteId,
  documentos,
  onDocumentoAgregado,
}: VisorDocumentosClinicosProps) {
  const [mostrarSubida, setMostrarSubida] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tipoDocumento, setTipoDocumento] = useState('radiografia');
  const [descripcion, setDescripcion] = useState('');

  const tiposDocumento = [
    { valor: 'radiografia', label: 'Radiografía' },
    { valor: 'foto', label: 'Fotografía' },
    { valor: 'consentimiento', label: 'Consentimiento' },
    { valor: 'informe', label: 'Informe' },
    { valor: 'otro', label: 'Otro' },
  ];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendo(true);
    setMensaje(null);

    try {
      const doc = await subirDocumentoClinico(pacienteId, file, {
        tipo: tipoDocumento,
        descripcion: descripcion || undefined,
      });
      onDocumentoAgregado(doc);
      setMostrarSubida(false);
      setDescripcion('');
      setTipoDocumento('radiografia');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setMensaje({ tipo: 'success', texto: 'Documento subido correctamente' });
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err instanceof Error ? err.message : 'Error al subir el documento',
      });
    } finally {
      setSubiendo(false);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'radiografia':
      case 'foto':
        return <FileImage className="w-5 h-5" />;
      default:
        return <FileImage className="w-5 h-5" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'radiografia':
        return 'bg-blue-100 text-blue-800';
      case 'foto':
        return 'bg-green-100 text-green-800';
      case 'consentimiento':
        return 'bg-purple-100 text-purple-800';
      case 'informe':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FileImage className="w-5 h-5 text-blue-600" />
          Documentos Clínicos
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
          className={`px-4 py-3 rounded-lg ${
            mensaje.tipo === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {mostrarSubida && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Subir Nuevo Documento</h4>
            <button
              onClick={() => {
                setMostrarSubida(false);
                setDescripcion('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
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
                onChange={(e) => setTipoDocumento(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción opcional del documento..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Archivo</label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept="image/*,.pdf"
                disabled={subiendo}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {subiendo && (
                <p className="text-sm text-blue-600 mt-2">Subiendo archivo...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {documentos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay documentos clínicos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentos.map((doc) => (
            <div
              key={doc._id || doc.nombreArchivo}
              className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTipoColor(doc.tipo)}`}>
                    {getTipoIcon(doc.tipo)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm truncate max-w-xs">
                      {doc.nombreArchivo}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTipoColor(doc.tipo)}`}>
                      {doc.tipo}
                    </span>
                  </div>
                </div>
              </div>

              {doc.descripcion && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.descripcion}</p>
              )}

              <p className="text-xs text-gray-500 mb-3">
                {new Date(doc.fechaSubida).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>

              <div className="flex gap-2">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </a>
                <a
                  href={doc.url}
                  download
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


