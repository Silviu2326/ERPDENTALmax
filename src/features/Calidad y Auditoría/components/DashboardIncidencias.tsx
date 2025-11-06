import { AlertCircle, CheckCircle, Clock, TrendingUp, Package, Activity, User, Shield } from 'lucide-react';
import { EstadisticasIncidencias } from '../api/incidenciasApi';

interface DashboardIncidenciasProps {
  estadisticas: EstadisticasIncidencias;
  loading?: boolean;
}

export default function DashboardIncidencias({ estadisticas, loading = false }: DashboardIncidenciasProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const total = estadisticas.totalAbiertas + estadisticas.totalEnInvestigacion + estadisticas.totalResueltas + estadisticas.totalCerradas;

  const getTipoIcon = (tipo: string) => {
    if (tipo.includes('Producto')) return Package;
    if (tipo.includes('Clínica')) return Activity;
    if (tipo.includes('Paciente')) return User;
    if (tipo.includes('Seguridad')) return Shield;
    return AlertCircle;
  };

  return (
    <div className="space-y-6">
      {/* Cards de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Abiertas */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Abiertas</h3>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{estadisticas.totalAbiertas}</span>
            <span className="text-sm text-gray-500">incidencias</span>
          </div>
        </div>

        {/* En Investigación */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">En Investigación</h3>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{estadisticas.totalEnInvestigacion}</span>
            <span className="text-sm text-gray-500">incidencias</span>
          </div>
        </div>

        {/* Resueltas */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Resueltas</h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{estadisticas.totalResueltas}</span>
            <span className="text-sm text-gray-500">incidencias</span>
          </div>
        </div>

        {/* Cerradas */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Cerradas</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{estadisticas.totalCerradas}</span>
            <span className="text-sm text-gray-500">incidencias</span>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Último mes: {estadisticas.cerradasUltimoMes}
          </div>
        </div>
      </div>

      {/* Estadísticas por Tipo */}
      {estadisticas.porTipo && estadisticas.porTipo.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidencias por Tipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estadisticas.porTipo.map((item) => {
              const TipoIcon = getTipoIcon(item.tipo);
              const porcentaje = total > 0 ? ((item.cantidad / total) * 100).toFixed(1) : 0;
              
              return (
                <div key={item.tipo} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <TipoIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.tipo}</p>
                      <p className="text-sm text-gray-500">{porcentaje}% del total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{item.cantidad}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Estadísticas por Clínica */}
      {estadisticas.porClinica && estadisticas.porClinica.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidencias por Clínica</h3>
          <div className="space-y-3">
            {estadisticas.porClinica.map((item) => {
              const porcentaje = total > 0 ? ((item.cantidad / total) * 100).toFixed(1) : 0;
              
              return (
                <div key={item.clinicaId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.clinicaNombre}</p>
                    <p className="text-sm text-gray-500">{porcentaje}% del total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{item.cantidad}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


