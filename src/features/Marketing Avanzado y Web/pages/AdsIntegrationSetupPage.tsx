import { ArrowLeft } from 'lucide-react';
import ConversionEventSetupForm from '../components/ConversionEventSetupForm';

interface AdsIntegrationSetupPageProps {
  onVolver: () => void;
  onSave?: () => void;
}

export default function AdsIntegrationSetupPage({
  onVolver,
  onSave,
}: AdsIntegrationSetupPageProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onVolver}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración de Eventos de Conversión</h1>
          <p className="text-gray-600 mt-2">
            Configura qué eventos del ERP se enviarán como conversiones a las plataformas publicitarias
          </p>
        </div>
      </div>

      <ConversionEventSetupForm onSave={onSave} />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">¿Cómo funciona?</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>
            Cuando ocurre un evento en el ERP (por ejemplo, una cita completada), el sistema busca
            el identificador de clic (gclid o fbclid) asociado al paciente.
          </li>
          <li>
            Si encuentra un identificador válido, envía la conversión a la plataforma publicitaria
            correspondiente.
          </li>
          <li>
            Esto permite a los algoritmos de Google y Meta optimizar las campañas para atraer
            pacientes de mayor valor.
          </li>
        </ul>
      </div>
    </div>
  );
}


