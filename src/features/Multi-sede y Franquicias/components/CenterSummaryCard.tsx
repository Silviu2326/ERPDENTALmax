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
      className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{nombre}</h3>
            <p className="text-sm text-gray-500">ID: {id.slice(0, 8)}...</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase">Facturación</span>
          </div>
          <p className="text-xl font-bold text-gray-800">
            {new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'EUR',
            }).format(facturacion)}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-xs font-semibold text-green-600 uppercase">Pacientes Nuevos</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{pacientesNuevos}</p>
        </div>
      </div>
    </div>
  );
}

