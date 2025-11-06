import { ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onVolver}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detalle del Presupuesto</h1>
              <p className="text-sm text-gray-600">
                Revisa los detalles completos del presupuesto
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PresupuestoDetailView
          presupuestoId={presupuestoId}
          onVolver={onVolver}
          onPresupuestoActualizado={onPresupuestoActualizado}
        />
      </main>
    </div>
  );
}


