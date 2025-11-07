import { AlertTriangle, XCircle, Bell, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { AlertaKPI } from '../api/alertasApi';

interface ListaAlertasProps {
  alertas: AlertaKPI[];
  onMarcarRevisada: (alertaId: string) => void;
  onMarcarResuelta: (alertaId: string, notas?: string) => void;
}

export default function ListaAlertas({ alertas, onMarcarRevisada, onMarcarResuelta }: ListaAlertasProps) {

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
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 ring-1 ring-red-200">Activa</span>;
      case 'revisada':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200">Revisada</span>;
      case 'resuelta':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 ring-1 ring-green-200">Resuelta</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 ring-1 ring-gray-200">{estado}</span>;
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
      <div className="bg-white shadow-sm rounded-2xl p-8 text-center">
        <Bell size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alertas para mostrar</h3>
        <p className="text-gray-600 mb-4">Las alertas aparecerán aquí cuando se detecten valores fuera de los umbrales configurados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alertas.map((alerta) => (
        <div
          key={alerta._id}
          className="bg-white shadow-sm rounded-2xl p-4 transition-shadow hover:shadow-md overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-1">{getSeveridadIcon(alerta.severidad)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{alerta.nombreThreshold}</h3>
                  {getEstadoBadge(alerta.estado)}
                </div>
                <p className="text-sm text-gray-600 mb-4">{alerta.mensaje}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3">
                    <p className="text-xs font-medium text-slate-600 mb-1">Valor Actual</p>
                    <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span>{formatValor(alerta.valorActual, alerta.metrica)}</span>
                      {alerta.valorActual > alerta.valorUmbral ? (
                        <TrendingUp className="w-4 h-4 text-red-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-600" />
                      )}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3">
                    <p className="text-xs font-medium text-slate-600 mb-1">Umbral</p>
                    <p className="text-lg font-bold text-gray-900">{formatValor(alerta.valorUmbral, alerta.metrica)}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3">
                    <p className="text-xs font-medium text-slate-600 mb-1">Detectada</p>
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatFecha(alerta.fechaDeteccion)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {alerta.estado === 'activa' && (
              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => onMarcarRevisada(alerta._id!)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-yellow-600 text-white hover:bg-yellow-700 shadow-sm"
                >
                  <CheckCircle size={16} />
                  <span>Marcar Revisada</span>
                </button>
                <button
                  onClick={() => {
                    const notas = prompt('Notas de resolución (opcional):');
                    onMarcarResuelta(alerta._id!, notas || undefined);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-green-600 text-white hover:bg-green-700 shadow-sm"
                >
                  <CheckCircle size={16} />
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



