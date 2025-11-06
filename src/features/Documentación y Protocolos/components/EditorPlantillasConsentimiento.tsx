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
    <div className="bg-white rounded-lg shadow-lg p-6">
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
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Plantilla <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Consentimiento Informado para Endodoncia"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Breve descripción de la plantilla..."
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Contenido <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Insertar variable:</span>
              {variablesDisponibles.map((variable) => (
                <button
                  key={variable}
                  onClick={() => insertarVariable(variable)}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Usa variables entre dobles llaves para personalizar el contenido automáticamente
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onCancelar}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                <span>Guardar Plantilla</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


