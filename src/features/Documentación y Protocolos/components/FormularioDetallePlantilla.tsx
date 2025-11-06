import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { DocumentoPlantilla } from '../api/plantillasApi';
import EditorTextoEnriquecidoConPlaceholders from './EditorTextoEnriquecidoConPlaceholders';
import SelectorDePlaceholders from './SelectorDePlaceholders';
import { PlaceholdersDisponibles } from '../api/plantillasApi';
import { obtenerPlaceholdersDisponibles } from '../api/plantillasApi';

interface FormularioDetallePlantillaProps {
  plantilla?: DocumentoPlantilla | null;
  onGuardar: (plantilla: Omit<DocumentoPlantilla, '_id' | 'version' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

export default function FormularioDetallePlantilla({
  plantilla,
  onGuardar,
  onCancelar,
  loading = false,
}: FormularioDetallePlantillaProps) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<DocumentoPlantilla['tipo']>('otro');
  const [contenidoHTML, setContenidoHTML] = useState('');
  const [sedeId, setSedeId] = useState<string | null>(null);
  const [activa, setActiva] = useState(true);
  const [placeholders, setPlaceholders] = useState<PlaceholdersDisponibles>({
    paciente: [],
    tratamiento: [],
    doctor: [],
    clinica: [],
    cita: [],
  });
  const [loadingPlaceholders, setLoadingPlaceholders] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (plantilla) {
      setNombre(plantilla.nombre);
      setTipo(plantilla.tipo);
      setContenidoHTML(plantilla.contenidoHTML);
      setSedeId(plantilla.sedeId || null);
      setActiva(plantilla.activa);
    } else {
      // Valores por defecto para nueva plantilla
      setNombre('');
      setTipo('otro');
      setContenidoHTML('');
      setSedeId(null);
      setActiva(true);
    }
  }, [plantilla]);

  useEffect(() => {
    // Cargar placeholders disponibles
    const cargarPlaceholders = async () => {
      setLoadingPlaceholders(true);
      try {
        const data = await obtenerPlaceholdersDisponibles();
        setPlaceholders(data);
      } catch (err) {
        console.error('Error al cargar placeholders:', err);
      } finally {
        setLoadingPlaceholders(false);
      }
    };

    cargarPlaceholders();
  }, []);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!contenidoHTML.trim()) {
      setError('El contenido es obligatorio');
      return;
    }

    setError(null);
    try {
      await onGuardar({
        nombre: nombre.trim(),
        tipo,
        contenidoHTML,
        sedeId: sedeId || null,
        activa,
      });
    } catch (err: any) {
      setError(err.message || 'Error al guardar la plantilla');
    }
  };

  const handleInsertarPlaceholder = (placeholder: string) => {
    // El placeholder se inserta automáticamente en el editor
    // Este método se puede usar para cualquier lógica adicional
    console.log('Placeholder insertado:', placeholder);
  };

  const tipos: Array<{ value: DocumentoPlantilla['tipo']; label: string }> = [
    { value: 'consentimiento', label: 'Consentimiento' },
    { value: 'prescripcion', label: 'Prescripción' },
    { value: 'informe', label: 'Informe' },
    { value: 'justificante', label: 'Justificante' },
    { value: 'presupuesto', label: 'Presupuesto' },
    { value: 'otro', label: 'Otro' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {plantilla ? 'Editar Plantilla' : 'Nueva Plantilla'}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onCancelar}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>
          <button
            onClick={handleGuardar}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Plantilla *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Consentimiento Informado - Implantes"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Documento *
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as DocumentoPlantilla['tipo'])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              {tipos.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sede (opcional)
            </label>
            <input
              type="text"
              value={sedeId || ''}
              onChange={(e) => setSedeId(e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Dejar vacío para plantilla global"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Dejar vacío para crear una plantilla global (disponible para todas las sedes)
            </p>
          </div>

          <div>
            <label className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                checked={activa}
                onChange={(e) => setActiva(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={loading}
              />
              <span className="text-sm font-medium text-gray-700">Plantilla activa</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Las plantillas inactivas no estarán disponibles para generar documentos
            </p>
          </div>
        </div>

        {/* Editor de contenido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido de la Plantilla *
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <EditorTextoEnriquecidoConPlaceholders
                contenido={contenidoHTML}
                onChange={setContenidoHTML}
                onInsertarPlaceholder={handleInsertarPlaceholder}
                disabled={loading}
              />
            </div>
            <div className="lg:col-span-1">
              {loadingPlaceholders ? (
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Cargando placeholders...</p>
                  </div>
                </div>
              ) : (
                <SelectorDePlaceholders
                  placeholders={placeholders}
                  onInsertarPlaceholder={(placeholder) => {
                    // Insertar placeholder en el editor
                    const editor = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
                    if (editor) {
                      const selection = window.getSelection();
                      if (selection && selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        range.deleteContents();
                        const span = document.createElement('span');
                        span.style.backgroundColor = '#fef3c7';
                        span.style.padding = '2px 4px';
                        span.style.borderRadius = '3px';
                        span.style.fontFamily = 'monospace';
                        span.textContent = placeholder;
                        range.insertNode(span);
                        range.setStartAfter(span);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        setContenidoHTML(editor.innerHTML);
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


