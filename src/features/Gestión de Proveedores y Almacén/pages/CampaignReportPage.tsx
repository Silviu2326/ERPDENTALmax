import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onVolver}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Reporte de Campaña</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error || 'No se pudo cargar el reporte'}</p>
          <button
            onClick={cargarDatos}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onVolver}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Reporte de Campaña: {campaign?.name}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Análisis detallado del rendimiento de tu campaña
            </p>
          </div>
        </div>
        <button
          onClick={cargarDatos}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Información de la campaña */}
      {campaign && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Asunto</p>
              <p className="font-medium text-gray-900">{campaign.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <p className="font-medium text-gray-900 capitalize">{campaign.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Fecha de Envío</p>
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <CampaignAnalyticsDashboard report={report} />
      </div>
    </div>
  );
}


