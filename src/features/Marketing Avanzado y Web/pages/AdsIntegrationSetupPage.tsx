import { ArrowLeft, Settings } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Botón volver */}
              <button
                onClick={onVolver}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Settings size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Configuración de Eventos de Conversión
                </h1>
                <p className="text-gray-600">
                  Configura qué eventos del ERP se enviarán como conversiones a las plataformas publicitarias
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          <ConversionEventSetupForm onSave={onSave} />

          {/* Caja informativa */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">¿Cómo funciona?</h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
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
      </div>
    </div>
  );
}



