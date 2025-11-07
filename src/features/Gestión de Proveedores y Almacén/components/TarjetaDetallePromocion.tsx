import { Calendar, Tag, DollarSign, Users, Package, Stethoscope, CheckCircle, XCircle, Clock, Code } from 'lucide-react';
import { Promocion } from '../api/promocionesApi';

interface TarjetaDetallePromocionProps {
  promocion: Promocion;
  onEditar?: () => void;
  onEliminar?: () => void;
}

export default function TarjetaDetallePromocion({
  promocion,
  onEditar,
  onEliminar,
}: TarjetaDetallePromocionProps) {
  const getEstadoBadge = () => {
    const estados = {
      activa: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Activa' },
      inactiva: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Inactiva' },
      expirada: { color: 'bg-red-100 text-red-800', icon: Clock, label: 'Expirada' },
    };
    const estado = estados[promocion.estado];
    const Icon = estado.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${estado.color}`}>
        <Icon className="w-4 h-4" />
        {estado.label}
      </span>
    );
  };

  const getTipoLabel = () => {
    const tipos = {
      porcentaje: 'Descuento Porcentual',
      fijo: 'Descuento Fijo',
      '2x1': '2x1',
      paquete: 'Paquete',
    };
    return tipos[promocion.tipo] || promocion.tipo;
  };

  const getValorDisplay = () => {
    if (promocion.tipo === 'porcentaje') {
      return `${promocion.valor}%`;
    }
    if (promocion.tipo === 'fijo') {
      return `€${promocion.valor.toFixed(2)}`;
    }
    return promocion.tipo;
  };

  return (
    <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{promocion.nombre}</h3>
            {getEstadoBadge()}
          </div>
          {promocion.descripcion && (
            <p className="text-gray-600">{promocion.descripcion}</p>
          )}
        </div>
        <div className="flex gap-2">
          {onEditar && (
            <button
              onClick={onEditar}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md"
            >
              Editar
            </button>
          )}
          {onEliminar && (
            <button
              onClick={onEliminar}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl ring-1 ring-blue-200">
          <Tag className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-sm text-slate-600">Tipo</div>
            <div className="font-semibold text-gray-900">{getTipoLabel()}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl ring-1 ring-green-200">
          <DollarSign className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-sm text-slate-600">Valor</div>
            <div className="font-semibold text-gray-900">{getValorDisplay()}</div>
          </div>
        </div>

        {promocion.codigo && (
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl ring-1 ring-purple-200">
            <Code className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-sm text-slate-600">Código Promocional</div>
              <div className="font-semibold text-gray-900 font-mono">{promocion.codigo}</div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl ring-1 ring-orange-200">
          <Users className="w-5 h-5 text-orange-600" />
          <div>
            <div className="text-sm text-slate-600">Usos</div>
            <div className="font-semibold text-gray-900">
              {promocion.usosActuales || 0} / {promocion.usosMaximos || '∞'}
            </div>
          </div>
        </div>
      </div>

      {/* Fechas */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-600" />
          <div>
            <div className="text-sm text-slate-600">Fecha Inicio</div>
            <div className="font-semibold text-gray-900">
              {new Date(promocion.fechaInicio).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-600" />
          <div>
            <div className="text-sm text-slate-600">Fecha Fin</div>
            <div className="font-semibold text-gray-900">
              {new Date(promocion.fechaFin).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Condiciones */}
      {promocion.condiciones && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Condiciones</h4>
          <p className="text-gray-600 bg-slate-50 p-4 rounded-xl ring-1 ring-slate-200">{promocion.condiciones}</p>
        </div>
      )}

      {/* Tratamientos y Productos aplicables */}
      {(promocion.tratamientosAplicables && promocion.tratamientosAplicables.length > 0) ||
      (promocion.productosAplicables && promocion.productosAplicables.length > 0) ? (
        <div className="space-y-4">
          {promocion.tratamientosAplicables && promocion.tratamientosAplicables.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Tratamientos Aplicables ({promocion.tratamientosAplicables.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {promocion.tratamientosAplicables.map((tratamiento) => (
                  <span
                    key={tratamiento._id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-800 rounded-lg text-sm ring-1 ring-blue-200"
                  >
                    {tratamiento.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {promocion.productosAplicables && promocion.productosAplicables.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Productos Aplicables ({promocion.productosAplicables.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {promocion.productosAplicables.map((producto) => (
                  <span
                    key={producto._id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-800 rounded-lg text-sm ring-1 ring-green-200"
                  >
                    {producto.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4 text-slate-500 bg-slate-50 rounded-xl ring-1 ring-slate-200">
          Esta promoción aplica a todos los tratamientos y productos
        </div>
      )}

      {/* Solo nuevos pacientes */}
      {promocion.soloNuevosPacientes && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl ring-1 ring-yellow-200">
          <p className="text-sm text-yellow-800 font-medium">
            ⚠️ Esta promoción solo aplica para nuevos pacientes
          </p>
        </div>
      )}
    </div>
  );
}



