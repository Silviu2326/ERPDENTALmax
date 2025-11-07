import { FaseTratamiento } from '../api/planesTratamientoApi';
import { FileText, Download } from 'lucide-react';

interface ResumenFinancieroPlanProps {
  fases: FaseTratamiento[];
  descuento: number;
  onDescuentoChange: (descuento: number) => void;
  onImprimir?: () => void;
  onExportarPDF?: () => void;
}

export default function ResumenFinancieroPlan({
  fases,
  descuento,
  onDescuentoChange,
  onImprimir,
  onExportarPDF,
}: ResumenFinancieroPlanProps) {
  const totalBruto = fases.reduce((sum, fase) => {
    return (
      sum +
      fase.procedimientos.reduce((faseSum, proc) => faseSum + proc.precio, 0)
    );
  }, 0);

  const descuentoAplicado = (totalBruto * descuento) / 100;
  const totalNeto = totalBruto - descuentoAplicado;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Resumen Financiero</h3>
        <div className="flex gap-2">
          {onImprimir && (
            <button
              onClick={onImprimir}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <FileText className="w-4 h-4" />
              Imprimir
            </button>
          )}
          {onExportarPDF && (
            <button
              onClick={onExportarPDF}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </button>
          )}
        </div>
      </div>

      {/* Desglose por fases */}
      <div className="mb-4 space-y-2">
        {fases.map((fase, index) => {
          const subtotalFase = fase.procedimientos.reduce((sum, proc) => sum + proc.precio, 0);
          return (
            <div key={index} className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-600">Fase {index + 1}: {fase.nombre}</span>
              <span className="font-medium text-gray-900">€{subtotalFase.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      {/* Total bruto */}
      <div className="mb-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total Bruto</span>
          <span className="text-lg font-semibold text-gray-900">€{totalBruto.toFixed(2)}</span>
        </div>
      </div>

      {/* Descuento */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Descuento (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={descuento}
            onChange={(e) => onDescuentoChange(parseFloat(e.target.value) || 0)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Descuento aplicado</span>
          <span>€{descuentoAplicado.toFixed(2)}</span>
        </div>
      </div>

      {/* Total neto */}
      <div className="pt-4 border-t-2 border-blue-200 bg-blue-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total Neto</span>
          <span className="text-2xl font-bold text-blue-600">€{totalNeto.toFixed(2)}</span>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div>Total de fases: {fases.length}</div>
          <div>
            Total de procedimientos:{' '}
            {fases.reduce((sum, fase) => sum + fase.procedimientos.length, 0)}
          </div>
        </div>
      </div>
    </div>
  );
}



