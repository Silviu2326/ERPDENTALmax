import { useState } from 'react';
import { Eye, Download, Trash2, Edit2, FileText, Image as ImageIcon, Calendar, User } from 'lucide-react';
import { Documento, formatearTamañoArchivo, obtenerIconoTipoMime, esPrevisualizable } from '../api/documentosApi';

interface DocumentoItemProps {
  documento: Documento;
  onVer: (documento: Documento) => void;
  onDescargar: (documento: Documento) => void;
  onEditar: (documento: Documento) => void;
  onEliminar: (documento: Documento) => void;
}

export default function DocumentoItem({
  documento,
  onVer,
  onDescargar,
  onEditar,
  onEliminar,
}: DocumentoItemProps) {
  const [loading, setLoading] = useState(false);

  const getCategoriaColor = (categoria: string) => {
    const colores: Record<string, string> = {
      'Radiografía': 'bg-purple-100 text-purple-800 border-purple-200',
      'Consentimiento': 'bg-blue-100 text-blue-800 border-blue-200',
      'Administrativo': 'bg-green-100 text-green-800 border-green-200',
      'Informe Externo': 'bg-orange-100 text-orange-800 border-orange-200',
      'Fotografía': 'bg-pink-100 text-pink-800 border-pink-200',
      'Otro': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colores[categoria] || colores['Otro'];
  };

  const handleVer = () => {
    onVer(documento);
  };

  const handleDescargar = async () => {
    setLoading(true);
    try {
      await onDescargar(documento);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = () => {
    onEditar(documento);
  };

  const handleEliminar = () => {
    if (window.confirm(`¿Está seguro de que desea eliminar el documento "${documento.nombreOriginal}"?`)) {
      onEliminar(documento);
    }
  };

  const icono = obtenerIconoTipoMime(documento.tipoMime);
  const puedePrevisualizar = esPrevisualizable(documento.tipoMime);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-5">
        {/* Header del documento */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-3xl flex-shrink-0">{icono}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate" title={documento.nombreOriginal}>
                {documento.nombreOriginal}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {formatearTamañoArchivo(documento.tamaño)} • {documento.tipoMime}
              </p>
            </div>
          </div>
        </div>

        {/* Categoría */}
        <div className="mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoriaColor(documento.categoria)}`}>
            {documento.categoria}
          </span>
        </div>

        {/* Descripción */}
        {documento.descripcion && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{documento.descripcion}</p>
        )}

        {/* Información adicional */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(documento.fechaSubida).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          {documento.subidoPor && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{documento.subidoPor.nombre} {documento.subidoPor.apellidos}</span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {puedePrevisualizar && (
            <button
              onClick={handleVer}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              title="Ver documento"
            >
              <Eye className="w-4 h-4" />
              Ver
            </button>
          )}
          <button
            onClick={handleDescargar}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            title="Descargar documento"
          >
            <Download className="w-4 h-4" />
            {loading ? 'Descargando...' : 'Descargar'}
          </button>
          <button
            onClick={handleEditar}
            className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Editar metadatos"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleEliminar}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            title="Eliminar documento"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


