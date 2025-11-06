import { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { obtenerProveedores, Proveedor } from '../api/ordenesCompraApi';

interface ModalSeleccionarProveedorProps {
  isOpen: boolean;
  onClose: () => void;
  onSeleccionar: (proveedor: Proveedor) => void;
  proveedorSeleccionadoId?: string;
}

export default function ModalSeleccionarProveedor({
  isOpen,
  onClose,
  onSeleccionar,
  proveedorSeleccionadoId,
}: ModalSeleccionarProveedorProps) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (isOpen) {
      cargarProveedores();
    }
  }, [isOpen]);

  const cargarProveedores = async () => {
    setLoading(true);
    try {
      const datos = await obtenerProveedores();
      setProveedores(datos);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      // Datos mock para desarrollo
      setProveedores([
        {
          _id: '1',
          nombreComercial: 'Proveedor Dental S.A.',
          razonSocial: 'Proveedor Dental Sociedad Anónima',
          nif: 'B12345678',
          contacto: {
            nombre: 'Juan García',
            email: 'contacto@proveedordental.com',
            telefono: '912345678',
          },
          direccion: {
            calle: 'Calle Mayor 123',
            ciudad: 'Madrid',
            codigoPostal: '28001',
          },
        },
        {
          _id: '2',
          nombreComercial: 'Materiales Odontológicos SL',
          razonSocial: 'Materiales Odontológicos Sociedad Limitada',
          nif: 'B87654321',
          contacto: {
            nombre: 'María López',
            email: 'ventas@materialesodonto.com',
            telefono: '934567890',
          },
          direccion: {
            calle: 'Avenida Diagonal 456',
            ciudad: 'Barcelona',
            codigoPostal: '08001',
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const proveedoresFiltrados = proveedores.filter(
    (p) =>
      p.nombreComercial.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.nif.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Seleccionar Proveedor</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, razón social o NIF..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando proveedores...</div>
          ) : proveedoresFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron proveedores
            </div>
          ) : (
            <div className="space-y-2">
              {proveedoresFiltrados.map((proveedor) => (
                <button
                  key={proveedor._id}
                  onClick={() => {
                    onSeleccionar(proveedor);
                    onClose();
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    proveedorSeleccionadoId === proveedor._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{proveedor.nombreComercial}</h3>
                        {proveedorSeleccionadoId === proveedor._id && (
                          <Check className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{proveedor.razonSocial}</p>
                      <p className="text-xs text-gray-500">NIF: {proveedor.nif}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {proveedor.contacto.nombre} · {proveedor.contacto.telefono}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}


