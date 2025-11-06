import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, AlertCircle, Receipt, RefreshCw } from 'lucide-react';
import {
  obtenerKPIsGenerales,
  obtenerEvolutivoFacturacion,
  obtenerFacturacionPorCategoria,
  obtenerFacturacionPorProfesional,
  KPIsGenerales,
  EvolutivoFacturacion,
  FacturacionPorCategoria,
  FacturacionPorProfesional,
  FiltrosFacturacion,
} from '../api/informesFacturacionApi';
import KPIFacturacionCard from '../components/indicadores-facturacion/KPIFacturacionCard';
import GraficoFacturacionEvolutivo from '../components/indicadores-facturacion/GraficoFacturacionEvolutivo';
import GraficoFacturacionPorCategoria from '../components/indicadores-facturacion/GraficoFacturacionPorCategoria';
import TablaRendimientoProfesional from '../components/indicadores-facturacion/TablaRendimientoProfesional';
import FiltroPeriodoSede from '../components/indicadores-facturacion/FiltroPeriodoSede';

export default function IndicadoresFacturacionPage() {
  // Estados para fechas y sedes
  const [fechaInicio, setFechaInicio] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - 1);
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  });

  const [fechaFin, setFechaFin] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setHours(23, 59, 59, 999);
    return fecha;
  });

  const [sedeIdsSeleccionadas, setSedeIdsSeleccionadas] = useState<string[]>([]);
  const [agrupacion, setAgrupacion] = useState<'dia' | 'mes' | 'año'>('mes');

  // Estados para datos
  const [kpis, setKpis] = useState<KPIsGenerales | null>(null);
  const [evolutivo, setEvolutivo] = useState<EvolutivoFacturacion[]>([]);
  const [porCategoria, setPorCategoria] = useState<FacturacionPorCategoria[]>([]);
  const [porProfesional, setPorProfesional] = useState<FacturacionPorProfesional[]>([]);

  // Estados de carga
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Datos mock de sedes (en producción vendrían de una API)
  const sedes = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

  const cargarDatos = async () => {
    try {
      setRefreshing(true);
      const filtros: FiltrosFacturacion = {
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        sedeIds: sedeIdsSeleccionadas.length > 0 ? sedeIdsSeleccionadas : undefined,
      };

      const [kpisData, evolutivoData, categoriaData, profesionalData] = await Promise.all([
        obtenerKPIsGenerales(filtros),
        obtenerEvolutivoFacturacion(filtros, agrupacion),
        obtenerFacturacionPorCategoria(filtros),
        obtenerFacturacionPorProfesional(filtros),
      ]);

      setKpis(kpisData);
      setEvolutivo(evolutivoData);
      setPorCategoria(categoriaData);
      setPorProfesional(profesionalData);
    } catch (error) {
      console.error('Error al cargar indicadores de facturación:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    cargarDatos();
  }, [fechaInicio, fechaFin, sedeIdsSeleccionadas, agrupacion]);

  const handleRefresh = () => {
    cargarDatos();
  };

  if (loading && !kpis) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando indicadores de facturación...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Indicadores de Facturación
            </h1>
            <p className="text-gray-600">
              Dashboard financiero con métricas clave de facturación y cobros
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Filtros */}
        <FiltroPeriodoSede
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          sedes={sedes}
          sedeIdsSeleccionadas={sedeIdsSeleccionadas}
          onFechaInicioChange={setFechaInicio}
          onFechaFinChange={setFechaFin}
          onSedeIdsChange={setSedeIdsSeleccionadas}
          agrupacion={agrupacion}
          onAgrupacionChange={setAgrupacion}
        />
      </div>

      {/* KPIs */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPIFacturacionCard
            titulo="Total Facturado"
            valor={kpis.totalFacturado}
            formato="moneda"
            icono={<DollarSign className="w-6 h-6 text-white" />}
            color="blue"
            descripcion="Facturación total del período"
          />
          <KPIFacturacionCard
            titulo="Total Cobrado"
            valor={kpis.totalCobrado}
            formato="moneda"
            icono={<CreditCard className="w-6 h-6 text-white" />}
            color="green"
            descripcion="Pagos recibidos"
          />
          <KPIFacturacionCard
            titulo="Saldo Pendiente"
            valor={kpis.saldoPendiente}
            formato="moneda"
            icono={<AlertCircle className="w-6 h-6 text-white" />}
            color="orange"
            descripcion="Facturas pendientes de cobro"
          />
          <KPIFacturacionCard
            titulo="Ticket Medio"
            valor={kpis.ticketMedio}
            formato="moneda"
            icono={<Receipt className="w-6 h-6 text-white" />}
            color="purple"
            descripcion="Promedio por factura"
          />
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GraficoFacturacionEvolutivo
          datos={evolutivo}
          loading={loading}
          agrupacion={agrupacion}
        />
        <GraficoFacturacionPorCategoria datos={porCategoria} loading={loading} />
      </div>

      {/* Tabla de Rendimiento por Profesional */}
      <div className="mb-8">
        <TablaRendimientoProfesional datos={porProfesional} loading={loading} />
      </div>
    </div>
  );
}


