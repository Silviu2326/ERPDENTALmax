import { ArrowLeft, FileText } from 'lucide-react';
import PresupuestoDetailView from '../components/PresupuestoDetailView';
import { PresupuestoPaciente } from '../api/presupuestosApi';

interface DetallePresupuestoPageProps {
  presupuestoId: string;
  onVolver: () => void;
  onPresupuestoActualizado?: (presupuesto: PresupuestoPaciente) => void;
}

export default function DetallePresupuestoPage({
  presupuestoId,
  onVolver,
  onPresupuestoActualizado,
}: DetallePresupuestoPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Botón volver */}
              <button
                onClick={onVolver}
                className="p-2 hover:bg-gray-100 rounded-xl mr-4 transition-all"
                aria-label="Volver"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Detalle del Presupuesto
                </h1>
                <p className="text-gray-600">
                  Revisa los detalles completos del presupuesto
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <PresupuestoDetailView
          presupuestoId={presupuestoId}
          onVolver={onVolver}
          onPresupuestoActualizado={onPresupuestoActualizado}
        />
      </div>
    </div>
  );
}



