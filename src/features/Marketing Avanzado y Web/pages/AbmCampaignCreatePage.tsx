import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Campaña ABM</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <AbmCampaignForm onSubmit={handleCrearCampana} onCancelar={onVolver} />
    </div>
  );
}


