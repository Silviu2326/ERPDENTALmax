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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Cargando presupuesto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !presupuesto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleVolver}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Presupuesto Firmado Exitosamente</h3>
            <p className="text-gray-600 mb-4">
              El presupuesto ha sido firmado y su estado ha cambiado a 'Aceptado'
            </p>
            {presupuesto && (
              <div className="mb-4">
                <EstadoPresupuestoBadge estado="Aceptado" size="lg" />
              </div>
            )}
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={handleVolver}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
              {presupuesto?.documentoFirmadoURL && (
                <button
                  onClick={handleDescargarPDF}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  <FileText className="w-4 h-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Firma de Presupuesto
                </h1>
                {presupuesto ? (
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-gray-600">
                      Presupuesto #{presupuesto.numeroPresupuesto}
                    </p>
                    <EstadoPresupuestoBadge estado={presupuesto.estado} />
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Revisa y firma el presupuesto del paciente
                  </p>
                )}
              </div>

              {/* Botón volver */}
              {onVolver && (
                <button
                  onClick={handleVolver}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/70 rounded-xl transition-all"
                >
                  <ArrowLeft size={18} />
                  <span>Volver</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {error && (
            <div className="bg-white shadow-sm rounded-lg p-4 border-l-4 border-red-500 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {presupuesto && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Panel izquierdo: Información del paciente */}
              <div className="lg:col-span-1">
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
        </div>
      </div>

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
  );
}

