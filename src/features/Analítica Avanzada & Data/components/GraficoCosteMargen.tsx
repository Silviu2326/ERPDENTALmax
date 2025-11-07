import { useState } from 'react';
import { TrendingUp, Loader2, BarChart3 } from 'lucide-react';
import { CostePorTratamiento } from '../api/analiticaApi';

interface GraficoCosteMargenProps {
  datos: CostePorTratamiento[];
  loading?: boolean;
}

export default function GraficoCosteMargen({
  datos,
  loading = false,
}: GraficoCosteMargenProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <TrendingUp size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Coste y Margen por Tratamiento</h3>
            <p className="text-sm text-gray-600">Análisis detallado de rentabilidad</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <TrendingUp size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Coste y Margen por Tratamiento</h3>
            <p className="text-sm text-gray-600">Análisis detallado de rentabilidad</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart3 size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
          <p className="text-gray-600">No se encontraron tratamientos para el período seleccionado</p>
        </div>
      </div>
    );
  }

  const datosOrdenados = [...datos].sort((a, b) => b.margen - a.margen);
  const maxMargen = Math.max(...datosOrdenados.map((d) => d.margen), 1);
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
          <TrendingUp size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Coste y Margen por Tratamiento</h3>
          <p className="text-sm text-gray-600">Análisis detallado de rentabilidad</p>
        </div>
      </div>

      <div className="space-y-4">
        {datosOrdenados.map((tratamiento, index) => {
          const porcentaje = (tratamiento.margen / maxMargen) * 100;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={tratamiento.tratamientoId}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {tratamiento.tratamientoNombre}
                    </span>
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-lg">
                      {tratamiento.areaClinica}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-green-600">
                      {formatearMoneda(tratamiento.margen)}
                    </span>
                    <span className="text-xs text-gray-600">
                      ({tratamiento.margenPorcentual.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-x-3">
                  <span>{tratamiento.cantidadRealizados} realizados</span>
                  <span>•</span>
                  <span>Ingresos: {formatearMoneda(tratamiento.ingresos)}</span>
                  <span>•</span>
                  <span>Coste: {formatearMoneda(tratamiento.costeTotal)}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isHovered
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      : 'bg-gradient-to-r from-blue-400 to-blue-500'
                  }`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



