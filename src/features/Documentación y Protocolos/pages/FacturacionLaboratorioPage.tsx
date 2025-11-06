import { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw, FileText } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Facturación de Laboratorio</h1>
                <p className="text-gray-600 mt-1">
                  Gestiona las facturas de los laboratorios protésicos externos
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFacturaSeleccionada(null);
                setVista('nueva');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Añadir Factura</span>
            </button>
          </div>
        </div>

        {/* Panel de Resumen */}
        <div className="mb-6">
          <PanelResumenFacturacionLab facturas={facturas} loading={loading} />
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtros de Búsqueda</span>
            </h2>
            <button
              onClick={handleLimpiarFiltros}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Limpiar filtros
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Laboratorio (ID)
              </label>
              <input
                type="text"
                value={laboratorioFiltro}
                onChange={(e) => setLaboratorioFiltro(e.target.value)}
                placeholder="ID del laboratorio"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Pagada">Pagada</option>
                <option value="Vencida">Vencida</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Desde</label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Hasta</label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end space-x-3">
            <button
              onClick={handleAplicarFiltros}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Aplicar Filtros</span>
            </button>
            <button
              onClick={cargarFacturas}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
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
          <div className="mt-6 flex items-center justify-center space-x-2">
            <button
              onClick={() => handleCambiarPagina(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handleCambiarPagina(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}

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
    </div>
  );
}


