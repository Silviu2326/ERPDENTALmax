import { useState, useEffect, useMemo } from 'react';
import { X, Download, FileText, FileSpreadsheet, Filter, ChevronLeft, ChevronRight, Clock, User, AlertCircle, Calendar, ArrowRightLeft, MousePointerClick, Database } from 'lucide-react';
import { Cita, HistorialCambio } from '../api/citasApi';


interface HistoryTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita | null;
}

const TIPOS_EVENTO = [
  { value: 'todos', label: 'Todos los eventos' },
  { value: 'creacion', label: 'Creación' },
  { value: 'actualizacion', label: 'Actualización' },
  { value: 'cancelacion', label: 'Cancelación' },
  { value: 'confirmacion', label: 'Confirmación' },
  { value: 'reprogramacion', label: 'Reprogramación' },
  { value: 'drag_drop', label: 'Drag & Drop' },
  { value: 'api', label: 'API' },
  { value: 'resize', label: 'Redimensionar' },
  { value: 'otro', label: 'Otros' },
];

const REGISTROS_POR_PAGINA = 20;

export default function HistoryTimeline({ isOpen, onClose, cita }: HistoryTimelineProps) {
  const [historial, setHistorial] = useState<HistorialCambio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtroTipoEvento, setFiltroTipoEvento] = useState<string>('todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    if (isOpen && cita?._id) {
      cargarHistorial();
    }
  }, [isOpen, cita?._id]);

  const cargarHistorial = async () => {
    if (!cita?._id) return;

    setLoading(true);
    setError(null);

    try {
      // En producción, esto vendría de la API
      // Por ahora, generamos datos mock basados en el historial_cambios de la cita
      const historialMock: HistorialCambio[] = [];

      // Convertir historial_cambios existente
      if (cita.historial_cambios) {
        cita.historial_cambios.forEach((cambio, index) => {
          historialMock.push({
            _id: `hist-${cita._id}-${index}`,
            fecha: cambio.fecha,
            usuario: cambio.usuario,
            cambio: cambio.cambio,
            tipoEvento: determinarTipoEvento(cambio.cambio),
            detalles: {
              origen: 'formulario',
            },
          });
        });
      }

      // Agregar eventos adicionales simulados para demostración
      historialMock.push({
        _id: `hist-${cita._id}-drag`,
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        usuario: 'Admin',
        cambio: 'Cita movida mediante drag & drop',
        tipoEvento: 'drag_drop',
        detalles: {
          campo: 'fecha_hora_inicio',
          valorAnterior: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          valorNuevo: cita.fecha_hora_inicio,
          origen: 'drag_drop',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
        },
      });

      historialMock.push({
        _id: `hist-${cita._id}-api`,
        fecha: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        usuario: 'Sistema',
        cambio: 'Cita actualizada mediante API externa',
        tipoEvento: 'api',
        detalles: {
          campo: 'estado',
          valorAnterior: 'programada',
          valorNuevo: cita.estado,
          origen: 'api',
          ipAddress: '10.0.0.50',
          userAgent: 'API Client v1.0',
        },
      });

      // Ordenar por fecha descendente
      historialMock.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

      setHistorial(historialMock);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const determinarTipoEvento = (cambio: string): HistorialCambio['tipoEvento'] => {
    const cambioLower = cambio.toLowerCase();
    if (cambioLower.includes('creada') || cambioLower.includes('creado')) return 'creacion';
    if (cambioLower.includes('cancelada') || cambioLower.includes('cancelado')) return 'cancelacion';
    if (cambioLower.includes('confirmada') || cambioLower.includes('confirmado')) return 'confirmacion';
    if (cambioLower.includes('reprogramada') || cambioLower.includes('reprogramado') || cambioLower.includes('movida')) return 'reprogramacion';
    if (cambioLower.includes('duración') || cambioLower.includes('duracion')) return 'resize';
    return 'actualizacion';
  };

  const historialFiltrado = useMemo(() => {
    let filtrado = historial;

    if (filtroTipoEvento !== 'todos') {
      filtrado = filtrado.filter(h => h.tipoEvento === filtroTipoEvento);
    }

    return filtrado;
  }, [historial, filtroTipoEvento]);

  const totalPaginas = Math.ceil(historialFiltrado.length / REGISTROS_POR_PAGINA);
  const historialPaginado = useMemo(() => {
    const inicio = (paginaActual - 1) * REGISTROS_POR_PAGINA;
    const fin = inicio + REGISTROS_POR_PAGINA;
    return historialFiltrado.slice(inicio, fin);
  }, [historialFiltrado, paginaActual]);

  const getIconoTipoEvento = (tipo: HistorialCambio['tipoEvento']) => {
    switch (tipo) {
      case 'creacion':
        return <Calendar className="w-4 h-4 text-green-600" />;
      case 'actualizacion':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'cancelacion':
        return <X className="w-4 h-4 text-red-600" />;
      case 'confirmacion':
        return <AlertCircle className="w-4 h-4 text-green-600" />;
      case 'reprogramacion':
        return <ArrowRightLeft className="w-4 h-4 text-orange-600" />;
      case 'drag_drop':
        return <MousePointerClick className="w-4 h-4 text-purple-600" />;
      case 'api':
        return <Database className="w-4 h-4 text-indigo-600" />;
      case 'resize':
        return <Clock className="w-4 h-4 text-cyan-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getColorTipoEvento = (tipo: HistorialCambio['tipoEvento']) => {
    switch (tipo) {
      case 'creacion':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'actualizacion':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'cancelacion':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'confirmacion':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'reprogramacion':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'drag_drop':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'api':
        return 'bg-indigo-50 border-indigo-200 text-indigo-800';
      case 'resize':
        return 'bg-cyan-50 border-cyan-200 text-cyan-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleExportar = async (formato: 'csv' | 'excel') => {
    if (!cita?._id) return;

    setExportando(true);
    try {
      // En producción, esto llamaría a la API real
      const datos = historialFiltrado.map(h => ({
        Fecha: formatearFecha(h.fecha),
        Usuario: h.usuario,
        Evento: h.cambio,
        Tipo: TIPOS_EVENTO.find(t => t.value === h.tipoEvento)?.label || h.tipoEvento,
        Campo: h.detalles?.campo || '',
        ValorAnterior: h.detalles?.valorAnterior || '',
        ValorNuevo: h.detalles?.valorNuevo || '',
        Origen: h.detalles?.origen || '',
        IP: h.detalles?.ipAddress || '',
      }));

      if (formato === 'csv') {
        const headers = Object.keys(datos[0] || {});
        const csvContent = [
          headers.join(','),
          ...datos.map(row => headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `historial-cita-${cita._id}-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
      } else {
        // Para Excel, usar una librería como xlsx o simplemente CSV con extensión .xlsx
        // Por simplicidad, exportamos como CSV pero con extensión .xlsx
        const headers = Object.keys(datos[0] || {});
        const csvContent = [
          headers.join('\t'),
          ...datos.map(row => headers.map(header => row[header as keyof typeof row] || '').join('\t'))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `historial-cita-${cita._id}-${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar el historial');
    } finally {
      setExportando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Historial de Cambios</h2>
              {cita && (
                <p className="text-sm text-gray-600">
                  {cita.paciente.nombre} {cita.paciente.apellidos} - {new Date(cita.fecha_hora_inicio).toLocaleDateString('es-ES')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filtros y Exportación */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filtroTipoEvento}
                onChange={(e) => {
                  setFiltroTipoEvento(e.target.value);
                  setPaginaActual(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {TIPOS_EVENTO.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportar('csv')}
                disabled={exportando || historialFiltrado.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Exportar CSV
              </button>
              <button
                onClick={() => handleExportar('excel')}
                disabled={exportando || historialFiltrado.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Exportar Excel
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando historial...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : historialPaginado.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay registros de historial</p>
            </div>
          ) : (
            <div className="space-y-4">
              {historialPaginado.map((cambio) => (
                <div
                  key={cambio._id}
                  className={`border-l-4 rounded-lg p-4 ${getColorTipoEvento(cambio.tipoEvento)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      {getIconoTipoEvento(cambio.tipoEvento)}
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">{cambio.cambio}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{cambio.usuario}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatearFecha(cambio.fecha)}</span>
                          </div>
                          {cambio.detalles?.origen && (
                            <span className="px-2 py-0.5 bg-white rounded text-xs font-medium">
                              {cambio.detalles.origen === 'drag_drop' ? 'Drag & Drop' : 
                               cambio.detalles.origen === 'api' ? 'API' : 'Formulario'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {cambio.detalles && (cambio.detalles.campo || cambio.detalles.valorAnterior || cambio.detalles.valorNuevo) && (
                    <div className="mt-3 pt-3 border-t border-gray-300 text-xs">
                      {cambio.detalles.campo && (
                        <p className="mb-1">
                          <span className="font-semibold">Campo:</span> {cambio.detalles.campo}
                        </p>
                      )}
                      {cambio.detalles.valorAnterior && (
                        <p className="mb-1">
                          <span className="font-semibold">Valor anterior:</span>{' '}
                          <span className="text-red-700">{String(cambio.detalles.valorAnterior)}</span>
                        </p>
                      )}
                      {cambio.detalles.valorNuevo && (
                        <p className="mb-1">
                          <span className="font-semibold">Valor nuevo:</span>{' '}
                          <span className="text-green-700">{String(cambio.detalles.valorNuevo)}</span>
                        </p>
                      )}
                      {cambio.detalles.ipAddress && (
                        <p className="text-gray-500 mt-2">
                          IP: {cambio.detalles.ipAddress}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {((paginaActual - 1) * REGISTROS_POR_PAGINA) + 1} - {Math.min(paginaActual * REGISTROS_POR_PAGINA, historialFiltrado.length)} de {historialFiltrado.length} registros
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm font-medium">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

