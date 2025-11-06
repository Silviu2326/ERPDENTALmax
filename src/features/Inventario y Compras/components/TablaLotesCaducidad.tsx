import { useState } from 'react';
import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { LoteProducto, FiltrosLotes } from '../api/lotesApi';
import AlertaCaducidadBadge from './AlertaCaducidadBadge';
import ModalDetalleLote from './ModalDetalleLote';

interface TablaLotesCaducidadProps {
  lotes: LoteProducto[];
  loading?: boolean;
  filtros: FiltrosLotes;
  onFiltrosChange: (filtros: FiltrosLotes) => void;
  onLoteActualizado?: () => void;
}

export default function TablaLotesCaducidad({
  lotes,
  loading = false,
  filtros,
  onFiltrosChange,
  onLoteActualizado,
}: TablaLotesCaducidadProps) {
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteProducto | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleSort = (campo: string) => {
    const nuevoSortOrder =
      filtros.sortBy === campo && filtros.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltrosChange({
      ...filtros,
      sortBy: campo,
      sortOrder: nuevoSortOrder,
    });
  };

  const handleVerDetalle = (lote: LoteProducto) => {
    setLoteSeleccionado(lote);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setLoteSeleccionado(null);
    if (onLoteActualizado) {
      onLoteActualizado();
    }
  };

  const renderSortIcon = (campo: string) => {
    if (filtros.sortBy !== campo) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return filtros.sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  const calcularDiasRestantes = (fechaCaducidad: string) => {
    const fecha = new Date(fechaCaducidad);
    const hoy = new Date();
    const dias = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return dias;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando lotes...</p>
      </div>
    );
  }

  if (lotes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600">No se encontraron lotes</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('numeroLote')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Número de Lote</span>
                    {renderSortIcon('numeroLote')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('fechaCaducidad')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Fecha de Caducidad</span>
                    {renderSortIcon('fechaCaducidad')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad Inicial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('fechaRecepcion')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Fecha de Recepción</span>
                    {renderSortIcon('fechaRecepcion')}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lotes.map((lote) => {
                const diasRestantes = calcularDiasRestantes(lote.fechaCaducidad);
                const porcentajeConsumido =
                  ((lote.cantidadInicial - lote.cantidadActual) / lote.cantidadInicial) * 100;
                
                // Colorear fila según estado
                let filaClase = '';
                if (lote.estado === 'Caducado' || diasRestantes < 0) {
                  filaClase = 'bg-red-50';
                } else if (lote.estado === 'PorCaducar' || diasRestantes <= 30) {
                  filaClase = 'bg-yellow-50';
                }

                return (
                  <tr key={lote._id} className={filaClase}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-medium text-gray-900">
                        {lote.numeroLote}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lote.producto.nombre}
                      </div>
                      {lote.producto.sku && (
                        <div className="text-xs text-gray-500">SKU: {lote.producto.sku}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(lote.fechaCaducidad).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      {diasRestantes >= 0 && (
                        <div className="text-xs text-gray-500">
                          {diasRestantes === 0
                            ? 'Caduca hoy'
                            : diasRestantes === 1
                            ? 'Caduca mañana'
                            : `Caduca en ${diasRestantes} días`}
                        </div>
                      )}
                      {diasRestantes < 0 && (
                        <div className="text-xs text-red-600 font-medium">
                          Caducado hace {Math.abs(diasRestantes)} días
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lote.cantidadInicial}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900">
                          {lote.cantidadActual}
                        </div>
                        <div className="flex-1 min-w-[60px] bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${100 - porcentajeConsumido}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AlertaCaducidadBadge lote={lote} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lote.fechaRecepcion).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleVerDetalle(lote)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 inline-flex items-center gap-1"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Ver</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {mostrarModal && loteSeleccionado && (
        <ModalDetalleLote
          loteId={loteSeleccionado._id!}
          onClose={handleCerrarModal}
        />
      )}
    </>
  );
}


