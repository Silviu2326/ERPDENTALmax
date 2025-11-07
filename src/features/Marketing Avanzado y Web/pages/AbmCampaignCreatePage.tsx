import { useState } from 'react';
import { ArrowLeft, Megaphone, AlertCircle } from 'lucide-react';
import { crearCampanaParaEmpresa, CrearCampanaRequest } from '../api/abmApi';
import AbmCampaignForm from '../components/AbmCampaignForm';

interface AbmCampaignCreatePageProps {
  empresaId: string;
  onVolver: () => void;
  onCreada?: () => void;
}

export default function AbmCampaignCreatePage({
  empresaId,
  onVolver,
  onCreada,
}: AbmCampaignCreatePageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCrearCampana = async (datos: CrearCampanaRequest) => {
    setLoading(true);
    setError(null);
    try {
      await crearCampanaParaEmpresa(empresaId, datos);
      if (onCreada) {
        onCreada();
      } else {
        onVolver();
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la campaña');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onVolver}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Volver</span>
                </button>
                <div className="flex items-center">
                  {/* Icono con contenedor */}
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <Megaphone size={24} className="text-blue-600" />
                  </div>
                  
                  {/* Título y descripción */}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Nueva Campaña ABM
                    </h1>
                    <p className="text-gray-600">
                      Crea una nueva campaña de marketing para tu empresa objetivo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {error && (
            <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-red-900 mb-1">Error al crear la campaña</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <AbmCampaignForm onSubmit={handleCrearCampana} onCancelar={onVolver} loading={loading} />
        </div>
      </div>
    </div>
  );
}



