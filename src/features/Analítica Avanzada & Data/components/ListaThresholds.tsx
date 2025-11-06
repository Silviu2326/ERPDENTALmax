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
      <div className="text-center py-12">
        <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">No hay thresholds configurados</p>
        <p className="text-gray-400 text-sm mt-2">Crea tu primer threshold para comenzar a recibir alertas automáticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {thresholds.map((threshold) => (
        <div
          key={threshold._id}
          className={`border-2 rounded-lg p-6 transition-all duration-200 hover:shadow-lg ${
            threshold.activa
              ? 'bg-white border-blue-300'
              : 'bg-gray-50 border-gray-300 opacity-75'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-bold">{threshold.nombre}</h3>
                {threshold.activa ? (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex items-center space-x-1">
                    <Bell className="w-3 h-3" />
                    <span>Activa</span>
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    Inactiva
                  </span>
                )}
              </div>
              {threshold.descripcion && (
                <p className="text-sm text-gray-600 mb-4">{threshold.descripcion}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-700 mb-1">Métrica</p>
                  <p className="text-sm font-bold text-blue-900">{threshold.metrica}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-purple-700 mb-1">Condición</p>
                  <p className="text-sm font-bold text-purple-900">
                    {getOperadorTexto(threshold.operador)} {formatValor(threshold.valorUmbral, threshold.metrica)}
                    {threshold.operador === 'entre' && threshold.valorUmbral2
                      ? ` - ${formatValor(threshold.valorUmbral2, threshold.metrica)}`
                      : ''}
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-indigo-700 mb-1">Frecuencia</p>
                  <p className="text-sm font-bold text-indigo-900">{getFrecuenciaTexto(threshold.frecuenciaVerificacion)}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-orange-700 mb-1">Notificaciones</p>
                  <div className="flex space-x-2">
                    {threshold.notificaciones.email && (
                      <span className="text-xs bg-white px-2 py-1 rounded">Email</span>
                    )}
                    {threshold.notificaciones.push && (
                      <span className="text-xs bg-white px-2 py-1 rounded">Push</span>
                    )}
                    {threshold.notificaciones.dashboard && (
                      <span className="text-xs bg-white px-2 py-1 rounded">Dashboard</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2 ml-4">
              <button
                onClick={() => onToggleActivo(threshold._id!, !threshold.activa)}
                className={`p-2 rounded-lg transition-colors ${
                  threshold.activa
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={threshold.activa ? 'Desactivar' : 'Activar'}
              >
                {threshold.activa ? (
                  <ToggleRight className="w-5 h-5" />
                ) : (
                  <ToggleLeft className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => onEditar(threshold)}
                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                title="Editar"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onEliminar(threshold._id!)}
                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


