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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Asignar Técnico
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Buscar técnico */}
          {tecnicosDisponibles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar técnico
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {busqueda && tecnicosFiltrados.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                  {tecnicosFiltrados.map((tec) => (
                    <button
                      key={tec}
                      onClick={() => {
                        setTecnicoSeleccionado(tec);
                        setBusqueda('');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Técnico asignado
            </label>
            <input
              type="text"
              value={tecnicoSeleccionado}
              onChange={(e) => setTecnicoSeleccionado(e.target.value)}
              placeholder="Nombre del técnico interno o externo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Puede ser un técnico interno o un proveedor externo
            </p>
          </div>

          {tecnicoActual && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Técnico actual:</strong> {tecnicoActual}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          {tecnicoActual && (
            <button
              onClick={handleEliminarAsignacion}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Eliminar asignación
            </button>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={!tecnicoSeleccionado.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


