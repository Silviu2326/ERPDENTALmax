import { useState, useEffect } from 'react';
import { FileText, Upload, Loader2, FileImage, FileCheck, Image, File } from 'lucide-react';
import { Documento, CategoriaDocumento, DocumentoConUrlSegura, obtenerDocumentosPorPaciente, obtenerUrlSeguraDocumento, eliminarDocumento, actualizarMetadatosDocumento, formatearTamañoArchivo } from '../api/documentosApi';
import DocumentoItem from './DocumentoItem';
import FiltroCategoriasDocumento from './FiltroCategoriasDocumento';
import ModalSubirDocumento from './ModalSubirDocumento';
import VisorDocumento from './VisorDocumento';

interface DocumentosGridProps {
  pacienteId: string;
}

export default function DocumentosGrid({ pacienteId }: DocumentosGridProps) {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaDocumento | 'Todas'>('Todas');
  const [mostrarModalSubir, setMostrarModalSubir] = useState(false);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<DocumentoConUrlSegura | null>(null);
  const [mostrarVisor, setMostrarVisor] = useState(false);

  const cargarDocumentos = async () => {
    if (!pacienteId) return;

    setLoading(true);
    setError(null);

    try {
      const categoria = categoriaFiltro === 'Todas' ? undefined : categoriaFiltro;
      const docs = await obtenerDocumentosPorPaciente(pacienteId, categoria);
      // Filtrar documentos eliminados
      const docsActivos = docs.filter(doc => !doc.isDeleted);
      setDocumentos(docsActivos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los documentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDocumentos();
  }, [pacienteId, categoriaFiltro]);

  const handleSubirDocumento = () => {
    setMostrarModalSubir(true);
  };

  const handleDocumentoSubido = () => {
    setMostrarModalSubir(false);
    cargarDocumentos();
  };

  const handleVerDocumento = async (documento: Documento) => {
    try {
      const { url } = await obtenerUrlSeguraDocumento(documento._id);
      setDocumentoSeleccionado({ ...documento, urlSegura: url });
      setMostrarVisor(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener la URL del documento');
    }
  };

  const handleDescargarDocumento = async (documento: Documento) => {
    try {
      const { url } = await obtenerUrlSeguraDocumento(documento._id);
      const link = document.createElement('a');
      link.href = url;
      link.download = documento.nombreOriginal;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al descargar el documento');
    }
  };

  const handleEditarDocumento = async (documento: Documento) => {
    const nuevaCategoria = prompt('Nueva categoría:', documento.categoria) as CategoriaDocumento | null;
    if (!nuevaCategoria) return;

    const nuevaDescripcion = prompt('Nueva descripción (opcional):', documento.descripcion || '') || undefined;

    try {
      await actualizarMetadatosDocumento(documento._id, {
        categoria: nuevaCategoria,
        descripcion: nuevaDescripcion,
      });
      cargarDocumentos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el documento');
    }
  };

  const handleEliminarDocumento = async (documento: Documento) => {
    try {
      await eliminarDocumento(documento._id);
      cargarDocumentos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el documento');
    }
  };

  const handleCerrarVisor = () => {
    setMostrarVisor(false);
    setDocumentoSeleccionado(null);
  };

  // Calcular estadísticas de documentos
  const totalTamaño = documentos.reduce((sum, doc) => sum + doc.tamaño, 0);
  const documentosPorCategoria = documentos.reduce((acc, doc) => {
    acc[doc.categoria] = (acc[doc.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const documentosRecientes = documentos
    .filter(doc => {
      const fecha = new Date(doc.fechaSubida);
      const hace30Dias = new Date();
      hace30Dias.setDate(hace30Dias.getDate() - 30);
      return fecha >= hace30Dias;
    })
    .length;
  
  const documentosEsteAño = documentos.filter(doc => {
    const fecha = new Date(doc.fechaSubida);
    return fecha.getFullYear() === new Date().getFullYear();
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Documentos del Paciente
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {documentos.length} {documentos.length === 1 ? 'documento' : 'documentos'} registrados
          </p>
        </div>
        <button
          onClick={handleSubirDocumento}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          <Upload className="w-4 h-4" />
          Subir Documento
        </button>
      </div>

      {/* Filtro de categorías */}
      <FiltroCategoriasDocumento
        categoriaSeleccionada={categoriaFiltro}
        onCategoriaChange={setCategoriaFiltro}
      />

      {/* Estadísticas de documentos */}
      {documentos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documentos</p>
                <p className="text-2xl font-bold text-blue-600">{documentos.length}</p>
                <p className="text-xs text-gray-500 mt-1">{documentosEsteAño} este año</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tamaño Total</p>
                <p className="text-2xl font-bold text-green-600">{formatearTamañoArchivo(totalTamaño)}</p>
                <p className="text-xs text-gray-500 mt-1">Almacenamiento</p>
              </div>
              <File className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documentos Recientes</p>
                <p className="text-2xl font-bold text-purple-600">{documentosRecientes}</p>
                <p className="text-xs text-gray-500 mt-1">Últimos 30 días</p>
              </div>
              <Upload className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categorías</p>
                <p className="text-2xl font-bold text-orange-600">{Object.keys(documentosPorCategoria).length}</p>
                <p className="text-xs text-gray-500 mt-1">Tipos diferentes</p>
              </div>
              <FileCheck className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Distribución por categoría */}
      {documentos.length > 0 && Object.keys(documentosPorCategoria).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categoría</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(documentosPorCategoria).map(([categoria, cantidad]) => {
              const porcentaje = (cantidad / documentos.length) * 100;
              const iconos: Record<string, any> = {
                'Radiografía': FileImage,
                'Consentimiento': FileCheck,
                'Fotografía': Image,
                'Informe Externo': FileText,
                'Administrativo': File,
                'Otro': FileText,
              };
              const Icon = iconos[categoria] || FileText;
              
              return (
                <div key={categoria} className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{categoria}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{cantidad}</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{porcentaje.toFixed(0)}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Grid de documentos */}
      {documentos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">No hay documentos registrados</p>
          <p className="text-sm text-gray-500 mb-4">
            {categoriaFiltro !== 'Todas' 
              ? `No hay documentos en la categoría "${categoriaFiltro}"`
              : 'Suba documentos como radiografías, consentimientos o informes'}
          </p>
          <button
            onClick={handleSubirDocumento}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Subir Primer Documento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentos.map((documento) => (
            <DocumentoItem
              key={documento._id}
              documento={documento}
              onVer={handleVerDocumento}
              onDescargar={handleDescargarDocumento}
              onEditar={handleEditarDocumento}
              onEliminar={handleEliminarDocumento}
            />
          ))}
        </div>
      )}

      {/* Modal para subir documento */}
      {mostrarModalSubir && (
        <ModalSubirDocumento
          pacienteId={pacienteId}
          onClose={() => setMostrarModalSubir(false)}
          onDocumentoSubido={handleDocumentoSubido}
        />
      )}

      {/* Visor de documento */}
      {mostrarVisor && documentoSeleccionado && (
        <VisorDocumento
          documento={documentoSeleccionado}
          onClose={handleCerrarVisor}
        />
      )}
    </div>
  );
}

