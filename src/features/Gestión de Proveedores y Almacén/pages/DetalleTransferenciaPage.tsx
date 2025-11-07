import { useState, useEffect } from 'react';
import { ArrowLeft, Package, CheckCircle, XCircle, Clock, AlertTriangle, Loader2, ArrowRightLeft } from 'lucide-react';
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
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200/70">
            <Clock size={16} />
            Pendiente
          </span>
        );
      case 'Completada':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-800 ring-1 ring-green-200/70">
            <CheckCircle size={16} />
            Completada
          </span>
        );
      case 'Cancelada':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-800 ring-1 ring-gray-200/70">
            <XCircle size={16} />
            Cancelada
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando transferencia...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !transferencia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error || 'Transferencia no encontrada'}</p>
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <button
              onClick={onVolver}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Volver a Transferencias</span>
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <ArrowRightLeft size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Transferencia {transferencia.codigo}
                  </h1>
                  <p className="text-gray-600">
                    Detalles de la transferencia entre almacenes
                  </p>
                </div>
              </div>
              {getEstadoBadge(transferencia.estado)}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Información Principal */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Almacén de Origen</label>
                <div className="bg-slate-50 ring-1 ring-slate-200 rounded-xl p-4">
                  <div className="font-medium text-gray-900 text-lg">
                    {transferencia.almacenOrigen.nombre}
                  </div>
                  {transferencia.almacenOrigen.ubicacion && (
                    <div className="text-sm text-gray-600 mt-1">
                      {transferencia.almacenOrigen.ubicacion}
                    </div>
                  )}
                  {transferencia.almacenOrigen.esPrincipal && (
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-xl ring-1 ring-blue-200/70">
                      Principal
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Almacén de Destino</label>
                <div className="bg-blue-50 ring-1 ring-blue-200 rounded-xl p-4">
                  <div className="font-medium text-blue-900 text-lg">
                    {transferencia.almacenDestino.nombre}
                  </div>
                  {transferencia.almacenDestino.ubicacion && (
                    <div className="text-sm text-blue-700 mt-1">
                      {transferencia.almacenDestino.ubicacion}
                    </div>
                  )}
                  {transferencia.almacenDestino.esPrincipal && (
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-xl ring-1 ring-blue-200/70">
                      Principal
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Productos a Transferir</h2>
            <div className="ring-1 ring-slate-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase">
                      Cantidad
                    </th>
                    {transferencia.productos.some((p) => p.lote) && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                        Lote
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {transferencia.productos.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Package size={20} className="text-blue-600" />
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
                <tfoot className="bg-slate-50 border-t border-slate-200">
                  <tr>
                    <td colSpan={transferencia.productos.some((p) => p.lote) ? 3 : 2} className="px-4 py-3 text-right font-medium text-slate-700">
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
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información Adicional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Creación</label>
                <div className="text-gray-900">{formatFecha(transferencia.fechaCreacion)}</div>
              </div>
              {transferencia.fechaCompletado && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Completado</label>
                  <div className="text-gray-900">{formatFecha(transferencia.fechaCompletado)}</div>
                </div>
              )}
              {transferencia.usuarioSolicitante && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Solicitado por</label>
                  <div className="text-gray-900">{transferencia.usuarioSolicitante.name}</div>
                </div>
              )}
              {transferencia.usuarioReceptor && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Recibido por</label>
                  <div className="text-gray-900">{transferencia.usuarioReceptor.name}</div>
                </div>
              )}
            </div>
            {transferencia.notas && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Notas</label>
                <div className="bg-slate-50 ring-1 ring-slate-200 rounded-xl p-4 text-gray-700">
                  {transferencia.notas}
                </div>
              </div>
            )}
          </div>

          {/* Acciones */}
          {transferencia.estado === 'Pendiente' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handleCancelar}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-red-700 hover:text-red-900 hover:bg-red-50 ring-1 ring-red-200"
                >
                  <XCircle size={20} />
                  Cancelar Transferencia
                </button>
                <button
                  onClick={() => setMostrarModalConfirmar(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-sm ring-1 ring-green-600/20 font-medium"
                >
                  <CheckCircle size={20} />
                  Confirmar Recepción
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmar Recepción */}
      {mostrarModalConfirmar && transferencia && (
        <ModalConfirmarRecepcion
          transferencia={transferencia}
          onConfirmar={handleConfirmarRecepcion}
          onCancelar={() => setMostrarModalConfirmar(false)}
        />
      )}
    </div>
  );
}



