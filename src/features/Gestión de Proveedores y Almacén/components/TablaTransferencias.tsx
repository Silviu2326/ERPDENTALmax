import { useState } from 'react';
import { Package, ArrowRight, Eye, XCircle, CheckCircle, Clock, MoreVertical, Loader2 } from 'lucide-react';
import { TransferenciaAlmacen, EstadoTransferencia } from '../api/transferenciasApi';

interface TablaTransferenciasProps {
  transferencias: TransferenciaAlmacen[];
  loading: boolean;
  onVerDetalle: (transferenciaId: string) => void;
  onConfirmarRecepcion?: (transferenciaId: string) => void;
  onCancelar?: (transferenciaId: string) => void;
}

export default function TablaTransferencias({
  transferencias,
  loading,
  onVerDetalle,
  onConfirmarRecepcion,
  onCancelar,
}: TablaTransferenciasProps) {
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);

  const getEstadoBadge = (estado: EstadoTransferencia) => {
    switch (estado) {
      case 'Pendiente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        );
      case 'Completada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Completada
          </span>
        );
      case 'Cancelada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3" />
            Cancelada
          </span>
        );
      default:
        return null;
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando transferencias...</p>
      </div>
    );
  }

  if (transferencias.length === 0) {
    return (
      <div className="p-8 text-center bg-white">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay transferencias registradas</h3>
        <p className="text-gray-600 mb-4">Crea una nueva transferencia para comenzar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Código
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Origen
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Destino
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Productos
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Fecha Creación
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {transferencias.map((transferencia) => (
            <tr
              key={transferencia._id}
              className="hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onVerDetalle(transferencia._id || '')}
            >
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900">{transferencia.codigo}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {transferencia.almacenOrigen.nombre}
                </div>
                {transferencia.almacenOrigen.ubicacion && (
                  <div className="text-xs text-slate-500">{transferencia.almacenOrigen.ubicacion}</div>
                )}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {transferencia.almacenDestino.nombre}
                    </div>
                    {transferencia.almacenDestino.ubicacion && (
                      <div className="text-xs text-slate-500">
                        {transferencia.almacenDestino.ubicacion}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm text-gray-900">
                  {transferencia.productos.length}{' '}
                  {transferencia.productos.length === 1 ? 'producto' : 'productos'}
                </div>
                <div className="text-xs text-slate-500">
                  Total:{' '}
                  {transferencia.productos.reduce((sum, p) => sum + p.cantidad, 0)} unidades
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">{getEstadoBadge(transferencia.estado)}</td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatFecha(transferencia.fechaCreacion)}</div>
                {transferencia.usuarioSolicitante && (
                  <div className="text-xs text-slate-500">
                    Por {transferencia.usuarioSolicitante.name}
                  </div>
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onVerDetalle(transferencia._id || '');
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                    title="Ver detalle"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {transferencia.estado === 'Pendiente' && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuAbierto(
                            menuAbierto === transferencia._id ? null : transferencia._id || null
                          );
                        }}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                        title="Más opciones"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuAbierto === transferencia._id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg ring-1 ring-slate-200 z-10">
                          <div className="py-1">
                            {onConfirmarRecepcion && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onConfirmarRecepcion(transferencia._id || '');
                                  setMenuAbierto(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Confirmar Recepción
                              </button>
                            )}
                            {onCancelar && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCancelar(transferencia._id || '');
                                  setMenuAbierto(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                                Cancelar
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {menuAbierto && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setMenuAbierto(null)}
        />
      )}
    </div>
  );
}



