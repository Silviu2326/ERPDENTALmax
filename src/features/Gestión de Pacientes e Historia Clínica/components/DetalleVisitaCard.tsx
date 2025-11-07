import { useState } from 'react';
import { Calendar, Clock, User, DollarSign, FileText, Eye, X, Upload, Loader2 } from 'lucide-react';
import { Visita, DetalleVisita, obtenerDetalleVisita } from '../api/historialVisitasApi';

interface DetalleVisitaCardProps {
  visita: Visita;
  onVerDetalleCompleto?: (visita: DetalleVisita) => void;
  onVerOdontograma?: (odontogramaId: string, fecha: string) => void;
  onAdjuntarDocumento?: (visitaId: string) => void;
}

export default function DetalleVisitaCard({
  visita,
  onVerDetalleCompleto,
  onVerOdontograma,
  onAdjuntarDocumento,
}: DetalleVisitaCardProps) {
  const [detalleCompleto, setDetalleCompleto] = useState<DetalleVisita | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearHora = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { bg: string; text: string; border: string }> = {
      programada: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      completada: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      cancelada: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    };

    const estadoStyle = estados[estado] || estados.programada;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoStyle.bg} ${estadoStyle.text} ring-1 ${estadoStyle.border}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  const calcularTotalPagos = () => {
    if (!detalleCompleto?.pagosAsociados) return 0;
    return detalleCompleto.pagosAsociados.reduce((total, pago) => total + pago.monto, 0);
  };

  const handleVerDetalle = async () => {
    if (detalleCompleto) {
      setShowModal(true);
      if (onVerDetalleCompleto) {
        onVerDetalleCompleto(detalleCompleto);
      }
      return;
    }

    setLoading(true);
    try {
      const detalle = await obtenerDetalleVisita(visita._id);
      setDetalleCompleto(detalle);
      setShowModal(true);
      if (onVerDetalleCompleto) {
        onVerDetalleCompleto(detalle);
      }
    } catch (error) {
      console.error('Error al cargar detalles:', error);
    } finally {
      setLoading(false);
    }
  };

  const tratamientos = visita.tratamientosRealizados || [];
  const totalPagos = calcularTotalPagos();

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 transition-shadow overflow-hidden hover:shadow-md h-full flex flex-col">
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-base">{formatearFecha(visita.fechaHoraInicio)}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4" />
                    {formatearHora(visita.fechaHoraInicio)} - {formatearHora(visita.fechaHoraFin)}
                  </p>
                </div>
              </div>

              <div className="ml-11 space-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium">
                    {visita.profesional.nombre} {visita.profesional.apellidos}
                  </span>
                </div>

                {tratamientos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Tratamientos:</p>
                    <div className="flex flex-wrap gap-2">
                      {tratamientos.slice(0, 3).map((tratamiento, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs ring-1 ring-blue-200/50"
                        >
                          {tratamiento.tratamiento.nombre}
                          {tratamiento.pieza && ` (${tratamiento.pieza})`}
                        </span>
                      ))}
                      {tratamientos.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs ring-1 ring-slate-200">
                          +{tratamientos.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {visita.notasClinicas && (
                  <div>
                    <p className="text-sm text-slate-600 line-clamp-2">{visita.notasClinicas}</p>
                  </div>
                )}

                {totalPagos > 0 && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      Pagado: ${totalPagos.toLocaleString('es-CL')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="ml-4 flex flex-col items-end gap-2">
              {getEstadoBadge(visita.estado)}
              {visita.odontogramaSnapshot && (
                <button
                  onClick={() => onVerOdontograma?.(visita.odontogramaSnapshot!._id, visita.fechaHoraInicio)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  Odontograma
                </button>
              )}
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-slate-600">
              {visita.documentosAdjuntos && visita.documentosAdjuntos.length > 0 && (
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{visita.documentosAdjuntos.length} documento(s)</span>
                </div>
              )}
            </div>

            <button
              onClick={handleVerDetalle}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Ver detalles
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalles completos */}
      {showModal && detalleCompleto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ring-1 ring-slate-200">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Detalles de la Visita - {formatearFecha(detalleCompleto.fechaHoraInicio)}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Profesional</p>
                  <p className="font-medium">
                    {detalleCompleto.profesional.nombre} {detalleCompleto.profesional.apellidos}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  {getEstadoBadge(detalleCompleto.estado)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha y Hora</p>
                  <p className="font-medium">
                    {formatearFecha(detalleCompleto.fechaHoraInicio)} {formatearHora(detalleCompleto.fechaHoraInicio)}
                  </p>
                </div>
                {detalleCompleto.sede && (
                  <div>
                    <p className="text-sm text-gray-500">Sede</p>
                    <p className="font-medium">{detalleCompleto.sede.nombre}</p>
                  </div>
                )}
              </div>

              {/* Tratamientos realizados */}
              {detalleCompleto.tratamientosRealizados && detalleCompleto.tratamientosRealizados.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Tratamientos Realizados</h4>
                  <div className="space-y-3">
                    {detalleCompleto.tratamientosRealizados.map((tratamiento, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl ring-1 ring-slate-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{tratamiento.tratamiento.nombre}</p>
                            {tratamiento.pieza && (
                              <p className="text-sm text-slate-600 mt-1">Pieza: {tratamiento.pieza}</p>
                            )}
                            {tratamiento.notas && (
                              <p className="text-sm text-slate-600 mt-2">{tratamiento.notas}</p>
                            )}
                          </div>
                          {tratamiento.tratamiento.costo && (
                            <p className="font-semibold text-gray-900">
                              ${tratamiento.tratamiento.costo.toLocaleString('es-CL')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notas clínicas */}
              {detalleCompleto.notasClinicas && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Notas Clínicas</h4>
                  <div className="bg-slate-50 p-4 rounded-xl ring-1 ring-slate-200">
                    <p className="text-slate-700 whitespace-pre-wrap">{detalleCompleto.notasClinicas}</p>
                  </div>
                </div>
              )}

              {/* Pagos asociados */}
              {detalleCompleto.pagosAsociados && detalleCompleto.pagosAsociados.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Pagos Asociados</h4>
                  <div className="space-y-3">
                    {detalleCompleto.pagosAsociados.map((pago) => (
                      <div key={pago._id} className="bg-green-50 p-4 rounded-xl ring-1 ring-green-200 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">${pago.monto.toLocaleString('es-CL')}</p>
                          <p className="text-sm text-slate-600 mt-1">
                            {new Date(pago.fecha).toLocaleDateString('es-ES')} - {pago.metodoPago}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium ring-1 ring-green-200">
                          {pago.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documentos adjuntos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">Documentos Adjuntos</h4>
                  {onAdjuntarDocumento && (
                    <button
                      onClick={() => onAdjuntarDocumento(detalleCompleto._id)}
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Adjuntar
                    </button>
                  )}
                </div>
                {detalleCompleto.documentosAdjuntos && detalleCompleto.documentosAdjuntos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {detalleCompleto.documentosAdjuntos.map((doc) => (
                      <a
                        key={doc._id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl ring-1 ring-slate-200 hover:bg-slate-100 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-slate-700 truncate">{doc.nombreArchivo}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No hay documentos adjuntos</p>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-2 text-sm font-medium transition-all bg-slate-600 text-white hover:bg-slate-700 shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

