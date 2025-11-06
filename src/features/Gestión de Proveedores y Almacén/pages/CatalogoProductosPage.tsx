import { useState, useEffect } from 'react';
import { Package, Plus, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Producto,
  FiltrosBusquedaProductos,
  NuevoProducto,
} from '../api/productosApi';
import BarraBusquedaFiltrosProductos from '../components/BarraBusquedaFiltrosProductos';
import TablaProductos from '../components/TablaProductos';
import FormularioProducto from '../components/FormularioProducto';
import ModalDetalleProducto from '../components/ModalDetalleProducto';

export default function CatalogoProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosBusquedaProductos>({
    page: 1,
    limit: 20,
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [productoDetalle, setProductoDetalle] = useState<Producto | null>(null);
  const [guardando, setGuardando] = useState(false);

  // KPIs de inventario (cliente)
  const valorInventario = productos.reduce((acc, p) => acc + (p.costoUnitario || 0) * (p.stockActual || 0), 0);
  const productosBajoStock = productos.filter((p) => (p.stockActual || 0) <= (p.stockMinimo || 0)).length;
  const productosPorCaducar = productos.filter((p) => {
    const fecha = (p as any).fechaCaducidad ? new Date((p as any).fechaCaducidad) : null;
    if (!fecha) return false;
    const hoy = new Date();
    const en180 = new Date(hoy.getTime() + 180 * 24 * 60 * 60 * 1000);
    return fecha <= en180;
  }).length;

  const exportarCSV = () => {
    const encabezados = [
      'ID',
      'Nombre',
      'SKU',
      'Descripción',
      'Categoría',
      'Proveedor',
      'Costo Unitario',
      'Stock Actual',
      'Stock Mínimo',
      'Unidad',
      'Lote',
      'Fecha Caducidad',
      'Activo',
      'Creado'
    ];
    const filas = productos.map(p => [
      p._id || '',
      p.nombre,
      p.sku || '',
      p.descripcion || '',
      p.categoria || '',
      (p as any).proveedor?.nombreComercial || '',
      (p.costoUnitario ?? '').toString(),
      (p.stockActual ?? '').toString(),
      (p.stockMinimo ?? '').toString(),
      p.unidadMedida || '',
      (p as any).lote || '',
      (p as any).fechaCaducidad || '',
      (p.activo ? 'Sí' : 'No'),
      p.createdAt || ''
    ]);
    const contenido = [encabezados, ...filas]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'catalogo_productos.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos de productos
      const datosFalsos: Producto[] = [
        {
          _id: '1',
          nombre: 'Guantes de Nitrilo Desechables',
          sku: 'GNT-001',
          descripcion: 'Guantes de nitrilo sin polvo, talla M, caja de 100 unidades',
          categoria: 'Consumible',
          proveedorId: '1',
          proveedor: { _id: '1', nombreComercial: 'Dental Supplies Pro' },
          costoUnitario: 12.50,
          stockActual: 450,
          stockMinimo: 200,
          unidadMedida: 'caja',
          lote: 'LOT-2024-001',
          fechaCaducidad: '2025-12-31',
          activo: true,
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          _id: '2',
          nombre: 'Jeringas Desechables 5ml',
          sku: 'JNG-002',
          descripcion: 'Jeringas desechables de 5ml con aguja, estériles',
          categoria: 'Consumible',
          proveedorId: '1',
          proveedor: { _id: '1', nombreComercial: 'Dental Supplies Pro' },
          costoUnitario: 0.35,
          stockActual: 1200,
          stockMinimo: 500,
          unidadMedida: 'unidad',
          lote: 'LOT-2024-002',
          fechaCaducidad: '2026-06-30',
          activo: true,
          createdAt: '2024-01-20T11:00:00Z',
        },
        {
          _id: '3',
          nombre: 'Anestesia Local Lidocaína 2%',
          sku: 'ANT-003',
          descripcion: 'Anestesia local lidocaína al 2% con epinefrina, frasco de 50ml',
          categoria: 'Consumible',
          proveedorId: '2',
          proveedor: { _id: '2', nombreComercial: 'MedTech Solutions' },
          costoUnitario: 18.75,
          stockActual: 85,
          stockMinimo: 50,
          unidadMedida: 'unidad',
          lote: 'LOT-2024-003',
          fechaCaducidad: '2025-03-31',
          activo: true,
          createdAt: '2024-02-01T09:30:00Z',
        },
        {
          _id: '4',
          nombre: 'Fresas Dentales Carburo de Tungsteno',
          sku: 'FRD-004',
          descripcion: 'Set de fresas dentales de carburo de tungsteno, 10 unidades',
          categoria: 'Instrumental',
          proveedorId: '3',
          proveedor: { _id: '3', nombreComercial: 'Dental Care Plus' },
          costoUnitario: 45.00,
          stockActual: 35,
          stockMinimo: 20,
          unidadMedida: 'paquete',
          activo: true,
          createdAt: '2024-02-10T14:00:00Z',
        },
        {
          _id: '5',
          nombre: 'Sillón Dental Eléctrico Premium',
          sku: 'SIL-005',
          descripcion: 'Sillón dental eléctrico con sistema de aspiración integrado',
          categoria: 'Equipamiento',
          proveedorId: '4',
          proveedor: { _id: '4', nombreComercial: 'ProDental Equipment' },
          costoUnitario: 3500.00,
          stockActual: 3,
          stockMinimo: 2,
          unidadMedida: 'unidad',
          activo: true,
          createdAt: '2024-01-05T08:00:00Z',
        },
        {
          _id: '6',
          nombre: 'Composite Resina Dental A2',
          sku: 'COM-006',
          descripcion: 'Composite de resina dental color A2, 4g',
          categoria: 'Consumible',
          proveedorId: '5',
          proveedor: { _id: '5', nombreComercial: 'BioDental Materials' },
          costoUnitario: 28.50,
          stockActual: 180,
          stockMinimo: 100,
          unidadMedida: 'unidad',
          lote: 'LOT-2024-004',
          fechaCaducidad: '2025-09-30',
          activo: true,
          createdAt: '2024-02-15T10:15:00Z',
        },
        {
          _id: '7',
          nombre: 'Lámpara de Polimerización LED',
          sku: 'LAM-007',
          descripcion: 'Lámpara LED para polimerización de composites, 1200mW/cm²',
          categoria: 'Equipamiento',
          proveedorId: '4',
          proveedor: { _id: '4', nombreComercial: 'ProDental Equipment' },
          costoUnitario: 320.00,
          stockActual: 8,
          stockMinimo: 5,
          unidadMedida: 'unidad',
          activo: true,
          createdAt: '2024-02-20T13:45:00Z',
        },
        {
          _id: '8',
          nombre: 'Mascarillas Quirúrgicas FFP2',
          sku: 'MAS-008',
          descripcion: 'Mascarillas quirúrgicas FFP2, caja de 50 unidades',
          categoria: 'Consumible',
          proveedorId: '1',
          proveedor: { _id: '1', nombreComercial: 'Dental Supplies Pro' },
          costoUnitario: 15.00,
          stockActual: 320,
          stockMinimo: 150,
          unidadMedida: 'caja',
          lote: 'LOT-2024-005',
          fechaCaducidad: '2026-12-31',
          activo: true,
          createdAt: '2024-03-01T09:00:00Z',
        },
        {
          _id: '9',
          nombre: 'Bisturí Desechable Nº15',
          sku: 'BIS-009',
          descripcion: 'Bisturí desechable con hoja Nº15, estéril',
          categoria: 'Instrumental',
          proveedorId: '8',
          proveedor: { _id: '8', nombreComercial: 'Premium Dental Tools' },
          costoUnitario: 0.85,
          stockActual: 250,
          stockMinimo: 100,
          unidadMedida: 'unidad',
          activo: true,
          createdAt: '2024-02-25T11:30:00Z',
        },
        {
          _id: '10',
          nombre: 'Papel de Oficina A4',
          sku: 'PAP-010',
          descripcion: 'Resma de papel A4 80gr, 500 hojas',
          categoria: 'Oficina',
          proveedorId: '3',
          proveedor: { _id: '3', nombreComercial: 'Dental Care Plus' },
          costoUnitario: 4.50,
          stockActual: 45,
          stockMinimo: 20,
          unidadMedida: 'paquete',
          activo: true,
          createdAt: '2024-03-05T10:00:00Z',
        },
        {
          _id: '11',
          nombre: 'Radiografía Digital Sensor',
          sku: 'RAD-011',
          descripcion: 'Sensor de radiografía digital intraoral, tamaño 2',
          categoria: 'Equipamiento',
          proveedorId: '2',
          proveedor: { _id: '2', nombreComercial: 'MedTech Solutions' },
          costoUnitario: 1200.00,
          stockActual: 2,
          stockMinimo: 1,
          unidadMedida: 'unidad',
          activo: true,
          createdAt: '2024-01-30T15:00:00Z',
        },
        {
          _id: '12',
          nombre: 'Algodón Estéril',
          sku: 'ALG-012',
          descripcion: 'Algodón estéril, paquete de 100 unidades',
          categoria: 'Consumible',
          proveedorId: '1',
          proveedor: { _id: '1', nombreComercial: 'Dental Supplies Pro' },
          costoUnitario: 8.25,
          stockActual: 95,
          stockMinimo: 50,
          unidadMedida: 'paquete',
          lote: 'LOT-2024-006',
          fechaCaducidad: '2025-08-31',
          activo: true,
          createdAt: '2024-02-28T12:00:00Z',
        },
        {
          _id: '13',
          nombre: 'Composite Resina Dental B2',
          sku: 'COM-013',
          descripcion: 'Composite de resina dental color B2, 4g',
          categoria: 'Consumible',
          proveedorId: '5',
          proveedor: { _id: '5', nombreComercial: 'BioDental Materials' },
          costoUnitario: 28.50,
          stockActual: 120,
          stockMinimo: 80,
          unidadMedida: 'unidad',
          lote: 'LOT-2024-007',
          fechaCaducidad: '2025-10-31',
          activo: true,
          createdAt: '2024-03-02T10:00:00Z',
        },
        {
          _id: '14',
          nombre: 'Gel Desinfectante Manos',
          sku: 'GEL-014',
          descripcion: 'Gel desinfectante para manos, botella de 500ml',
          categoria: 'Consumible',
          proveedorId: '10',
          proveedor: { _id: '10', nombreComercial: 'SteriDent Solutions' },
          costoUnitario: 6.75,
          stockActual: 85,
          stockMinimo: 40,
          unidadMedida: 'unidad',
          lote: 'LOT-2024-008',
          fechaCaducidad: '2026-12-31',
          activo: true,
          createdAt: '2024-03-05T09:30:00Z',
        },
        {
          _id: '15',
          nombre: 'Brackets Metálicos Estándar',
          sku: 'BRK-015',
          descripcion: 'Set de brackets metálicos estándar, 20 unidades',
          categoria: 'Consumible',
          proveedorId: '12',
          proveedor: { _id: '12', nombreComercial: 'OrthoMaterials' },
          costoUnitario: 125.00,
          stockActual: 15,
          stockMinimo: 10,
          unidadMedida: 'set',
          activo: true,
          createdAt: '2024-02-20T14:00:00Z',
        },
        {
          _id: '16',
          nombre: 'Arco de Ortodoncia 0.014',
          sku: 'ARCO-016',
          descripcion: 'Arco de ortodoncia de níquel-titanio 0.014 pulgadas',
          categoria: 'Consumible',
          proveedorId: '12',
          proveedor: { _id: '12', nombreComercial: 'OrthoMaterials' },
          costoUnitario: 18.50,
          stockActual: 45,
          stockMinimo: 25,
          unidadMedida: 'unidad',
          activo: true,
          createdAt: '2024-02-22T11:15:00Z',
        },
        {
          _id: '17',
          nombre: 'Solución Esterilizante Glutaraldehído',
          sku: 'EST-017',
          descripcion: 'Solución esterilizante glutaraldehído al 2%, frasco de 1L',
          categoria: 'Consumible',
          proveedorId: '10',
          proveedor: { _id: '10', nombreComercial: 'SteriDent Solutions' },
          costoUnitario: 24.90,
          stockActual: 30,
          stockMinimo: 15,
          unidadMedida: 'unidad',
          lote: 'LOT-2024-009',
          fechaCaducidad: '2025-06-30',
          activo: true,
          createdAt: '2024-03-01T08:45:00Z',
        },
        {
          _id: '18',
          nombre: 'Turbina Dental de Alta Velocidad',
          sku: 'TUR-018',
          descripcion: 'Turbina dental de alta velocidad con sistema de refrigeración',
          categoria: 'Equipamiento',
          proveedorId: '4',
          proveedor: { _id: '4', nombreComercial: 'ProDental Equipment' },
          costoUnitario: 450.00,
          stockActual: 6,
          stockMinimo: 3,
          unidadMedida: 'unidad',
          activo: true,
          createdAt: '2024-01-18T13:20:00Z',
        },
        {
          _id: '19',
          nombre: 'Jeringa de Anestesia Carpule',
          sku: 'JNG-019',
          descripcion: 'Jeringa de anestesia tipo carpule, estéril',
          categoria: 'Instrumental',
          proveedorId: '1',
          proveedor: { _id: '1', nombreComercial: 'Dental Supplies Pro' },
          costoUnitario: 2.25,
          stockActual: 180,
          stockMinimo: 100,
          unidadMedida: 'unidad',
          activo: true,
          createdAt: '2024-02-14T10:30:00Z',
        },
        {
          _id: '20',
          nombre: 'Película Radiográfica Digital',
          sku: 'RAD-020',
          descripcion: 'Película radiográfica digital tamaño 2, caja de 50 unidades',
          categoria: 'Consumible',
          proveedorId: '11',
          proveedor: { _id: '11', nombreComercial: 'Radiología Dental Avanzada' },
          costoUnitario: 85.00,
          stockActual: 12,
          stockMinimo: 8,
          unidadMedida: 'caja',
          lote: 'LOT-2024-010',
          fechaCaducidad: '2025-12-31',
          activo: true,
          createdAt: '2024-02-25T15:00:00Z',
        },
        {
          _id: '21',
          nombre: 'Cemento de Ionómero de Vidrio',
          sku: 'CEM-021',
          descripcion: 'Cemento de ionómero de vidrio, 25g',
          categoria: 'Consumible',
          proveedorId: '5',
          proveedor: { _id: '5', nombreComercial: 'BioDental Materials' },
          costoUnitario: 32.75,
          stockActual: 28,
          stockMinimo: 15,
          unidadMedida: 'unidad',
          lote: 'LOT-2024-011',
          fechaCaducidad: '2025-09-30',
          activo: true,
          createdAt: '2024-03-08T09:00:00Z',
        },
        {
          _id: '22',
          nombre: 'Sellador de Fosas y Fisuras',
          sku: 'SEL-022',
          descripcion: 'Sellador de fosas y fisuras transparente, 5ml',
          categoria: 'Consumible',
          proveedorId: '5',
          proveedor: { _id: '5', nombreComercial: 'BioDental Materials' },
          costoUnitario: 15.50,
          stockActual: 65,
          stockMinimo: 30,
          unidadMedida: 'unidad',
          lote: 'LOT-2024-012',
          fechaCaducidad: '2025-11-30',
          activo: true,
          createdAt: '2024-03-10T11:45:00Z',
        },
        {
          _id: '23',
          nombre: 'Pinza de Extracción Universal',
          sku: 'PIN-023',
          descripcion: 'Pinza de extracción dental universal, acero inoxidable',
          categoria: 'Instrumental',
          proveedorId: '8',
          proveedor: { _id: '8', nombreComercial: 'Premium Dental Tools' },
          costoUnitario: 35.00,
          stockActual: 22,
          stockMinimo: 12,
          unidadMedida: 'unidad',
          activo: true,
          createdAt: '2024-02-16T14:30:00Z',
        },
        {
          _id: '24',
          nombre: 'Sistema de Aspiración Portátil',
          sku: 'ASP-024',
          descripcion: 'Sistema de aspiración portátil para consultorio dental',
          categoria: 'Equipamiento',
          proveedorId: '4',
          proveedor: { _id: '4', nombreComercial: 'ProDental Equipment' },
          costoUnitario: 680.00,
          stockActual: 4,
          stockMinimo: 2,
          unidadMedida: 'unidad',
          activo: true,
          createdAt: '2024-01-22T10:15:00Z',
        },
      ];

      // Aplicar filtros
      let productosFiltrados = [...datosFalsos];
      
      if (filtros.search) {
        const searchLower = filtros.search.toLowerCase();
        productosFiltrados = productosFiltrados.filter(p => 
          p.nombre.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          p.descripcion?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filtros.categoria) {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === filtros.categoria);
      }
      
      if (filtros.proveedor) {
        productosFiltrados = productosFiltrados.filter(p => p.proveedorId === filtros.proveedor);
      }

      // Paginación
      const page = filtros.page || 1;
      const limit = filtros.limit || 20;
      const total = productosFiltrados.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const productosPaginados = productosFiltrados.slice(startIndex, endIndex);

      setProductos(productosPaginados);
      setPaginacion({
        total,
        page,
        limit,
        totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el catálogo de productos');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosBusquedaProductos) => {
    setFiltros((prev) => ({
      ...prev,
      ...nuevosFiltros,
    }));
  };

  const handlePageChange = (page: number) => {
    setFiltros((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleNuevoProducto = () => {
    setProductoEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarProducto = (producto: Producto) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const handleGuardarProducto = async (datos: NuevoProducto) => {
    setGuardando(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (productoEditando && productoEditando._id) {
        // Simular actualización
        console.log('Actualizando producto:', productoEditando._id, datos);
      } else {
        // Simular creación
        console.log('Creando nuevo producto:', datos);
      }
      
      setMostrarFormulario(false);
      setProductoEditando(null);
      await cargarProductos();
    } catch (err) {
      throw err; // Re-lanzar para que el formulario lo maneje
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
  };

  const handleEliminarProducto = async (productoId: string) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simular eliminación
      console.log('Eliminando producto:', productoId);
      await cargarProductos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el producto');
    }
  };

  const handleVerDetalle = (producto: Producto) => {
    setProductoDetalle(producto);
  };

  const handleCerrarDetalle = () => {
    setProductoDetalle(null);
  };

  const handleEditarDesdeDetalle = () => {
    if (productoDetalle) {
      setProductoEditando(productoDetalle);
      setProductoDetalle(null);
      setMostrarFormulario(true);
    }
  };

  return (
    <div className="p-6">
      {/* Header con botón de nuevo producto */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{productos.length}</span> productos en esta página
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportarCSV}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Exportar CSV
            </button>
            <button
              onClick={handleNuevoProducto}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Añadir Producto</span>
            </button>
          </div>
        </div>

        {/* KPIs de inventario */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Valor total inventario</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">${valorInventario.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Bajo stock</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{productosBajoStock}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Por caducar (≤ 180 días)</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{productosPorCaducar}</div>
          </div>
        </div>
      </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Filtros de búsqueda */}
        <BarraBusquedaFiltrosProductos filtros={filtros} onFiltrosChange={handleFiltrosChange} />

        {/* Tabla de productos */}
        <TablaProductos
          productos={productos}
          loading={loading}
          onEditar={handleEditarProducto}
          onVerDetalle={handleVerDetalle}
          onEliminar={handleEliminarProducto}
        />

        {/* Paginación */}
        {paginacion.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-700">
              Mostrando {((filtros.page || 1) - 1) * (filtros.limit || 20) + 1} a{' '}
              {Math.min((filtros.page || 1) * (filtros.limit || 20), paginacion.total)} de{' '}
              {paginacion.total} productos
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange((filtros.page || 1) - 1)}
                disabled={filtros.page === 1 || loading}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-gray-700">
                Página {filtros.page || 1} de {paginacion.totalPages}
              </span>
              <button
                onClick={() => handlePageChange((filtros.page || 1) + 1)}
                disabled={(filtros.page || 1) >= paginacion.totalPages || loading}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal de formulario */}
        {mostrarFormulario && (
          <FormularioProducto
            producto={productoEditando || undefined}
            onGuardar={handleGuardarProducto}
            onCancelar={handleCancelarFormulario}
            loading={guardando}
          />
        )}

        {/* Modal de detalle */}
        {productoDetalle && (
          <ModalDetalleProducto
            producto={productoDetalle}
            onCerrar={handleCerrarDetalle}
            onEditar={handleEditarDesdeDetalle}
          />
        )}
    </div>
  );
}

