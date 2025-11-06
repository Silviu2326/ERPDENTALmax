import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { RentabilidadPorTratamiento } from '../api/rentabilidadApi';

interface GraficoRentabilidadTratamientosProps {
  datos: RentabilidadPorTratamiento[];
  loading?: boolean;
}

export default function GraficoRentabilidadTratamientos({
  datos,
  loading = false,
}: GraficoRentabilidadTratamientosProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Rentabilidad por Tratamiento</h3>
            <p className="text-sm text-gray-500">Margen por tipo de tratamiento</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-500 mt-4">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Rentabilidad por Tratamiento</h3>
            <p className="text-sm text-gray-500">Margen por tipo de tratamiento</p>
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
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Rentabilidad por Tratamiento</h3>
          <p className="text-sm text-gray-500">Margen por tipo de tratamiento</p>
        </div>
      </div>

      <div className="space-y-4">
        {datosOrdenados.map((tratamiento, index) => {
          const porcentaje = (tratamiento.margen / maxMargen) * 100;
          const margenPorcentual = tratamiento.ingresos > 0 
            ? (tratamiento.margen / tratamiento.ingresos) * 100 
            : 0;
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
                  <span className="text-sm font-semibold text-gray-800">
                    {tratamiento.tratamientoNombre}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-green-600">
                      {formatearMoneda(tratamiento.margen)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({margenPorcentual.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {tratamiento.cantidadRealizados} realizados • 
                  Ingresos: {formatearMoneda(tratamiento.ingresos)} • 
                  Costos: {formatearMoneda(tratamiento.costosDirectos)}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isHovered
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                      : 'bg-gradient-to-r from-purple-400 to-purple-500'
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


