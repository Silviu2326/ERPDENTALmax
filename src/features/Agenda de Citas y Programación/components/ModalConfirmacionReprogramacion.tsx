import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { DatosReprogramacion, ResultadoReprogramacion } from '../api/citasApi';
import SelectorDeAccionMasiva from './SelectorDeAccionMasiva';

interface ModalConfirmacionReprogramacionProps {
  mostrar: boolean;
  onCerrar: () => void;
  onConfirmar: () => void;
  datos: DatosReprogramacion;
  onDatosChange: (datos: DatosReprogramacion) => void;
  cantidadCitas: number;
  loading?: boolean;
  resultado?: ResultadoReprogramacion | null;
}

export default function ModalConfirmacionReprogramacion({
  mostrar,
  onCerrar,
  onConfirmar,
  datos,
  onDatosChange,
  cantidadCitas,
  loading = false,
  resultado = null,
}: ModalConfirmacionReprogramacionProps) {
  if (!mostrar) return null;

  const esValido = datos.motivo.trim().length > 0 && datos.citasIds.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Confirmar Reprogramación Masiva</h2>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4">
          {resultado ? (
            <div className="space-y-4">
              {resultado.success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">Reprogramación completada</h3>
                      <p className="text-sm text-green-700 mt-1">
                        Se actualizaron {resultado.actualizadas} citas correctamente
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-red-900">Error en la reprogramación</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Hubo problemas al procesar algunas citas
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {resultado.errores > 0 && resultado.detallesErrores.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Errores ({resultado.errores}):</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                    {resultado.detallesErrores.map((error, index) => (
                      <li key={index}>
                        Cita {error.citaId}: {error.motivo}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={onCerrar}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Reprogramación masiva</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Estás a punto de reprogramar <strong>{cantidadCitas} citas</strong>. Esta acción
                      actualizará todas las citas seleccionadas y registrará el cambio en el historial.
                    </p>
                  </div>
                </div>
              </div>

              <SelectorDeAccionMasiva datos={datos} onDatosChange={onDatosChange} />

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={onCerrar}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirmar}
                  disabled={!esValido || loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <span>Confirmar Reprogramación</span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


