import { useState, useEffect } from 'react';
import { Search, X, Package, Calendar, User } from 'lucide-react';
import {
  PedidoCompra,
} from '../api/recepcionApi';

interface ModalBusquedaPedidosProps {
  isOpen: boolean;
  onClose: () => void;
  onSeleccionarPedido: (pedido: PedidoCompra) => void;
}

export default function ModalBusquedaPedidos({
  isOpen,
  onClose,
  onSeleccionarPedido,
}: ModalBusquedaPedidosProps) {
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [proveedorFiltro, setProveedorFiltro] = useState('');

  useEffect(() => {
    if (isOpen) {
      cargarPedidos();
    }
  }, [isOpen]);

  const cargarPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos de pedidos
      const datosFalsos: PedidoCompra[] = [
        {
          _id: '1',
          numeroOrden: 'OC-2024-001',
          proveedor: {
            _id: '1',
            nombreComercial: 'Dental Supplies Pro',
            razonSocial: 'Dental Supplies Pro S.L.',
            nif: 'B12345678',
          },
          fechaCreacion: '2024-03-15T10:00:00Z',
          fechaEntregaEstimada: '2024-03-22T10:00:00Z',
          items: [
            {
              producto: {
                _id: '1',
                nombre: 'Guantes de Nitrilo Desechables',
                sku: 'GNT-001',
                descripcion: 'Guantes de nitrilo sin polvo, talla M',
                categoria: 'Consumible',
              },
              descripcion: 'Guantes de Nitrilo Desechables',
              cantidad: 50,
              cantidadRecibida: 0,
              cantidadPendiente: 50,
              precioUnitario: 12.50,
              subtotal: 625.00,
            },
            {
              producto: {
                _id: '2',
                nombre: 'Jeringas Desechables 5ml',
                sku: 'JNG-002',
                descripcion: 'Jeringas desechables de 5ml con aguja',
                categoria: 'Consumible',
              },
              descripcion: 'Jeringas Desechables 5ml',
              cantidad: 200,
              cantidadRecibida: 0,
              cantidadPendiente: 200,
              precioUnitario: 0.35,
              subtotal: 70.00,
            },
          ],
          estado: 'abierto',
          creadoPor: { _id: '1', nombre: 'Juan Pérez' },
          notas: 'Pedido urgente, prioridad alta',
        },
        {
          _id: '2',
          numeroOrden: 'OC-2024-002',
          proveedor: {
            _id: '2',
            nombreComercial: 'MedTech Solutions',
            razonSocial: 'MedTech Solutions S.A.',
            nif: 'A87654321',
          },
          fechaCreacion: '2024-03-10T14:30:00Z',
          fechaEntregaEstimada: '2024-03-17T14:30:00Z',
          items: [
            {
              producto: {
                _id: '3',
                nombre: 'Anestesia Local Lidocaína 2%',
                sku: 'ANT-003',
                descripcion: 'Anestesia local lidocaína al 2%',
                categoria: 'Consumible',
              },
              descripcion: 'Anestesia Local Lidocaína 2%',
              cantidad: 20,
              cantidadRecibida: 10,
              cantidadPendiente: 10,
              precioUnitario: 18.75,
              subtotal: 375.00,
            },
          ],
          estado: 'parcialmente_recibido',
          creadoPor: { _id: '2', nombre: 'María López' },
        },
        {
          _id: '3',
          numeroOrden: 'OC-2024-003',
          proveedor: {
            _id: '4',
            nombreComercial: 'ProDental Equipment',
            razonSocial: 'ProDental Equipment S.L.',
            nif: 'C11223344',
          },
          fechaCreacion: '2024-03-12T09:15:00Z',
          fechaEntregaEstimada: '2024-03-19T09:15:00Z',
          items: [
            {
              producto: {
                _id: '7',
                nombre: 'Lámpara de Polimerización LED',
                sku: 'LAM-007',
                descripcion: 'Lámpara LED para polimerización',
                categoria: 'Equipamiento',
              },
              descripcion: 'Lámpara de Polimerización LED',
              cantidad: 2,
              cantidadRecibida: 0,
              cantidadPendiente: 2,
              precioUnitario: 320.00,
              subtotal: 640.00,
            },
          ],
          estado: 'abierto',
          creadoPor: { _id: '3', nombre: 'Carlos Martínez' },
        },
        {
          _id: '4',
          numeroOrden: 'OC-2024-004',
          proveedor: {
            _id: '5',
            nombreComercial: 'BioDental Materials',
            razonSocial: 'BioDental Materials S.A.',
            nif: 'D55667788',
          },
          fechaCreacion: '2024-03-08T11:00:00Z',
          fechaEntregaEstimada: '2024-03-15T11:00:00Z',
          items: [
            {
              producto: {
                _id: '6',
                nombre: 'Composite Resina Dental A2',
                sku: 'COM-006',
                descripcion: 'Composite de resina dental color A2',
                categoria: 'Consumible',
              },
              descripcion: 'Composite Resina Dental A2',
              cantidad: 30,
              cantidadRecibida: 15,
              cantidadPendiente: 15,
              precioUnitario: 28.50,
              subtotal: 855.00,
            },
          ],
          estado: 'parcialmente_recibido',
          creadoPor: { _id: '4', nombre: 'Ana García' },
        },
        {
          _id: '5',
          numeroOrden: 'OC-2024-005',
          proveedor: {
            _id: '8',
            nombreComercial: 'Premium Dental Tools',
            razonSocial: 'Premium Dental Tools S.A.',
            nif: 'G33445566',
          },
          fechaCreacion: '2024-03-14T08:30:00Z',
          fechaEntregaEstimada: '2024-03-21T08:30:00Z',
          items: [
            {
              producto: {
                _id: '9',
                nombre: 'Bisturí Desechable Nº15',
                sku: 'BIS-009',
                descripcion: 'Bisturí desechable con hoja Nº15',
                categoria: 'Instrumental',
              },
              descripcion: 'Bisturí Desechable Nº15',
              cantidad: 100,
              cantidadRecibida: 0,
              cantidadPendiente: 100,
              precioUnitario: 0.85,
              subtotal: 85.00,
            },
            {
              producto: {
                _id: '23',
                nombre: 'Pinza de Extracción Universal',
                sku: 'PIN-023',
                descripcion: 'Pinza de extracción dental universal',
                categoria: 'Instrumental',
              },
              descripcion: 'Pinza de Extracción Universal',
              cantidad: 5,
              cantidadRecibida: 0,
              cantidadPendiente: 5,
              precioUnitario: 35.00,
              subtotal: 175.00,
            },
          ],
          estado: 'abierto',
          creadoPor: { _id: '1', nombre: 'Juan Pérez' },
          notas: 'Pedido de instrumental quirúrgico',
        },
        {
          _id: '6',
          numeroOrden: 'OC-2024-006',
          proveedor: {
            _id: '10',
            nombreComercial: 'SteriDent Solutions',
            razonSocial: 'SteriDent Solutions S.A.',
            nif: 'I11223344',
          },
          fechaCreacion: '2024-03-13T13:45:00Z',
          fechaEntregaEstimada: '2024-03-20T13:45:00Z',
          items: [
            {
              producto: {
                _id: '14',
                nombre: 'Gel Desinfectante Manos',
                sku: 'GEL-014',
                descripcion: 'Gel desinfectante para manos, botella de 500ml',
                categoria: 'Consumible',
              },
              descripcion: 'Gel Desinfectante Manos',
              cantidad: 50,
              cantidadRecibida: 0,
              cantidadPendiente: 50,
              precioUnitario: 6.75,
              subtotal: 337.50,
            },
            {
              producto: {
                _id: '17',
                nombre: 'Solución Esterilizante Glutaraldehído',
                sku: 'EST-017',
                descripcion: 'Solución esterilizante glutaraldehído al 2%',
                categoria: 'Consumible',
              },
              descripcion: 'Solución Esterilizante Glutaraldehído',
              cantidad: 20,
              cantidadRecibida: 0,
              cantidadPendiente: 20,
              precioUnitario: 24.90,
              subtotal: 498.00,
            },
          ],
          estado: 'abierto',
          creadoPor: { _id: '2', nombre: 'María López' },
        },
        {
          _id: '7',
          numeroOrden: 'OC-2024-007',
          proveedor: {
            _id: '12',
            nombreComercial: 'OrthoMaterials',
            razonSocial: 'OrthoMaterials S.L.',
            nif: 'K55667788',
          },
          fechaCreacion: '2024-03-11T10:20:00Z',
          fechaEntregaEstimada: '2024-03-18T10:20:00Z',
          items: [
            {
              producto: {
                _id: '15',
                nombre: 'Brackets Metálicos Estándar',
                sku: 'BRK-015',
                descripcion: 'Set de brackets metálicos estándar',
                categoria: 'Consumible',
              },
              descripcion: 'Brackets Metálicos Estándar',
              cantidad: 10,
              cantidadRecibida: 0,
              cantidadPendiente: 10,
              precioUnitario: 125.00,
              subtotal: 1250.00,
            },
            {
              producto: {
                _id: '16',
                nombre: 'Arco de Ortodoncia 0.014',
                sku: 'ARCO-016',
                descripcion: 'Arco de ortodoncia de níquel-titanio',
                categoria: 'Consumible',
              },
              descripcion: 'Arco de Ortodoncia 0.014',
              cantidad: 30,
              cantidadRecibida: 0,
              cantidadPendiente: 30,
              precioUnitario: 18.50,
              subtotal: 555.00,
            },
          ],
          estado: 'abierto',
          creadoPor: { _id: '3', nombre: 'Carlos Martínez' },
          notas: 'Material para ortodoncia - pedido mensual',
        },
        {
          _id: '8',
          numeroOrden: 'OC-2024-008',
          proveedor: {
            _id: '11',
            nombreComercial: 'Radiología Dental Avanzada',
            razonSocial: 'Radiología Dental Avanzada S.L.',
            nif: 'J99887766',
          },
          fechaCreacion: '2024-03-09T15:00:00Z',
          fechaEntregaEstimada: '2024-03-16T15:00:00Z',
          items: [
            {
              producto: {
                _id: '20',
                nombre: 'Película Radiográfica Digital',
                sku: 'RAD-020',
                descripcion: 'Película radiográfica digital tamaño 2',
                categoria: 'Consumible',
              },
              descripcion: 'Película Radiográfica Digital',
              cantidad: 5,
              cantidadRecibida: 3,
              cantidadPendiente: 2,
              precioUnitario: 85.00,
              subtotal: 425.00,
            },
          ],
          estado: 'parcialmente_recibido',
          creadoPor: { _id: '4', nombre: 'Ana García' },
        },
        {
          _id: '9',
          numeroOrden: 'OC-2024-009',
          proveedor: {
            _id: '4',
            nombreComercial: 'ProDental Equipment',
            razonSocial: 'ProDental Equipment S.L.',
            nif: 'C11223344',
          },
          fechaCreacion: '2024-03-16T09:00:00Z',
          fechaEntregaEstimada: '2024-03-23T09:00:00Z',
          items: [
            {
              producto: {
                _id: '18',
                nombre: 'Turbina Dental de Alta Velocidad',
                sku: 'TUR-018',
                descripcion: 'Turbina dental de alta velocidad',
                categoria: 'Equipamiento',
              },
              descripcion: 'Turbina Dental de Alta Velocidad',
              cantidad: 3,
              cantidadRecibida: 0,
              cantidadPendiente: 3,
              precioUnitario: 450.00,
              subtotal: 1350.00,
            },
            {
              producto: {
                _id: '24',
                nombre: 'Sistema de Aspiración Portátil',
                sku: 'ASP-024',
                descripcion: 'Sistema de aspiración portátil',
                categoria: 'Equipamiento',
              },
              descripcion: 'Sistema de Aspiración Portátil',
              cantidad: 1,
              cantidadRecibida: 0,
              cantidadPendiente: 1,
              precioUnitario: 680.00,
              subtotal: 680.00,
            },
          ],
          estado: 'abierto',
          creadoPor: { _id: '1', nombre: 'Juan Pérez' },
          notas: 'Equipamiento nuevo para consultorio 3',
        },
      ];

      // Aplicar filtros
      let pedidosFiltrados = [...datosFalsos];
      
      if (busqueda) {
        const searchLower = busqueda.toLowerCase();
        pedidosFiltrados = pedidosFiltrados.filter(p => 
          p.numeroOrden.toLowerCase().includes(searchLower) ||
          (typeof p.proveedor === 'object' && p.proveedor?.nombreComercial?.toLowerCase().includes(searchLower))
        );
      }
      
      if (proveedorFiltro) {
        pedidosFiltrados = pedidosFiltrados.filter(p => 
          typeof p.proveedor === 'object' && p.proveedor?._id === proveedorFiltro
        );
      }

      setPedidos(pedidosFiltrados);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pedidos');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    cargarPedidos();
  };

  const handleSeleccionar = (pedido: PedidoCompra) => {
    onSeleccionarPedido(pedido);
    onClose();
  };

  if (!isOpen) return null;

  const getProveedorNombre = (proveedor: string | any): string => {
    if (typeof proveedor === 'string') return proveedor;
    return proveedor?.nombreComercial || proveedor?.razonSocial || 'N/A';
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; color: string }> = {
      abierto: { label: 'Abierto', color: 'bg-blue-100 text-blue-800' },
      parcialmente_recibido: { label: 'Parcialmente Recibido', color: 'bg-yellow-100 text-yellow-800' },
      recibido: { label: 'Recibido', color: 'bg-green-100 text-green-800' },
      cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    };

    const estadoInfo = estados[estado] || estados.abierto;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}>
        {estadoInfo.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Buscar Orden de Compra</h2>
              <p className="text-sm text-gray-600">Selecciona una orden para recibir mercancías</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Filtros */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por número
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="OC-2024-001"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                />
                <button
                  onClick={handleBuscar}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proveedor (opcional)
              </label>
              <input
                type="text"
                value={proveedorFiltro}
                onChange={(e) => setProveedorFiltro(e.target.value)}
                placeholder="ID del proveedor"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={cargarPedidos}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de pedidos */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!loading && !error && pedidos.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron pedidos</p>
            </div>
          )}

          {!loading && !error && pedidos.length > 0 && (
            <div className="space-y-3">
              {pedidos.map((pedido) => (
                <div
                  key={pedido._id}
                  onClick={() => handleSeleccionar(pedido)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-gray-900">{pedido.numeroOrden}</h3>
                        {getEstadoBadge(pedido.estado)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{getProveedorNombre(pedido.proveedor)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(pedido.fechaEntregaEstimada).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {pedido.items?.length || 0} artículo(s) en la orden
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


