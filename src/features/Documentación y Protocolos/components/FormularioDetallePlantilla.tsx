import { useState, useEffect } from 'react';
import { Save, X, Loader2 } from 'lucide-react';
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
    <div className="bg-white shadow-sm rounded-lg">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end p-4 border-b border-gray-200/60">
        <div className="flex items-center gap-2">
          <button
            onClick={onCancelar}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} />
            <span>Cancelar</span>
          </button>
          <button
            onClick={handleGuardar}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Guardar</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre de la Plantilla *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ej: Consentimiento Informado - Implantes"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Documento *
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as DocumentoPlantilla['tipo'])}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sede (opcional)
            </label>
            <input
              type="text"
              value={sedeId || ''}
              onChange={(e) => setSedeId(e.target.value || null)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Dejar vacío para plantilla global"
              disabled={loading}
            />
            <p className="text-xs text-slate-500 mt-1">
              Dejar vacío para crear una plantilla global (disponible para todas las sedes)
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={activa}
                onChange={(e) => setActiva(e.target.checked)}
                className="w-4 h-4 text-blue-600 ring-1 ring-slate-300 rounded focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
              <span className="text-sm font-medium text-slate-700">Plantilla activa</span>
            </label>
            <p className="text-xs text-slate-500 mt-1">
              Las plantillas inactivas no estarán disponibles para generar documentos
            </p>
          </div>
        </div>

        {/* Editor de contenido */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Contenido de la Plantilla *
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <div className="bg-white shadow-sm rounded-lg p-4 ring-1 ring-slate-200">
                  <div className="text-center py-4">
                    <Loader2 size={24} className="animate-spin text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Cargando placeholders...</p>
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



