import { Edit, Trash2, Eye, CheckCircle2, XCircle, Loader2, CreditCard } from 'lucide-react';
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
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando planes...</p>
      </div>
    );
  }

  if (planes.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay planes de financiación disponibles</h3>
        <p className="text-gray-600 mb-4">Crea tu primer plan de financiación para comenzar</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Tasa TAE
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Cuotas
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Monto Mínimo
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Monto Máximo
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Entrada
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                      <CheckCircle2 size={12} />
                      <span>Activo</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                      <XCircle size={12} />
                      <span>Inactivo</span>
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    {onVerDetalle && (
                      <button
                        onClick={() => onVerDetalle(plan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Ver detalle"
                      >
                        <Eye size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => onEditar(plan)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Editar"
                    >
                      <Edit size={20} />
                    </button>
                    {onEliminar && (
                      <button
                        onClick={() => plan._id && onEliminar(plan._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
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



