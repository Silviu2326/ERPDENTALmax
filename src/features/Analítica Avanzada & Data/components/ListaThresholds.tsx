import { Settings, Edit, Trash2, ToggleLeft, ToggleRight, Bell, AlertTriangle } from 'lucide-react';
import { KPIThreshold } from '../api/alertasApi';

interface ListaThresholdsProps {
  thresholds: KPIThreshold[];
  onEditar: (threshold: KPIThreshold) => void;
  onEliminar: (thresholdId: string) => void;
  onToggleActivo: (thresholdId: string, activa: boolean) => void;
}

export default function ListaThresholds({
  thresholds,
  onEditar,
  onEliminar,
  onToggleActivo,
}: ListaThresholdsProps) {
  const getOperadorTexto = (operador: string) => {
    switch (operador) {
      case 'mayor_que':
        return 'Mayor que';
      case 'menor_que':
        return 'Menor que';
      case 'igual':
        return 'Igual a';
      case 'diferente':
        return 'Diferente de';
      case 'entre':
        return 'Entre';
      default:
        return operador;
    }
  };

  const getFrecuenciaTexto = (frecuencia: string) => {
    switch (frecuencia) {
      case 'tiempo_real':
        return 'Tiempo Real';
      case 'diaria':
        return 'Diaria';
      case 'semanal':
        return 'Semanal';
      case 'mensual':
        return 'Mensual';
      default:
        return frecuencia;
    }
  };

  const formatValor = (valor: number, metrica: string) => {
    if (metrica.includes('tasa') || metrica.includes('porcentaje')) {
      return `${valor}%`;
    }
    if (metrica === 'ingresos' || metrica.includes('coste') || metrica.includes('precio')) {
      return `${valor.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`;
    }
    return valor.toLocaleString('es-ES');
  };

  if (thresholds.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-2xl p-8 text-center">
        <Settings size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay thresholds configurados</h3>
        <p className="text-gray-600 mb-4">Crea tu primer threshold para comenzar a recibir alertas automáticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {thresholds.map((threshold) => (
        <div
          key={threshold._id}
          className={`bg-white shadow-sm rounded-2xl p-4 transition-shadow hover:shadow-md overflow-hidden ${
            !threshold.activa ? 'opacity-75' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{threshold.nombre}</h3>
                {threshold.activa ? (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 ring-1 ring-green-200 flex items-center gap-1">
                    <Bell size={12} />
                    <span>Activa</span>
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 ring-1 ring-gray-200">
                    Inactiva
                  </span>
                )}
              </div>
              {threshold.descripcion && (
                <p className="text-sm text-gray-600 mb-4">{threshold.descripcion}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3">
                  <p className="text-xs font-medium text-slate-600 mb-1">Métrica</p>
                  <p className="text-sm font-bold text-gray-900">{threshold.metrica}</p>
                </div>
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3">
                  <p className="text-xs font-medium text-slate-600 mb-1">Condición</p>
                  <p className="text-sm font-bold text-gray-900">
                    {getOperadorTexto(threshold.operador)} {formatValor(threshold.valorUmbral, threshold.metrica)}
                    {threshold.operador === 'entre' && threshold.valorUmbral2
                      ? ` - ${formatValor(threshold.valorUmbral2, threshold.metrica)}`
                      : ''}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3">
                  <p className="text-xs font-medium text-slate-600 mb-1">Frecuencia</p>
                  <p className="text-sm font-bold text-gray-900">{getFrecuenciaTexto(threshold.frecuenciaVerificacion)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3">
                  <p className="text-xs font-medium text-slate-600 mb-1">Notificaciones</p>
                  <div className="flex flex-wrap gap-1">
                    {threshold.notificaciones.email && (
                      <span className="text-xs bg-white px-2 py-1 rounded ring-1 ring-slate-200 text-slate-700">Email</span>
                    )}
                    {threshold.notificaciones.push && (
                      <span className="text-xs bg-white px-2 py-1 rounded ring-1 ring-slate-200 text-slate-700">Push</span>
                    )}
                    {threshold.notificaciones.dashboard && (
                      <span className="text-xs bg-white px-2 py-1 rounded ring-1 ring-slate-200 text-slate-700">Dashboard</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => onToggleActivo(threshold._id!, !threshold.activa)}
                className={`p-2 rounded-xl transition-all ${
                  threshold.activa
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 ring-1 ring-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 ring-1 ring-gray-200'
                }`}
                title={threshold.activa ? 'Desactivar' : 'Activar'}
              >
                {threshold.activa ? (
                  <ToggleRight size={20} />
                ) : (
                  <ToggleLeft size={20} />
                )}
              </button>
              <button
                onClick={() => onEditar(threshold)}
                className="p-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all ring-1 ring-blue-200"
                title="Editar"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onEliminar(threshold._id!)}
                className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all ring-1 ring-red-200"
                title="Eliminar"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



