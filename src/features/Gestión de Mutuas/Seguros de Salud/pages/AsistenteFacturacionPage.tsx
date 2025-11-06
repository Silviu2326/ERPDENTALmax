import { useState } from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import AsistenteFacturacionWizard from '../components/AsistenteFacturacion/AsistenteFacturacionWizard';
import { FacturaMutuaConfirmada } from '../api/facturacionMutuaApi';

interface AsistenteFacturacionPageProps {
  onVolver?: () => void;
}

export default function AsistenteFacturacionPage({ onVolver }: AsistenteFacturacionPageProps) {
  const [facturaConfirmada, setFacturaConfirmada] = useState<FacturaMutuaConfirmada | null>(null);

  const handleCompletado = (factura: FacturaMutuaConfirmada) => {
    setFacturaConfirmada(factura);
  };

  const handleNuevaFactura = () => {
    setFacturaConfirmada(null);
  };

  const handleVolver = () => {
    if (onVolver) {
      onVolver();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Asistente de Facturación a Mutuas
            </h2>
            <p className="text-gray-600 mt-1">
              Herramienta guiada para generar facturas a compañías de seguros y mutuas
            </p>
          </div>
          {onVolver && (
            <button
              onClick={handleVolver}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          )}
        </div>
      </div>

        {/* Contenido principal */}
        {facturaConfirmada ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center py-8">
              <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Factura Generada Exitosamente
              </h2>
              <p className="text-gray-600 mb-6">
                La factura {facturaConfirmada.numeroFactura} ha sido creada y está lista para su envío.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleNuevaFactura}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  Crear Nueva Factura
                </button>
                {onVolver && (
                  <button
                    onClick={handleVolver}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Volver al Módulo
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <AsistenteFacturacionWizard
            onCompletado={handleCompletado}
            onCancelar={onVolver}
          />
        )}
    </div>
  );
}

