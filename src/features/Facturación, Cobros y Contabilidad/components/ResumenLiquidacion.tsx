import { Tratamiento } from '../api/liquidacionesApi';
import { Calculator, FileText, DollarSign } from 'lucide-react';

interface ResumenLiquidacionProps {
  tratamientosSeleccionados: Tratamiento[];
  loading?: boolean;
}

export default function ResumenLiquidacion({
  tratamientosSeleccionados,
  loading = false,
}: ResumenLiquidacionProps) {
  const totalTratamientos = tratamientosSeleccionados.length;
  const importeTotal = tratamientosSeleccionados.reduce(
    (suma, tratamiento) => suma + tratamiento.importeTotal,
    0
  );
  const importeMutua = tratamientosSeleccionados.reduce(
    (suma, tratamiento) => suma + tratamiento.importeMutua,
    0
  );
  const importePaciente = tratamientosSeleccionados.reduce(
    (suma, tratamiento) => suma + tratamiento.importePaciente,
    0
  );

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calculator size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Resumen de Liquidación</h3>
      </div>

      <div className="space-y-4">
        {/* Total de tratamientos */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tratamientos seleccionados</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{totalTratamientos}</span>
          </div>
        </div>

        {/* Importe Total */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Importe Total</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{formatearMoneda(importeTotal)}</span>
          </div>
        </div>

        {/* Importe Mutua */}
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Importe a Liquidar (Mutua)</span>
            </div>
            <span className="text-xl font-bold text-blue-700">{formatearMoneda(importeMutua)}</span>
          </div>
        </div>

        {/* Importe Paciente */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Importe Paciente</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{formatearMoneda(importePaciente)}</span>
          </div>
        </div>
      </div>

      {totalTratamientos === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800 text-center">
            Seleccione al menos un tratamiento para generar la liquidación
          </p>
        </div>
      )}
    </div>
  );
}



