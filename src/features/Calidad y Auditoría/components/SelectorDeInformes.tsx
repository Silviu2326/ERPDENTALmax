import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { obtenerPlantillasInformes, PlantillaInforme } from '../api/informesAcreditacionApi';

interface SelectorDeInformesProps {
  plantillaSeleccionada: string | null;
  onPlantillaSeleccionada: (plantillaId: string) => void;
  error?: string;
}

export default function SelectorDeInformes({
  plantillaSeleccionada,
  onPlantillaSeleccionada,
  error,
}: SelectorDeInformesProps) {
  const [plantillas, setPlantillas] = useState<PlantillaInforme[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const cargarPlantillas = async () => {
    try {
      setLoading(true);
      setErrorCarga(null);
      const datos = await obtenerPlantillasInformes();
      setPlantillas(datos);
    } catch (err) {
      console.error('Error al cargar plantillas:', err);
      setErrorCarga(err instanceof Error ? err.message : 'Error al cargar plantillas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
        <span className="text-gray-600">Cargando plantillas...</span>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">{errorCarga}</p>
        <button
          onClick={cargarPlantillas}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Tipo de Informe
        </label>
        {error && (
          <p className="text-red-600 text-sm mb-2">{error}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plantillas.map((plantilla) => (
          <button
            key={plantilla.id}
            onClick={() => onPlantillaSeleccionada(plantilla.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              plantillaSeleccionada === plantilla.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className={`w-5 h-5 ${
                    plantillaSeleccionada === plantilla.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <h3 className="font-semibold text-gray-900">{plantilla.nombre}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{plantilla.descripcion}</p>
                {plantilla.filtrosDisponibles && plantilla.filtrosDisponibles.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {plantilla.filtrosDisponibles.map((filtro) => (
                      <span
                        key={filtro}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {filtro}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {plantillaSeleccionada === plantilla.id && (
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
              )}
            </div>
          </button>
        ))}
      </div>

      {plantillas.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No hay plantillas de informes disponibles</p>
        </div>
      )}
    </div>
  );
}


