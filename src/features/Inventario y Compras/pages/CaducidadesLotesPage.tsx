import { useState, useEffect, useMemo } from 'react';
import { Plus, AlertTriangle, RefreshCw, Calendar, Package, Clock, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  LoteProducto,
  FiltrosLotes,
  obtenerLotes,
  obtenerAlertasCaducidad,
  RespuestaListaLotes,
  AlertasCaducidad,
} from '../api/lotesApi';
import TablaLotesCaducidad from '../components/TablaLotesCaducidad';
import FiltrosCaducidad from '../components/FiltrosCaducidad';
import ModalRegistroLote from '../components/ModalRegistroLote';
import AlertaCaducidadBadge from '../components/AlertaCaducidadBadge';
import MetricCards from '../components/MetricCards';

export default function CaducidadesLotesPage() {
  const [lotes, setLotes] = useState<LoteProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [alertas, setAlertas] = useState<AlertasCaducidad | null>(null);
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filtros, setFiltros] = useState<FiltrosLotes>({
    page: 1,
    limit: 10,
    sortBy: 'fechaCaducidad',
    sortOrder: 'asc',
  });

  // Mock de productos - en producción vendría de una API
  const [productos] = useState([
    { _id: '1', nombre: 'Composite Resina A2', sku: 'COMP-A2' },
    { _id: '2', nombre: 'Anestésico Lidocaína', sku: 'ANES-LID' },
    { _id: '3', nombre: 'Implant Dental', sku: 'IMPL-001' },
  ]);

  useEffect(() => {
    cargarLotes();
    cargarAlertas();
  }, [filtros]);

  const cargarLotes = async () => {
    try {
      setLoading(true);
      setError(null);
      // Datos falsos completos - NO usar API
      const lotesMock: LoteProducto[] = [
        {
          _id: '1',
          producto: { _id: '1', nombre: 'Resina Composite A2', sku: 'COMP-A2-001' },
          numeroLote: 'LOT-2024-001',
          fechaCaducidad: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 50,
          cantidadActual: 45,
          estado: 'Activo',
        },
        {
          _id: '2',
          producto: { _id: '2', nombre: 'Anestésico Lidocaína 2%', sku: 'ANES-LID-002' },
          numeroLote: 'LOT-2024-002',
          fechaCaducidad: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 20,
          cantidadActual: 8,
          estado: 'PorCaducar',
        },
        {
          _id: '3',
          producto: { _id: '3', nombre: 'Gel Desinfectante Clorhexidina', sku: 'GEL-CHX-010' },
          numeroLote: 'LOT-2023-045',
          fechaCaducidad: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 30,
          cantidadActual: 5,
          estado: 'Caducado',
        },
        {
          _id: '4',
          producto: { _id: '4', nombre: 'Cemento de Ionómero de Vidrio', sku: 'CEM-IV-005' },
          numeroLote: 'LOT-2024-003',
          fechaCaducidad: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 40,
          cantidadActual: 32,
          estado: 'Activo',
        },
        {
          _id: '5',
          producto: { _id: '5', nombre: 'Guantes de Nitrilo', sku: 'GUANT-NIT-M' },
          numeroLote: 'LOT-2024-004',
          fechaCaducidad: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 150,
          cantidadActual: 120,
          estado: 'Activo',
        },
        {
          _id: '6',
          producto: { _id: '6', nombre: 'Agujas Desechables 27G', sku: 'AGU-27G-006' },
          numeroLote: 'LOT-2024-005',
          fechaCaducidad: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 25,
          cantidadActual: 15,
          estado: 'PorCaducar',
        },
        {
          _id: '7',
          producto: { _id: '7', nombre: 'Mascarillas Quirúrgicas N95', sku: 'MASC-N95-013' },
          numeroLote: 'LOT-2023-038',
          fechaCaducidad: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 30,
          cantidadActual: 18,
          estado: 'Caducado',
        },
        {
          _id: '8',
          producto: { _id: '8', nombre: 'Hilo Dental Super Floss', sku: 'HILO-SF-008' },
          numeroLote: 'LOT-2024-006',
          fechaCaducidad: new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 100,
          cantidadActual: 85,
          estado: 'Activo',
        },
        {
          _id: '9',
          producto: { _id: '9', nombre: 'Seda Dental', sku: 'SEDA-014' },
          numeroLote: 'LOT-2024-007',
          fechaCaducidad: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 80,
          cantidadActual: 65,
          estado: 'PorCaducar',
        },
        {
          _id: '10',
          producto: { _id: '10', nombre: 'Cofferdam Látex', sku: 'COFF-LAT-015' },
          numeroLote: 'LOT-2024-008',
          fechaCaducidad: new Date(Date.now() + 540 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 30,
          cantidadActual: 7,
          estado: 'Activo',
        },
        {
          _id: '11',
          producto: { _id: '11', nombre: 'Resina Composite B1', sku: 'COMP-B1-016' },
          numeroLote: 'LOT-2024-009',
          fechaCaducidad: new Date(Date.now() + 280 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 35,
          cantidadActual: 28,
          estado: 'Activo',
        },
        {
          _id: '12',
          producto: { _id: '12', nombre: 'Anestésico Articaina 4%', sku: 'ANES-ART-017' },
          numeroLote: 'LOT-2024-010',
          fechaCaducidad: new Date(Date.now() + 190 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 25,
          cantidadActual: 12,
          estado: 'PorCaducar',
        },
        {
          _id: '13',
          producto: { _id: '13', nombre: 'Implante Dental Zirconio', sku: 'IMPL-ZIR-018' },
          numeroLote: 'LOT-2024-011',
          fechaCaducidad: new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 8,
          cantidadActual: 3,
          estado: 'Activo',
        },
        {
          _id: '14',
          producto: { _id: '14', nombre: 'Guantes de Nitrilo Talla L', sku: 'GUANT-NIT-L' },
          numeroLote: 'LOT-2024-012',
          fechaCaducidad: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 120,
          cantidadActual: 95,
          estado: 'Activo',
        },
        {
          _id: '15',
          producto: { _id: '15', nombre: 'Gutapercha', sku: 'GUT-020' },
          numeroLote: 'LOT-2024-013',
          fechaCaducidad: new Date(Date.now() + 1825 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 200,
          cantidadActual: 150,
          estado: 'Activo',
        },
        {
          _id: '16',
          producto: { _id: '16', nombre: 'Limas Endodóncicas', sku: 'LIM-END-021' },
          numeroLote: 'LOT-2024-014',
          fechaCaducidad: new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 15,
          cantidadActual: 10,
          estado: 'Activo',
        },
        {
          _id: '17',
          producto: { _id: '17', nombre: 'Alambre Ortodóncico', sku: 'ALAM-ORT-022' },
          numeroLote: 'LOT-2024-015',
          fechaCaducidad: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 60,
          cantidadActual: 45,
          estado: 'Activo',
        },
        {
          _id: '18',
          producto: { _id: '18', nombre: 'Ligaduras Elásticas', sku: 'LIG-ELAS-023' },
          numeroLote: 'LOT-2024-016',
          fechaCaducidad: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 25,
          cantidadActual: 18,
          estado: 'Activo',
        },
        {
          _id: '19',
          producto: { _id: '19', nombre: 'Curetas Periodontales', sku: 'CUR-PER-024' },
          numeroLote: 'LOT-2024-017',
          fechaCaducidad: new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 12,
          cantidadActual: 8,
          estado: 'Activo',
        },
        {
          _id: '20',
          producto: { _id: '20', nombre: 'Antiséptico Bucal Clorhexidina', sku: 'ANT-BUC-025' },
          numeroLote: 'LOT-2023-050',
          fechaCaducidad: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 35,
          cantidadActual: 8,
          estado: 'Caducado',
        },
        {
          _id: '21',
          producto: { _id: '21', nombre: 'Gasa Estéril', sku: 'GASA-EST-026' },
          numeroLote: 'LOT-2024-018',
          fechaCaducidad: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 50,
          cantidadActual: 35,
          estado: 'PorCaducar',
        },
        {
          _id: '22',
          producto: { _id: '22', nombre: 'Algodón Estéril', sku: 'ALG-EST-027' },
          numeroLote: 'LOT-2024-019',
          fechaCaducidad: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 45,
          cantidadActual: 28,
          estado: 'PorCaducar',
        },
        {
          _id: '23',
          producto: { _id: '23', nombre: 'Gel Blanqueador', sku: 'GEL-BLAN-028' },
          numeroLote: 'LOT-2024-020',
          fechaCaducidad: new Date(Date.now() + 170 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 20,
          cantidadActual: 15,
          estado: 'Activo',
        },
        {
          _id: '24',
          producto: { _id: '24', nombre: 'Férulas Personalizadas', sku: 'FER-PER-029' },
          numeroLote: 'LOT-2024-021',
          fechaCaducidad: new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 15,
          cantidadActual: 12,
          estado: 'Activo',
        },
        {
          _id: '25',
          producto: { _id: '25', nombre: 'Pilar de Cicatrización', sku: 'PIL-CIC-030' },
          numeroLote: 'LOT-2024-022',
          fechaCaducidad: new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000).toISOString(),
          fechaRecepcion: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
          cantidadInicial: 25,
          cantidadActual: 18,
          estado: 'Activo',
        },
      ];

      // Aplicar filtros
      let lotesFiltrados = [...lotesMock];

      if (filtros.productoId) {
        lotesFiltrados = lotesFiltrados.filter((l) => l.producto._id === filtros.productoId);
      }

      if (filtros.estado) {
        lotesFiltrados = lotesFiltrados.filter((l) => l.estado === filtros.estado);
      }

      if (filtros.fechaCaducidadAntes) {
        lotesFiltrados = lotesFiltrados.filter((l) => l.fechaCaducidad <= filtros.fechaCaducidadAntes!);
      }

      if (filtros.fechaCaducidadDespues) {
        lotesFiltrados = lotesFiltrados.filter((l) => l.fechaCaducidad >= filtros.fechaCaducidadDespues!);
      }

      // Ordenar
      if (filtros.sortBy) {
        lotesFiltrados.sort((a, b) => {
          let aVal: any = a[filtros.sortBy as keyof LoteProducto];
          let bVal: any = b[filtros.sortBy as keyof LoteProducto];

          if (filtros.sortBy === 'producto') {
            aVal = a.producto.nombre;
            bVal = b.producto.nombre;
          }

          if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }

          const comparacion = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return filtros.sortOrder === 'desc' ? -comparacion : comparacion;
        });
      }

      // Paginación
      const limit = filtros.limit || 10;
      const page = filtros.page || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      setLotes(lotesFiltrados.slice(startIndex, endIndex));
      setPaginacion({
        page,
        limit,
        total: lotesFiltrados.length,
        totalPages: Math.ceil(lotesFiltrados.length / limit),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los lotes');
    } finally {
      setLoading(false);
    }
  };

  const cargarAlertas = async () => {
    try {
      // Datos falsos completos - NO usar API
      const alertasData: AlertasCaducidad = {
        caducados: [
          {
            _id: '3',
            producto: { _id: '3', nombre: 'Gel Desinfectante Clorhexidina', sku: 'GEL-CHX-010' },
            numeroLote: 'LOT-2023-045',
            fechaCaducidad: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            fechaRecepcion: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
            cantidadInicial: 30,
            cantidadActual: 5,
            estado: 'Caducado',
          },
          {
            _id: '7',
            producto: { _id: '7', nombre: 'Mascarillas Quirúrgicas N95', sku: 'MASC-N95-013' },
            numeroLote: 'LOT-2023-038',
            fechaCaducidad: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            fechaRecepcion: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
            cantidadInicial: 30,
            cantidadActual: 18,
            estado: 'Caducado',
          },
        ],
        porCaducar: [
          {
            _id: '2',
            producto: { _id: '2', nombre: 'Anestésico Lidocaína 2%', sku: 'ANES-LID-002' },
            numeroLote: 'LOT-2024-002',
            fechaCaducidad: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
            fechaRecepcion: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            cantidadInicial: 20,
            cantidadActual: 8,
            estado: 'PorCaducar',
          },
          {
            _id: '6',
            producto: { _id: '6', nombre: 'Agujas Desechables 27G', sku: 'AGU-27G-006' },
            numeroLote: 'LOT-2024-005',
            fechaCaducidad: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            fechaRecepcion: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
            cantidadInicial: 25,
            cantidadActual: 15,
            estado: 'PorCaducar',
          },
          {
            _id: '9',
            producto: { _id: '9', nombre: 'Seda Dental', sku: 'SEDA-014' },
            numeroLote: 'LOT-2024-007',
            fechaCaducidad: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
            fechaRecepcion: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
            cantidadInicial: 80,
            cantidadActual: 65,
            estado: 'PorCaducar',
          },
        ],
      };
      setAlertas(alertasData);
    } catch (err) {
      console.error('Error al cargar alertas:', err);
    }
  };

  const handleLoteCreado = () => {
    cargarLotes();
    cargarAlertas();
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setFiltros((prev) => ({
      ...prev,
      page: nuevaPagina,
    }));
  };

  // Calcular estadísticas de lotes
  const estadisticas = useMemo(() => {
    const activos = lotes.filter(l => l.estado === 'Activo').length;
    const porCaducar = lotes.filter(l => l.estado === 'PorCaducar').length;
    const caducados = lotes.filter(l => l.estado === 'Caducado').length;
    const cantidadTotal = lotes.reduce((sum, l) => sum + l.cantidadActual, 0);
    const cantidadInicialTotal = lotes.reduce((sum, l) => sum + l.cantidadInicial, 0);
    const porcentajeUso = cantidadInicialTotal > 0 
      ? ((cantidadInicialTotal - cantidadTotal) / cantidadInicialTotal) * 100 
      : 0;
    
    // Lotes próximos a caducar (próximos 7 días)
    const hoy = new Date();
    const proximos7Dias = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
    const lotesProximos7Dias = lotes.filter(l => {
      const fechaCad = new Date(l.fechaCaducidad);
      return fechaCad >= hoy && fechaCad <= proximos7Dias;
    }).length;

    // Lotes próximos a caducar (próximos 30 días)
    const proximos30Dias = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);
    const lotesProximos30Dias = lotes.filter(l => {
      const fechaCad = new Date(l.fechaCaducidad);
      return fechaCad >= hoy && fechaCad <= proximos30Dias;
    }).length;

    // Valor total de lotes caducados
    const valorCaducados = lotes
      .filter(l => l.estado === 'Caducado')
      .reduce((sum, l) => {
        // Estimación de valor basado en cantidad (asumiendo costo promedio)
        return sum + (l.cantidadActual * 10); // Valor estimado por unidad
      }, 0);

    // Distribución por producto
    const lotesPorProducto = lotes.reduce((acc, lote) => {
      const productoNombre = lote.producto.nombre;
      if (!acc[productoNombre]) {
        acc[productoNombre] = { total: 0, activos: 0, porCaducar: 0, caducados: 0 };
      }
      acc[productoNombre].total++;
      if (lote.estado === 'Activo') acc[productoNombre].activos++;
      if (lote.estado === 'PorCaducar') acc[productoNombre].porCaducar++;
      if (lote.estado === 'Caducado') acc[productoNombre].caducados++;
      return acc;
    }, {} as Record<string, { total: number; activos: number; porCaducar: number; caducados: number }>);

    // Tiempo promedio hasta caducidad (solo lotes activos)
    const lotesActivos = lotes.filter(l => l.estado === 'Activo' || l.estado === 'PorCaducar');
    const diasPromedioCaducidad = lotesActivos.length > 0
      ? lotesActivos.reduce((sum, l) => {
          const fechaCad = new Date(l.fechaCaducidad);
          const diasRestantes = Math.ceil((fechaCad.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
          return sum + Math.max(0, diasRestantes);
        }, 0) / lotesActivos.length
      : 0;
    
    return {
      activos,
      porCaducar,
      caducados,
      cantidadTotal,
      cantidadInicialTotal,
      porcentajeUso,
      lotesProximos7Dias,
      lotesProximos30Dias,
      valorCaducados,
      lotesPorProducto,
      diasPromedioCaducidad,
    };
  }, [lotes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Package size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Caducidades y Lotes
                  </h1>
                  <p className="text-gray-600">
                    Gestión y monitoreo de lotes de productos con control de caducidades
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMostrarModalRegistro(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
              >
                <Plus size={20} />
                Registrar Nuevo Lote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* KPIs de lotes */}
          <MetricCards
            data={[
              {
                id: 'lotes-activos',
                title: 'Lotes Activos',
                value: estadisticas.activos,
                color: 'success',
              },
              {
                id: 'por-caducar',
                title: 'Por Caducar',
                value: estadisticas.porCaducar,
                color: 'warning',
              },
              {
                id: 'caducados',
                title: 'Caducados',
                value: estadisticas.caducados,
                color: 'danger',
              },
              {
                id: 'stock-total',
                title: 'Stock Total',
                value: estadisticas.cantidadTotal,
                color: 'info',
              },
              {
                id: 'proximos-7-dias',
                title: 'Próximos 7 días',
                value: estadisticas.lotesProximos7Dias,
                color: 'warning',
              },
              {
                id: 'proximos-30-dias',
                title: 'Próximos 30 días',
                value: estadisticas.lotesProximos30Dias,
                color: 'warning',
              },
              {
                id: 'valor-caducado',
                title: 'Valor Caducado',
                value: `$${estadisticas.valorCaducados.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
                color: 'danger',
              },
              {
                id: 'dias-promedio',
                title: 'Días Promedio',
                value: Math.round(estadisticas.diasPromedioCaducidad),
                color: 'info',
              },
            ]}
          />

          {/* Resumen de uso */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Resumen de Inventario</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Cantidad Inicial Total</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.cantidadInicialTotal}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Cantidad Actual Total</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.cantidadTotal}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Porcentaje de Uso</p>
                <p className="text-2xl font-bold text-indigo-600">{estadisticas.porcentajeUso.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Distribución por producto */}
          {Object.keys(estadisticas.lotesPorProducto).length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Lotes por Producto</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(estadisticas.lotesPorProducto)
                  .sort((a, b) => b[1].total - a[1].total)
                  .slice(0, 6)
                  .map(([producto, datos]) => (
                    <div key={producto} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-sm font-medium text-slate-700 mb-3 truncate">{producto}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">{datos.total}</span>
                          <span className="text-xs text-slate-500">Total lotes</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-green-600">Activos: {datos.activos}</span>
                            <span className="text-yellow-600">Por caducar: {datos.porCaducar}</span>
                            <span className="text-red-600">Caducados: {datos.caducados}</span>
                          </div>
                          <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div className="flex h-2">
                              <div
                                className="bg-green-500 h-2"
                                style={{ width: `${(datos.activos / datos.total) * 100}%` }}
                              ></div>
                              <div
                                className="bg-yellow-500 h-2"
                                style={{ width: `${(datos.porCaducar / datos.total) * 100}%` }}
                              ></div>
                              <div
                                className="bg-red-500 h-2"
                                style={{ width: `${(datos.caducados / datos.total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Alertas de Caducidad */}
          {alertas && (alertas.caducados.length > 0 || alertas.porCaducar.length > 0) && (
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-400">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Alertas de Caducidad</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alertas.caducados.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-red-800 mb-1">
                          {alertas.caducados.length} Lote(s) Caducado(s)
                        </p>
                        <div className="space-y-1">
                          {alertas.caducados.slice(0, 3).map((lote) => (
                            <div key={lote._id} className="text-xs text-red-700">
                              • {lote.producto.nombre} - Lote {lote.numeroLote}
                            </div>
                          ))}
                          {alertas.caducados.length > 3 && (
                            <div className="text-xs text-red-600 font-medium">
                              +{alertas.caducados.length - 3} más
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {alertas.porCaducar.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-yellow-800 mb-1">
                          {alertas.porCaducar.length} Lote(s) Por Caducar (próximos 30 días)
                        </p>
                        <div className="space-y-1">
                          {alertas.porCaducar.slice(0, 3).map((lote) => (
                            <div key={lote._id} className="text-xs text-yellow-700">
                              • {lote.producto.nombre} - Lote {lote.numeroLote}
                            </div>
                          ))}
                          {alertas.porCaducar.length > 3 && (
                            <div className="text-xs text-yellow-600 font-medium">
                              +{alertas.porCaducar.length - 3} más
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <FiltrosCaducidad
            filtros={filtros}
            onFiltrosChange={setFiltros}
            productos={productos}
          />

          {/* Error */}
          {error && (
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 flex-1">{error}</p>
                <button
                  onClick={cargarLotes}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* Tabla de Lotes */}
          <TablaLotesCaducidad
            lotes={lotes}
            loading={loading}
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onLoteActualizado={cargarLotes}
          />

          {/* Paginación */}
          {paginacion.totalPages > 1 && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-600">
                  Mostrando {(paginacion.page - 1) * paginacion.limit + 1} a{' '}
                  {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de{' '}
                  {paginacion.total} lotes
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCambiarPagina(paginacion.page - 1)}
                    disabled={paginacion.page === 1}
                    className="inline-flex items-center justify-center p-2 rounded-xl text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-slate-200"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-4 py-2 text-sm text-slate-700">
                    Página {paginacion.page} de {paginacion.totalPages}
                  </span>
                  <button
                    onClick={() => handleCambiarPagina(paginacion.page + 1)}
                    disabled={paginacion.page >= paginacion.totalPages}
                    className="inline-flex items-center justify-center p-2 rounded-xl text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-slate-200"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Registro */}
      {mostrarModalRegistro && (
        <ModalRegistroLote
          onClose={() => setMostrarModalRegistro(false)}
          onLoteCreado={handleLoteCreado}
          productos={productos}
        />
      )}
    </div>
  );
}


