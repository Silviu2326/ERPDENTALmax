import { AlertTriangle, XCircle, Bell, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { AlertaKPI } from '../api/alertasApi';

interface ListaAlertasProps {
  alertas: AlertaKPI[];
  onMarcarRevisada: (alertaId: string) => void;
  onMarcarResuelta: (alertaId: string, notas?: string) => void;
}

export default function ListaAlertas({ alertas, onMarcarRevisada, onMarcarResuelta }: ListaAlertasProps) {
  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return 'bg-red-50 border-red-300 text-red-900';
      case 'advertencia':
        return 'bg-yellow-50 border-yellow-300 text-yellow-900';
      case 'info':
        return 'bg-blue-50 border-blue-300 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-900';
    }
  };

  const getSeveridadIcon = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'advertencia':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Bell className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activa':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Activa</span>;
      case 'revisada':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Revisada</span>;
      case 'resuelta':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Resuelta</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{estado}</span>;
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatValor = (valor: number, metrica: string) => {
    if (metrica.includes('tasa') || metrica.includes('porcentaje')) {
      return `${valor.toFixed(2)}%`;
    }
    if (metrica === 'ingresos' || metrica.includes('coste') || metrica.includes('precio')) {
      return `${valor.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`;
    }
    return valor.toLocaleString('es-ES');
  };

  if (alertas.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">No hay alertas para mostrar</p>
        <p className="text-gray-400 text-sm mt-2">Las alertas aparecerán aquí cuando se detecten valores fuera de los umbrales configurados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alertas.map((alerta) => (
        <div
          key={alerta._id}
          className={`border-2 rounded-lg p-6 ${getSeveridadColor(alerta.severidad)} transition-all duration-200 hover:shadow-lg`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="flex-shrink-0 mt-1">{getSeveridadIcon(alerta.severidad)}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold">{alerta.nombreThreshold}</h3>
                  {getEstadoBadge(alerta.estado)}
                </div>
                <p className="text-sm mb-4">{alerta.mensaje}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-xs font-medium opacity-70 mb-1">Valor Actual</p>
                    <p className="text-lg font-bold flex items-center space-x-2">
                      <span>{formatValor(alerta.valorActual, alerta.metrica)}</span>
                      {alerta.valorActual > alerta.valorUmbral ? (
                        <TrendingUp className="w-4 h-4 text-red-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-600" />
                      )}
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-xs font-medium opacity-70 mb-1">Umbral</p>
                    <p className="text-lg font-bold">{formatValor(alerta.valorUmbral, alerta.metrica)}</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-xs font-medium opacity-70 mb-1">Detectada</p>
                    <p className="text-sm font-medium flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatFecha(alerta.fechaDeteccion)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {alerta.estado === 'activa' && (
              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => onMarcarRevisada(alerta._id!)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Marcar Revisada</span>
                </button>
                <button
                  onClick={() => {
                    const notas = prompt('Notas de resolución (opcional):');
                    onMarcarResuelta(alerta._id!, notas || undefined);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Resolver</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


