import { useState } from 'react';
import { X, User, Search } from 'lucide-react';

interface ModalAsignarTecnicoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (tecnico: string) => void;
  tecnicoActual?: string;
  tecnicosDisponibles?: string[];
}

export default function ModalAsignarTecnico({
  isOpen,
  onClose,
  onConfirmar,
  tecnicoActual,
  tecnicosDisponibles = [],
}: ModalAsignarTecnicoProps) {
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState(tecnicoActual || '');
  const [busqueda, setBusqueda] = useState('');

  if (!isOpen) return null;

  const tecnicosFiltrados = tecnicosDisponibles.filter((tec) =>
    tec.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleConfirmar = () => {
    if (tecnicoSeleccionado.trim()) {
      onConfirmar(tecnicoSeleccionado.trim());
      setTecnicoSeleccionado('');
      setBusqueda('');
      onClose();
    }
  };

  const handleEliminarAsignacion = () => {
    onConfirmar('');
    setTecnicoSeleccionado('');
    setBusqueda('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 ring-1 ring-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <User size={20} className="text-blue-600" />
            </div>
            Asignar Técnico
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Buscar técnico */}
          {tecnicosDisponibles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Search size={16} className="inline mr-1" />
                Buscar técnico
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              {busqueda && tecnicosFiltrados.length > 0 && (
                <div className="mt-2 border border-slate-200 rounded-xl max-h-40 overflow-y-auto bg-white shadow-sm">
                  {tecnicosFiltrados.map((tec) => (
                    <button
                      key={tec}
                      onClick={() => {
                        setTecnicoSeleccionado(tec);
                        setBusqueda('');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors text-sm text-gray-900"
                    >
                      {tec}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Input manual */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Técnico asignado
            </label>
            <input
              type="text"
              value={tecnicoSeleccionado}
              onChange={(e) => setTecnicoSeleccionado(e.target.value)}
              placeholder="Nombre del técnico interno o externo"
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            />
            <p className="mt-1 text-xs text-slate-500">
              Puede ser un técnico interno o un proveedor externo
            </p>
          </div>

          {tecnicoActual && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 ring-1 ring-blue-200/50">
              <p className="text-sm text-blue-800">
                <strong>Técnico actual:</strong> {tecnicoActual}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          {tecnicoActual && (
            <button
              onClick={handleEliminarAsignacion}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium transition-colors rounded-xl hover:bg-red-50"
            >
              Eliminar asignación
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white shadow-sm ring-1 ring-slate-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={!tecnicoSeleccionado.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



