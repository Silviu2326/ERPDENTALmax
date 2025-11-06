import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
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
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-red-800 font-medium">Error al cargar el informe</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Informe de Costes de Equipamiento
        </h1>
        <p className="text-gray-600">
          Visualiza y analiza los costes asociados al equipamiento de la clínica
        </p>
      </div>

      {/* Filtros */}
      <FiltrosInformeCostesComponent
        filtros={filtros}
        onFiltrosChange={setFiltros}
        sedes={sedes}
        categorias={categorias}
        onAplicarFiltros={handleAplicarFiltros}
      />

      {/* Botón de exportar */}
      <div className="flex justify-end mb-6">
        <BotonExportarInforme filtros={filtros} />
      </div>

      {/* Resumen de costes */}
      {informe && (
        <>
          <ResumenTotalCostes resumen={informe.resumen} loading={loading} />

          {/* Gráfico y tabla */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <GraficoCostesPorCategoria costes={informe.desglose} loading={loading} />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Resumen de Equipos
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total de equipos:</span>
                  <span className="font-semibold text-gray-900">
                    {informe.resumen.totalEquipos}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Coste medio por equipo:</span>
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
                  <span className="text-gray-600">Depreciación total:</span>
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

      {loading && !informe && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}


