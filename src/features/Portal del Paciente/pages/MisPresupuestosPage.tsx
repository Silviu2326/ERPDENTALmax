import { useState } from 'react';
import { ArrowLeft, Receipt } from 'lucide-react';
import PresupuestoList from '../components/PresupuestoList';

interface MisPresupuestosPageProps {
  onVolver?: () => void;
  onVerDetalle?: (presupuestoId: string) => void;
}

export default function MisPresupuestosPage({ onVolver, onVerDetalle }: MisPresupuestosPageProps) {
  const [presupuestoSeleccionadoId, setPresupuestoSeleccionadoId] = useState<string | null>(null);

  const handleVerDetalle = (id: string) => {
    setPresupuestoSeleccionadoId(id);
    if (onVerDetalle) {
      onVerDetalle(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Volver"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mis Presupuestos</h1>
                  <p className="text-sm text-gray-600">
                    Revisa y aprueba tus presupuestos de tratamiento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <PresupuestoList onVerDetalle={handleVerDetalle} />
        </div>
      </main>
    </div>
  );
}



