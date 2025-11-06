import { CreditCard, Banknote, Building2, TrendingUp } from 'lucide-react';

export type MetodoPago = 'Tarjeta' | 'Efectivo' | 'Transferencia' | 'Financiacion';

interface SelectorMetodoPagoProps {
  metodoSeleccionado: MetodoPago | null;
  onMetodoChange: (metodo: MetodoPago) => void;
  disabled?: boolean;
}

export default function SelectorMetodoPago({
  metodoSeleccionado,
  onMetodoChange,
  disabled = false,
}: SelectorMetodoPagoProps) {
  const metodos: Array<{ valor: MetodoPago; label: string; icono: React.ReactNode; descripcion: string }> = [
    {
      valor: 'Tarjeta',
      label: 'Tarjeta',
      icono: <CreditCard className="w-6 h-6" />,
      descripcion: 'Tarjeta de crédito/débito',
    },
    {
      valor: 'Efectivo',
      label: 'Efectivo',
      icono: <Banknote className="w-6 h-6" />,
      descripcion: 'Pago en efectivo',
    },
    {
      valor: 'Transferencia',
      label: 'Transferencia',
      icono: <Building2 className="w-6 h-6" />,
      descripcion: 'Transferencia bancaria',
    },
    {
      valor: 'Financiacion',
      label: 'Financiación',
      icono: <TrendingUp className="w-6 h-6" />,
      descripcion: 'Plan de financiación',
    },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Método de Pago *
      </label>
      <div className="grid grid-cols-2 gap-3">
        {metodos.map((metodo) => (
          <button
            key={metodo.valor}
            type="button"
            onClick={() => !disabled && onMetodoChange(metodo.valor)}
            disabled={disabled}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              metodoSeleccionado === metodo.valor
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`${
                  metodoSeleccionado === metodo.valor ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {metodo.icono}
              </div>
              <div className="text-left">
                <div
                  className={`font-semibold ${
                    metodoSeleccionado === metodo.valor ? 'text-blue-900' : 'text-gray-700'
                  }`}
                >
                  {metodo.label}
                </div>
                <div className="text-xs text-gray-500">{metodo.descripcion}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


