import { ArrowLeft, FileText } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileText size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Nueva Factura
                  </h1>
                  <p className="text-gray-600">
                    Cree una nueva factura para un paciente
                  </p>
                </div>
              </div>
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
                >
                  <ArrowLeft size={18} className="opacity-70" />
                  <span>Volver</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <FormularioNuevaFactura
          onFacturaCreada={onFacturaCreada}
          onCancelar={onVolver}
        />
      </div>
    </div>
  );
}



