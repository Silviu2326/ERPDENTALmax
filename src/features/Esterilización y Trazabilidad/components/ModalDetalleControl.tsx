import { X, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { ControlEsterilizacion, ResultadoControl, TipoControl } from '../api/controlesApi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ModalDetalleControlProps {
  control: ControlEsterilizacion | null;
  onCerrar: () => void;
  onEditar?: (control: ControlEsterilizacion) => void;
}

export default function ModalDetalleControl({
  control,
  onCerrar,
  onEditar,
}: ModalDetalleControlProps) {
  if (!control) return null;

  const getResultadoBadge = (resultado: ResultadoControl) => {
    const estilos = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      negativo: 'bg-green-100 text-green-800 border-green-200',
      positivo: 'bg-red-100 text-red-800 border-red-200',
      fallido: 'bg-red-100 text-red-800 border-red-200',
    };

    const iconos = {
      pendiente: <Clock className="w-5 h-5" />,
      negativo: <CheckCircle className="w-5 h-5" />,
      positivo: <AlertTriangle className="w-5 h-5" />,
      fallido: <XCircle className="w-5 h-5" />,
    };

    const etiquetas = {
      pendiente: 'Pendiente',
      negativo: 'Negativo (Correcto)',
      positivo: 'Positivo (Fallido)',
      fallido: 'Fallido',
    };

    return (
      <span
        className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${estilos[resultado]}`}
      >
        {iconos[resultado]}
        <span>{etiquetas[resultado]}</span>
      </span>
    );
  };

  const formatearFecha = (fecha: Date | string | undefined) => {
    if (!fecha) return '-';
    try {
      return format(new Date(fecha), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
    } catch {
      return '-';
    }
  };

  const formatearFechaCorta = (fecha: Date | string | undefined) => {
    if (!fecha) return '-';
    try {
      return format(new Date(fecha), 'dd/MM/yyyy', { locale: es });
    } catch {
      return '-';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onCerrar}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Detalle del Control de Esterilización
              </h3>
              <button
                onClick={onCerrar}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 bg-gray-50">
            <div className="space-y-6">
              {/* Resultado destacado */}
              <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Resultado</p>
                    {getResultadoBadge(control.resultado)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 mb-2">Tipo de Control</p>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                        control.tipoControl === 'biologico'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {control.tipoControl === 'biologico' ? 'Biológico' : 'Químico'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información del Control */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Información del Control</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha de Registro</p>
                    <p className="text-sm text-gray-900 mt-1">{formatearFecha(control.fechaRegistro)}</p>
                  </div>
                  {control.fechaResultado && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de Resultado</p>
                      <p className="text-sm text-gray-900 mt-1">{formatearFecha(control.fechaResultado)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Autoclave</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {control.idEsterilizador.nombre}
                      {control.idEsterilizador.modelo && ` (${control.idEsterilizador.modelo})`}
                    </p>
                  </div>
                  {control.idCicloEsterilizacion && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ciclo de Esterilización</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {control.idCicloEsterilizacion.loteId || control.idCicloEsterilizacion._id}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del Indicador */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Información del Indicador</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lote del Indicador</p>
                    <p className="text-sm text-gray-900 mt-1">{control.loteIndicador}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha de Vencimiento</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatearFechaCorta(control.fechaVencimientoIndicador)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Responsables */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Responsables</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Registrado por</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {control.idUsuarioRegistro.nombre} {control.idUsuarioRegistro.apellidos}
                    </p>
                  </div>
                  {control.idUsuarioResultado && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Resultado registrado por</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {control.idUsuarioResultado.nombre} {control.idUsuarioResultado.apellidos}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Observaciones */}
              {control.observaciones && (
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Observaciones</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{control.observaciones}</p>
                </div>
              )}

              {/* Alerta si el resultado es positivo */}
              {control.resultado === 'positivo' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">
                        Alerta: Control Positivo
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        Este control ha resultado positivo. Se debe activar el protocolo de seguridad inmediatamente.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            {onEditar && (control.resultado === 'pendiente' || control.tipoControl === 'biologico') && (
              <button
                onClick={() => {
                  onEditar(control);
                  onCerrar();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Actualizar Resultado
              </button>
            )}
            <button
              onClick={onCerrar}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


