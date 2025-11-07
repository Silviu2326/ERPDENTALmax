import { AlertCircle, CheckCircle, Clock, TrendingUp, Package, Activity, User, Shield, Loader2 } from 'lucide-react';
import { EstadisticasIncidencias } from '../api/incidenciasApi';

interface DashboardIncidenciasProps {
  estadisticas: EstadisticasIncidencias;
  loading?: boolean;
}

export default function DashboardIncidencias({ estadisticas, loading = false }: DashboardIncidenciasProps) {
  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando estadísticas...</p>
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
        <div className="bg-white shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Abiertas</h3>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle size={20} className="text-red-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{estadisticas.totalAbiertas}</span>
            <span className="text-sm text-gray-600">incidencias</span>
          </div>
        </div>

        {/* En Investigación */}
        <div className="bg-white shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">En Investigación</h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{estadisticas.totalEnInvestigacion}</span>
            <span className="text-sm text-gray-600">incidencias</span>
          </div>
        </div>

        {/* Resueltas */}
        <div className="bg-white shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Resueltas</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{estadisticas.totalResueltas}</span>
            <span className="text-sm text-gray-600">incidencias</span>
          </div>
        </div>

        {/* Cerradas */}
        <div className="bg-white shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Cerradas</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{estadisticas.totalCerradas}</span>
            <span className="text-sm text-gray-600">incidencias</span>
          </div>
          {estadisticas.cerradasUltimoMes !== undefined && (
            <div className="mt-4 text-sm text-gray-600">
              Último mes: {estadisticas.cerradasUltimoMes}
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas por Tipo */}
      {estadisticas.porTipo && estadisticas.porTipo.length > 0 && (
        <div className="bg-white shadow-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidencias por Tipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estadisticas.porTipo.map((item) => {
              const TipoIcon = getTipoIcon(item.tipo);
              const porcentaje = total > 0 ? ((item.cantidad / total) * 100).toFixed(1) : 0;
              
              return (
                <div key={item.tipo} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TipoIcon size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.tipo}</p>
                      <p className="text-sm text-gray-600">{porcentaje}% del total</p>
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
        <div className="bg-white shadow-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidencias por Clínica</h3>
          <div className="space-y-3">
            {estadisticas.porClinica.map((item) => {
              const porcentaje = total > 0 ? ((item.cantidad / total) * 100).toFixed(1) : 0;
              
              return (
                <div key={item.clinicaId} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.clinicaNombre}</p>
                    <p className="text-sm text-gray-600">{porcentaje}% del total</p>
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



