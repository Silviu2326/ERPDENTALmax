import { useState, useEffect } from 'react';
import { X, Package, DollarSign, MapPin, Calendar, Building2 } from 'lucide-react';
import { obtenerMaterialPorId, Material } from '../api/materialesApi';
import IndicadorEstadoStock from './IndicadorEstadoStock';

interface ModalDetalleMaterialProps {
  materialId: string;
  onClose: () => void;
}

export default function ModalDetalleMaterial({ materialId, onClose }: ModalDetalleMaterialProps) {
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarMaterial = async () => {
      try {
        setLoading(true);
        const datos = await obtenerMaterialPorId(materialId);
        setMaterial(datos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el material');
      } finally {
        setLoading(false);
      }
    };

    cargarMaterial();
  }, [materialId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div className="p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-center text-gray-600">Cargando detalles del material...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div className="p-6">
            <p className="text-center text-red-600">{error || 'Material no encontrado'}</p>
            <button
              onClick={onClose}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{material.nombre}</h2>
              <p className="text-sm text-gray-600 font-mono">{material.codigoSKU}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-6">
            <IndicadorEstadoStock material={material} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Información Básica</h3>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Descripción</label>
                <p className="text-gray-900 mt-1">{material.descripcion || 'Sin descripción'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Categoría</label>
                <p className="text-gray-900 mt-1">{material.categoria?.nombre || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Unidad de Medida</label>
                <p className="text-gray-900 mt-1">{material.unidadMedida}</p>
              </div>
            </div>

            {/* Stock e Inventario */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Stock e Inventario</h3>
              
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Stock Actual</label>
                  <p className="text-gray-900 font-semibold">
                    {material.stockActual} {material.unidadMedida}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Stock Mínimo</label>
                <p className="text-gray-900 mt-1">
                  {material.stockMinimo} {material.unidadMedida}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Ubicación</label>
                  <p className="text-gray-900 mt-1">{material.ubicacion || 'No especificada'}</p>
                </div>
              </div>
            </div>

            {/* Información Económica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Información Económica</h3>
              
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Costo Unitario</label>
                  <p className="text-gray-900 font-semibold">
                    ${material.costoUnitario.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Valor Total en Stock</label>
                <p className="text-gray-900 font-semibold">
                  ${(material.stockActual * material.costoUnitario).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Información Adicional</h3>
              
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Proveedor Principal</label>
                  <p className="text-gray-900 mt-1">
                    {material.proveedorPrincipal?.nombre || 'No especificado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Caducidad</label>
                  <p className="text-gray-900 mt-1">
                    {material.fechaCaducidad
                      ? new Date(material.fechaCaducidad).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'No especificada'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <p className="text-gray-900 mt-1 capitalize">{material.estado}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


