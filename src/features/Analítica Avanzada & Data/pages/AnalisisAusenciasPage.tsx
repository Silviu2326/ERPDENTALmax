import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import FiltrosAnalisisAusencias from '../components/FiltrosAnalisisAusencias';
import IndicadoresClaveAusencias from '../components/IndicadoresClaveAusencias';
import GraficoTasaAusencias from '../components/GraficoTasaAusencias';
import TablaPacientesReincidentes from '../components/TablaPacientesReincidentes';
import MapaCalorHorariosAusencia from '../components/MapaCalorHorariosAusencia';
import {
  FiltrosAusencias,
  obtenerAusenciasKPIs,
  obtenerEvolucionAusencias,
  obtenerPacientesReincidentes,
  AusenciasKPIs,
  EvolucionAusencias,
  PacienteReincidente,
} from '../api/analiticaApi';

export default function AnalisisAusenciasPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado de los datos
  const [kpis, setKpis] = useState<AusenciasKPIs | null>(null);
  const [evolucion, setEvolucion] = useState<EvolucionAusencias[]>([]);
  const [pacientesReincidentes, setPacientesReincidentes] = useState<PacienteReincidente[]>([]);

  // Filtros iniciales (último mes por defecto)
  const [filtros, setFiltros] = useState<FiltrosAusencias>(() => {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    return {
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
    };
  });

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar todos los datos en paralelo
      const [kpisData, evolucionData, pacientesData] = await Promise.all([
        obtenerAusenciasKPIs(filtros),
        obtenerEvolucionAusencias(filtros, 'semana'),
        obtenerPacientesReincidentes(filtros, 1, 10),
      ]);

      setKpis(kpisData);
      setEvolucion(evolucionData);
      setPacientesReincidentes(pacientesData.pacientes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos de ausencias');
      console.error('Error cargando datos de ausencias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAplicarFiltros = () => {
    cargarDatos();
  };

  const handleVerPaciente = (pacienteId: string) => {
    // TODO: Navegar a la página de perfil del paciente
    console.log('Ver paciente:', pacienteId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <AlertCircle size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Análisis de Ausencias (No-show)
                </h1>
                <p className="text-gray-600">
                  Visualiza el impacto de las inasistencias y toma decisiones estratégicas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Error */}
          {error && (
            <div className="bg-white shadow-sm rounded-xl p-4 border border-red-200">
              <div className="flex items-center space-x-2">
                <AlertCircle size={20} className="text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Filtros */}
          <FiltrosAnalisisAusencias
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onAplicarFiltros={handleAplicarFiltros}
            loading={loading}
          />

          {/* Indicadores Clave */}
          <IndicadoresClaveAusencias kpis={kpis} loading={loading} />

          {/* Gráfico de Evolución */}
          <GraficoTasaAusencias datos={evolucion} loading={loading} />

          {/* Tabla de Pacientes Reincidentes */}
          <TablaPacientesReincidentes
            pacientes={pacientesReincidentes}
            loading={loading}
            onVerPaciente={handleVerPaciente}
          />

          {/* Mapa de Calor */}
          <MapaCalorHorariosAusencia loading={loading} />
        </div>
      </div>
    </div>
  );
}



