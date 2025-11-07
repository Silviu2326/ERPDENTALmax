import { useState } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import { ConsentimientoPlantilla, NuevaPlantilla } from '../api/consentimientosApi';

interface EditorPlantillasConsentimientoProps {
  plantilla?: ConsentimientoPlantilla;
  onGuardar: (plantilla: NuevaPlantilla) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

export default function EditorPlantillasConsentimiento({
  plantilla,
  onGuardar,
  onCancelar,
  loading = false,
}: EditorPlantillasConsentimientoProps) {
  const [nombre, setNombre] = useState(plantilla?.nombre || '');
  const [descripcion, setDescripcion] = useState(plantilla?.descripcion || '');
  const [contenido, setContenido] = useState(plantilla?.contenido || '');
  const [error, setError] = useState<string | null>(null);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      setError('El nombre de la plantilla es obligatorio');
      return;
    }

    if (!contenido.trim()) {
      setError('El contenido de la plantilla es obligatorio');
      return;
    }

    setError(null);
    try {
      await onGuardar({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        contenido: contenido.trim(),
      });
    } catch (err) {
      setError('Error al guardar la plantilla. Por favor, inténtalo de nuevo.');
    }
  };

  const variablesDisponibles = [
    '{{nombre_paciente}}',
    '{{apellidos_paciente}}',
    '{{dni_paciente}}',
    '{{tratamiento_descripcion}}',
    '{{fecha_actual}}',
    '{{odontologo_nombre}}',
  ];

  const insertarVariable = (variable: string) => {
    const textarea = document.getElementById('contenido-editor') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const texto = contenido.substring(0, start) + variable + contenido.substring(end);
      setContenido(texto);
      // Restaurar el cursor después de la variable insertada
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    } else {
      setContenido(contenido + variable);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {plantilla ? 'Editar Plantilla' : 'Nueva Plantilla de Consentimiento'}
        </h2>
        <p className="text-gray-600 mt-1">
          Crea o edita una plantilla de consentimiento informado. Puedes usar variables para
          personalizar el contenido.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
          <AlertCircle size={20} className="text-red-600" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre de la Plantilla <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Consentimiento Informado para Endodoncia"
            className="w-full px-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Breve descripción de la plantilla..."
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">
              Contenido <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Insertar variable:</span>
              {variablesDisponibles.map((variable) => (
                <button
                  key={variable}
                  onClick={() => insertarVariable(variable)}
                  className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
                  title={`Insertar ${variable}`}
                >
                  {variable}
                </button>
              ))}
            </div>
          </div>
          <textarea
            id="contenido-editor"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Escribe el contenido del consentimiento informado. Puedes usar variables como {{nombre_paciente}}, {{tratamiento_descripcion}}, etc."
            rows={15}
            className="w-full px-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Usa variables entre dobles llaves para personalizar el contenido automáticamente
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={onCancelar}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} />
            <span>Cancelar</span>
          </button>
          <button
            onClick={handleGuardar}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Guardar Plantilla</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



