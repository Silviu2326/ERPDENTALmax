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
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-sm" onClick={onCerrar} />

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <Package size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Detalle del Lote</h3>
                  <p className="text-sm text-gray-600 mt-1">ID: {lote.loteId}</p>
                </div>
              </div>
              <button
                onClick={onCerrar}
                className="text-gray-400 hover:text-gray-500 transition-colors p-2 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-4">{getEstadoBadge(lote.estado)}</div>
          </div>

          <div className="px-6 pb-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Información General */}
            <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información General</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Autoclave</p>
                    <p className="font-medium text-gray-900">{lote.autoclave.nombre}</p>
                    {lote.autoclave.modelo && (
                      <p className="text-xs text-slate-500 mt-1">{lote.autoclave.modelo}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Operador</p>
                    <p className="font-medium text-gray-900">
                      {lote.operador.nombre} {lote.operador.apellidos}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Sede</p>
                    <p className="font-medium text-gray-900">{lote.sede.nombre}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Fechas del Ciclo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Fecha de Inicio</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(lote.fechaInicio), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                    </p>
                  </div>
                </div>
                {lote.fechaFin && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Fecha de Fin</p>
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
              <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Parámetros del Ciclo</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <Thermometer className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Temperatura</p>
                      <p className="font-medium text-gray-900">{lote.parametrosCiclo.temperatura}°C</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Gauge className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Presión</p>
                      <p className="font-medium text-gray-900">{lote.parametrosCiclo.presion} bar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Timer className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Tiempo</p>
                      <p className="font-medium text-gray-900">{lote.parametrosCiclo.tiempo} min</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Indicadores */}
            <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Indicadores</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lote.indicadorQuimico && (
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Indicador Químico</p>
                    <div className="flex items-center gap-2">
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
                    <p className="text-sm text-slate-600 mb-2">Indicador Biológico</p>
                    <div className="flex items-center gap-2">
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
                      <p className="text-xs text-slate-500 mt-2">
                        Lectura: {format(new Date(lote.indicadorBiologico.fechaLectura), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Paquetes */}
            <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Paquetes de Instrumental</h4>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-600">{lote.paquetes.length} paquetes</span>
                </div>
              </div>
              <div className="space-y-3">
                {lote.paquetes.map((paquete, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{paquete.paqueteId}</p>
                      <p className="text-sm text-slate-600 mt-1">{paquete.contenido}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {paquete.utilizado ? (
                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Utilizado
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-full">
                          Disponible
                        </span>
                      )}
                      {paquete.paciente && (
                        <div className="text-right">
                          <p className="text-xs text-slate-600">Paciente:</p>
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
              <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Notas</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{lote.notas}</p>
              </div>
            )}
          </div>

          <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-200">
            {onEditar && lote.estado === 'en_proceso' && (
              <button
                onClick={() => {
                  onEditar(lote);
                  onCerrar();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
              >
                Editar Lote
              </button>
            )}
            <button
              onClick={onCerrar}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



