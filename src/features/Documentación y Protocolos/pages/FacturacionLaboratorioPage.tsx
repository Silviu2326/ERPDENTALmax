import { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw, FileText, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  obtenerFacturasLaboratorio,
  obtenerFacturaLaboratorioPorId,
  crearFacturaLaboratorio,
  actualizarFacturaLaboratorio,
  eliminarFacturaLaboratorio,
  FacturaLaboratorio,
  NuevaFacturaLaboratorio,
  FiltrosFacturasLaboratorio,
} from '../api/facturacionLaboratorioApi';
import TablaFacturasLaboratorio from '../components/TablaFacturasLaboratorio';
import FormularioFacturaLaboratorio from '../components/FormularioFacturaLaboratorio';
import ModalDetalleFactura from '../components/ModalDetalleFactura';
import PanelResumenFacturacionLab from '../components/PanelResumenFacturacionLab';

type Vista = 'lista' | 'nueva' | 'editar';

export default function FacturacionLaboratorioPage() {
  const [vista, setVista] = useState<Vista>('lista');
  const [facturas, setFacturas] = useState<FacturaLaboratorio[]>([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<FacturaLaboratorio | null>(null);
  const [facturaDetalle, setFacturaDetalle] = useState<FacturaLaboratorio | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtros, setFiltros] = useState<FiltrosFacturasLaboratorio>({
    page: 1,
    limit: 20,
  });
  const [laboratorioFiltro, setLaboratorioFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');

  // Paginación
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    cargarFacturas();
  }, [filtros]);

  const cargarFacturas = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta = await obtenerFacturasLaboratorio(filtros);
      setFacturas(respuesta.facturas);
      setTotalPages(respuesta.totalPages);
      setCurrentPage(respuesta.page);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las facturas');
      console.error('Error al cargar facturas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAplicarFiltros = () => {
    const nuevosFiltros: FiltrosFacturasLaboratorio = {
      page: 1,
      limit: 20,
    };

    if (laboratorioFiltro) nuevosFiltros.laboratorioId = laboratorioFiltro;
    if (estadoFiltro) nuevosFiltros.estado = estadoFiltro as any;
    if (fechaDesde) nuevosFiltros.fechaDesde = fechaDesde;
    if (fechaHasta) nuevosFiltros.fechaHasta = fechaHasta;

    setFiltros(nuevosFiltros);
    setCurrentPage(1);
  };

  const handleLimpiarFiltros = () => {
    setLaboratorioFiltro('');
    setEstadoFiltro('');
    setFechaDesde('');
    setFechaHasta('');
    const filtrosLimpiados: FiltrosFacturasLaboratorio = {
      page: 1,
      limit: 20,
    };
    setFiltros(filtrosLimpiados);
    setCurrentPage(1);
  };

  const handleVerDetalle = async (facturaId: string) => {
    try {
      const factura = await obtenerFacturaLaboratorioPorId(facturaId);
      setFacturaDetalle(factura);
      setMostrarModalDetalle(true);
    } catch (err) {
      console.error('Error al cargar detalle:', err);
      alert('Error al cargar los detalles de la factura');
    }
  };

  const handleEditar = async (facturaId: string) => {
    try {
      const factura = await obtenerFacturaLaboratorioPorId(facturaId);
      setFacturaSeleccionada(factura);
      setVista('editar');
    } catch (err) {
      console.error('Error al cargar factura para editar:', err);
      alert('Error al cargar la factura');
    }
  };

  const handleEliminar = async (facturaId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta factura?')) {
      return;
    }

    try {
      await eliminarFacturaLaboratorio(facturaId);
      alert('Factura eliminada correctamente');
      cargarFacturas();
    } catch (err) {
      console.error('Error al eliminar factura:', err);
      alert('Error al eliminar la factura');
    }
  };

  const handleGuardar = async (factura: NuevaFacturaLaboratorio) => {
    try {
      if (facturaSeleccionada?._id) {
        // Actualizar
        await actualizarFacturaLaboratorio(facturaSeleccionada._id, factura);
        alert('Factura actualizada correctamente');
      } else {
        // Crear
        await crearFacturaLaboratorio(factura);
        alert('Factura creada correctamente');
      }
      setVista('lista');
      setFacturaSeleccionada(null);
      cargarFacturas();
    } catch (err: any) {
      throw new Error(err.message || 'Error al guardar la factura');
    }
  };

  const handleMarcarPagada = async () => {
    if (!facturaDetalle?._id) return;

    try {
      await actualizarFacturaLaboratorio(facturaDetalle._id, {
        estado: 'Pagada',
        fechaPago: new Date().toISOString(),
      });
      alert('Factura marcada como pagada');
      setMostrarModalDetalle(false);
      setFacturaDetalle(null);
      cargarFacturas();
    } catch (err) {
      console.error('Error al marcar como pagada:', err);
      alert('Error al actualizar el estado de la factura');
    }
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setFiltros({ ...filtros, page: nuevaPagina });
    setCurrentPage(nuevaPagina);
  };

  if (vista === 'nueva' || vista === 'editar') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <FormularioFacturaLaboratorio
            factura={facturaSeleccionada || undefined}
            onGuardar={handleGuardar}
            onCancelar={() => {
              setVista('lista');
              setFacturaSeleccionada(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Facturación de Laboratorio
                  </h1>
                  <p className="text-gray-600">
                    Gestiona las facturas de los laboratorios protésicos externos
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFacturaSeleccionada(null);
                  setVista('nueva');
                }}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <Plus size={20} />
                <span>Añadir Factura</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Panel de Resumen */}
          <PanelResumenFacturacionLab facturas={facturas} loading={loading} />

          {/* Filtros */}
          <div className="bg-white shadow-sm rounded-lg p-0">
            <div className="px-4 py-3">
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={laboratorioFiltro}
                      onChange={(e) => setLaboratorioFiltro(e.target.value)}
                      placeholder="Buscar por ID de laboratorio..."
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                    />
                  </div>
                  <button
                    onClick={handleAplicarFiltros}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  >
                    <Search size={18} />
                    <span>Buscar</span>
                  </button>
                  {(laboratorioFiltro || estadoFiltro || fechaDesde || fechaHasta) && (
                    <button
                      onClick={handleLimpiarFiltros}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Filter size={16} className="inline mr-1" />
                      Estado
                    </label>
                    <select
                      value={estadoFiltro}
                      onChange={(e) => setEstadoFiltro(e.target.value)}
                      className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    >
                      <option value="">Todos</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagada">Pagada</option>
                      <option value="Vencida">Vencida</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fecha Desde
                    </label>
                    <input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fecha Hasta
                    </label>
                    <input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    />
                  </div>
                </div>
                {(laboratorioFiltro || estadoFiltro || fechaDesde || fechaHasta) && (
                  <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                    <span>{facturas.length} resultados encontrados</span>
                    <span>
                      {[laboratorioFiltro, estadoFiltro, fechaDesde, fechaHasta].filter(Boolean).length} filtros aplicados
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-white shadow-sm rounded-lg p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={cargarFacturas}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <RefreshCw size={18} />
                <span>Reintentar</span>
              </button>
            </div>
          )}

          {/* Tabla de Facturas */}
          <TablaFacturasLaboratorio
            facturas={facturas}
            loading={loading}
            onVerDetalle={handleVerDetalle}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-white shadow-sm rounded-lg p-4">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handleCambiarPagina(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                  <span>Anterior</span>
                </button>
                <span className="px-4 py-2 text-sm text-slate-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => handleCambiarPagina(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Siguiente</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle */}
      <ModalDetalleFactura
        factura={facturaDetalle}
        isOpen={mostrarModalDetalle}
        onClose={() => {
          setMostrarModalDetalle(false);
          setFacturaDetalle(null);
        }}
        onEditar={() => {
          if (facturaDetalle?._id) {
            setMostrarModalDetalle(false);
            handleEditar(facturaDetalle._id);
          }
        }}
        onMarcarPagada={handleMarcarPagada}
      />
    </div>
  );
}



