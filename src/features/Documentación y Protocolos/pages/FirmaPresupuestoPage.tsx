import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react';
import {
  obtenerDocumentoParaFirma,
  firmarPresupuesto,
  PresupuestoParaFirma,
} from '../api/presupuestosApi';
import VisorPresupuestoPDF from '../components/VisorPresupuestoPDF';
import PanelFirmaDigital from '../components/PanelFirmaDigital';
import ModalConfirmacionFirma from '../components/ModalConfirmacionFirma';
import EstadoPresupuestoBadge from '../components/EstadoPresupuestoBadge';
import InformacionPacientePresupuesto from '../components/InformacionPacientePresupuesto';

interface FirmaPresupuestoPageProps {
  presupuestoId?: string;
  onVolver?: () => void;
  onFirmado?: () => void;
}

export default function FirmaPresupuestoPage({
  presupuestoId,
  onVolver,
  onFirmado,
}: FirmaPresupuestoPageProps) {

  const [presupuesto, setPresupuesto] = useState<PresupuestoParaFirma | null>(null);
  const [loading, setLoading] = useState(true);
  const [firmando, setFirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [firmaBase64, setFirmaBase64] = useState<string | null>(null);
  const [firmaCompletada, setFirmaCompletada] = useState(false);

  useEffect(() => {
    if (!presupuestoId) {
      setError('No se ha proporcionado un ID de presupuesto');
      setLoading(false);
      return;
    }

    cargarPresupuesto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presupuestoId]);

  const cargarPresupuesto = async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerDocumentoParaFirma(presupuestoId);
      setPresupuesto(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el presupuesto');
    } finally {
      setLoading(false);
    }
  };

  const handleFirmar = (firma: string) => {
    setFirmaBase64(firma);
    setMostrarModalConfirmacion(true);
  };

  const handleConfirmarFirma = async () => {
    if (!firmaBase64 || !presupuestoId) return;

    setFirmando(true);
    setError(null);

    try {
      // Obtener metadatos para auditoría
      const metadatos = {
        ipAddress: await obtenerIP(),
        userAgent: navigator.userAgent,
        fechaFirma: new Date().toISOString(),
      };

      await firmarPresupuesto(presupuestoId, {
        firmaData: firmaBase64,
        metadatos,
      });

      setFirmaCompletada(true);
      setMostrarModalConfirmacion(false);
      
      // Llamar callback si existe
      if (onFirmado) {
        onFirmado();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al firmar el presupuesto');
    } finally {
      setFirmando(false);
    }
  };

  const obtenerIP = async (): Promise<string> => {
    try {
      // Intentar obtener IP desde un servicio externo
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  };

  const handleVolver = () => {
    if (onVolver) {
      onVolver();
    }
  };

  const handleDescargarPDF = () => {
    if (presupuesto?.documentoFirmadoURL) {
      window.open(presupuesto.documentoFirmadoURL, '_blank');
    } else {
      alert('El documento firmado aún no está disponible');
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Cargando presupuesto...</p>
        </div>
      </div>
    );
  }

  if (error && !presupuesto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md border border-red-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Error</h2>
            </div>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={handleVolver}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (firmaCompletada) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md border border-green-200 p-8 text-center">
            <div className="mb-6">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Presupuesto Firmado Exitosamente</h2>
              <p className="text-gray-600">
                El presupuesto ha sido firmado y su estado ha cambiado a 'Aceptado'
              </p>
            </div>
            {presupuesto && (
              <div className="mb-6">
                <EstadoPresupuestoBadge estado="Aceptado" size="lg" />
              </div>
            )}
            <div className="flex justify-center space-x-3">
              <button
                onClick={handleVolver}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
              {presupuesto?.documentoFirmadoURL && (
                <button
                  onClick={handleDescargarPDF}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Ver Documento Firmado</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleVolver}
            className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Firma de Presupuesto</h1>
                {presupuesto && (
                  <div className="flex items-center space-x-3 mt-2">
                    <p className="text-gray-600">
                      Presupuesto #{presupuesto.numeroPresupuesto}
                    </p>
                    <EstadoPresupuestoBadge estado={presupuesto.estado} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {presupuesto && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel izquierdo: Información del paciente */}
            <div className="lg:col-span-1 space-y-6">
              <InformacionPacientePresupuesto presupuesto={presupuesto} />
            </div>

            {/* Panel central: Vista del presupuesto */}
            <div className="lg:col-span-2 space-y-6">
              <VisorPresupuestoPDF
                presupuesto={presupuesto}
                loading={loading}
                onDescargarPDF={handleDescargarPDF}
                onImprimir={handleImprimir}
              />

              {/* Panel de firma */}
              {presupuesto.estado === 'Presentado' && (
                <PanelFirmaDigital
                  onFirmar={handleFirmar}
                  nombrePaciente={`${presupuesto.paciente.nombre} ${presupuesto.paciente.apellidos}`}
                  disabled={firmando}
                  loading={firmando}
                />
              )}
            </div>
          </div>
        )}

        {/* Modal de confirmación */}
        <ModalConfirmacionFirma
          isOpen={mostrarModalConfirmacion}
          onClose={() => setMostrarModalConfirmacion(false)}
          onConfirmar={handleConfirmarFirma}
          nombrePaciente={
            presupuesto
              ? `${presupuesto.paciente.nombre} ${presupuesto.paciente.apellidos}`
              : undefined
          }
          numeroPresupuesto={presupuesto?.numeroPresupuesto}
          total={presupuesto?.total}
          loading={firmando}
        />
      </div>
    </div>
  );
}

