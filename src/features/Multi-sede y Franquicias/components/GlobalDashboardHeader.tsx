import { Building2 } from 'lucide-react';

interface GlobalDashboardHeaderProps {
  totalCentros: number;
}

export default function GlobalDashboardHeader({ totalCentros }: GlobalDashboardHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Panel Global de Centros</h1>
            <p className="text-blue-100 text-sm">
              Vista consolidada de {totalCentros} {totalCentros === 1 ? 'centro' : 'centros'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



