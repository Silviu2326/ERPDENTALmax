import { X, Calendar, User, Building2, CheckCircle, XCircle, Clock, Package, Thermometer, Gauge, Timer } from 'lucide-react';
import { LoteEsterilizacion } from '../api/esterilizacionApi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ModalDetalleLoteProps {
  lote: LoteEsterilizacion | null;
  onCerrar: () => void;
  onEditar?: (lote: LoteEsterilizacion) => void;
}

export default function ModalDetalleLote({ lote, onCerrar, onEditar }: ModalDetalleLoteProps) {
  if (!lote) return null;

  const getEstadoBadge = (estado: string) => {
    const estilos = {
      en_proceso: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      validado: 'bg-green-100 text-green-800 border-green-200',
      fallido: 'bg-red-100 text-red-800 border-red-200',
    };

    const iconos = {
      en_proceso: <Clock className="w-4 h-4" />,
      validado: <CheckCircle className="w-4 h-4" />,
      fallido: <XCircle className="w-4 h-4" />,
    };

    const etiquetas = {
      en_proceso: 'En Proceso',
      validado: 'Validado',
      fallido: 'Fallido',
    };

    return (
      <span
        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${estilos[estado as keyof typeof estilos] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
      >
        {iconos[estado as keyof typeof iconos]}
        <span>{etiquetas[estado as keyof typeof etiquetas] || estado}</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onCerrar} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Detalle del Lote</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {lote.loteId}</p>
              </div>
              <button
                onClick={onCerrar}
                className="text-gray-400 hover:text-gray-500 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-4">{getEstadoBadge(lote.estado)}</div>
          </div>

          <div className="px-6 pb-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Información General */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Información General</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Autoclave</p>
                    <p className="font-medium text-gray-900">{lote.autoclave.nombre}</p>
                    {lote.autoclave.modelo && (
                      <p className="text-xs text-gray-500">{lote.autoclave.modelo}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Operador</p>
                    <p className="font-medium text-gray-900">
                      {lote.operador.nombre} {lote.operador.apellidos}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Sede</p>
                    <p className="font-medium text-gray-900">{lote.sede.nombre}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Fechas del Ciclo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Inicio</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(lote.fechaInicio), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                    </p>
                  </div>
                </div>
                {lote.fechaFin && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Fin</p>
                      <p className="font-medium text-gray-900">
                        {format(new Date(lote.fechaFin), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Parámetros del Ciclo */}
            {lote.parametrosCiclo && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Parámetros del Ciclo</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start space-x-3">
                    <Thermometer className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Temperatura</p>
                      <p className="font-medium text-gray-900">{lote.parametrosCiclo.temperatura}°C</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Gauge className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Presión</p>
                      <p className="font-medium text-gray-900">{lote.parametrosCiclo.presion} bar</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Timer className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Tiempo</p>
                      <p className="font-medium text-gray-900">{lote.parametrosCiclo.tiempo} min</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Indicadores */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Indicadores</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lote.indicadorQuimico && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Indicador Químico</p>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{lote.indicadorQuimico.tipo}</span>
                      {lote.indicadorQuimico.resultado === 'correcto' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          lote.indicadorQuimico.resultado === 'correcto' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {lote.indicadorQuimico.resultado === 'correcto' ? 'Correcto' : 'Incorrecto'}
                      </span>
                    </div>
                  </div>
                )}
                {lote.indicadorBiologico && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Indicador Biológico</p>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{lote.indicadorBiologico.tipo}</span>
                      {lote.indicadorBiologico.resultado === 'negativo' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          lote.indicadorBiologico.resultado === 'negativo' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {lote.indicadorBiologico.resultado === 'negativo' ? 'Negativo' : 'Positivo'}
                      </span>
                    </div>
                    {lote.indicadorBiologico.fechaLectura && (
                      <p className="text-xs text-gray-500 mt-1">
                        Lectura: {format(new Date(lote.indicadorBiologico.fechaLectura), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Paquetes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Paquetes de Instrumental</h4>
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">{lote.paquetes.length} paquetes</span>
                </div>
              </div>
              <div className="space-y-2">
                {lote.paquetes.map((paquete, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{paquete.paqueteId}</p>
                      <p className="text-sm text-gray-500">{paquete.contenido}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {paquete.utilizado ? (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          Utilizado
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          Disponible
                        </span>
                      )}
                      {paquete.paciente && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Paciente:</p>
                          <p className="text-sm font-medium text-gray-900">
                            {paquete.paciente.nombre} {paquete.paciente.apellidos}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas */}
            {lote.notas && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Notas</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{lote.notas}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            {onEditar && lote.estado === 'en_proceso' && (
              <button
                onClick={() => {
                  onEditar(lote);
                  onCerrar();
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Editar Lote
              </button>
            )}
            <button
              onClick={onCerrar}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


