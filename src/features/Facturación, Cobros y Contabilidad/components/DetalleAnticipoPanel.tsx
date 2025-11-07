import { Receipt, Calendar, User, DollarSign, FileText, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Anticipo } from '../api/anticiposApi';

interface DetalleAnticipoPanelProps {
  anticipo: Anticipo;
  onCerrar: () => void;
}

export default function DetalleAnticipoPanel({ anticipo, onCerrar }: DetalleAnticipoPanelProps) {
  const getEstadoBadge = (estado: string) => {
    const badges = {
      disponible: (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center space-x-1">
          <CheckCircle className="w-4 h-4" />
          <span>Disponible</span>
        </span>
      ),
      aplicado: (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center space-x-1">
          <CheckCircle className="w-4 h-4" />
          <span>Aplicado</span>
        </span>
      ),
      devuelto: (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center space-x-1">
          <XCircle className="w-4 h-4" />
          <span>Devuelto</span>
        </span>
      ),
    };
    return badges[estado as keyof typeof badges] || badges.disponible;
  };

  const getMetodoPagoBadge = (metodo: string) => {
    const colores = {
      Efectivo: 'bg-slate-100 text-slate-800',
      Tarjeta: 'bg-purple-100 text-purple-800',
      Transferencia: 'bg-indigo-100 text-indigo-800',
    };
    return colores[metodo as keyof typeof colores] || colores.Efectivo;
  };

  const fechaFormateada = new Date(anticipo.fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Detalle del Anticipo</h3>
        <button
          onClick={onCerrar}
          className="text-gray-400 hover:text-gray-600 transition-all rounded-lg p-1.5 hover:bg-gray-100"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Estado y Método de Pago */}
        <div className="flex items-center justify-between">
          {getEstadoBadge(anticipo.estado)}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMetodoPagoBadge(anticipo.metodoPago)}`}>
            {anticipo.metodoPago}
          </span>
        </div>

        {/* Monto */}
        <div className="bg-blue-50 rounded-xl p-4 ring-1 ring-blue-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monto del Anticipo</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(anticipo.monto)}
              </p>
            </div>
          </div>
        </div>

        {/* Información del Paciente */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
            <User size={16} className="mr-1" />
            <span>Paciente</span>
          </h4>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="font-medium text-gray-900">
              {anticipo.paciente.nombre} {anticipo.paciente.apellidos}
            </p>
            {anticipo.paciente.documentoIdentidad && (
              <p className="text-sm text-gray-600 mt-1">
                DNI: {anticipo.paciente.documentoIdentidad}
              </p>
            )}
          </div>
        </div>

        {/* Información de Fecha */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>Fecha de Registro</span>
          </h4>
          <p className="text-gray-900">{fechaFormateada}</p>
        </div>

        {/* Plan de Tratamiento (si existe) */}
        {anticipo.planTratamiento && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
              <Receipt size={16} className="mr-1" />
              <span>Plan de Tratamiento</span>
            </h4>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-gray-900">{anticipo.planTratamiento.nombre}</p>
            </div>
          </div>
        )}

        {/* Factura Aplicada (si existe) */}
        {anticipo.facturaAplicada && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
              <Receipt size={16} className="mr-1" />
              <span>Factura Aplicada</span>
            </h4>
            <div className="bg-blue-50 rounded-xl p-3 ring-1 ring-blue-200">
              <p className="font-medium text-blue-900">
                Factura #{anticipo.facturaAplicada.numeroFactura}
              </p>
            </div>
          </div>
        )}

        {/* Observaciones */}
        {anticipo.observacion && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
              <FileText size={16} className="mr-1" />
              <span>Observaciones</span>
            </h4>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-gray-700 whitespace-pre-wrap">{anticipo.observacion}</p>
            </div>
          </div>
        )}

        {/* Información de Auditoría */}
        <div className="border-t border-gray-200 pt-4">
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              Creado por: <span className="font-medium">{anticipo.creadoPor.nombre}</span>
            </p>
            {anticipo.createdAt && (
              <p>
                Fecha de creación:{' '}
                {new Date(anticipo.createdAt).toLocaleString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



