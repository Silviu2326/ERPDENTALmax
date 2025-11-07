import { Edit, Trash2, Eye, Tag, Calendar, CheckCircle, XCircle, Clock, Loader2, Package } from 'lucide-react';
import { Promocion } from '../api/promocionesApi';

interface ListaPromocionesProps {
  promociones: Promocion[];
  onEditar: (promocion: Promocion) => void;
  onEliminar: (promocion: Promocion) => void;
  onVerDetalle: (promocion: Promocion) => void;
  loading?: boolean;
}

export default function ListaPromociones({
  promociones,
  onEditar,
  onEliminar,
  onVerDetalle,
  loading = false,
}: ListaPromocionesProps) {
  const getEstadoBadge = (estado: string) => {
    const estados = {
      activa: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Activa' },
      inactiva: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Inactiva' },
      expirada: { color: 'bg-red-100 text-red-800', icon: Clock, label: 'Expirada' },
    };
    const estadoInfo = estados[estado as keyof typeof estados] || estados.inactiva;
    const Icon = estadoInfo.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}>
        <Icon className="w-3 h-3" />
        {estadoInfo.label}
      </span>
    );
  };

  const getTipoLabel = (tipo: string) => {
    const tipos = {
      porcentaje: 'Porcentaje',
      fijo: 'Monto Fijo',
      '2x1': '2x1',
      paquete: 'Paquete',
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const getValorDisplay = (promocion: Promocion) => {
    if (promocion.tipo === 'porcentaje') {
      return `${promocion.valor}%`;
    }
    if (promocion.tipo === 'fijo') {
      return `€${promocion.valor.toFixed(2)}`;
    }
    return promocion.tipo;
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (promociones.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay promociones disponibles</h3>
        <p className="text-gray-600 mb-4">Crea una nueva promoción para comenzar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {promociones.map((promocion) => (
        <div
          key={promocion._id}
          className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{promocion.nombre}</h3>
                {getEstadoBadge(promocion.estado)}
              </div>
              
              {promocion.descripcion && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{promocion.descripcion}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span className="font-medium">{getTipoLabel(promocion.tipo)}</span>
                  <span className="text-gray-900 ml-1">({getValorDisplay(promocion)})</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(promocion.fechaInicio).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                    })}{' '}
                    -{' '}
                    {new Date(promocion.fechaFin).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {promocion.usosMaximos && (
                  <div className="text-slate-600">
                    Usos: {promocion.usosActuales || 0} / {promocion.usosMaximos}
                  </div>
                )}

                {promocion.codigo && (
                  <div className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-mono ring-1 ring-purple-200">
                    {promocion.codigo}
                  </div>
                )}
              </div>

              {(promocion.tratamientosAplicables?.length || promocion.productosAplicables?.length) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {promocion.tratamientosAplicables && promocion.tratamientosAplicables.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg ring-1 ring-blue-200">
                      {promocion.tratamientosAplicables.length} tratamiento(s)
                    </span>
                  )}
                  {promocion.productosAplicables && promocion.productosAplicables.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg ring-1 ring-green-200">
                      {promocion.productosAplicables.length} producto(s)
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onVerDetalle(promocion)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="Ver detalle"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => onEditar(promocion)}
                className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                title="Editar"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onEliminar(promocion)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Eliminar"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



