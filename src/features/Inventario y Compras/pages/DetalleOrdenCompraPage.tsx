import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Send, PackageCheck, PackageX, Printer, CheckCircle, Loader2, Package, AlertCircle, ShoppingCart } from 'lucide-react';
import {
  obtenerOrdenCompraPorId,
  cambiarEstadoOrdenCompra,
  eliminarOrdenCompra,
  OrdenCompra,
} from '../api/ordenesCompraApi';
import BadgeEstadoOrdenCompra from '../components/BadgeEstadoOrdenCompra';
import VistaImpresionOrdenCompra from '../components/VistaImpresionOrdenCompra';

interface DetalleOrdenCompraPageProps {
  ordenId: string;
  onVolver: () => void;
  onEditar?: (ordenId: string) => void;
}

export default function DetalleOrdenCompraPage({
  ordenId,
  onVolver,
  onEditar,
}: DetalleOrdenCompraPageProps) {
  const [orden, setOrden] = useState<OrdenCompra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarImpresion, setMostrarImpresion] = useState(false);

  useEffect(() => {
    cargarOrden();
  }, [ordenId]);

  const cargarOrden = async () => {
    setLoading(true);
    setError(null);
    try {
      // Datos falsos completos - NO usar API
      const datos: OrdenCompra = {
        _id: ordenId,
        numeroOrden: 'OC-2024-001',
        proveedor: {
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
        sucursal: { _id: '1', nombre: 'Sede Central' },
        fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        fechaEntregaEstimada: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            producto: '1',
            descripcion: 'Composite Resina A2',
            cantidad: 10,
            precioUnitario: 25.50,
            subtotal: 255.0,
          },
          {
            producto: '2',
            descripcion: 'Anestesia Lidocaína 2%',
            cantidad: 5,
            precioUnitario: 15.75,
            subtotal: 78.75,
          },
          {
            producto: '3',
            descripcion: 'Guantes de Nitrilo Talla M',
            cantidad: 20,
            precioUnitario: 15.00,
            subtotal: 300.0,
          },
        ],
        subtotal: 633.75,
        impuestos: 133.09,
        total: 766.84,
        estado: 'Enviada',
        creadoPor: { _id: '1', nombre: 'María López' },
        notas: 'Entregar en horario de mañana preferiblemente. Verificar caducidades al recibir.',
        historialEstados: [
          { estado: 'Borrador', fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
          { estado: 'Enviada', fecha: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
        ],
      };
      setOrden(datos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la orden de compra');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (nuevoEstado: OrdenCompra['estado']) => {
    if (!orden?._id) return;

    const mensaje = {
      'Enviada': '¿Enviar esta orden de compra al proveedor?',
      'Recibida Parcial': '¿Marcar esta orden como recibida parcialmente?',
      'Recibida Completa': '¿Marcar esta orden como recibida completamente?',
      'Cancelada': '¿Cancelar esta orden de compra?',
    }[nuevoEstado];

    if (!window.confirm(mensaje)) return;

    try {
      await cambiarEstadoOrdenCompra(orden._id, nuevoEstado as any);
      cargarOrden();
    } catch (err: any) {
      alert(err.message || 'Error al cambiar el estado de la orden');
    }
  };

  const handleEliminar = async () => {
    if (!orden?._id) return;

    if (!window.confirm('¿Está seguro de eliminar esta orden de compra? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await eliminarOrdenCompra(orden._id);
      onVolver();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar la orden');
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cantidad);
  };

  const obtenerNombreProveedor = (proveedor: string | any) => {
    if (typeof proveedor === 'string') {
      return proveedor;
    }
    return proveedor.nombreComercial || proveedor.nombre || 'N/A';
  };

  const obtenerDatosProveedor = (proveedor: string | any) => {
    if (typeof proveedor === 'string') {
      return null;
    }
    return proveedor;
  };

  const obtenerNombreSucursal = (sucursal: string | any) => {
    if (typeof sucursal === 'string') {
      return sucursal;
    }
    return sucursal.nombre || 'N/A';
  };

  if (mostrarImpresion && orden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <VistaImpresionOrdenCompra
            orden={orden}
            onImprimir={() => window.print()}
          />
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setMostrarImpresion(false)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-slate-600 text-white hover:bg-slate-700"
            >
              <ArrowLeft size={20} />
              Volver al Detalle
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando orden de compra...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error || 'Orden de compra no encontrada'}</p>
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-slate-600 text-white hover:bg-slate-700"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  const datosProveedor = obtenerDatosProveedor(orden.proveedor);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <ShoppingCart size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Orden de Compra: {orden.numeroOrden}
                  </h1>
                  <p className="text-gray-600">
                    Creada el {formatearFecha(orden.fechaCreacion)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BadgeEstadoOrdenCompra estado={orden.estado} />
                <button
                  onClick={() => setMostrarImpresion(true)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 shadow-sm ring-1 ring-slate-200"
                >
                  <Printer size={18} />
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Acciones según estado */}
          {orden.estado === 'Borrador' && (
            <div className="flex items-center justify-end gap-2">
              {onEditar && (
                <button
                  onClick={() => onEditar(orden._id || '')}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-yellow-600 text-white hover:bg-yellow-700"
                >
                  <Edit size={20} />
                  Editar
                </button>
              )}
              <button
                onClick={handleEliminar}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 size={20} />
                Eliminar
              </button>
              <button
                onClick={() => handleCambiarEstado('Enviada')}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-green-600 text-white hover:bg-green-700"
              >
                <Send size={20} />
                Enviar Orden
              </button>
            </div>
          )}

          {orden.estado === 'Enviada' && (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleCambiarEstado('Recibida Parcial')}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-yellow-600 text-white hover:bg-yellow-700"
              >
                <PackageCheck size={20} />
                Marcar como Recibida Parcial
              </button>
              <button
                onClick={() => handleCambiarEstado('Recibida Completa')}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-green-600 text-white hover:bg-green-700"
              >
                <CheckCircle size={20} />
                Marcar como Recibida Completa
              </button>
              <button
                onClick={() => handleCambiarEstado('Cancelada')}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-red-600 text-white hover:bg-red-700"
              >
                <PackageX size={20} />
                Cancelar
              </button>
            </div>
          )}

          {/* Información principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Datos del Proveedor */}
            <div className="bg-white shadow-sm rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos del Proveedor</h2>
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{obtenerNombreProveedor(orden.proveedor)}</p>
            {datosProveedor?.razonSocial && (
              <p className="text-sm text-gray-600">{datosProveedor.razonSocial}</p>
            )}
            {datosProveedor?.nif && (
              <p className="text-sm text-gray-600">NIF: {datosProveedor.nif}</p>
            )}
              {datosProveedor?.contacto && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Contacto:</span> {datosProveedor.contacto.nombre}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Teléfono:</span> {datosProveedor.contacto.telefono}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {datosProveedor.contacto.email}
                  </p>
                </div>
              )}
              {datosProveedor?.direccion && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-slate-700 mb-1">Dirección:</p>
                  <p className="text-sm text-gray-600">{datosProveedor.direccion.calle}</p>
                  <p className="text-sm text-gray-600">
                    {datosProveedor.direccion.codigoPostal} {datosProveedor.direccion.ciudad}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información de Entrega */}
          <div className="bg-white shadow-sm rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Entrega</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Sucursal</p>
                <p className="font-medium text-gray-900">{obtenerNombreSucursal(orden.sucursal)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Fecha Estimada de Entrega</p>
                <p className="font-medium text-gray-900">{formatearFecha(orden.fechaEntregaEstimada)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Creado por</p>
                <p className="font-medium text-gray-900">
                  {typeof orden.creadoPor === 'string' ? orden.creadoPor : orden.creadoPor.nombre}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white shadow-sm rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Productos Solicitados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Unit.
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orden.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.cantidad}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.descripcion}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-sm text-gray-900">
                      {formatearMoneda(item.precioUnitario)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatearMoneda(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">{formatearMoneda(orden.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA (21%):</span>
                <span className="font-medium text-gray-900">{formatearMoneda(orden.impuestos)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">{formatearMoneda(orden.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notas */}
        {orden.notas && (
          <div className="bg-white shadow-sm rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Observaciones</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{orden.notas}</p>
          </div>
        )}

        {/* Resumen de items */}
        <div className="bg-white shadow-sm rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-100 rounded-xl border-l-4 border-blue-200">
              <p className="text-sm font-medium text-slate-700 mb-1">Total Items</p>
              <p className="text-2xl font-bold text-blue-600">{orden.items.length}</p>
            </div>
            <div className="p-4 bg-green-100 rounded-xl border-l-4 border-green-200">
              <p className="text-sm font-medium text-slate-700 mb-1">Cantidad Total</p>
              <p className="text-2xl font-bold text-green-600">
                {orden.items.reduce((sum, item) => sum + item.cantidad, 0)}
              </p>
            </div>
            <div className="p-4 bg-purple-100 rounded-xl border-l-4 border-purple-200">
              <p className="text-sm font-medium text-slate-700 mb-1">Precio Promedio</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatearMoneda(
                  orden.items.reduce((sum, item) => sum + item.precioUnitario, 0) / orden.items.length
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Historial de Estados */}
        {orden.historialEstados && orden.historialEstados.length > 0 && (
          <div className="bg-white shadow-sm rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Estados</h2>
            <div className="space-y-3">
              {orden.historialEstados.map((historial, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                  <BadgeEstadoOrdenCompra estado={historial.estado as any} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{historial.usuario}</p>
                    <p className="text-xs text-gray-500">{formatearFecha(historial.fecha)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}


