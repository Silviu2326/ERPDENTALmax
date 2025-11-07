import { useState } from 'react';
import { Eye, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Loader2, Package, AlertCircle } from 'lucide-react';
import { Material, FiltrosMateriales } from '../api/materialesApi';
import IndicadorEstadoStock from './IndicadorEstadoStock';
import ModalDetalleMaterial from './ModalDetalleMaterial';
import { useAuth } from '../../../contexts/AuthContext';

interface TablaMaterialesProps {
  materiales: Material[];
  loading?: boolean;
  filtros: FiltrosMateriales;
  onFiltrosChange: (filtros: FiltrosMateriales) => void;
  onMaterialEliminado?: () => void;
}

export default function TablaMateriales({
  materiales,
  loading = false,
  filtros,
  onFiltrosChange,
  onMaterialEliminado,
}: TablaMaterialesProps) {
  const { user } = useAuth();
  const [materialSeleccionado, setMaterialSeleccionado] = useState<Material | null>(null);
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

  const handleVerDetalle = (material: Material) => {
    setMaterialSeleccionado(material);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setMaterialSeleccionado(null);
  };

  const renderSortIcon = (campo: string) => {
    if (filtros.sortBy !== campo) {
      return <ArrowUpDown className="w-4 h-4 text-slate-400" />;
    }
    return filtros.sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  const puedeEliminar = user?.role === 'compras_inventario' || user?.role === 'admin';

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando materiales...</p>
      </div>
    );
  }

  if (materiales.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron materiales</h3>
        <p className="text-gray-600">Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('codigoSKU')}
                >
                  <div className="flex items-center gap-2">
                    <span>SKU</span>
                    {renderSortIcon('codigoSKU')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('nombre')}
                >
                  <div className="flex items-center gap-2">
                    <span>Nombre</span>
                    {renderSortIcon('nombre')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Categoría
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('stockActual')}
                >
                  <div className="flex items-center gap-2">
                    <span>Stock Actual</span>
                    {renderSortIcon('stockActual')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Stock Mínimo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Estado
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('fechaCaducidad')}
                >
                  <div className="flex items-center gap-2">
                    <span>Fecha Caducidad</span>
                    {renderSortIcon('fechaCaducidad')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {materiales.map((material) => {
                const estado = material.stockActual <= 0 ? 'agotado' : material.stockActual < material.stockMinimo ? 'bajo_stock' : 'en_stock';
                const filaClase = estado === 'agotado' ? 'bg-red-50' : estado === 'bajo_stock' ? 'bg-yellow-50' : '';
                
                return (
                  <tr key={material._id} className={filaClase}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {material.codigoSKU}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{material.nombre}</div>
                      {material.descripcion && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {material.descripcion}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.categoria?.nombre || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {material.stockActual} {material.unidadMedida}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.stockMinimo} {material.unidadMedida}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <IndicadorEstadoStock material={material} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.fechaCaducidad
                        ? new Date(material.fechaCaducidad).toLocaleDateString('es-ES')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.ubicacion || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleVerDetalle(material)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-xl hover:bg-blue-50 transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {puedeEliminar && (
                          <button
                            onClick={async () => {
                              if (
                                window.confirm(
                                  `¿Está seguro de desactivar el material "${material.nombre}"?`
                                )
                              ) {
                                try {
                                  const { desactivarMaterial } = await import('../api/materialesApi');
                                  await desactivarMaterial(material._id!);
                                  if (onMaterialEliminado) {
                                    onMaterialEliminado();
                                  }
                                } catch (error) {
                                  alert('Error al desactivar el material');
                                }
                              }
                            }}
                            className="text-red-600 hover:text-red-900 p-2 rounded-xl hover:bg-red-50 transition-colors"
                            title="Desactivar material"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {mostrarModal && materialSeleccionado && (
        <ModalDetalleMaterial
          materialId={materialSeleccionado._id!}
          onClose={handleCerrarModal}
        />
      )}
    </>
  );
}



