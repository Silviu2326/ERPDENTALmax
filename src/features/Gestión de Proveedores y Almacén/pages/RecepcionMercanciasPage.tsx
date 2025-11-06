import { useState } from 'react';
import { Package, Search, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { PedidoCompra, RecepcionMercancia } from '../api/recepcionApi';
import ModalBusquedaPedidos from '../components/ModalBusquedaPedidos';
import FormularioRecepcionMercancias from '../components/FormularioRecepcionMercancias';

export default function RecepcionMercanciasPage() {
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoCompra | null>(null);
  const [mostrarModalBusqueda, setMostrarModalBusqueda] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const handleSeleccionarPedido = async (pedido: PedidoCompra) => {
    setCargandoDetalle(true);
    setError(null);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Si el pedido ya tiene items completos, usarlo directamente
      if (pedido.items && pedido.items.length > 0) {
        setPedidoSeleccionado(pedido);
      } else {
        // Simular carga de detalle completo con datos falsos
        const detalleCompleto: PedidoCompra = {
          ...pedido,
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
              cantidadRecibida: 0,
              cantidadPendiente: 20,
              precioUnitario: 18.75,
              subtotal: 375.00,
            },
          ],
        };
        setPedidoSeleccionado(detalleCompleto);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar el detalle del pedido');
      // Usar el pedido básico si falla la carga del detalle
      setPedidoSeleccionado(pedido);
    } finally {
      setCargandoDetalle(false);
    }
  };

  const handleGuardarRecepcion = async (recepcion: RecepcionMercancia) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular creación de recepción
      console.log('Guardando recepción:', recepcion);
      
      setSuccess('Recepción de mercancías registrada correctamente');
      
      // Limpiar el formulario después de un breve delay
      setTimeout(() => {
        setPedidoSeleccionado(null);
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la recepción');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setPedidoSeleccionado(null);
    setError(null);
    setSuccess(null);
  };

  const handleNuevaRecepcion = () => {
    setPedidoSeleccionado(null);
    setError(null);
    setSuccess(null);
    setMostrarModalBusqueda(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Recepción de Mercancías
                </h1>
                <p className="text-gray-600 mt-1">
                  Registra la recepción de productos de las órdenes de compra
                </p>
              </div>
            </div>
            {!pedidoSeleccionado && (
              <button
                onClick={handleNuevaRecepcion}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Nueva Recepción
              </button>
            )}
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Contenido principal */}
        {!pedidoSeleccionado ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Selecciona una Orden de Compra
              </h2>
              <p className="text-gray-600 mb-6">
                Busca una orden de compra pendiente para registrar la recepción de mercancías
              </p>
              <button
                onClick={handleNuevaRecepcion}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Buscar Orden de Compra
              </button>
            </div>
          </div>
        ) : (
          <div>
            {cargandoDetalle ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Cargando detalle del pedido...</span>
                </div>
              </div>
            ) : (
              <FormularioRecepcionMercancias
                pedido={pedidoSeleccionado}
                onGuardar={handleGuardarRecepcion}
                onCancelar={handleCancelar}
              />
            )}
          </div>
        )}

        {/* Modal de búsqueda */}
        <ModalBusquedaPedidos
          isOpen={mostrarModalBusqueda}
          onClose={() => setMostrarModalBusqueda(false)}
          onSeleccionarPedido={handleSeleccionarPedido}
        />
      </div>
    </div>
  );
}


