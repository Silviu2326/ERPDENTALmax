import { useState } from 'react';
import { FileText, ArrowLeft, Receipt } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Receipt size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Asistente de Facturación a Mutuas
                  </h1>
                  <p className="text-gray-600">
                    Herramienta guiada para generar facturas a compañías de seguros y mutuas
                  </p>
                </div>
              </div>
              {onVolver && (
                <button
                  onClick={handleVolver}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Volver
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Contenido principal */}
        {facturaConfirmada ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FileText size={48} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Factura Generada Exitosamente
            </h3>
            <p className="text-gray-600 mb-4">
              La factura {facturaConfirmada.numeroFactura} ha sido creada y está lista para su envío.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleNuevaFactura}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-semibold"
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
        ) : (
          <AsistenteFacturacionWizard
            onCompletado={handleCompletado}
            onCancelar={onVolver}
          />
        )}
      </div>
    </div>
  );
}

