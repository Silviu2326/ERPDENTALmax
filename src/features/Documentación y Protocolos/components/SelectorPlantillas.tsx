import { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { PlantillaDocumento, obtenerPlantillas } from '../api/documentosApi';

interface SelectorPlantillasProps {
  plantillaSeleccionada: PlantillaDocumento | null;
  onPlantillaSeleccionada: (plantilla: PlantillaDocumento) => void;
  tipoFiltro?: string;
}

export default function SelectorPlantillas({
  plantillaSeleccionada,
  onPlantillaSeleccionada,
  tipoFiltro,
}: SelectorPlantillasProps) {
  const [plantillas, setPlantillas] = useState<PlantillaDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
    cargarPlantillas();
  }, [tipoFiltro]);

  const cargarPlantillas = async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerPlantillas(tipoFiltro);
      setPlantillas(datos.filter(p => p.activo));
    } catch (err) {
      setError('Error al cargar plantillas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionar = (plantilla: PlantillaDocumento) => {
    onPlantillaSeleccionada(plantilla);
    setMostrarLista(false);
  };

  const getTipoColor = (tipo: string) => {
    const colores: Record<string, string> = {
      'Consentimiento': 'bg-blue-100 text-blue-800',
      'Presupuesto': 'bg-green-100 text-green-800',
      'Informe': 'bg-purple-100 text-purple-800',
      'Receta': 'bg-orange-100 text-orange-800',
      'Otro': 'bg-gray-100 text-gray-800',
    };
    return colores[tipo] || colores['Otro'];
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Seleccionar Plantilla
      </label>
      <button
        type="button"
        onClick={() => setMostrarLista(!mostrarLista)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-gray-400" />
          <span className={plantillaSeleccionada ? 'text-gray-900' : 'text-gray-500'}>
            {plantillaSeleccionada ? plantillaSeleccionada.nombre : 'Selecciona una plantilla...'}
          </span>
        </div>
        {mostrarLista ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {mostrarLista && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Cargando plantillas...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : plantillas.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No hay plantillas disponibles</div>
          ) : (
            <ul className="py-1">
              {plantillas.map((plantilla) => (
                <li
                  key={plantilla._id}
                  onClick={() => handleSeleccionar(plantilla)}
                  className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                    plantillaSeleccionada?._id === plantilla._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{plantilla.nombre}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(plantilla.tipo)}`}>
                      {plantilla.tipo}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {plantillaSeleccionada && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Tipo:</span> {plantillaSeleccionada.tipo}
          </p>
          {plantillaSeleccionada.variables.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Variables disponibles:</span>{' '}
              {plantillaSeleccionada.variables.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


