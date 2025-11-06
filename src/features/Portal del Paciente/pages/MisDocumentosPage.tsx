import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Loader2, AlertCircle } from 'lucide-react';
import DocumentosLista from '../components/DocumentosLista';
import VisorPDFModal from '../components/VisorPDFModal';
import FirmaDigitalCanvas from '../components/FirmaDigitalCanvas';
import {
  obtenerDocumentos,
  descargarDocumento,
  firmarDocumento,
  Documento,
} from '../api/documentosApi';

interface MisDocumentosPageProps {
  onVolver?: () => void;
}

export default function MisDocumentosPage({ onVolver }: MisDocumentosPageProps) {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<Documento | null>(null);
  const [mostrarVisor, setMostrarVisor] = useState(false);
  const [mostrarFirma, setMostrarFirma] = useState(false);
  const [firmando, setFirmando] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    cargarDocumentos();
  }, [page]);

  const cargarDocumentos = async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await obtenerDocumentos(page, 50);
      setDocumentos(response.documentos);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error al cargar documentos:', err);
      setError('No se pudieron cargar los documentos. Por favor, inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const handleVer = (documento: Documento) => {
    setDocumentoSeleccionado(documento);
    setMostrarVisor(true);
  };

  const handleDescargar = async (documento: Documento) => {
    try {
      await descargarDocumento(documento._id);
    } catch (err) {
      console.error('Error al descargar:', err);
      alert('Error al descargar el documento. Por favor, inténtalo de nuevo.');
    }
  };

  const handleFirmar = (documento: Documento) => {
    setDocumentoSeleccionado(documento);
    setMostrarFirma(true);
  };

  const handleFirmaCompletada = async (firmaData: string) => {
    if (!documentoSeleccionado) return;

    try {
      setFirmando(true);
      await firmarDocumento(documentoSeleccionado._id, firmaData);
      
      // Actualizar el documento en la lista
      setDocumentos((prev) =>
        prev.map((doc) =>
          doc._id === documentoSeleccionado._id
            ? {
                ...doc,
                estado: 'Firmado',
                firmaDigital: {
                  data: firmaData,
                  fecha: new Date().toISOString(),
                },
              }
            : doc
        )
      );

      setMostrarFirma(false);
      setDocumentoSeleccionado(null);
      alert('Documento firmado correctamente');
    } catch (err) {
      console.error('Error al firmar:', err);
      alert('Error al firmar el documento. Por favor, inténtalo de nuevo.');
    } finally {
      setFirmando(false);
    }
  };

  const handleCerrarVisor = () => {
    setMostrarVisor(false);
    setDocumentoSeleccionado(null);
  };

  const handleCerrarFirma = () => {
    setMostrarFirma(false);
    setDocumentoSeleccionado(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            {onVolver && (
              <button
                onClick={onVolver}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Documentos</h1>
                <p className="text-sm text-gray-600">
                  Consentimientos, recetas y planes de tratamiento
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Cargando documentos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={cargarDocumentos}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <DocumentosLista
            documentos={documentos}
            onVer={handleVer}
            onDescargar={handleDescargar}
            onFirmar={handleFirmar}
          />
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-gray-700">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </main>

      {/* Modal Visor PDF */}
      {mostrarVisor && documentoSeleccionado && (
        <VisorPDFModal
          documentoId={documentoSeleccionado._id}
          nombreArchivo={documentoSeleccionado.nombreArchivo}
          onCerrar={handleCerrarVisor}
          onDescargar={() => handleDescargar(documentoSeleccionado)}
        />
      )}

      {/* Modal Firma Digital */}
      {mostrarFirma && documentoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl">
            <FirmaDigitalCanvas
              onFirmaCompletada={handleFirmaCompletada}
              onCancelar={handleCerrarFirma}
              ancho={600}
              alto={200}
            />
            {firmando && (
              <div className="mt-4 bg-white rounded-lg p-4 text-center">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Procesando firma...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


