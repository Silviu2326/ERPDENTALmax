import { RendimientoProfesional } from '../api/revisionDireccionApi';
import { User, Star, DollarSign, Activity, Loader2 } from 'lucide-react';

interface GraficoRendimientoClinicoProps {
  datos: RendimientoProfesional[];
  loading?: boolean;
}

export default function GraficoRendimientoClinico({
  datos,
  loading = false,
}: GraficoRendimientoClinicoProps) {
  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  if (datos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Activity size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos disponibles</h3>
        <p className="text-gray-600">No hay datos disponibles para el período seleccionado</p>
      </div>
    );
  }

  // Ordenar por ingresos generados (mayor a menor)
  const datosOrdenados = [...datos].sort((a, b) => b.revenueGenerated - a.revenueGenerated);
  const maxIngresos = Math.max(...datos.map((d) => d.revenueGenerated), 1);

  return (
    <div className="bg-white shadow-sm rounded-xl p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Rendimiento por Profesional
        </h3>
      </div>
      <div className="space-y-4">
        {datosOrdenados.map((profesional) => {
          const porcentaje = (profesional.revenueGenerated / maxIngresos) * 100;

          return (
            <div key={profesional.professionalId} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl ring-1 ring-blue-200/70">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{profesional.professionalName}</h4>
                    <p className="text-sm text-slate-600">
                      {profesional.proceduresCount} procedimientos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-900">
                    {profesional.patientRating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Barra de ingresos */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Ingresos generados
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {profesional.revenueGenerated.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${porcentaje}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



