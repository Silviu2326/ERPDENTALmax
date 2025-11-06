import { Calculator, FileText, TrendingDown, Shield, Percent, DollarSign, Info } from 'lucide-react';
import { ResultadoSimulacion } from '../api/simuladorApi';

interface ResumenCostosDinamicoProps {
  resultado: ResultadoSimulacion | null;
  totalTratamientos: number;
  loading?: boolean;
}

export default function ResumenCostosDinamico({
  resultado,
  totalTratamientos,
  loading = false,
}: ResumenCostosDinamicoProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Resumen de Costos</h3>
        </div>
        <div className="text-center py-12 text-gray-500">
          <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No hay simulación activa</p>
          <p className="text-sm">Agrega tratamientos para ver el resumen de costos</p>
        </div>
      </div>
    );
  }

  const {
    subtotal,
    totalDescuentos,
    montoCubiertoAseguradora,
    totalPaciente,
    detalleCoberturas,
  } = resultado;

  const porcentajeDescuento = subtotal > 0 ? (totalDescuentos / subtotal) * 100 : 0;
  const porcentajeCobertura = subtotal > 0 ? (montoCubiertoAseguradora / subtotal) * 100 : 0;
  const ahorroTotal = totalDescuentos + montoCubiertoAseguradora;
  const porcentajeAhorro = subtotal > 0 ? (ahorroTotal / subtotal) * 100 : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 rounded-lg p-2">
          <Calculator className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Resumen de Costos</h3>
          <p className="text-xs text-gray-500">{totalTratamientos} {totalTratamientos === 1 ? 'tratamiento' : 'tratamientos'}</p>
        </div>
      </div>

      {/* Indicadores de ahorro */}
      {ahorroTotal > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <TrendingDown className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-semibold text-green-800">Ahorro Total</span>
            </div>
            <span className="text-xl font-bold text-green-700">
              {ahorroTotal.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(porcentajeAhorro, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-green-700 mt-2">{porcentajeAhorro.toFixed(1)}% de ahorro sobre el subtotal</p>
        </div>
      )}

      {/* Desglose básico */}
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-700 font-medium flex items-center">
              <FileText className="w-4 h-4 mr-2 text-gray-500" />
              Subtotal ({totalTratamientos} {totalTratamientos === 1 ? 'tratamiento' : 'tratamientos'})
            </span>
            <span className="font-bold text-gray-900 text-lg">
              {subtotal.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          </div>
        </div>

        {totalDescuentos > 0 && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-green-700 font-medium flex items-center">
                <Percent className="w-4 h-4 mr-2 text-green-600" />
                Descuentos aplicados
              </span>
              <span className="font-bold text-green-700 text-lg">
                -{totalDescuentos.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">{porcentajeDescuento.toFixed(1)}% de descuento</p>
          </div>
        )}

        {montoCubiertoAseguradora > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-blue-700 font-medium flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-600" />
                Cobertura de seguro
              </span>
              <span className="font-bold text-blue-700 text-lg">
                -{montoCubiertoAseguradora.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
            <p className="text-xs text-blue-600 mt-1">{porcentajeCobertura.toFixed(1)}% cubierto por seguro</p>
          </div>
        )}

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 border-2 border-indigo-300">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
              Total a pagar
            </span>
            <span className="text-3xl font-bold text-indigo-700">
              {totalPaciente.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          </div>
          {ahorroTotal > 0 && (
            <p className="text-xs text-indigo-600 mt-2 flex items-center">
              <Info className="w-3 h-3 mr-1" />
              Ahorraste {ahorroTotal.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })} ({porcentajeAhorro.toFixed(1)}%)
            </p>
          )}
        </div>
      </div>

      {/* Detalle de coberturas */}
      {detalleCoberturas && detalleCoberturas.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-700">Detalle de Coberturas del Seguro</h4>
          </div>
          <div className="space-y-3">
            {detalleCoberturas.map((cobertura, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 text-sm border border-blue-200 hover:shadow-md transition-shadow"
              >
                <div className="font-semibold text-gray-800 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-600" />
                  {cobertura.tratamientoNombre}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded p-2 border border-gray-200">
                    <span className="text-xs text-gray-500 block mb-1">Precio base</span>
                    <span className="font-semibold text-gray-800">
                      {cobertura.precioBase.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </span>
                  </div>
                  <div className="bg-white rounded p-2 border border-gray-200">
                    <span className="text-xs text-gray-500 block mb-1">Cobertura</span>
                    <span className="font-semibold text-blue-600">
                      {cobertura.porcentajeCobertura}%
                    </span>
                  </div>
                  <div className="bg-green-50 rounded p-2 border border-green-200">
                    <span className="text-xs text-green-600 block mb-1">Cubierto por seguro</span>
                    <span className="font-bold text-green-700 text-base">
                      {cobertura.montoCubierto.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded p-2 border border-gray-200">
                    <span className="text-xs text-gray-600 block mb-1">Pago paciente</span>
                    <span className="font-bold text-gray-800 text-base">
                      {cobertura.montoPaciente.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen final */}
      <div className="mt-6 pt-6 border-t-2 border-gray-300 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 block mb-1">Valor original</span>
            <span className="text-lg font-bold text-gray-800">
              {subtotal.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          </div>
          <div>
            <span className="text-gray-600 block mb-1">Total final</span>
            <span className="text-lg font-bold text-indigo-700">
              {totalPaciente.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          </div>
        </div>
        {ahorroTotal > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Ahorro total</span>
              <span className="text-lg font-bold text-green-700">
                {ahorroTotal.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


