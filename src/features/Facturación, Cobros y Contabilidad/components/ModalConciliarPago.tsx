import { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { ConciliarPagoData } from '../api/liquidacionesApi';

interface ModalConciliarPagoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (datos: ConciliarPagoData) => Promise<void>;
  importeTotal: number;
  liquidacionCodigo: string;
}

export default function ModalConciliarPago({
  isOpen,
  onClose,
  onConfirmar,
  importeTotal,
  liquidacionCodigo,
}: ModalConciliarPagoProps) {
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().split('T')[0]);
  const [importePagado, setImportePagado] = useState(importeTotal.toString());
  const [referencia, setReferencia] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const importe = parseFloat(importePagado);
    if (isNaN(importe) || importe <= 0) {
      setError('El importe debe ser un número válido mayor que cero');
      setLoading(false);
      return;
    }

    try {
      await onConfirmar({
        fechaPago,
        importePagado: importe,
        referencia: referencia || undefined,
        notas: notas || undefined,
      });
      // Resetear formulario
      setFechaPago(new Date().toISOString().split('T')[0]);
      setImportePagado(importeTotal.toString());
      setReferencia('');
      setNotas('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conciliar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const diferencia = parseFloat(importePagado) - importeTotal;
  const esParcial = diferencia < 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Conciliar Pago</h2>
              <p className="text-sm text-gray-600">Liquidación: {liquidacionCodigo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Importe Total a Liquidar */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-blue-900 mb-1">
              Importe Total de la Liquidación
            </label>
            <p className="text-2xl font-bold text-blue-700">{formatearMoneda(importeTotal)}</p>
          </div>

          {/* Fecha de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Pago <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Importe Pagado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Importe Pagado <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={importePagado}
              onChange={(e) => setImportePagado(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {esParcial && (
              <p className="mt-1 text-sm text-orange-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Pago parcial: falta {formatearMoneda(Math.abs(diferencia))} por recibir
                </span>
              </p>
            )}
            {diferencia > 0 && (
              <p className="mt-1 text-sm text-blue-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>Pago excedente: {formatearMoneda(diferencia)}</span>
              </p>
            )}
          </div>

          {/* Referencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referencia de Pago (opcional)
            </label>
            <input
              type="text"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              placeholder="Ej: Transferencia bancaria, cheque número..."
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="Observaciones adicionales sobre el pago..."
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Conciliando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Conciliación</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


