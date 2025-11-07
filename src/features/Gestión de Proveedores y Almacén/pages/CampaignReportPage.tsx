import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import {
  obtenerReporteCampana,
  obtenerCampanaPorId,
  CampaignReport,
  EmailCampaign,
} from '../api/campaignsApi';
import CampaignAnalyticsDashboard from '../components/CampaignAnalyticsDashboard';

interface CampaignReportPageProps {
  campaignId: string;
  onVolver: () => void;
}

export default function CampaignReportPage({
  campaignId,
  onVolver,
}: CampaignReportPageProps) {
  const [report, setReport] = useState<CampaignReport | null>(null);
  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [campaignId]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [reportData, campaignData] = await Promise.all([
        obtenerReporteCampana(campaignId),
        obtenerCampanaPorId(campaignId),
      ]);

      setReport(reportData);
      setCampaign(campaignData);
    } catch (err) {
      setError('Error al cargar el reporte de la campaña');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando reporte...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <BarChart3 size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Reporte de Campaña
                  </h1>
                  <p className="text-gray-600">
                    Análisis detallado del rendimiento de tu campaña
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error || 'No se pudo cargar el reporte'}</p>
            <button
              onClick={cargarDatos}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <BarChart3 size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Reporte de Campaña: {campaign?.name}
                  </h1>
                  <p className="text-gray-600">
                    Análisis detallado del rendimiento de tu campaña
                  </p>
                </div>
              </div>
              <button
                onClick={cargarDatos}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <RefreshCw size={20} className="mr-2" />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Información de la campaña */}
          {campaign && (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Asunto</p>
                  <p className="font-medium text-gray-900">{campaign.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Estado</p>
                  <p className="font-medium text-gray-900 capitalize">{campaign.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Fecha de Envío</p>
                  <p className="font-medium text-gray-900">
                    {campaign.sentAt
                      ? new Date(campaign.sentAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard de analíticas */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <CampaignAnalyticsDashboard report={report} />
          </div>
        </div>
      </div>
    </div>
  );
}



