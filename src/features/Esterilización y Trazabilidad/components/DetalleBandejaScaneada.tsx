import { Package, Calendar, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { BandejaEsteril } from '../api/trazabilidadApi';

interface DetalleBandejaScaneadaProps {
  bandeja: BandejaEsteril;
}

export default function DetalleBandejaScaneada({ bandeja }: DetalleBandejaScaneadaProps) {
  const fechaEsterilizacion = new Date(bandeja.fechaEsterilizacion);
  const fechaVencimiento = new Date(bandeja.fechaVencimiento);
  const ahora = new Date();
  const estaVencida = fechaVencimiento < ahora;
  const proximaAVencerse = fechaVencimiento.getTime() - ahora.getTime() < 7 * 24 * 60 * 60 * 1000; // 7 días

  const getEstadoBadge = () => {
    switch (bandeja.estado) {
      case 'Disponible':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 ring-1 ring-green-200">
            <CheckCircle size={12} />
            Disponible
          </span>
        );
      case 'En uso':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ring-1 ring-blue-200">
            En uso
          </span>
        );
      case 'Contaminada':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 ring-1 ring-red-200">
            <XCircle size={12} />
            Contaminada
          </span>
        );
      case 'En proceso':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200">
            En proceso
          </span>
        );
      default:
        return null;
    }
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Package size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{bandeja.nombre}</h3>
            <p className="text-sm text-gray-600">Código: {bandeja.codigoUnico}</p>
          </div>
        </div>
        {getEstadoBadge()}
      </div>

      {/* Alertas de validación */}
      {estaVencida && (
        <div className="mb-4 p-3 bg-red-50 ring-1 ring-red-200 rounded-2xl flex items-start space-x-2">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Bandeja vencida</p>
            <p className="text-sm text-red-700">
              Esta bandeja no puede ser asignada. La fecha de vencimiento ha pasado.
            </p>
          </div>
        </div>
      )}

      {proximaAVencerse && !estaVencida && (
        <div className="mb-4 p-3 bg-yellow-50 ring-1 ring-yellow-200 rounded-2xl flex items-start space-x-2">
          <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Advertencia</p>
            <p className="text-sm text-yellow-700">
              Esta bandeja está próxima a vencer. Verifique la fecha de vencimiento.
            </p>
          </div>
        </div>
      )}

      {bandeja.estado !== 'Disponible' && (
        <div className="mb-4 p-3 bg-red-50 ring-1 ring-red-200 rounded-2xl flex items-start space-x-2">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Bandeja no disponible</p>
            <p className="text-sm text-red-700">
              El estado actual de la bandeja no permite su asignación.
            </p>
          </div>
        </div>
      )}

      {/* Información detallada */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl ring-1 ring-slate-200">
          <Calendar size={20} className="text-gray-600" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Fecha de Esterilización</p>
            <p className="font-medium text-gray-900">{formatearFecha(fechaEsterilizacion)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl ring-1 ring-slate-200">
          <Calendar size={20} className="text-gray-600" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Fecha de Vencimiento</p>
            <p className={`font-medium ${estaVencida ? 'text-red-600' : 'text-gray-900'}`}>
              {formatearFecha(fechaVencimiento)}
            </p>
          </div>
        </div>

        {bandeja.cicloEsterilizacionId && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl ring-1 ring-slate-200">
            <Package size={20} className="text-gray-600" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Ciclo de Esterilización</p>
              <p className="font-medium text-gray-900">{bandeja.cicloEsterilizacionId}</p>
            </div>
          </div>
        )}
      </div>

      {/* Indicador de validez */}
      {!estaVencida && bandeja.estado === 'Disponible' && (
        <div className="mt-4 p-3 bg-green-50 ring-1 ring-green-200 rounded-2xl">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            <p className="text-sm font-medium text-green-800">
              Esta bandeja es válida y puede ser asignada
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



