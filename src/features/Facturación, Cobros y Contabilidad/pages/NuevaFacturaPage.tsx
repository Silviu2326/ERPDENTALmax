import { ArrowLeft } from 'lucide-react';
import FormularioNuevaFactura from '../components/FormularioNuevaFactura';
import { Factura } from '../api/facturacionApi';

interface NuevaFacturaPageProps {
  onVolver?: () => void;
  onFacturaCreada?: (factura: Factura) => void;
}

export default function NuevaFacturaPage({
  onVolver,
  onFacturaCreada,
}: NuevaFacturaPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {onVolver && (
          <button
            onClick={onVolver}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Panel de Facturación</span>
          </button>
        )}
        <FormularioNuevaFactura
          onFacturaCreada={onFacturaCreada}
          onCancelar={onVolver}
        />
      </div>
    </div>
  );
}


