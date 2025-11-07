import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Search, X, RefreshCw } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleCrearNueva}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        >
          <Plus size={20} />
          <span>Nueva Plantilla</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
            />
          </div>
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
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
      </div>

      {/* Lista de plantillas */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <RefreshCw size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando plantillas...</p>
        </div>
      ) : plantillasFiltradas.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay plantillas disponibles</h3>
          <p className="text-gray-600 mb-4">Crea tu primera plantilla para comenzar</p>
          <button
            onClick={handleCrearNueva}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus size={20} />
            <span>Nueva Plantilla</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plantillasFiltradas.map((plantilla) => (
            <div
              key={plantilla._id}
              className="bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  <h4 className="font-semibold text-gray-900">{plantilla.nombre}</h4>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(plantilla.tipo)}`}>
                  {plantilla.tipo}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{plantilla.asunto}</p>
              
              {plantilla.placeholdersDisponibles.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-1">Placeholders:</p>
                  <div className="flex flex-wrap gap-1">
                    {plantilla.placeholdersDisponibles.slice(0, 3).map((placeholder, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                        {`{{${placeholder}}}`}
                      </span>
                    ))}
                    {plantilla.placeholdersDisponibles.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                        +{plantilla.placeholdersDisponibles.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 mt-auto pt-3 border-t border-gray-100">
                {onPlantillaSeleccionada && (
                  <button
                    onClick={() => onPlantillaSeleccionada(plantilla)}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  >
                    Seleccionar
                  </button>
                )}
                <button
                  onClick={() => handleEditar(plantilla)}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setMostrarConfirmacionEliminar(plantilla._id!)}
                  className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
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
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setMostrarConfirmacionEliminar(null)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleEliminar(mostrarConfirmacionEliminar)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-red-600 text-white hover:bg-red-700 shadow-sm"
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



