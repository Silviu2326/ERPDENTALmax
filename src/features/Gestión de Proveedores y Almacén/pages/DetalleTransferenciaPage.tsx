import { useState, useEffect } from 'react';
import { ArrowLeft, Package, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { obtenerTransferenciaPorId, confirmarRecepcionTransferencia, cancelarTransferencia, TransferenciaAlmacen } from '../api/transferenciasApi';
import ModalConfirmarRecepcion from '../components/ModalConfirmarRecepcion';

interface DetalleTransferenciaPageProps {
  transferenciaId: string;
  onVolver: () => void;
}

export default function DetalleTransferenciaPage({
  transferenciaId,
  onVolver,
}: DetalleTransferenciaPageProps) {
  const [transferencia, setTransferencia] = useState<TransferenciaAlmacen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalConfirmar, setMostrarModalConfirmar] = useState(false);

  useEffect(() => {
    cargarTransferencia();
  }, [transferenciaId]);

  const cargarTransferencia = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTransferenciaPorId(transferenciaId);
      setTransferencia(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la transferencia');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarRecepcion = async () => {
    if (!transferencia?._id) return;

    try {
      await confirmarRecepcionTransferencia(transferencia._id);
      setMostrarModalConfirmar(false);
      cargarTransferencia();
    } catch (err: any) {
      alert(err.message || 'Error al confirmar la recepción');
      throw err;
    }
  };

  const handleCancelar = async () => {
    if (!transferencia?._id) return;
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta transferencia?')) {
      return;
    }

    try {
      await cancelarTransferencia(transferencia._id);
      cargarTransferencia();
    } catch (err: any) {
      alert(err.message || 'Error al cancelar la transferencia');
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-5 h-5" />
            Pendiente
          </span>
        );
      case 'Completada':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Completada
          </span>
        );
      case 'Cancelada':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-5 h-5" />
            Cancelada
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Cargando transferencia...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !transferencia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Error</h3>
            <p className="text-red-700 mb-4">{error || 'Transferencia no encontrada'}</p>
            <button
              onClick={onVolver}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Transferencias
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transferencia {transferencia.codigo}</h1>
              <p className="text-gray-600 mt-1">Detalles de la transferencia entre almacenes</p>
            </div>
            {getEstadoBadge(transferencia.estado)}
          </div>
        </div>

        {/* Información Principal */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Almacén de Origen</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="font-medium text-gray-900 text-lg">
                  {transferencia.almacenOrigen.nombre}
                </div>
                {transferencia.almacenOrigen.ubicacion && (
                  <div className="text-sm text-gray-600 mt-1">
                    {transferencia.almacenOrigen.ubicacion}
                  </div>
                )}
                {transferencia.almacenOrigen.esPrincipal && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Principal
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Almacén de Destino</label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-medium text-blue-900 text-lg">
                  {transferencia.almacenDestino.nombre}
                </div>
                {transferencia.almacenDestino.ubicacion && (
                  <div className="text-sm text-blue-700 mt-1">
                    {transferencia.almacenDestino.ubicacion}
                  </div>
                )}
                {transferencia.almacenDestino.esPrincipal && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Principal
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Productos a Transferir</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Cantidad
                  </th>
                  {transferencia.productos.some((p) => p.lote) && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Lote
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transferencia.productos.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">{item.producto.nombre}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{item.producto.sku || '-'}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-medium text-gray-900">{item.cantidad}</span>
                    </td>
                    {transferencia.productos.some((p) => p.lote) && (
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{item.lote || '-'}</span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan={transferencia.productos.some((p) => p.lote) ? 3 : 2} className="px-4 py-3 text-right font-medium text-gray-700">
                    Total de productos:
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">
                    {transferencia.productos.reduce((sum, p) => sum + p.cantidad, 0)} unidades
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información Adicional</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Creación</label>
              <div className="text-gray-900">{formatFecha(transferencia.fechaCreacion)}</div>
            </div>
            {transferencia.fechaCompletado && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Completado</label>
                <div className="text-gray-900">{formatFecha(transferencia.fechaCompletado)}</div>
              </div>
            )}
            {transferencia.usuarioSolicitante && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Solicitado por</label>
                <div className="text-gray-900">{transferencia.usuarioSolicitante.name}</div>
              </div>
            )}
            {transferencia.usuarioReceptor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recibido por</label>
                <div className="text-gray-900">{transferencia.usuarioReceptor.name}</div>
              </div>
            )}
          </div>
          {transferencia.notas && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700">
                {transferencia.notas}
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        {transferencia.estado === 'Pendiente' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleCancelar}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancelar Transferencia
              </button>
              <button
                onClick={() => setMostrarModalConfirmar(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirmar Recepción
              </button>
            </div>
          </div>
        )}

        {/* Modal de Confirmar Recepción */}
        {mostrarModalConfirmar && transferencia && (
          <ModalConfirmarRecepcion
            transferencia={transferencia}
            onConfirmar={handleConfirmarRecepcion}
            onCancelar={() => setMostrarModalConfirmar(false)}
          />
        )}
      </div>
    </div>
  );
}


