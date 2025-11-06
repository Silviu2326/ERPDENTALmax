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
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-200">
      <div className="flex items-center space-x-2 mb-6">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Resumen de Liquidación</h3>
      </div>

      <div className="space-y-4">
        {/* Total de tratamientos */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tratamientos seleccionados</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{totalTratamientos}</span>
          </div>
        </div>

        {/* Importe Total */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Importe Total</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{formatearMoneda(importeTotal)}</span>
          </div>
        </div>

        {/* Importe Mutua */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border-2 border-blue-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Importe a Liquidar (Mutua)</span>
            </div>
            <span className="text-xl font-bold text-blue-700">{formatearMoneda(importeMutua)}</span>
          </div>
        </div>

        {/* Importe Paciente */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-gray-500" />
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


