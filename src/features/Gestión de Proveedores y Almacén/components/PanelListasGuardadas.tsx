import { useState, useEffect } from 'react';
import { Bookmark, Trash2, Loader2, X, Plus } from 'lucide-react';
import { ListaGuardada, obtenerListasGuardadas, eliminarListaGuardada, FiltrosPacientes } from '../api/listasPacientesApi';

interface PanelListasGuardadasProps {
  isOpen: boolean;
  onClose: () => void;
  onCargarLista: (filtros: FiltrosPacientes) => void;
  onGuardarLista: (nombre: string, filtros: FiltrosPacientes) => Promise<void>;
  filtrosActuales?: FiltrosPacientes;
}

export default function PanelListasGuardadas({
  isOpen,
  onClose,
  onCargarLista,
  onGuardarLista,
  filtrosActuales: filtrosProp,
}: PanelListasGuardadasProps) {
  const [listas, setListas] = useState<ListaGuardada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreNuevaLista, setNombreNuevaLista] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarListas();
    }
  }, [isOpen]);

  const cargarListas = async () => {
    setLoading(true);
    setError(null);
    try {
      const listasGuardadas = await obtenerListasGuardadas();
      setListas(listasGuardadas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las listas guardadas');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta lista guardada?')) {
      return;
    }

    try {
      await eliminarListaGuardada(id);
      setListas(listas.filter(l => l._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar la lista');
    }
  };

  const handleCargarLista = (filtros: FiltrosPacientes) => {
    onCargarLista(filtros);
    onClose();
  };

  const handleGuardarLista = async () => {
    if (!nombreNuevaLista.trim()) {
      alert('Por favor, ingresa un nombre para la lista');
      return;
    }

    if (!filtrosProp || Object.keys(filtrosProp).length === 0) {
      alert('No hay filtros para guardar. Aplica algunos filtros primero.');
      return;
    }

    setGuardando(true);
    try {
      await onGuardarLista(nombreNuevaLista, filtrosProp);
      setNombreNuevaLista('');
      setMostrarFormulario(false);
      await cargarListas();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar la lista');
    } finally {
      setGuardando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return fecha;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Listas Guardadas</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando listas guardadas...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {listas.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay listas guardadas</h3>
                  <p className="text-gray-600 mb-4">Guarda tus filtros para reutilizarlos más tarde</p>
                </div>
              ) : (
                listas.map((lista) => (
                  <div
                    key={lista._id}
                    className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{lista.nombre}</h3>
                        <p className="text-sm text-slate-600 mb-2">
                          Creada por {lista.creadoPor.name} el {formatearFecha(lista.fechaCreacion)}
                        </p>
                        <button
                          onClick={() => handleCargarLista(lista.filtros)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Cargar lista →
                        </button>
                      </div>
                      <button
                        onClick={() => handleEliminar(lista._id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                        title="Eliminar lista"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-6 bg-slate-50">
          {!mostrarFormulario ? (
            <button
              onClick={() => {
                if (!filtrosProp || Object.keys(filtrosProp).length === 0) {
                  alert('No hay filtros para guardar. Aplica algunos filtros primero.');
                  return;
                }
                setMostrarFormulario(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-all shadow-sm ring-1 ring-blue-600/20"
            >
              <Plus size={20} className="mr-2" />
              Guardar Lista Actual
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de la lista
                </label>
                <input
                  type="text"
                  value={nombreNuevaLista}
                  onChange={(e) => setNombreNuevaLista(e.target.value)}
                  placeholder="Ej: Pacientes Blanqueamiento + Kit"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setMostrarFormulario(false);
                    setNombreNuevaLista('');
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-all ring-1 ring-slate-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarLista}
                  disabled={guardando || !nombreNuevaLista.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-all shadow-sm ring-1 ring-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

