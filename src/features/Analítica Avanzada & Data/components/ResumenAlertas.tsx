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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Activas</p>
            <p className="text-2xl font-bold text-gray-900">{resumen.activas}</p>
          </div>
          <div className="p-2 bg-red-100 rounded-xl">
            <Bell size={20} className="text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Críticas</p>
            <p className="text-2xl font-bold text-gray-900">{resumen.porSeveridad.critica}</p>
          </div>
          <div className="p-2 bg-red-100 rounded-xl">
            <XCircle size={20} className="text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Advertencias</p>
            <p className="text-2xl font-bold text-gray-900">{resumen.porSeveridad.advertencia}</p>
          </div>
          <div className="p-2 bg-yellow-100 rounded-xl">
            <AlertTriangle size={20} className="text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Informativas</p>
            <p className="text-2xl font-bold text-gray-900">{resumen.porSeveridad.info}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-xl">
            <Bell size={20} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Resueltas</p>
            <p className="text-2xl font-bold text-gray-900">{resumen.resueltas}</p>
          </div>
          <div className="p-2 bg-green-100 rounded-xl">
            <CheckCircle size={20} className="text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}



