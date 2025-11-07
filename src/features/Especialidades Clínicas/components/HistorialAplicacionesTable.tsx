import { Trash2, Edit2, Calendar, Filter, Loader2 } from 'lucide-react';
import { AplicacionPreventiva } from '../api/odontopediatriaApi';

interface HistorialAplicacionesTableProps {
  aplicaciones: AplicacionPreventiva[];
  loading?: boolean;
  onEditar?: (aplicacion: AplicacionPreventiva) => void;
  onEliminar?: (aplicacionId: string) => void;
  filtroTipo?: 'Fluor' | 'Sellador' | 'Todos';
  onFiltroTipoChange?: (tipo: 'Fluor' | 'Sellador' | 'Todos') => void;
}

export default function HistorialAplicacionesTable({
  aplicaciones,
  loading = false,
  onEditar,
  onEliminar,
  filtroTipo = 'Todos',
  onFiltroTipoChange,
}: HistorialAplicacionesTableProps) {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const obtenerTipoColor = (tipo: 'Fluor' | 'Sellador') => {
    return tipo === 'Fluor'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const aplicacionesFiltradas =
    filtroTipo === 'Todos'
      ? aplicaciones
      : aplicaciones.filter((app) => app.tipoAplicacion === filtroTipo);

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando historial...</p>
      </div>
    );
  }

  if (aplicacionesFiltradas.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay aplicaciones registradas</h3>
        <p className="text-gray-600 mb-4">
          {filtroTipo !== 'Todos'
            ? `No hay aplicaciones de tipo "${filtroTipo === 'Fluor' ? 'Flúor' : 'Sellador'}" registradas`
            : 'Comience registrando una nueva aplicación'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      {/* Filtros */}
      {onFiltroTipoChange && (
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Filter size={16} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Filtrar por tipo:</span>
              <div className="flex gap-2">
                {(['Todos', 'Fluor', 'Sellador'] as const).map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => onFiltroTipoChange(tipo)}
                    className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      filtroTipo === tipo
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    {tipo === 'Fluor' ? 'Flúor' : tipo === 'Sellador' ? 'Sellador' : 'Todos'}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-xs text-slate-600 ml-auto">
              {aplicacionesFiltradas.length} de {aplicaciones.length} aplicaciones
            </span>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Dientes Tratados
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Notas
              </th>
              {(onEditar || onEliminar) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {aplicacionesFiltradas.map((aplicacion) => (
              <tr key={aplicacion._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatearFecha(aplicacion.fechaAplicacion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${obtenerTipoColor(
                      aplicacion.tipoAplicacion
                    )}`}
                  >
                    {aplicacion.tipoAplicacion === 'Fluor' ? 'Flúor' : 'Sellador'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{aplicacion.productoUtilizado}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex flex-wrap gap-1">
                    {Array.from(new Set(aplicacion.dientesTratados.map((dt) => dt.diente))).map(
                      (diente) => {
                        const superficies = aplicacion.dientesTratados
                          .filter((dt) => dt.diente === diente)
                          .map((dt) => dt.superficie)
                          .join(', ');
                        return (
                          <span
                            key={diente}
                            className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium ring-1 ring-blue-200"
                            title={`Superficies: ${superficies}`}
                          >
                            {diente}
                          </span>
                        );
                      }
                    )}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {new Set(aplicacion.dientesTratados.map((dt) => dt.diente)).size} diente(s)
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  {aplicacion.notas ? (
                    <p className="truncate" title={aplicacion.notas}>
                      {aplicacion.notas}
                    </p>
                  ) : (
                    <span className="text-slate-400 italic">Sin notas</span>
                  )}
                </td>
                {(onEditar || onEliminar) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {onEditar && (
                        <button
                          onClick={() => onEditar(aplicacion)}
                          className="inline-flex items-center justify-center p-2 rounded-xl text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-all"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {onEliminar && (
                        <button
                          onClick={() => {
                            if (aplicacion._id && confirm('¿Está seguro de eliminar esta aplicación?')) {
                              onEliminar(aplicacion._id);
                            }
                          }}
                          className="inline-flex items-center justify-center p-2 rounded-xl text-red-600 hover:text-red-900 hover:bg-red-50 transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



