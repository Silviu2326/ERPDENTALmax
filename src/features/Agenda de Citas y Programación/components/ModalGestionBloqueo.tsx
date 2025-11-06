import { useState } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { Bloqueo, crearBloqueo, actualizarBloqueo, eliminarBloqueo, NuevoBloqueo } from '../api/bloqueosApi';
import FormularioBloqueo from './FormularioBloqueo';

interface ModalGestionBloqueoProps {
  bloqueo?: Bloqueo | null;
  fechaSeleccionada?: Date;
  horaSeleccionada?: string;
  sedeId?: string;
  onClose: () => void;
  onSave: () => void;
}

export default function ModalGestionBloqueo({
  bloqueo,
  fechaSeleccionada,
  horaSeleccionada,
  sedeId,
  onClose,
  onSave,
}: ModalGestionBloqueoProps) {
  const [formData, setFormData] = useState<NuevoBloqueo | null>(null);
  const [valido, setValido] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarConfirmarEliminar, setMostrarConfirmarEliminar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData || !valido) {
      setError('Por favor, complete todos los campos requeridos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (bloqueo?._id) {
        await actualizarBloqueo(bloqueo._id, formData);
      } else {
        await crearBloqueo(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el bloqueo');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!bloqueo?._id) return;

    setLoading(true);
    setError(null);

    try {
      await eliminarBloqueo(bloqueo._id);
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el bloqueo');
    } finally {
      setLoading(false);
      setMostrarConfirmarEliminar(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {bloqueo ? 'Editar Bloqueo' : 'Crear Bloqueo de Sala/Horario'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <FormularioBloqueo
            bloqueo={bloqueo}
            fechaSeleccionada={fechaSeleccionada}
            horaSeleccionada={horaSeleccionada}
            sedeId={sedeId || bloqueo?.sede._id}
            onValidar={setValido}
            onFormDataChange={setFormData}
          />

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            {bloqueo?._id && (
              <button
                type="button"
                onClick={() => setMostrarConfirmarEliminar(true)}
                className="px-4 py-2 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
              >
                Eliminar
              </button>
            )}
            <div className="flex justify-end space-x-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !valido}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Guardando...' : bloqueo ? 'Actualizar' : 'Crear Bloqueo'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Modal de confirmación de eliminación */}
        {mostrarConfirmarEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Eliminación</h3>
              <p className="text-gray-600 mb-6">
                ¿Está seguro de que desea eliminar este bloqueo? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarEliminar(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleEliminar}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


