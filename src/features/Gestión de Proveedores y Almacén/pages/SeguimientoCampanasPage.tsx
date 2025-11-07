import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Loader2 } from 'lucide-react';
import { obtenerCampanas, obtenerEstadisticasDashboard, CampanaConMetricas, FiltrosCampana } from '../api/campanasApi';
import CampanaDashboard from '../components/CampanaDashboard';
import ListaCampanasTable from '../components/ListaCampanasTable';
import ModalCrearEditarCampana from '../components/ModalCrearEditarCampana';
import FiltrosCampanaComponent from '../components/FiltrosCampana';
import GraficoRendimientoCampana from '../components/GraficoRendimientoCampana';

interface SeguimientoCampanasPageProps {
  onVerDetalle?: (campanaId: string) => void;
}

export default function SeguimientoCampanasPage({ onVerDetalle }: SeguimientoCampanasPageProps) {
  const [campanas, setCampanas] = useState<CampanaConMetricas[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    inversionTotal: 0,
    totalPacientesCaptados: 0,
    cpaPromedio: 0,
    roiGlobal: 0,
    ingresosGenerados: 0,
  });
  const [filtros, setFiltros] = useState<FiltrosCampana>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campanaEditando, setCampanaEditando] = useState<CampanaConMetricas | null>(null);
  const [tipoGrafico, setTipoGrafico] = useState<'cpa' | 'roi' | 'pacientes' | 'ingresos'>('roi');

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Datos falsos de campañas con métricas
      const campanasData: CampanaConMetricas[] = [
        {
          _id: '1',
          nombre: 'Promoción Limpieza Dental',
          tipo: 'Email',
          estado: 'Completada',
          fechaInicio: '2024-03-01',
          fechaFin: '2024-03-31',
          presupuesto: 5000,
          pacientesAlcanzados: 1250,
          pacientesConvertidos: 342,
          ingresosGenerados: 51250,
          cpa: 14.62,
          roi: 9.25,
          createdAt: '2024-02-25T10:00:00Z',
        },
        {
          _id: '2',
          nombre: 'Recordatorio Revisión Anual',
          tipo: 'SMS',
          estado: 'En Curso',
          fechaInicio: '2024-03-10',
          fechaFin: '2024-04-10',
          presupuesto: 1200,
          pacientesAlcanzados: 850,
          pacientesConvertidos: 178,
          ingresosGenerados: 26700,
          cpa: 6.74,
          roi: 21.25,
          createdAt: '2024-03-05T09:00:00Z',
        },
        {
          _id: '3',
          nombre: 'Oferta Ortodoncia Invisible',
          tipo: 'Email',
          estado: 'Programada',
          fechaInicio: '2024-03-20',
          fechaFin: '2024-04-20',
          presupuesto: 3000,
          pacientesAlcanzados: 0,
          pacientesConvertidos: 0,
          ingresosGenerados: 0,
          cpa: 0,
          roi: 0,
          createdAt: '2024-03-15T14:30:00Z',
        },
        {
          _id: '4',
          nombre: 'Campaña Bienvenida Nuevos Pacientes',
          tipo: 'Email',
          estado: 'Completada',
          fechaInicio: '2024-02-15',
          fechaFin: '2024-03-15',
          presupuesto: 800,
          pacientesAlcanzados: 45,
          pacientesConvertidos: 38,
          ingresosGenerados: 11400,
          cpa: 21.05,
          roi: 13.25,
          createdAt: '2024-02-10T11:00:00Z',
        },
      ];
      
      // Datos falsos de estadísticas del dashboard
      const estadisticasData = {
        inversionTotal: 10000,
        totalPacientesCaptados: 2145,
        cpaPromedio: 4.66,
        roiGlobal: 8.93,
        ingresosGenerados: 89300,
      };
      
      setCampanas(campanasData);
      setEstadisticas(estadisticasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNuevaCampana = () => {
    setCampanaEditando(null);
    setIsModalOpen(true);
  };

  const handleEditarCampana = (campana: CampanaConMetricas) => {
    setCampanaEditando(campana);
    setIsModalOpen(true);
  };

  const handleEliminarCampana = async (campanaId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta campaña?')) {
      try {
        // Aquí se llamaría a eliminarCampana, pero por ahora solo recargamos
        await cargarDatos();
      } catch (error) {
        console.error('Error al eliminar campaña:', error);
        alert('Error al eliminar la campaña');
      }
    }
  };

  const handleVerDetalleCampana = (campanaId: string) => {
    if (onVerDetalle) {
      onVerDetalle(campanaId);
    }
  };

  const handleGuardado = () => {
    setIsModalOpen(false);
    setCampanaEditando(null);
    cargarDatos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <TrendingUp size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Seguimiento de Campañas
                  </h1>
                  <p className="text-gray-600">
                    Planifica, ejecuta y analiza la efectividad de tus campañas de marketing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleNuevaCampana}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
            >
              <Plus size={20} className="mr-2" />
              Nueva Campaña
            </button>
          </div>

          {/* Dashboard KPIs */}
          {!isLoading && <CampanaDashboard estadisticas={estadisticas} />}

          {/* Filtros */}
          <FiltrosCampanaComponent
            filtros={filtros}
            onFiltrosChange={setFiltros}
          />

          {/* Gráficos */}
          {campanas.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Rendimiento de Campañas</h2>
                <select
                  value={tipoGrafico}
                  onChange={(e) => setTipoGrafico(e.target.value as typeof tipoGrafico)}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="roi">ROI</option>
                  <option value="cpa">CPA</option>
                  <option value="pacientes">Pacientes</option>
                  <option value="ingresos">Ingresos</option>
                </select>
              </div>
              <GraficoRendimientoCampana campanas={campanas} tipo={tipoGrafico} />
            </div>
          )}

          {/* Tabla de Campañas */}
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando campañas...</p>
            </div>
          ) : (
            <ListaCampanasTable
              campanas={campanas}
              onVerDetalle={handleVerDetalleCampana}
              onEditar={handleEditarCampana}
              onEliminar={handleEliminarCampana}
            />
          )}

          {/* Modal */}
          <ModalCrearEditarCampana
            campana={campanaEditando}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setCampanaEditando(null);
            }}
            onGuardado={handleGuardado}
          />
        </div>
      </div>
    </div>
  );
}


