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
      <label className="block text-sm font-medium text-slate-700 mb-2">
        <FileText size={16} className="inline mr-1" />
        Seleccionar Plantilla
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FileText className="h-5 w-5 text-slate-400" />
        </div>
        <button
          type="button"
          onClick={() => setMostrarLista(!mostrarLista)}
          className="w-full flex items-center justify-between rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5 transition-all"
        >
          <span className={plantillaSeleccionada ? 'text-slate-900' : 'text-slate-400'}>
            {plantillaSeleccionada ? plantillaSeleccionada.nombre : 'Selecciona una plantilla...'}
          </span>
          {mostrarLista ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
      </div>

      {mostrarLista && (
        <div className="absolute z-10 w-full mt-1 bg-white ring-1 ring-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-500">Cargando plantillas...</div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-red-600">{error}</div>
          ) : plantillas.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">No hay plantillas disponibles</div>
          ) : (
            <ul className="py-1">
              {plantillas.map((plantilla) => (
                <li
                  key={plantilla._id}
                  onClick={() => handleSeleccionar(plantilla)}
                  className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                    plantillaSeleccionada?._id === plantilla._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{plantilla.nombre}</span>
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
        <div className="mt-2 p-3 bg-blue-50 rounded-xl ring-1 ring-blue-200/70">
          <p className="text-sm text-slate-700">
            <span className="font-medium">Tipo:</span> {plantillaSeleccionada.tipo}
          </p>
          {plantillaSeleccionada.variables.length > 0 && (
            <p className="text-sm text-slate-600 mt-1">
              <span className="font-medium">Variables disponibles:</span>{' '}
              {plantillaSeleccionada.variables.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}



