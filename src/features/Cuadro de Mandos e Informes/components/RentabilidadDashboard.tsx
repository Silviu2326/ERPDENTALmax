import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, Calculator, Percent, BarChart3 } from 'lucide-react';
import {
  obtenerKPIsRentabilidad,
  obtenerRentabilidadPorTratamiento,
  obtenerRentabilidadPorProfesional,
  obtenerEvolucionFinanciera,
  RentabilidadKPIs,
  RentabilidadPorTratamiento,
  RentabilidadPorProfesional,
  EvolucionFinanciera,
  RentabilidadFilters,
} from '../api/rentabilidadApi';
import KpiCard from './KpiCard';
import GraficoRentabilidadTratamientos from './GraficoRentabilidadTratamientos';
import GraficoEvolucionIngresosCostos from './GraficoEvolucionIngresosCostos';
import TablaRentabilidadProfesionales from './TablaRentabilidadProfesionales';
import FiltroPeriodoTiempo from './FiltroPeriodoTiempo';
import SelectorSede from './SelectorSede';

interface RentabilidadDashboardProps {
  fechaInicio: Date;
  fechaFin: Date;
  sedeId?: string | null;
  sedes: Array<{ _id: string; nombre: string }>;
  onCambioFecha?: (inicio: Date, fin: Date) => void;
  onCambioSede?: (sedeId: string | null) => void;
}

export default function RentabilidadDashboard({
  fechaInicio,
  fechaFin,
  sedeId,
  sedes,
  onCambioFecha,
  onCambioSede,
}: RentabilidadDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<RentabilidadKPIs | null>(null);
  const [rentabilidadTratamientos, setRentabilidadTratamientos] = useState<RentabilidadPorTratamiento[]>([]);
  const [rentabilidadProfesionales, setRentabilidadProfesionales] = useState<RentabilidadPorProfesional[]>([]);
  const [evolucionFinanciera, setEvolucionFinanciera] = useState<EvolucionFinanciera[]>([]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const filtros: RentabilidadFilters = {
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0],
        sedeId: sedeId || undefined,
        groupBy: 'day',
      };

      const [kpisData, tratamientosData, profesionalesData, evolucionData] = await Promise.all([
        obtenerKPIsRentabilidad(filtros),
        obtenerRentabilidadPorTratamiento(filtros),
        obtenerRentabilidadPorProfesional(filtros),
        obtenerEvolucionFinanciera(filtros),
      ]);

      setKpis(kpisData);
      setRentabilidadTratamientos(tratamientosData);
      setRentabilidadProfesionales(profesionalesData);
      setEvolucionFinanciera(evolucionData);
    } catch (error) {
      console.error('Error al cargar datos de rentabilidad:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [fechaInicio, fechaFin, sedeId]);

  const handleCambioFecha = (inicio: Date, fin: Date) => {
    if (onCambioFecha) {
      onCambioFecha(inicio, fin);
    }
  };

  const handleCambioSede = (nuevaSedeId: string | null) => {
    if (onCambioSede) {
      onCambioSede(nuevaSedeId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-4">
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex flex-wrap items-center gap-4">
            <FiltroPeriodoTiempo
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              onCambio={handleCambioFecha}
            />
            <SelectorSede
              sedes={sedes}
              sedeSeleccionada={sedeId || null}
              onCambio={handleCambioSede}
            />
          </div>
        </div>
      </div>

      {/* KPIs */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KpiCard
            titulo="Ingresos Totales"
            valor={kpis.ingresosTotales}
            formato="moneda"
            icono={DollarSign}
            color="green"
            descripcion="Total de ingresos del período"
          />
          <KpiCard
            titulo="Costos Totales"
            valor={kpis.costosTotales}
            formato="moneda"
            icono={Calculator}
            color="red"
            descripcion="Total de costos del período"
          />
          <KpiCard
            titulo="Margen Bruto"
            valor={kpis.margenBruto}
            formato="moneda"
            icono={BarChart3}
            color="blue"
            descripcion="Ingresos - Costos"
          />
          <KpiCard
            titulo="EBITDA"
            valor={kpis.ebitda}
            formato="moneda"
            icono={TrendingUp}
            color="purple"
            descripcion="Beneficio antes de intereses, impuestos y amortizaciones"
          />
          <KpiCard
            titulo="Pacientes Nuevos"
            valor={kpis.numeroPacientesNuevos}
            formato="numero"
            icono={Users}
            color="orange"
            descripcion="Nuevos pacientes adquiridos"
          />
          <KpiCard
            titulo="Ticket Promedio"
            valor={kpis.ticketPromedio}
            formato="moneda"
            icono={Percent}
            color="green"
            descripcion="Ingresos promedio por paciente"
          />
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficoEvolucionIngresosCostos
          datos={evolucionFinanciera}
          loading={loading}
        />
        <GraficoRentabilidadTratamientos
          datos={rentabilidadTratamientos}
          loading={loading}
        />
      </div>

      {/* Tabla de Profesionales */}
      <TablaRentabilidadProfesionales
        datos={rentabilidadProfesionales}
        loading={loading}
      />
    </div>
  );
}



