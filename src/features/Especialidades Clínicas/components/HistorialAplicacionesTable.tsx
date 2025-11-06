import { Trash2, Edit2, Calendar, Filter } from 'lucide-react';
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
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">Cargando historial...</div>
      </div>
    );
  }

  if (aplicacionesFiltradas.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">No hay aplicaciones registradas</p>
          <p className="text-sm mt-2">
            {filtroTipo !== 'Todos'
              ? `No hay aplicaciones de tipo "${filtroTipo === 'Fluor' ? 'Flúor' : 'Sellador'}" registradas`
              : 'Comience registrando una nueva aplicación'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Filtros */}
      {onFiltroTipoChange && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrar por tipo:</span>
            <div className="flex gap-2">
              {(['Todos', 'Fluor', 'Sellador'] as const).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => onFiltroTipoChange(tipo)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    filtroTipo === tipo
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {tipo === 'Fluor' ? 'Flúor' : tipo === 'Sellador' ? 'Sellador' : 'Todos'}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-auto">
              {aplicacionesFiltradas.length} de {aplicaciones.length} aplicaciones
            </span>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dientes Tratados
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notas
              </th>
              {(onEditar || onEliminar) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {aplicacionesFiltradas.map((aplicacion) => (
              <tr key={aplicacion._id} className="hover:bg-gray-50">
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
                            className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium"
                            title={`Superficies: ${superficies}`}
                          >
                            {diente}
                          </span>
                        );
                      }
                    )}
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {new Set(aplicacion.dientesTratados.map((dt) => dt.diente)).size} diente(s)
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  {aplicacion.notas ? (
                    <p className="truncate" title={aplicacion.notas}>
                      {aplicacion.notas}
                    </p>
                  ) : (
                    <span className="text-gray-400 italic">Sin notas</span>
                  )}
                </td>
                {(onEditar || onEliminar) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {onEditar && (
                        <button
                          onClick={() => onEditar(aplicacion)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {onEliminar && (
                        <button
                          onClick={() => {
                            if (aplicacion._id && confirm('¿Está seguro de eliminar esta aplicación?')) {
                              onEliminar(aplicacion._id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
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


