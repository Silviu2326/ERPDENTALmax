import { Eye, Edit, Trash2, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';
import { CampanaConMetricas } from '../api/campanasApi';

interface ListaCampanasTableProps {
  campanas: CampanaConMetricas[];
  onVerDetalle: (campanaId: string) => void;
  onEditar: (campana: CampanaConMetricas) => void;
  onEliminar: (campanaId: string) => void;
}

const estadosColor = {
  Planificada: 'bg-blue-100 text-blue-800',
  Activa: 'bg-green-100 text-green-800',
  Finalizada: 'bg-gray-100 text-gray-800',
  Archivada: 'bg-red-100 text-red-800',
};

export default function ListaCampanasTable({
  campanas,
  onVerDetalle,
  onEditar,
  onEliminar,
}: ListaCampanasTableProps) {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Campaña
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Canal
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Periodo
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Presupuesto
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Pacientes
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                CPA
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                ROI
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {campanas.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-600">
                  No hay campañas disponibles
                </td>
              </tr>
            ) : (
              campanas.map((campana) => (
                <tr key={campana._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{campana.nombre}</div>
                      {campana.descripcion && (
                        <div className="text-sm text-slate-600 truncate max-w-xs">
                          {campana.descripcion}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-900">{campana.canal || campana.tipo}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <div>{formatearFecha(campana.fechaInicio)}</div>
                        <div className="text-xs text-slate-500">hasta {formatearFecha(campana.fechaFin)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                      <DollarSign className="w-4 h-4" />
                      {formatearMoneda(campana.presupuesto)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-slate-900">
                      <Users className="w-4 h-4" />
                      {campana.pacientesAsociadosCount || campana.pacientesAsociados?.length || campana.pacientesConvertidos || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {campana.cpa ? formatearMoneda(campana.cpa) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-4 h-4 ${
                        (campana.roi || 0) > 0 ? 'text-green-600' : 'text-red-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        (campana.roi || 0) > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {campana.roi ? `${campana.roi.toFixed(1)}%` : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      estadosColor[campana.estado] || 'bg-slate-100 text-slate-800'
                    }`}>
                      {campana.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => campana._id && onVerDetalle(campana._id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-all"
                        title="Ver detalle"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onEditar(campana)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-all"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => campana._id && onEliminar(campana._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



