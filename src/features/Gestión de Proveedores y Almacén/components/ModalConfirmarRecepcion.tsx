import { Package, CheckCircle, AlertTriangle, X, Loader2 } from 'lucide-react';
import { TransferenciaAlmacen } from '../api/transferenciasApi';

interface ModalConfirmarRecepcionProps {
  transferencia: TransferenciaAlmacen;
  onConfirmar: () => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

export default function ModalConfirmarRecepcion({
  transferencia,
  onConfirmar,
  onCancelar,
  loading = false,
}: ModalConfirmarRecepcionProps) {
  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ring-1 ring-slate-200">
        <div className="sticky top-0 bg-white/80 backdrop-blur border-b border-gray-200/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl ring-1 ring-green-200/70">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Confirmar Recepción</h2>
              <p className="text-sm text-gray-600">Transferencia: {transferencia.codigo}</p>
            </div>
          </div>
          <button
            onClick={onCancelar}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-yellow-50 ring-1 ring-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 mb-1">
                  ¿Confirmar la recepción de esta transferencia?
                </p>
                <p className="text-sm text-yellow-800">
                  Esta acción actualizará el stock en ambos almacenes. El almacén de origen
                  disminuirá su stock y el almacén de destino lo aumentará. Esta operación no se
                  puede deshacer.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Almacén de Origen</label>
              <div className="bg-slate-50 ring-1 ring-slate-200 rounded-xl p-3">
                <div className="font-medium text-gray-900">{transferencia.almacenOrigen.nombre}</div>
                {transferencia.almacenOrigen.ubicacion && (
                  <div className="text-sm text-gray-600 mt-1">
                    {transferencia.almacenOrigen.ubicacion}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Almacén de Destino</label>
              <div className="bg-blue-50 ring-1 ring-blue-200 rounded-xl p-3">
                <div className="font-medium text-blue-900">{transferencia.almacenDestino.nombre}</div>
                {transferencia.almacenDestino.ubicacion && (
                  <div className="text-sm text-blue-700 mt-1">
                    {transferencia.almacenDestino.ubicacion}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Productos a Transferir</label>
            <div className="ring-1 ring-slate-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
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
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Package size={20} className="text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.producto.nombre}
                            </div>
                            {item.producto.sku && (
                              <div className="text-xs text-gray-500">SKU: {item.producto.sku}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{item.cantidad}</span>
                      </td>
                      {transferencia.productos.some((p) => p.lote) && (
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{item.lote || '-'}</span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Creación</label>
              <div className="text-gray-600">{formatFecha(transferencia.fechaCreacion)}</div>
            </div>
            {transferencia.usuarioSolicitante && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Solicitado por</label>
                <div className="text-gray-600">{transferencia.usuarioSolicitante.name}</div>
              </div>
            )}
          </div>

          {transferencia.notas && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notas</label>
              <div className="bg-slate-50 ring-1 ring-slate-200 rounded-xl p-3 text-sm text-gray-700">
                {transferencia.notas}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-slate-50/80 backdrop-blur border-t border-gray-200/60 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onCancelar}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white ring-1 ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-sm ring-1 ring-green-600/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Confirmando...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Confirmar Recepción
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



