import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import SelectorDeInformes from '../components/SelectorDeInformes';
import FormularioFiltrosInforme from '../components/FormularioFiltrosInforme';
import TablaHistorialInformes from '../components/TablaHistorialInformes';
import {
  obtenerPlantillasInformes,
  solicitarGeneracionInforme,
  PlantillaInforme,
  FiltrosInforme,
} from '../api/informesAcreditacionApi';

interface InformesAcreditacionPageProps {
  onVolver?: () => void;
}

export default function InformesAcreditacionPage({ onVolver }: InformesAcreditacionPageProps) {
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<string | null>(null);
  const [plantillaData, setPlantillaData] = useState<PlantillaInforme | null>(null);
  const [filtros, setFiltros] = useState<FiltrosInforme>({
    fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
    fechaFin: new Date(),
  });
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [refreshHistorial, setRefreshHistorial] = useState(0);

  useEffect(() => {
    if (plantillaSeleccionada) {
      cargarDatosPlantilla();
    }
  }, [plantillaSeleccionada]);

  const cargarDatosPlantilla = async () => {
    try {
      const plantillas = await obtenerPlantillasInformes();
      const plantilla = plantillas.find((p) => p.id === plantillaSeleccionada);
      if (plantilla) {
        setPlantillaData(plantilla);
      }
    } catch (err) {
      console.error('Error al cargar datos de plantilla:', err);
    }
  };

  const validarFiltros = (): string | null => {
    if (!plantillaSeleccionada) {
      return 'Por favor, selecciona un tipo de informe';
    }

    if (filtros.fechaInicio > filtros.fechaFin) {
      return 'La fecha de inicio no puede ser posterior a la fecha de fin';
    }

    return null;
  };

  const handleGenerarInforme = async () => {
    setError(null);
    setExito(null);

    const errorValidacion = validarFiltros();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      setGenerando(true);
      const respuesta = await solicitarGeneracionInforme({
        plantillaId: plantillaSeleccionada!,
        filtros,
      });

      setExito(respuesta.mensaje || 'La generación del informe ha comenzado. Puedes consultar el estado en el historial.');
      
      // Limpiar formulario
      setPlantillaSeleccionada(null);
      setPlantillaData(null);
      setFiltros({
        fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        fechaFin: new Date(),
      });

      // Forzar actualización del historial
      setRefreshHistorial((prev) => prev + 1);
    } catch (err) {
      console.error('Error al generar informe:', err);
      setError(err instanceof Error ? err.message : 'Error al generar el informe. Por favor, intenta de nuevo.');
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-xl mr-4 transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
              )}
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Informes de Acreditación/Normativas
                </h1>
                <p className="text-gray-600">
                  Genera informes de acreditación, certificaciones y cumplimiento normativo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Mensajes de éxito/error */}
          {exito && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-green-800 font-medium">{exito}</p>
              </div>
              <button
                onClick={() => setExito(null)}
                className="text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          )}

          {/* Sección de Generación de Informe */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Generar Nuevo Informe</h2>

            {/* Paso 1: Seleccionar Plantilla */}
            <div className="mb-8">
              <SelectorDeInformes
                plantillaSeleccionada={plantillaSeleccionada}
                onPlantillaSeleccionada={setPlantillaSeleccionada}
                error={plantillaSeleccionada === null && error?.includes('selecciona') ? error : undefined}
              />
            </div>

            {/* Paso 2: Configurar Filtros */}
            {plantillaSeleccionada && plantillaData && (
              <div className="mb-8">
                <FormularioFiltrosInforme
                  filtros={filtros}
                  onFiltrosChange={setFiltros}
                  filtrosDisponibles={plantillaData.filtrosDisponibles}
                  error={error && !error.includes('selecciona') ? error : undefined}
                />
              </div>
            )}

            {/* Botón de Generar */}
            {plantillaSeleccionada && (
              <div className="flex items-center justify-end">
                <button
                  onClick={handleGenerarInforme}
                  disabled={generando || !plantillaSeleccionada}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generando ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Generando informe...
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      Generar Informe
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sección de Historial */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <TablaHistorialInformes
              key={refreshHistorial}
              autoRefresh={true}
              refreshInterval={5000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}



