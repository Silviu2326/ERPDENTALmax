import { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, RefreshCw, Package, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import {
  AlertaReabastecimiento,
  FiltrosAlertas,
  obtenerAlertas,
  RespuestaAlertas,
} from '../api/alertasApi';
import TablaAlertasReabastecimiento from '../components/TablaAlertasReabastecimiento';
import FiltrosAlertas from '../components/FiltrosAlertas';
import ModalAccionAlerta from '../components/ModalAccionAlerta';
import PaginacionTabla from '../components/PaginacionTabla';

export default function AlertasReabastecimientoPage() {
  const [alertas, setAlertas] = useState<AlertaReabastecimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<AlertaReabastecimiento | null>(null);
  const [accionModal, setAccionModal] = useState<'revisar' | 'crear_orden' | 'resolver' | null>(null);

  // Datos mock para sedes (en producción vendrían de una API)
  const sedes = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
  ];

  const [filtros, setFiltros] = useState<FiltrosAlertas>({
    page: 1,
    limit: 10,
    sortBy: 'fecha_creacion',
    sortOrder: 'desc',
  });

  const cargarAlertas = async () => {
    setLoading(true);
    setError(null);
    try {
      // En producción, esto llamaría a la API real
      // const respuesta: RespuestaAlertas = await obtenerAlertas(filtros);
      // setAlertas(respuesta.data);
      // setTotal(respuesta.total);

      // Datos falsos completos - NO usar API
      const datosMock: AlertaReabastecimiento[] = [
        {
          _id: '1',
          producto: {
            _id: '1',
            nombre: 'Guantes Nitrilo Talla M',
            sku: 'GUANT-NIT-M',
            stock_minimo: 50,
            categoria: 'Consumibles',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Proveedor Dental S.A.',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 25,
          stock_minimo_al_generar: 50,
          cantidad_sugerida_pedido: 100,
          estado: 'nueva',
          fecha_creacion: new Date().toISOString(),
        },
        {
          _id: '2',
          producto: {
            _id: '2',
            nombre: 'Resina Compuesta A2',
            sku: 'RES-COMP-A2',
            stock_minimo: 30,
            categoria: 'Materiales de Restauración',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Dental Supply S.A.',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 15,
          stock_minimo_al_generar: 30,
          cantidad_sugerida_pedido: 60,
          estado: 'revisada',
          fecha_creacion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '3',
          producto: {
            _id: '3',
            nombre: 'Anestésico Lidocaína 2%',
            sku: 'ANES-LID-002',
            stock_minimo: 15,
            categoria: 'Anestésicos',
            proveedor_preferido: {
              _id: '2',
              nombre: 'Farmacéutica Dental',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 8,
          stock_minimo_al_generar: 15,
          cantidad_sugerida_pedido: 30,
          estado: 'nueva',
          fecha_creacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '4',
          producto: {
            _id: '4',
            nombre: 'Implante Dental Titanio',
            sku: 'IMPL-TIT-003',
            stock_minimo: 5,
            categoria: 'Implantes',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Dental Supply S.A.',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 0,
          stock_minimo_al_generar: 5,
          cantidad_sugerida_pedido: 10,
          estado: 'nueva',
          fecha_creacion: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '5',
          producto: {
            _id: '5',
            nombre: 'Agujas Desechables 27G',
            sku: 'AGU-27G-006',
            stock_minimo: 20,
            categoria: 'Consumibles',
            proveedor_preferido: {
              _id: '3',
              nombre: 'Suministros Médicos',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 15,
          stock_minimo_al_generar: 20,
          cantidad_sugerida_pedido: 40,
          estado: 'revisada',
          fecha_creacion: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '6',
          producto: {
            _id: '6',
            nombre: 'Mascarillas Quirúrgicas N95',
            sku: 'MASC-N95-013',
            stock_minimo: 25,
            categoria: 'Consumibles',
            proveedor_preferido: {
              _id: '3',
              nombre: 'Suministros Médicos',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 18,
          stock_minimo_al_generar: 25,
          cantidad_sugerida_pedido: 50,
          estado: 'nueva',
          fecha_creacion: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '7',
          producto: {
            _id: '7',
            nombre: 'Cofferdam Látex',
            sku: 'COFF-LAT-015',
            stock_minimo: 12,
            categoria: 'Consumibles',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Dental Supply S.A.',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 7,
          stock_minimo_al_generar: 12,
          cantidad_sugerida_pedido: 25,
          estado: 'resuelta',
          fecha_creacion: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '8',
          producto: {
            _id: '8',
            nombre: 'Brackets Metálicos Autoligantes',
            sku: 'BRAC-MET-007',
            stock_minimo: 10,
            categoria: 'Equipamiento',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Dental Supply S.A.',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 8,
          stock_minimo_al_generar: 10,
          cantidad_sugerida_pedido: 20,
          estado: 'nueva',
          fecha_creacion: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '9',
          producto: {
            _id: '9',
            nombre: 'Cofferdam Látex',
            sku: 'COFF-LAT-015',
            stock_minimo: 12,
            categoria: 'Consumibles',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Dental Supply S.A.',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 7,
          stock_minimo_al_generar: 12,
          cantidad_sugerida_pedido: 25,
          estado: 'nueva',
          fecha_creacion: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '10',
          producto: {
            _id: '10',
            nombre: 'Resina Composite B1',
            sku: 'COMP-B1-016',
            stock_minimo: 15,
            categoria: 'Materiales de Restauración',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Dental Supply S.A.',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 12,
          stock_minimo_al_generar: 15,
          cantidad_sugerida_pedido: 30,
          estado: 'revisada',
          fecha_creacion: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '11',
          producto: {
            _id: '11',
            nombre: 'Fresas de Carburo Tungsteno',
            sku: 'FRES-CT-011',
            stock_minimo: 8,
            categoria: 'Instrumental',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Dental Supply S.A.',
            },
          },
          sede: { _id: '2', nombre: 'Sede Norte' },
          stock_actual: 5,
          stock_minimo_al_generar: 8,
          cantidad_sugerida_pedido: 15,
          estado: 'nueva',
          fecha_creacion: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '12',
          producto: {
            _id: '12',
            nombre: 'Lámpara de Polimerización LED',
            sku: 'LAMP-LED-012',
            stock_minimo: 4,
            categoria: 'Equipamiento',
            proveedor_preferido: {
              _id: '4',
              nombre: 'Tecnología Dental',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 3,
          stock_minimo_al_generar: 4,
          cantidad_sugerida_pedido: 6,
          estado: 'nueva',
          fecha_creacion: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '13',
          producto: {
            _id: '13',
            nombre: 'Seda Dental',
            sku: 'SEDA-014',
            stock_minimo: 30,
            categoria: 'Consumibles',
            proveedor_preferido: {
              _id: '3',
              nombre: 'Suministros Médicos',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 25,
          stock_minimo_al_generar: 30,
          cantidad_sugerida_pedido: 60,
          estado: 'nueva',
          fecha_creacion: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '14',
          producto: {
            _id: '14',
            nombre: 'Curetas Periodontales',
            sku: 'CUR-PER-024',
            stock_minimo: 6,
            categoria: 'Instrumental',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Dental Supply S.A.',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 4,
          stock_minimo_al_generar: 6,
          cantidad_sugerida_pedido: 12,
          estado: 'nueva',
          fecha_creacion: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '15',
          producto: {
            _id: '15',
            nombre: 'Ligaduras Elásticas',
            sku: 'LIG-ELAS-023',
            stock_minimo: 15,
            categoria: 'Consumibles',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Dental Supply S.A.',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 12,
          stock_minimo_al_generar: 15,
          cantidad_sugerida_pedido: 30,
          estado: 'revisada',
          fecha_creacion: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '16',
          producto: {
            _id: '16',
            nombre: 'Gutapercha',
            sku: 'GUT-020',
            stock_minimo: 100,
            categoria: 'Instrumental',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Dental Supply S.A.',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 85,
          stock_minimo_al_generar: 100,
          cantidad_sugerida_pedido: 200,
          estado: 'nueva',
          fecha_creacion: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '17',
          producto: {
            _id: '17',
            nombre: 'Limas Endodóncicas',
            sku: 'LIM-END-021',
            stock_minimo: 8,
            categoria: 'Instrumental',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Dental Supply S.A.',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 6,
          stock_minimo_al_generar: 8,
          cantidad_sugerida_pedido: 15,
          estado: 'nueva',
          fecha_creacion: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '18',
          producto: {
            _id: '18',
            nombre: 'Alambre Ortodóncico',
            sku: 'ALAM-ORT-022',
            stock_minimo: 30,
            categoria: 'Instrumental',
            proveedor_preferido: {
              _id: '1',
              nombre: 'Dental Supply S.A.',
            },
          },
          sede: { _id: '1', nombre: 'Sede Central' },
          stock_actual: 22,
          stock_minimo_al_generar: 30,
          cantidad_sugerida_pedido: 60,
          estado: 'nueva',
          fecha_creacion: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setAlertas(datosMock);
      setTotal(datosMock.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las alertas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlertas();
  }, [filtros]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosAlertas) => {
    setFiltros(nuevosFiltros);
  };

  const handleAccion = (alerta: AlertaReabastecimiento, accion: 'revisar' | 'crear_orden' | 'resolver') => {
    setAlertaSeleccionada(alerta);
    setAccionModal(accion);
  };

  const handleCerrarModal = () => {
    setAlertaSeleccionada(null);
    setAccionModal(null);
  };

  const handleSuccess = () => {
    cargarAlertas();
  };

  const handlePageChange = (nuevaPage: number) => {
    setFiltros({
      ...filtros,
      page: nuevaPage,
    });
  };

  const totalPaginas = Math.ceil(total / (filtros.limit || 10));

  // Calcular estadísticas de alertas
  const estadisticas = useMemo(() => {
    const nuevas = alertas.filter(a => a.estado === 'nueva').length;
    const revisadas = alertas.filter(a => a.estado === 'revisada').length;
    const resueltas = alertas.filter(a => a.estado === 'resuelta').length;
    const stockTotalBajo = alertas.reduce((sum, a) => sum + a.stock_actual, 0);
    const stockMinimoTotal = alertas.reduce((sum, a) => sum + a.stock_minimo_al_generar, 0);
    const cantidadSugeridaTotal = alertas.reduce((sum, a) => sum + a.cantidad_sugerida_pedido, 0);
    const deficitTotal = Math.max(0, stockMinimoTotal - stockTotalBajo);
    const porcentajeDeficit = stockMinimoTotal > 0 ? (deficitTotal / stockMinimoTotal) * 100 : 0;
    
    // Agrupar por categoría de producto
    const alertasPorCategoria = alertas.reduce((acc, alerta) => {
      const categoria = alerta.producto.categoria || 'Sin categoría';
      if (!acc[categoria]) {
        acc[categoria] = { total: 0, nuevas: 0, revisadas: 0, resueltas: 0 };
      }
      acc[categoria].total++;
      if (alerta.estado === 'nueva') acc[categoria].nuevas++;
      if (alerta.estado === 'revisada') acc[categoria].revisadas++;
      if (alerta.estado === 'resuelta') acc[categoria].resueltas++;
      return acc;
    }, {} as Record<string, { total: number; nuevas: number; revisadas: number; resueltas: number }>);

    // Alertas críticas (stock = 0)
    const alertasCriticas = alertas.filter(a => a.stock_actual === 0).length;
    
    // Alertas urgentes (stock < 50% del mínimo)
    const alertasUrgentes = alertas.filter(a => {
      const porcentajeStock = a.stock_minimo_al_generar > 0 
        ? (a.stock_actual / a.stock_minimo_al_generar) * 100 
        : 0;
      return porcentajeStock < 50 && a.stock_actual > 0;
    }).length;
    
    return {
      nuevas,
      revisadas,
      resueltas,
      stockTotalBajo,
      stockMinimoTotal,
      cantidadSugeridaTotal,
      deficitTotal,
      porcentajeDeficit,
      alertasPorCategoria,
      alertasCriticas,
      alertasUrgentes,
    };
  }, [alertas]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <span>Alertas de Reabastecimiento</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Monitorea los productos que han alcanzado su nivel mínimo de stock y gestiona su reabastecimiento
            </p>
          </div>
          <button
            onClick={cargarAlertas}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Estadísticas de alertas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Nuevas</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{estadisticas.nuevas}</p>
                <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Revisión</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{estadisticas.revisadas}</p>
                <p className="text-xs text-gray-500 mt-1">Pendientes de acción</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resueltas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{estadisticas.resueltas}</p>
                <p className="text-xs text-gray-500 mt-1">Completadas</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cantidad Sugerida</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{estadisticas.cantidadSugeridaTotal}</p>
                <p className="text-xs text-gray-500 mt-1">Total a pedir</p>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Estadísticas adicionales de criticidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-gray-900">Alertas Críticas</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Productos Agotados</p>
                <p className="text-3xl font-bold text-red-600">{estadisticas.alertasCriticas}</p>
                <p className="text-xs text-gray-500 mt-1">Stock en cero</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Alertas Urgentes</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.alertasUrgentes}</p>
                <p className="text-xs text-gray-500 mt-1">Stock &lt; 50% del mínimo</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-900">Resumen de Stock Bajo</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Stock Actual Total</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.stockTotalBajo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Stock Mínimo Total</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.stockMinimoTotal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Déficit Total</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.deficitTotal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">% Déficit</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.porcentajeDeficit.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Distribución por categoría */}
        {Object.keys(estadisticas.alertasPorCategoria).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Alertas por Categoría</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(estadisticas.alertasPorCategoria).map(([categoria, datos]) => (
                <div key={categoria} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3 truncate">{categoria}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{datos.total}</span>
                      <span className="text-xs text-gray-500">Total alertas</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-red-600">Nuevas: {datos.nuevas}</span>
                        <span className="text-yellow-600">Revisadas: {datos.revisadas}</span>
                        <span className="text-green-600">Resueltas: {datos.resueltas}</span>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="flex h-2">
                          <div
                            className="bg-red-500 h-2"
                            style={{ width: `${(datos.nuevas / datos.total) * 100}%` }}
                          ></div>
                          <div
                            className="bg-yellow-500 h-2"
                            style={{ width: `${(datos.revisadas / datos.total) * 100}%` }}
                          ></div>
                          <div
                            className="bg-green-500 h-2"
                            style={{ width: `${(datos.resueltas / datos.total) * 100}%` }}
                          ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        <FiltrosAlertas filtros={filtros} onFiltrosChange={handleFiltrosChange} sedes={sedes} />

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabla de Alertas */}
        <TablaAlertasReabastecimiento
          alertas={alertas}
          loading={loading}
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          onAccion={handleAccion}
          onRefresh={cargarAlertas}
        />

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="mt-4">
            <PaginacionTabla
              page={filtros.page || 1}
              totalPages={totalPaginas}
              total={total}
              limit={filtros.limit || 10}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Modal de Acción */}
        <ModalAccionAlerta
          alerta={alertaSeleccionada}
          accion={accionModal}
          onClose={handleCerrarModal}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}

