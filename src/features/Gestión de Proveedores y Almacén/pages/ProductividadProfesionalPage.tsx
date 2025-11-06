import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import {
  obtenerProductividadProfesional,
  calcularResumenKPIs,
  ProductividadProfesional,
  FiltrosProductividad,
} from '../api/reportesProductividadApi';
import KPIResumenCard from '../components/KPIResumenCard';
import FiltroProductividad from '../components/FiltroProductividad';
import ProductividadChartContainer from '../components/ProductividadChartContainer';
import ProductividadDataTable from '../components/ProductividadDataTable';

export default function ProductividadProfesionalPage() {
  const [datos, setDatos] = useState<ProductividadProfesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar filtros con el mes actual por defecto
  const getDefaultDateRange = () => {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    return {
      fechaInicio: primerDiaMes.toISOString().split('T')[0],
      fechaFin: ultimoDiaMes.toISOString().split('T')[0],
    };
  };

  const [filtros, setFiltros] = useState<FiltrosProductividad>(getDefaultDateRange());

  // Datos falsos para profesionales y sedes
  const profesionales = [
    { _id: '1', nombre: 'Juan', apellidos: 'Pérez García' },
    { _id: '2', nombre: 'María', apellidos: 'López Sánchez' },
    { _id: '3', nombre: 'Carlos', apellidos: 'Martínez Ruiz' },
    { _id: '4', nombre: 'Ana', apellidos: 'García Fernández' },
    { _id: '5', nombre: 'Pedro', apellidos: 'Sánchez Torres' },
    { _id: '6', nombre: 'Lucía', apellidos: 'Fernández Moreno' },
    { _id: '7', nombre: 'Roberto', apellidos: 'García López' },
    { _id: '8', nombre: 'Sandra', apellidos: 'Martín Díaz' },
  ];

  const sedes = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
    { _id: '4', nombre: 'Sede Este' },
  ];

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Datos falsos completos de productividad
      const datosFalsos: ProductividadProfesional[] = [
        {
          profesionalId: '1',
          nombreCompleto: 'Dr. Juan Pérez García',
          ingresosTotales: 48500,
          numeroTratamientos: 92,
          horasSillon: 128,
          costeMateriales: 9200,
          rentabilidad: 39300,
          productividadPorHora: 378.91,
        },
        {
          profesionalId: '2',
          nombreCompleto: 'Dra. María López Sánchez',
          ingresosTotales: 56200,
          numeroTratamientos: 105,
          horasSillon: 145,
          costeMateriales: 10500,
          rentabilidad: 45700,
          productividadPorHora: 387.59,
        },
        {
          profesionalId: '3',
          nombreCompleto: 'Carlos Martínez Ruiz',
          ingresosTotales: 19800,
          numeroTratamientos: 45,
          horasSillon: 95,
          costeMateriales: 3200,
          rentabilidad: 16600,
          productividadPorHora: 208.42,
        },
        {
          profesionalId: '4',
          nombreCompleto: 'Ana García Fernández',
          ingresosTotales: 16200,
          numeroTratamientos: 38,
          horasSillon: 88,
          costeMateriales: 2800,
          rentabilidad: 13400,
          productividadPorHora: 184.09,
        },
        {
          profesionalId: '5',
          nombreCompleto: 'Pedro Sánchez Torres',
          ingresosTotales: 17100,
          numeroTratamientos: 42,
          horasSillon: 92,
          costeMateriales: 3100,
          rentabilidad: 14000,
          productividadPorHora: 186.96,
        },
        {
          profesionalId: '6',
          nombreCompleto: 'Dra. Lucía Fernández Moreno',
          ingresosTotales: 49800,
          numeroTratamientos: 88,
          horasSillon: 135,
          costeMateriales: 9800,
          rentabilidad: 40000,
          productividadPorHora: 368.89,
        },
        {
          profesionalId: '7',
          nombreCompleto: 'Roberto García López',
          ingresosTotales: 33000,
          numeroTratamientos: 0,
          horasSillon: 0,
          costeMateriales: 0,
          rentabilidad: 33000,
          productividadPorHora: 0,
        },
        {
          profesionalId: '8',
          nombreCompleto: 'Sandra Martín Díaz',
          ingresosTotales: 22500,
          numeroTratamientos: 0,
          horasSillon: 0,
          costeMateriales: 0,
          rentabilidad: 22500,
          productividadPorHora: 0,
        },
      ];

      // Aplicar filtros
      let datosFiltrados = [...datosFalsos];
      
      if (filtros.profesionalId) {
        datosFiltrados = datosFiltrados.filter(d => d.profesionalId === filtros.profesionalId);
      }
      
      if (filtros.sedeId) {
        // En un caso real, filtraríamos por sede, pero para datos falsos no aplicamos este filtro
      }

      setDatos(datosFiltrados);
    } catch (err) {
      console.error('Error al cargar datos de productividad:', err);
      setError('Error al cargar los datos de productividad. Por favor, intente nuevamente.');
      setDatos([]);
    } finally {
      setLoading(false);
    }
  };

  const resumen = calcularResumenKPIs(datos);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Productividad por Profesional
              </h1>
              <p className="text-gray-600 mt-1">
                Análisis de rendimiento y rentabilidad por profesional
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Filtros */}
        <FiltroProductividad
          filtros={filtros}
          onFiltrosChange={setFiltros}
          profesionales={profesionales}
          sedes={sedes}
          loading={loading}
        />

        {/* KPIs Resumen */}
        <KPIResumenCard resumen={resumen} loading={loading} />

        {/* Gráficos */}
        <ProductividadChartContainer datos={datos} loading={loading} />

        {/* Tabla de datos */}
        <ProductividadDataTable datos={datos} loading={loading} />
      </div>
    </div>
  );
}

