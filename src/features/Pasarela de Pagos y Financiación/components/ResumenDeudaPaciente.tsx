import { Tratamiento, DeudaPaciente } from '../api/pagoApi';
import { AlertCircle, CheckCircle, Euro } from 'lucide-react';

interface ResumenDeudaPacienteProps {
  deuda: DeudaPaciente | null;
  loading?: boolean;
  tratamientosSeleccionados?: string[];
  onTratamientoToggle?: (tratamientoId: string) => void;
}

export default function ResumenDeudaPaciente({
  deuda,
  loading = false,
  tratamientosSeleccionados = [],
  onTratamientoToggle,
}: ResumenDeudaPacienteProps) {
  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!deuda) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center py-12 text-gray-500">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Selecciona un paciente para ver su deuda</p>
          </div>
        </div>
      </div>
    );
  }

  const totalSeleccionado = deuda.tratamientos
    .filter((t) => tratamientosSeleccionados.includes(t._id))
    .reduce((sum, t) => sum + (t.saldoPendiente || 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Resumen de Deuda
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="font-medium">{deuda.paciente.nombre} {deuda.paciente.apellidos}</span>
          {deuda.paciente.documentoIdentidad && (
            <span className="text-gray-400">• {deuda.paciente.documentoIdentidad}</span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Resumen total */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Total Deuda</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatearMoneda(deuda.totalDeuda)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Pagado</span>
            <span className="font-semibold text-green-600">
              {formatearMoneda(deuda.totalPagado)}
            </span>
          </div>
          {totalSeleccionado > 0 && (
            <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-blue-200">
              <span className="font-medium text-gray-700">Seleccionado para Pago</span>
              <span className="font-bold text-blue-700">
                {formatearMoneda(totalSeleccionado)}
              </span>
            </div>
          )}
        </div>

        {/* Lista de tratamientos */}
        {deuda.tratamientos.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Tratamientos con Saldo Pendiente
            </h4>
            {deuda.tratamientos.map((tratamiento) => {
              const estaSeleccionado = tratamientosSeleccionados.includes(tratamiento._id);
              const tieneSaldo = (tratamiento.saldoPendiente || 0) > 0;

              return (
                <div
                  key={tratamiento._id}
                  onClick={() => onTratamientoToggle && tieneSaldo && onTratamientoToggle(tratamiento._id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    estaSeleccionado
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50'
                  } ${tieneSaldo && onTratamientoToggle ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-semibold text-gray-900">{tratamiento.nombre}</h5>
                        {estaSeleccionado && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      {tratamiento.descripcion && (
                        <p className="text-sm text-gray-600 mb-2">{tratamiento.descripcion}</p>
                      )}
                      {tratamiento.planTratamiento && (
                        <p className="text-xs text-gray-500">
                          Plan: {tratamiento.planTratamiento.nombre}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center space-x-1 text-lg font-bold text-gray-900">
                        <Euro className="w-4 h-4" />
                        <span>{tratamiento.saldoPendiente?.toFixed(2) || '0.00'}</span>
                      </div>
                      {tratamiento.precio && tratamiento.saldoPendiente !== tratamiento.precio && (
                        <div className="text-xs text-gray-500 mt-1">
                          Precio: {formatearMoneda(tratamiento.precio)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
            <p>No hay tratamientos con saldo pendiente</p>
          </div>
        )}
      </div>
    </div>
  );
}


