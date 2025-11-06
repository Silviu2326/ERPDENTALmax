import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Role, crearRol, actualizarRol } from '../api/rolesApi';

interface ModalGestionRolProps {
  rol: Role | null;
  onClose: () => void;
  onGuardado: () => void;
}

export default function ModalGestionRol({ rol, onClose, onGuardado }: ModalGestionRolProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (rol) {
      setNombre(rol.nombre || '');
      setDescripcion(rol.descripcion || '');
    } else {
      setNombre('');
      setDescripcion('');
    }
    setError(null);
  }, [rol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      setError('El nombre del rol es obligatorio');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      if (rol?._id) {
        await actualizarRol(rol._id, { nombre, descripcion });
      } else {
        await crearRol({ nombre, descripcion, permisos: [] });
      }
      onGuardado();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el rol');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {rol ? 'Editar Rol' : 'Nuevo Rol'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={guardando}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Rol <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Jefe de Almacén"
              disabled={guardando}
              required
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción del rol y sus responsabilidades..."
              rows={3}
              disabled={guardando}
            />
          </div>

          {rol?.isSystemRole && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              <p className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Este es un rol del sistema. Solo puedes modificar su descripción.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || !nombre.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {guardando ? 'Guardando...' : rol ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


