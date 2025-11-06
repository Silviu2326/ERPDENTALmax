import { useState } from 'react';
import { X, Save } from 'lucide-react';
import SelectorTratamientos from './SelectorTratamientos';
import { NuevoHallazgo } from '../../api/odontogramaApi';

interface ModalAgregarTratamientoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hallazgo: NuevoHallazgo) => void;
  dienteId: number;
  dienteNombre: string;
}

const SUPERFICIES_DISPONIBLES = [
  { codigo: 'oclusal', label: 'Oclusal', descripcion: 'Superficie de masticación' },
  { codigo: 'mesial', label: 'Mesial', descripcion: 'Hacia la línea media' },
  { codigo: 'distal', label: 'Distal', descripcion: 'Alejado de la línea media' },
  { codigo: 'vestibular', label: 'Vestibular', descripcion: 'Hacia los labios/mejillas' },
  { codigo: 'lingual', label: 'Lingual', descripcion: 'Hacia la lengua' },
];

export default function ModalAgregarTratamiento({
  isOpen,
  onClose,
  onSave,
  dienteId,
  dienteNombre,
}: ModalAgregarTratamientoProps) {
  const [tratamiento, setTratamiento] = useState<{ codigo: string; nombre: string } | null>(null);
  const [superficies, setSuperficies] = useState<string[]>([]);
  const [estado, setEstado] = useState<'diagnostico' | 'planificado'>('diagnostico');
  const [nota, setNota] = useState('');

  if (!isOpen) return null;

  const handleSuperficieToggle = (codigo: string) => {
    setSuperficies((prev) =>
      prev.includes(codigo) ? prev.filter((s) => s !== codigo) : [...prev, codigo]
    );
  };

  const handleSave = () => {
    if (!tratamiento || superficies.length === 0) {
      alert('Por favor, selecciona un tratamiento y al menos una superficie');
      return;
    }

    const nuevoHallazgo: NuevoHallazgo = {
      dienteId,
      superficies,
      codigoTratamiento: tratamiento.codigo,
      estado,
      nota: nota.trim() || undefined,
    };

    onSave(nuevoHallazgo);
    handleClose();
  };

  const handleClose = () => {
    setTratamiento(null);
    setSuperficies([]);
    setEstado('diagnostico');
    setNota('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Agregar Tratamiento - Diente {dienteId}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">{dienteNombre}</p>

            <div className="space-y-4">
              {/* Selector de tratamiento */}
              <SelectorTratamientos
                onSelect={(trat) => setTratamiento(trat)}
                selected={tratamiento}
              />

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEstado('diagnostico')}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      estado === 'diagnostico'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-900'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Diagnóstico
                  </button>
                  <button
                    type="button"
                    onClick={() => setEstado('planificado')}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      estado === 'planificado'
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Planificado
                  </button>
                </div>
              </div>

              {/* Superficies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Superficies Afectadas
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SUPERFICIES_DISPONIBLES.map((superficie) => (
                    <button
                      key={superficie.codigo}
                      type="button"
                      onClick={() => handleSuperficieToggle(superficie.codigo)}
                      className={`px-3 py-2 rounded-lg border-2 transition-colors text-sm ${
                        superficies.includes(superficie.codigo)
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                      title={superficie.descripcion}
                    >
                      {superficie.label}
                    </button>
                  ))}
                </div>
                {superficies.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Selecciona al menos una superficie
                  </p>
                )}
              </div>

              {/* Nota */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nota (opcional)
                </label>
                <textarea
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              disabled={!tratamiento || superficies.length === 0}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


