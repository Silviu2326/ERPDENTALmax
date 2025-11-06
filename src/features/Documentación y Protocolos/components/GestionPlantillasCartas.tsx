import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Search, X } from 'lucide-react';
import { PlantillaCarta, obtenerTodasLasPlantillas, eliminarPlantilla } from '../api/plantillasCartaApi';
import EditorPlantillaCarta from './EditorPlantillaCarta';

interface GestionPlantillasCartasProps {
  onPlantillaSeleccionada?: (plantilla: PlantillaCarta) => void;
}

export default function GestionPlantillasCartas({ onPlantillaSeleccionada }: GestionPlantillasCartasProps) {
  const [plantillas, setPlantillas] = useState<PlantillaCarta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('');
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [plantillaEditando, setPlantillaEditando] = useState<PlantillaCarta | null>(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState<string | null>(null);

  useEffect(() => {
    cargarPlantillas();
  }, [tipoFiltro]);

  const cargarPlantillas = async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerTodasLasPlantillas(tipoFiltro || undefined);
      setPlantillas(datos);
    } catch (err) {
      setError('Error al cargar plantillas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearNueva = () => {
    setPlantillaEditando(null);
    setMostrarEditor(true);
  };

  const handleEditar = (plantilla: PlantillaCarta) => {
    setPlantillaEditando(plantilla);
    setMostrarEditor(true);
  };

  const handleEliminar = async (id: string) => {
    try {
      await eliminarPlantilla(id);
      await cargarPlantillas();
      setMostrarConfirmacionEliminar(null);
    } catch (err) {
      setError('Error al eliminar plantilla');
      console.error(err);
    }
  };

  const handleGuardarPlantilla = () => {
    setMostrarEditor(false);
    setPlantillaEditando(null);
    cargarPlantillas();
  };

  const plantillasFiltradas = plantillas.filter(p => {
    const matchBusqueda = busqueda === '' || 
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.asunto.toLowerCase().includes(busqueda.toLowerCase());
    return matchBusqueda;
  });

  const getTipoColor = (tipo: string) => {
    const colores: Record<string, string> = {
      'bienvenida': 'bg-green-100 text-green-800',
      'marketing': 'bg-purple-100 text-purple-800',
      'recordatorio': 'bg-blue-100 text-blue-800',
      'post-operatorio': 'bg-orange-100 text-orange-800',
      'cumpleaños': 'bg-pink-100 text-pink-800',
      'promocion': 'bg-yellow-100 text-yellow-800',
    };
    return colores[tipo] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Plantillas de Cartas</h3>
        <button
          onClick={handleCrearNueva}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Plantilla</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar plantillas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos los tipos</option>
          <option value="bienvenida">Bienvenida</option>
          <option value="marketing">Marketing</option>
          <option value="recordatorio">Recordatorio</option>
          <option value="post-operatorio">Post-operatorio</option>
          <option value="cumpleaños">Cumpleaños</option>
          <option value="promocion">Promoción</option>
        </select>
      </div>

      {/* Lista de plantillas */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando plantillas...</div>
      ) : plantillasFiltradas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No hay plantillas disponibles</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plantillasFiltradas.map((plantilla) => (
            <div
              key={plantilla._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">{plantilla.nombre}</h4>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(plantilla.tipo)}`}>
                  {plantilla.tipo}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{plantilla.asunto}</p>
              
              {plantilla.placeholdersDisponibles.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Placeholders:</p>
                  <div className="flex flex-wrap gap-1">
                    {plantilla.placeholdersDisponibles.slice(0, 3).map((placeholder, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {`{{${placeholder}}}`}
                      </span>
                    ))}
                    {plantilla.placeholdersDisponibles.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{plantilla.placeholdersDisponibles.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 mt-4">
                {onPlantillaSeleccionada && (
                  <button
                    onClick={() => onPlantillaSeleccionada(plantilla)}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Seleccionar
                  </button>
                )}
                <button
                  onClick={() => handleEditar(plantilla)}
                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMostrarConfirmacionEliminar(plantilla._id!)}
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {mostrarConfirmacionEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar eliminación</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setMostrarConfirmacionEliminar(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleEliminar(mostrarConfirmacionEliminar)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de editor */}
      {mostrarEditor && (
        <EditorPlantillaCarta
          plantilla={plantillaEditando}
          onGuardar={handleGuardarPlantilla}
          onCancelar={() => {
            setMostrarEditor(false);
            setPlantillaEditando(null);
          }}
        />
      )}
    </div>
  );
}


