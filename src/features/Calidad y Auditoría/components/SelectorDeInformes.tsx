import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
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
      <div className="p-8 text-center bg-white shadow-sm rounded-xl">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando plantillas...</p>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="p-8 text-center bg-white shadow-sm rounded-xl">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{errorCarga}</p>
        <button
          onClick={cargarPlantillas}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Seleccionar Tipo de Informe
        </label>
        {error && (
          <p className="text-red-600 text-sm mb-2">{error}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plantillas.map((plantilla) => (
          <button
            key={plantilla.id}
            onClick={() => onPlantillaSeleccionada(plantilla.id)}
            className={`p-4 rounded-xl transition-all text-left h-full flex flex-col ${
              plantillaSeleccionada === plantilla.id
                ? 'bg-white ring-2 ring-blue-500 shadow-sm'
                : 'bg-white ring-1 ring-slate-200 hover:ring-blue-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between flex-1">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={20} className={
                    plantillaSeleccionada === plantilla.id ? 'text-blue-600' : 'text-slate-600'
                  } />
                  <h3 className="font-semibold text-gray-900">{plantilla.nombre}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{plantilla.descripcion}</p>
                {plantilla.filtrosDisponibles && plantilla.filtrosDisponibles.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {plantilla.filtrosDisponibles.map((filtro) => (
                      <span
                        key={filtro}
                        className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg"
                      >
                        {filtro}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {plantillaSeleccionada === plantilla.id && (
                <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0 ml-2" />
              )}
            </div>
          </button>
        ))}
      </div>

      {plantillas.length === 0 && (
        <div className="p-8 text-center bg-white shadow-sm rounded-xl">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay plantillas disponibles</h3>
          <p className="text-gray-600">No hay plantillas de informes disponibles</p>
        </div>
      )}
    </div>
  );
}



