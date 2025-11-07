import { useState, useEffect } from 'react';
import { History, Download, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  obtenerTodosLosPagos, 
  obtenerPagosPorPacientePaginados,
  FiltrosPagos, 
  PagosPaginados,
  Pago 
} from '../api/pagosApi';
import HistorialPagosTable from '../components/HistorialPagosTable';
import FiltrosHistorialPagos from '../components/FiltrosHistorialPagos';
import ModalDetallePago from '../components/ModalDetallePago';

interface HistorialPagosPageProps {
  pacienteId?: string;
  onVolver?: () => void;
}

export default function HistorialPagosPage({ pacienteId, onVolver }: HistorialPagosPageProps = {}) {
  const { user } = useAuth();
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  // Determinar si es vista administrativa o de paciente
  const esVistaAdministrativa = !pacienteId && (user?.role === 'contable' || user?.role === 'recepcion');

  const [filtros, setFiltros] = useState<FiltrosPagos>({
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    cargarPagos();
  }, [filtros, pacienteId]);

  const cargarPagos = async () => {
    setLoading(true);
    setError(null);

    try {
      let resultado: PagosPaginados;

      if (pacienteId) {
        // Vista de paciente específico
        resultado = await obtenerPagosPorPacientePaginados(pacienteId, filtros);
      } else if (esVistaAdministrativa) {
        // Vista administrativa global
        resultado = await obtenerTodosLosPagos(filtros);
      } else {
        // Si el usuario es paciente, solo puede ver sus propios pagos
        if (user?.pacienteId) {
          resultado = await obtenerPagosPorPacientePaginados(user.pacienteId, filtros);
        } else {
          throw new Error('No se pudo identificar el paciente');
        }
      }

      setPagos(resultado.data);
      setPaginacion({
        page: resultado.page,
        limit: resultado.limit,
        total: resultado.total,
        totalPages: resultado.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial de pagos');
      setPagos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = (pago: Pago) => {
    setPagoSeleccionado(pago);
    setMostrarModal(true);
  };

  const handleGenerarRecibo = async (pagoId: string) => {
    try {
      const { generarReciboPago } = await import('../api/pagosApi');
      const blob = await generarReciboPago(pagoId);
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo-pago-${pagoId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar recibo:', error);
      alert('Error al generar el recibo. Por favor, inténtalo de nuevo.');
    }
  };

  const handlePageChange = (nuevaPagina: number) => {
    setFiltros({ ...filtros, page: nuevaPagina });
    // Scroll al inicio de la tabla
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportarCSV = () => {
    // Crear CSV con los pagos actuales
    const headers = ['Fecha', 'Paciente', 'Monto', 'Método', 'Estado', 'Tratamientos'];
    const rows = pagos.map(pago => [
      new Date(pago.fecha).toLocaleDateString('es-ES'),
      `${pago.paciente.nombre} ${pago.paciente.apellidos}`,
      `${pago.monto} ${pago.moneda}`,
      pago.metodo,
      pago.estado,
      pago.tratamientos?.map(t => t.nombre).join('; ') || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial-pagos-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    const { page, totalPages } = paginacion;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <History size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Historial de Pagos
                  </h1>
                  <p className="text-gray-600">
                    {pacienteId 
                      ? 'Historial de pagos del paciente'
                      : esVistaAdministrativa 
                      ? 'Vista global de todos los pagos de la clínica'
                      : 'Tu historial de pagos'
                    }
                  </p>
                </div>
              </div>
              {/* Toolbar */}
              <div className="flex items-center gap-2">
                {esVistaAdministrativa && (
                  <button
                    onClick={handleExportarCSV}
                    disabled={pagos.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={20} />
                    <span>Exportar CSV</span>
                  </button>
                )}
                <button
                  onClick={cargarPagos}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  <span>Actualizar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Filtros */}
          <FiltrosHistorialPagos
            filtros={filtros}
            onFiltrosChange={setFiltros}
            mostrarPaciente={esVistaAdministrativa}
            mostrarProfesional={esVistaAdministrativa}
          />

          {/* Error */}
          {error && (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar pagos</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          )}

          {/* Tabla */}
          <HistorialPagosTable
            pagos={pagos}
            loading={loading}
            onVerDetalle={handleVerDetalle}
            onGenerarRecibo={handleGenerarRecibo}
            mostrarPaciente={esVistaAdministrativa}
          />

          {/* Paginación */}
          {paginacion.totalPages > 1 && (
            <div className="bg-white shadow-sm rounded-xl p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} a{' '}
                  {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de {paginacion.total} pagos
                </div>

                <div className="flex items-center gap-2">
                {/* Primera página */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={paginacion.page === 1 || loading}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  aria-label="Primera página"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Página anterior */}
                <button
                  onClick={() => handlePageChange(paginacion.page - 1)}
                  disabled={paginacion.page === 1 || loading}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Números de página */}
                <div className="flex gap-1">
                  {getPageNumbers().map((pageNum, index) => {
                    if (pageNum === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      );
                    }

                    const pageNumber = pageNum as number;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          paginacion.page === pageNumber
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Página siguiente */}
                <button
                  onClick={() => handlePageChange(paginacion.page + 1)}
                  disabled={paginacion.page >= paginacion.totalPages || loading}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Última página */}
                <button
                  onClick={() => handlePageChange(paginacion.totalPages)}
                  disabled={paginacion.page >= paginacion.totalPages || loading}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  aria-label="Última página"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Detalle */}
          <ModalDetallePago
            pago={pagoSeleccionado}
            isOpen={mostrarModal}
            onClose={() => {
              setMostrarModal(false);
              setPagoSeleccionado(null);
            }}
            onReciboGenerado={() => {
              // Opcional: recargar datos después de generar recibo
            }}
          />
        </div>
      </div>
    </div>
  );
}

