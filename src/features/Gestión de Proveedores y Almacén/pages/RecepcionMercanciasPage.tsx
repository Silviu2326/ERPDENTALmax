import { useState } from 'react';
import { Package, Search, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Package size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Recepción de Mercancías
                  </h1>
                  <p className="text-gray-600">
                    Registra la recepción de productos de las órdenes de compra
                  </p>
                </div>
              </div>
              {!pedidoSeleccionado && (
                <button
                  onClick={handleNuevaRecepcion}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  <Plus size={20} />
                  Nueva Recepción
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8 space-y-6">
        {/* Mensajes de estado */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Contenido principal */}
        {!pedidoSeleccionado ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Selecciona una Orden de Compra
            </h3>
            <p className="text-gray-600 mb-4">
              Busca una orden de compra pendiente para registrar la recepción de mercancías
            </p>
            <button
              onClick={handleNuevaRecepcion}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              <Search size={20} />
              Buscar Orden de Compra
            </button>
          </div>
        ) : (
          <div>
            {cargandoDetalle ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando detalle del pedido...</p>
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


