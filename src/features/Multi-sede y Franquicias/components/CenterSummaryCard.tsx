import { Building2, DollarSign, Users } from 'lucide-react';

interface CenterSummaryCardProps {
  id: string;
  nombre: string;
  facturacion: number;
  pacientesNuevos: number;
  onVerDetalle?: (centerId: string) => void;
}

export default function CenterSummaryCard({
  id,
  nombre,
  facturacion,
  pacientesNuevos,
  onVerDetalle,
}: CenterSummaryCardProps) {
  const handleClick = () => {
    if (onVerDetalle) {
      onVerDetalle(id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-sm rounded-xl p-4 ring-1 ring-gray-200 hover:shadow-md transition-all cursor-pointer h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Building2 size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{nombre}</h3>
            <p className="text-xs text-gray-500">ID: {id.slice(0, 8)}...</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="bg-blue-50 rounded-xl p-3 ring-1 ring-blue-200/50">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-600">Facturación</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'EUR',
            }).format(facturacion)}
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-3 ring-1 ring-green-200/50">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-green-600" />
            <span className="text-xs font-medium text-green-600">Pacientes Nuevos</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{pacientesNuevos}</p>
        </div>
      </div>
    </div>
  );
}

