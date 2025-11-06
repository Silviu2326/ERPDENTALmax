import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, FileText, Loader } from 'lucide-react';
import { confirmarYEnviarFactura, PrefacturaMutua, FacturaMutuaConfirmada } from '../../api/facturacionMutuaApi';
import VisorPrefacturaMutua from './VisorPrefacturaMutua';

interface PasoResumenYEnvioProps {
  prefactura: PrefacturaMutua;
  onFacturaConfirmada: (factura: FacturaMutuaConfirmada) => void;
  onCancelar?: () => void;
}

export default function PasoResumenYEnvio({
  prefactura,
  onFacturaConfirmada,
  onCancelar,
}: PasoResumenYEnvioProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facturaConfirmada, setFacturaConfirmada] = useState<FacturaMutuaConfirmada | null>(null);

  const handleConfirmarYEnviar = async () => {
    if (!prefactura._id) {
      setError('La prefactura no tiene un ID válido');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resultado = await confirmarYEnviarFactura(prefactura._id);
      setFacturaConfirmada(resultado);
      onFacturaConfirmada(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al confirmar y enviar la factura');
    } finally {
      setLoading(false);
    }
  };

  if (facturaConfirmada) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-600 rounded-full p-3">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-green-900 mb-2">¡Factura Confirmada y Enviada!</h3>
              <p className="text-green-700 mb-4">
                La factura ha sido generada correctamente y está lista para su envío a la mutua.
              </p>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Número de Factura</div>
                    <div className="font-bold text-lg text-gray-900">{facturaConfirmada.numeroFactura}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Fecha de Envío</div>
                    <div className="font-semibold text-gray-900">
                      {new Date(facturaConfirmada.fechaEnvio).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Estado</div>
                    <div className="font-semibold text-green-700 capitalize">{facturaConfirmada.estado}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="font-bold text-lg text-gray-900">{facturaConfirmada.total.toFixed(2)} €</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <VisorPrefacturaMutua prefactura={facturaConfirmada} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Paso 5: Resumen y Envío</h3>
        <p className="text-gray-600 text-sm">
          Revisa la prefactura una última vez y confirma para generar y enviar la factura final.
        </p>
      </div>

      {/* Advertencia */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-medium text-yellow-900 mb-1">Confirmación Final</div>
          <div className="text-sm text-yellow-800">
            Al confirmar, la factura será guardada en el sistema con estado "enviada", los tratamientos se
            marcarán como facturados y se generará el documento PDF correspondiente.
          </div>
        </div>
      </div>

      {/* Visor de prefactura */}
      <VisorPrefacturaMutua prefactura={prefactura} />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-red-900 mb-1">Error</div>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {onCancelar && (
          <button
            onClick={onCancelar}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
        <button
          onClick={handleConfirmarYEnviar}
          disabled={loading || !prefactura._id}
          className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Confirmar y Enviar Factura
            </>
          )}
        </button>
      </div>
    </div>
  );
}


