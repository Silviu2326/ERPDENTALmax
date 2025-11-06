import { useState } from 'react';
import { Eye, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando materiales...</p>
      </div>
    );
  }

  if (materiales.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600">No se encontraron materiales</p>
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
                  onClick={() => handleSort('codigoSKU')}
                >
                  <div className="flex items-center space-x-1">
                    <span>SKU</span>
                    {renderSortIcon('codigoSKU')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('nombre')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Nombre</span>
                    {renderSortIcon('nombre')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('stockActual')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Stock Actual</span>
                    {renderSortIcon('stockActual')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Mínimo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('fechaCaducidad')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Fecha Caducidad</span>
                    {renderSortIcon('fechaCaducidad')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleVerDetalle(material)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
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
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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


