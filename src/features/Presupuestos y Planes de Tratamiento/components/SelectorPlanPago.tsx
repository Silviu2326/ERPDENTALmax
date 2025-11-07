import { PlanPago } from '../api/presupuestosApi';
import { CreditCard, Check } from 'lucide-react';

interface SelectorPlanPagoProps {
  planes: PlanPago[];
  planSeleccionado: string | null;
  onSeleccionarPlan: (planId: string) => void;
  totalPresupuesto: number;
}

export default function SelectorPlanPago({
  planes,
  planSeleccionado,
  onSeleccionarPlan,
  totalPresupuesto,
}: SelectorPlanPagoProps) {
  const formatMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cantidad);
  };

  const calcularCuota = (plan: PlanPago): number => {
    if (plan.numeroCuotas === 0) return totalPresupuesto;
    const totalConInteres = totalPresupuesto * (1 + plan.interes / 100);
    return totalConInteres / plan.numeroCuotas;
  };

  if (planes.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          No hay planes de pago disponibles. Contacte con el administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <span>Plan de Pago</span>
        </h3>
        <p className="text-sm text-gray-600">
          Seleccione el plan de pago acordado con el paciente
        </p>
      </div>

      <div className="space-y-3">
        {planes.map((plan) => {
          const cuota = calcularCuota(plan);
          const totalConInteres = plan.numeroCuotas > 0 ? totalPresupuesto * (1 + plan.interes / 100) : totalPresupuesto;
          const isSelected = planSeleccionado === plan._id;

          return (
            <button
              key={plan._id}
              onClick={() => onSeleccionarPlan(plan._id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-800">{plan.nombre}</h4>
                    {isSelected && (
                      <div className="bg-blue-600 text-white rounded-full p-1">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  {plan.descripcion && (
                    <p className="text-sm text-gray-600 mb-2">{plan.descripcion}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm">
                    {plan.numeroCuotas > 0 ? (
                      <>
                        <span className="text-gray-600">
                          <span className="font-semibold">{plan.numeroCuotas}</span> cuotas de{' '}
                          <span className="font-semibold text-blue-600">{formatMoneda(cuota)}</span>
                        </span>
                        {plan.interes > 0 && (
                          <span className="text-gray-500">
                            Interés: {plan.interes}% | Total: {formatMoneda(totalConInteres)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-600">
                        Pago único: <span className="font-semibold text-blue-600">{formatMoneda(totalPresupuesto)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {planSeleccionado && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Plan seleccionado:</span>{' '}
            {planes.find((p) => p._id === planSeleccionado)?.nombre}
          </p>
        </div>
      )}
    </div>
  );
}



