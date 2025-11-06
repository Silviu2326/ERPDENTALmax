import { useState, useEffect } from 'react';
import { Protocolo, NuevoProtocolo, ActualizarProtocolo } from '../api/protocolosApi';
import { X, Save, AlertCircle } from 'lucide-react';

interface ModalGestionProtocoloProps {
  protocolo?: Protocolo | null;
  onGuardar: (protocoloId: string, datos: ActualizarProtocolo) => void | ((datos: NuevoProtocolo) => void);
  onCerrar: () => void;
}

export default function ModalGestionProtocolo({
  protocolo,
  onGuardar,
  onCerrar,
}: ModalGestionProtocoloProps) {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [contenido, setContenido] = useState('');
  const [sedesAsignadas, setSedesAsignadas] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Datos mock de sedes (en producción vendrían de una API)
  const sedesDisponibles = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

  useEffect(() => {
    if (protocolo) {
      // Modo edición
      setTitulo(protocolo.titulo);
      setCategoria(protocolo.categoria);
      const versionActual = protocolo.versiones?.find(
        (v) => v.version === protocolo.versionActual
      );
      setContenido(versionActual?.contenido || '');
      setSedesAsignadas(protocolo.sedes?.map((s) => s._id) || []);
    } else {
      // Modo creación
      setTitulo('');
      setCategoria('');
      setContenido('');
      setSedesAsignadas([]);
    }
  }, [protocolo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titulo.trim() || !categoria.trim() || !contenido.trim()) {
      setError('Por favor, complete todos los campos requeridos');
      return;
    }

    if (sedesAsignadas.length === 0) {
      setError('Debe asignar al menos una sede');
      return;
    }

    try {
      setGuardando(true);
      if (protocolo) {
        // Actualizar protocolo existente
        await (onGuardar as (protocoloId: string, datos: ActualizarProtocolo) => void)(
          protocolo._id,
          { titulo, contenido }
        );
      } else {
        // Crear nuevo protocolo
        await (onGuardar as (datos: NuevoProtocolo) => void)({
          titulo,
          categoria,
          contenido,
          sedesAsignadas,
        });
      }
      onCerrar();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el protocolo');
    } finally {
      setGuardando(false);
    }
  };

  const toggleSede = (sedeId: string) => {
    if (sedesAsignadas.includes(sedeId)) {
      setSedesAsignadas(sedesAsignadas.filter((id) => id !== sedeId));
    } else {
      setSedesAsignadas([...sedesAsignadas, sedeId]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {protocolo ? 'Editar Protocolo' : 'Nuevo Protocolo'}
          </h2>
          <button
            onClick={onCerrar}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Protocolo de limpieza de superficies"
                required
              />
            </div>

            {/* Categoría (solo en creación) */}
            {!protocolo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="Limpieza de superficies">Limpieza de superficies</option>
                  <option value="Esterilización de instrumental">Esterilización de instrumental</option>
                  <option value="Limpieza de gabinetes">Limpieza de gabinetes</option>
                  <option value="Gestión de residuos">Gestión de residuos</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
            )}

            {/* Sedes (solo en creación) */}
            {!protocolo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sedes Asignadas <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {sedesDisponibles.map((sede) => (
                    <label
                      key={sede._id}
                      className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={sedesAsignadas.includes(sede._id)}
                        onChange={() => toggleSede(sede._id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{sede.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Contenido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido <span className="text-red-500">*</span>
              </label>
              <textarea
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Ingrese el contenido del protocolo (puede usar HTML/Markdown básico)"
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                Puede usar formato HTML básico para formatear el contenido (p. ej., &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, etc.)
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3 bg-gray-50">
          <button
            type="button"
            onClick={onCerrar}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={guardando}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{guardando ? 'Guardando...' : protocolo ? 'Actualizar Protocolo' : 'Crear Protocolo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


