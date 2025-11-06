import { useState, useEffect } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Seguimiento de Campañas
              </h1>
              <p className="text-gray-600 mt-1">
                Planifica, ejecuta y analiza la efectividad de tus campañas de marketing
              </p>
            </div>
          </div>
          <button
            onClick={handleNuevaCampana}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nueva Campaña
          </button>
        </div>

        {/* Filtros */}
        <FiltrosCampanaComponent
          filtros={filtros}
          onFiltrosChange={setFiltros}
        />

        {/* Dashboard KPIs */}
        {!isLoading && <CampanaDashboard estadisticas={estadisticas} />}

        {/* Gráficos */}
        {campanas.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Rendimiento de Campañas</h2>
              <select
                value={tipoGrafico}
                onChange={(e) => setTipoGrafico(e.target.value as typeof tipoGrafico)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando campañas...</p>
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
  );
}


