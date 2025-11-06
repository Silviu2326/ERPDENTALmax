import { Bell, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ResumenAlertasProps {
  resumen: {
    activas: number;
    revisadas: number;
    resueltas: number;
    porSeveridad: {
      info: number;
      advertencia: number;
      critica: number;
    };
  };
}

export default function ResumenAlertas({ resumen }: ResumenAlertasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-700">Activas</p>
            <p className="text-2xl font-bold text-red-900">{resumen.activas}</p>
          </div>
          <Bell className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-700">Críticas</p>
            <p className="text-2xl font-bold text-yellow-900">{resumen.porSeveridad.critica}</p>
          </div>
          <XCircle className="w-8 h-8 text-yellow-600" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-700">Advertencias</p>
            <p className="text-2xl font-bold text-orange-900">{resumen.porSeveridad.advertencia}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-orange-600" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Informativas</p>
            <p className="text-2xl font-bold text-blue-900">{resumen.porSeveridad.info}</p>
          </div>
          <Bell className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-700">Resueltas</p>
            <p className="text-2xl font-bold text-green-900">{resumen.resueltas}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>
    </div>
  );
}


