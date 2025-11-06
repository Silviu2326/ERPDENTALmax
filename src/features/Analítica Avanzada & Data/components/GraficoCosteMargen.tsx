import { useState } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
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
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Coste y Margen por Tratamiento</h3>
            <p className="text-sm text-gray-500">Análisis detallado de rentabilidad</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-4">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Coste y Margen por Tratamiento</h3>
            <p className="text-sm text-gray-500">Análisis detallado de rentabilidad</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p>No hay datos disponibles</p>
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
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Coste y Margen por Tratamiento</h3>
          <p className="text-sm text-gray-500">Análisis detallado de rentabilidad</p>
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
                    <span className="text-sm font-semibold text-gray-800">
                      {tratamiento.tratamientoNombre}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {tratamiento.areaClinica}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-green-600">
                      {formatearMoneda(tratamiento.margen)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({tratamiento.margenPorcentual.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-x-3">
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


