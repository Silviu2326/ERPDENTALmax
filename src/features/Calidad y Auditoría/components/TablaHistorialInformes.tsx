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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
        <span className="text-gray-600">Cargando historial de informes...</span>
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
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {informes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No hay informes generados aún</p>
          <p className="text-sm text-gray-500 mt-1">
            Los informes que generes aparecerán aquí
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
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
                            className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {descargandoId === informe.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Descargando...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-1" />
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
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPaginacion({ ...paginacion, page: paginacion.page - 1 })}
                  disabled={paginacion.page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPaginacion({ ...paginacion, page: paginacion.page + 1 })}
                  disabled={paginacion.page >= totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPaginacion({ ...paginacion, page: paginacion.page - 1 })}
                      disabled={paginacion.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setPaginacion({ ...paginacion, page: paginacion.page + 1 })}
                      disabled={paginacion.page >= totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}


