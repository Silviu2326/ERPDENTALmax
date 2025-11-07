import { useState, useEffect } from 'react';
import { Download, FileText, Clock, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import {
  listarInformesGenerados,
  consultarEstadoInforme,
  descargarInforme,
  InformeGenerado,
  PaginacionInformes,
} from '../api/informesAcreditacionApi';

interface TablaHistorialInformesProps {
  onRefresh?: () => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function TablaHistorialInformes({
  onRefresh,
  autoRefresh = false,
  refreshInterval = 5000,
}: TablaHistorialInformesProps) {
  const [informes, setInformes] = useState<InformeGenerado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginacion, setPaginacion] = useState<PaginacionInformes>({
    page: 1,
    limit: 10,
    sortBy: 'fechaGeneracion',
  });
  const [totalPages, setTotalPages] = useState(1);
  const [descargandoId, setDescargandoId] = useState<string | null>(null);
  const [estadosProcesando, setEstadosProcesando] = useState<Set<string>>(new Set());

  useEffect(() => {
    cargarInformes();
  }, [paginacion]);

  useEffect(() => {
    if (autoRefresh && estadosProcesando.size > 0) {
      const interval = setInterval(() => {
        verificarEstadosProcesando();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, estadosProcesando, refreshInterval]);

  const cargarInformes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listarInformesGenerados(paginacion);
      setInformes(data.informes);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error al cargar informes:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar informes');
    } finally {
      setLoading(false);
    }
  };

  const verificarEstadosProcesando = async () => {
    const informesProcesando = informes.filter(
      (informe) => informe.estado === 'procesando' || informe.estado === 'En proceso'
    );

    if (informesProcesando.length === 0) {
      setEstadosProcesando(new Set());
      return;
    }

    const nuevosEstados = new Set<string>();
    for (const informe of informesProcesando) {
      try {
        // Buscar el jobId en los parámetros del informe
        const jobId = informe.parametros?.jobId || informe.id;
        const estado = await consultarEstadoInforme(jobId);
        
        if (estado.estado === 'completado') {
          // Actualizar el informe localmente
          setInformes((prev) =>
            prev.map((inf) =>
              inf.id === informe.id
                ? { ...inf, estado: 'completado', urlDescarga: estado.urlDescarga || inf.urlDescarga }
                : inf
            )
          );
        } else if (estado.estado === 'error') {
          setInformes((prev) =>
            prev.map((inf) =>
              inf.id === informe.id ? { ...inf, estado: 'error' } : inf
            )
          );
        } else {
          nuevosEstados.add(informe.id);
        }
      } catch (err) {
        console.error(`Error al verificar estado del informe ${informe.id}:`, err);
      }
    }

    setEstadosProcesando(nuevosEstados);
    if (nuevosEstados.size === 0) {
      cargarInformes(); // Recargar para obtener datos actualizados
    }
  };

  const handleDescargar = async (informe: InformeGenerado) => {
    if (!informe.urlDescarga) {
      setError('El informe aún no está disponible para descarga');
      return;
    }

    try {
      setDescargandoId(informe.id);
      await descargarInforme(informe.urlDescarga, `${informe.nombreInforme}.pdf`);
    } catch (err) {
      console.error('Error al descargar informe:', err);
      setError(err instanceof Error ? err.message : 'Error al descargar el informe');
    } finally {
      setDescargandoId(null);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('completado') || estadoLower === 'completado') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completado
        </span>
      );
    } else if (estadoLower.includes('procesando') || estadoLower.includes('en proceso')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Procesando
        </span>
      );
    } else if (estadoLower.includes('error') || estadoLower === 'error') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Error
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <Clock className="w-3 h-3 mr-1" />
        {estado}
      </span>
    );
  };

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(fecha);
  };

  if (loading && informes.length === 0) {
    return (
      <div className="p-8 text-center bg-white shadow-sm rounded-xl">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando historial de informes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Historial de Informes Generados</h3>
        <button
          onClick={() => {
            cargarInformes();
            onRefresh?.();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {informes.length === 0 ? (
        <div className="p-8 text-center bg-white shadow-sm rounded-xl">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay informes generados</h3>
          <p className="text-gray-600 mb-4">
            Los informes que generes aparecerán aquí
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre del Informe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Generación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {informes.map((informe) => (
                  <tr key={informe.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {informe.nombreInforme}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatearFecha(informe.fechaGeneracion)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEstadoBadge(informe.estado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {informe.urlDescarga && (
                        informe.estado.toLowerCase().includes('completado') ||
                        informe.estado.toLowerCase() === 'completado' ? (
                          <button
                            onClick={() => handleDescargar(informe)}
                            disabled={descargandoId === informe.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {descargandoId === informe.id ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Descargando...
                              </>
                            ) : (
                              <>
                                <Download size={16} />
                                Descargar
                              </>
                            )}
                          </button>
                        ) : null
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="p-4 bg-white shadow-sm rounded-xl">
              <div className="flex justify-center items-center gap-2">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPaginacion({ ...paginacion, page: paginacion.page - 1 })}
                    disabled={paginacion.page === 1}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPaginacion({ ...paginacion, page: paginacion.page + 1 })}
                    disabled={paginacion.page >= totalPages}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando página <span className="font-medium">{paginacion.page}</span> de{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-xl -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPaginacion({ ...paginacion, page: paginacion.page - 1 })}
                        disabled={paginacion.page === 1}
                        className="relative inline-flex items-center px-4 py-2 rounded-l-xl border border-slate-300 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => setPaginacion({ ...paginacion, page: paginacion.page + 1 })}
                        disabled={paginacion.page >= totalPages}
                        className="relative inline-flex items-center px-4 py-2 rounded-r-xl border border-slate-300 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}



