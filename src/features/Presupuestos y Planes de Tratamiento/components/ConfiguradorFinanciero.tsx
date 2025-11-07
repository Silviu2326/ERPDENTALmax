import { useState } from 'react';
import { CreditCard, Percent, Euro, Calculator } from 'lucide-react';
import { AseguradoraPlan, OpcionFinanciera } from '../api/simuladorApi';

interface ConfiguradorFinancieroProps {
  planesAseguradoras: AseguradoraPlan[];
  opcionesFinancieras: OpcionFinanciera[];
  planSeleccionado: AseguradoraPlan | null;
  opcionFinancieraSeleccionada: OpcionFinanciera | null;
  plazoMesesSeleccionado: number | null;
  descuentoPorcentaje: number;
  descuentoFijo: number;
  totalPaciente: number;
  onPlanAseguradoraChange: (plan: AseguradoraPlan | null) => void;
  onOpcionFinancieraChange: (opcion: OpcionFinanciera | null) => void;
  onPlazoMesesChange: (plazo: number) => void;
  onDescuentoPorcentajeChange: (descuento: number) => void;
  onDescuentoFijoChange: (descuento: number) => void;
  loading?: boolean;
}

export default function ConfiguradorFinanciero({
  planesAseguradoras,
  opcionesFinancieras,
  planSeleccionado,
  opcionFinancieraSeleccionada,
  plazoMesesSeleccionado,
  descuentoPorcentaje,
  descuentoFijo,
  totalPaciente,
  onPlanAseguradoraChange,
  onOpcionFinancieraChange,
  onPlazoMesesChange,
  onDescuentoPorcentajeChange,
  onDescuentoFijoChange,
  loading = false,
}: ConfiguradorFinancieroProps) {
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(true);

  // Calcular cuota mensual si hay financiación seleccionada
  const calcularCuotaMensual = () => {
    if (!opcionFinancieraSeleccionada || !plazoMesesSeleccionado || totalPaciente <= 0) {
      return null;
    }

    const tasaMensual = opcionFinancieraSeleccionada.tasa_interes / 100 / 12;
    const comision = (opcionFinancieraSeleccionada.comision_apertura / 100) * totalPaciente;
    const montoTotal = totalPaciente + comision;

    if (tasaMensual === 0) {
      // Sin intereses
      return montoTotal / plazoMesesSeleccionado;
    }

    // Con intereses
    const cuota =
      (montoTotal * tasaMensual * Math.pow(1 + tasaMensual, plazoMesesSeleccionado)) /
      (Math.pow(1 + tasaMensual, plazoMesesSeleccionado) - 1);

    return cuota;
  };

  const cuotaMensual = calcularCuotaMensual();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Configuración Financiera</h3>
        </div>
        <button
          onClick={() => setMostrarConfiguracion(!mostrarConfiguracion)}
          className="text-gray-500 hover:text-gray-700"
        >
          {mostrarConfiguracion ? '▼' : '▶'}
        </button>
      </div>

      {mostrarConfiguracion && (
        <div className="space-y-6">
          {/* Plan de Aseguradora */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Plan de Seguro
            </label>
            <select
              value={planSeleccionado?._id || ''}
              onChange={(e) => {
                const plan = planesAseguradoras.find((p) => p._id === e.target.value) || null;
                onPlanAseguradoraChange(plan);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="">Sin seguro</option>
              {planesAseguradoras.map((plan) => (
                <option key={plan._id} value={plan._id}>
                  {plan.nombre_aseguradora} - {plan.nombre_plan}
                </option>
              ))}
            </select>
            {planSeleccionado && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Deducible: {planSeleccionado.deducible.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                })}</p>
              </div>
            )}
          </div>

          {/* Descuentos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Percent className="w-4 h-4 inline mr-1" />
                Descuento (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={descuentoPorcentaje}
                onChange={(e) => onDescuentoPorcentajeChange(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Euro className="w-4 h-4 inline mr-1" />
                Descuento Fijo (€)
              </label>
              <input
                type="number"
                min="0"
                value={descuentoFijo}
                onChange={(e) => onDescuentoFijoChange(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Opciones de Financiación */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Opción de Financiación
            </label>
            <select
              value={opcionFinancieraSeleccionada?._id || ''}
              onChange={(e) => {
                const opcion =
                  opcionesFinancieras.find((o) => o._id === e.target.value) || null;
                onOpcionFinancieraChange(opcion);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="">Pago único</option>
              {opcionesFinancieras.map((opcion) => (
                <option key={opcion._id} value={opcion._id}>
                  {opcion.nombre} ({opcion.entidad})
                </option>
              ))}
            </select>

            {opcionFinancieraSeleccionada && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Plazo (meses)
                  </label>
                  <select
                    value={plazoMesesSeleccionado || ''}
                    onChange={(e) => onPlazoMesesChange(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    {opcionFinancieraSeleccionada.plazos_meses.map((plazo) => (
                      <option key={plazo} value={plazo}>
                        {plazo} meses
                      </option>
                    ))}
                  </select>
                </div>

                {cuotaMensual && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calculator className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-700">Estimación de Cuota</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tasa de interés:</span>
                        <span className="font-medium">
                          {opcionFinancieraSeleccionada.tasa_interes}%
                        </span>
                      </div>
                      {opcionFinancieraSeleccionada.comision_apertura > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Comisión de apertura:</span>
                          <span className="font-medium">
                            {opcionFinancieraSeleccionada.comision_apertura}%
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-blue-200">
                        <span className="font-semibold text-gray-800">Cuota mensual:</span>
                        <span className="text-lg font-bold text-blue-600">
                          {cuotaMensual.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



