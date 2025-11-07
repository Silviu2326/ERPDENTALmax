import { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import {
  obtenerInformeCostes,
  FiltrosInformeCostes,
  InformeCostesEquipamiento,
} from '../api/informesEquipamientoApi';
import FiltrosInformeCostesComponent from '../components/FiltrosInformeCostes';
import ResumenTotalCostes from '../components/ResumenTotalCostes';
import GraficoCostesPorCategoria from '../components/GraficoCostesPorCategoria';
import TablaCostesEquipamiento from '../components/TablaCostesEquipamiento';
import BotonExportarInforme from '../components/BotonExportarInforme';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export default function InformeCostesEquipamientoPage() {
  const [informe, setInforme] = useState<InformeCostesEquipamiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosInformeCostes>(() => {
    // Por defecto, últimos 30 días
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    
    return {
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
    };
  });
  const [sedes, setSedes] = useState<Array<{ _id: string; nombre: string }>>([]);
  const [categorias, setCategorias] = useState<Array<{ _id: string; nombre: string }>>([]);

  // Cargar sedes y categorías
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        // Cargar sedes
        const responseSedes = await fetch(`${API_BASE_URL}/sedes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (responseSedes.ok) {
          const sedesData = await responseSedes.json();
          setSedes(sedesData);
        }

        // Cargar categorías de equipos
        const responseCategorias = await fetch(`${API_BASE_URL}/equipamiento/categorias`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (responseCategorias.ok) {
          const categoriasData = await responseCategorias.json();
          setCategorias(categoriasData);
        }
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err);
      }
    };

    cargarDatosIniciales();
  }, []);

  // Cargar informe
  const cargarInforme = async () => {
    try {
      setLoading(true);
      setError(null);
      const datos = await obtenerInformeCostes(filtros);
      setInforme(datos);
    } catch (err) {
      console.error('Error al cargar el informe:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el informe de costes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInforme();
  }, []); // Solo se ejecuta al montar el componente

  const handleAplicarFiltros = () => {
    cargarInforme();
  };

  if (error && !informe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <TrendingUp size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Informe de Costes de Equipamiento
                  </h1>
                  <p className="text-gray-600">
                    Visualiza y analiza los costes asociados al equipamiento de la clínica
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => cargarInforme()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Informe de Costes de Equipamiento
                </h1>
                <p className="text-gray-600">
                  Visualiza y analiza los costes asociados al equipamiento de la clínica
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar superior - Botón de exportar */}
          <div className="flex items-center justify-end">
            <BotonExportarInforme filtros={filtros} />
          </div>

          {/* Filtros */}
          <FiltrosInformeCostesComponent
            filtros={filtros}
            onFiltrosChange={setFiltros}
            sedes={sedes}
            categorias={categorias}
            onAplicarFiltros={handleAplicarFiltros}
          />

          {/* Estado de carga */}
          {loading && !informe && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </div>
          )}

          {/* Resumen de costes */}
          {informe && (
            <>
              <ResumenTotalCostes resumen={informe.resumen} loading={loading} />

              {/* Gráfico y resumen */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GraficoCostesPorCategoria costes={informe.desglose} loading={loading} />
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Resumen de Equipos
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total de equipos:</span>
                      <span className="font-semibold text-gray-900">
                        {informe.resumen.totalEquipos}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Coste medio por equipo:</span>
                      <span className="font-semibold text-gray-900">
                        {informe.resumen.totalEquipos > 0
                          ? new Intl.NumberFormat('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                              maximumFractionDigits: 0,
                            }).format(informe.resumen.costeGeneral / informe.resumen.totalEquipos)
                          : '0 €'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Depreciación total:</span>
                      <span className="font-semibold text-red-600">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(informe.resumen.totalDepreciacion)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de costes */}
              <TablaCostesEquipamiento costes={informe.desglose} loading={loading} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}



