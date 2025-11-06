import { Edit, Trash2, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { PlanFinanciacion } from '../api/financiacionApi';

interface TablaGestionPlanesProps {
  planes: PlanFinanciacion[];
  onEditar: (plan: PlanFinanciacion) => void;
  onEliminar?: (planId: string) => void;
  onVerDetalle?: (plan: PlanFinanciacion) => void;
  loading?: boolean;
}

export default function TablaGestionPlanes({
  planes,
  onEditar,
  onEliminar,
  onVerDetalle,
  loading,
}: TablaGestionPlanesProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando planes...</p>
      </div>
    );
  }

  if (planes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <p className="text-gray-600">No hay planes de financiación disponibles</p>
        <p className="text-sm text-gray-500 mt-2">Crea tu primer plan de financiación para comenzar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Tasa TAE
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Cuotas
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Monto Mínimo
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Monto Máximo
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Entrada
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {planes.map((plan) => (
              <tr key={plan._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{plan.nombre}</div>
                    {plan.descripcion && (
                      <div className="text-sm text-gray-500">{plan.descripcion}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-semibold">{plan.tasaInteresAnual}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {plan.numeroCuotasMin} - {plan.numeroCuotasMax} cuotas
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">€{plan.montoMinimo.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">€{plan.montoMaximo.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {plan.requiereEntrada ? (
                    <div className="text-sm text-gray-900">
                      {plan.porcentajeEntrada || 0}%
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">No</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {plan.estado === 'activo' ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      <XCircle className="w-4 h-4 mr-1" />
                      Inactivo
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {onVerDetalle && (
                      <button
                        onClick={() => onVerDetalle(plan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onEditar(plan)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    {onEliminar && (
                      <button
                        onClick={() => plan._id && onEliminar(plan._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


