import { useState, useEffect } from 'react';
import { Save, X, AlertCircle, Plus } from 'lucide-react';
import { PlantillaCarta, crearPlantilla, actualizarPlantilla } from '../api/plantillasCartaApi';

interface EditorPlantillaCartaProps {
  plantilla?: PlantillaCarta | null;
  onGuardar: () => void;
  onCancelar: () => void;
}

export default function EditorPlantillaCarta({
  plantilla,
  onGuardar,
  onCancelar,
}: EditorPlantillaCartaProps) {
  const [nombre, setNombre] = useState(plantilla?.nombre || '');
  const [asunto, setAsunto] = useState(plantilla?.asunto || '');
  const [cuerpoHTML, setCuerpoHTML] = useState(plantilla?.cuerpoHTML || '');
  const [tipo, setTipo] = useState(plantilla?.tipo || 'bienvenida');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plantilla) {
      setNombre(plantilla.nombre);
      setAsunto(plantilla.asunto);
      setCuerpoHTML(plantilla.cuerpoHTML);
      setTipo(plantilla.tipo);
    }
  }, [plantilla]);

  // Detectar placeholders en el contenido
  const detectarPlaceholders = (texto: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const placeholders: string[] = [];
    let match;
    while ((match = regex.exec(texto)) !== null) {
      if (!placeholders.includes(match[1])) {
        placeholders.push(match[1]);
      }
    }
    return placeholders;
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      setError('El nombre de la plantilla es obligatorio');
      return;
    }

    if (!asunto.trim()) {
      setError('El asunto de la carta es obligatorio');
      return;
    }

    if (!cuerpoHTML.trim()) {
      setError('El contenido de la carta es obligatorio');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const placeholders = detectarPlaceholders(cuerpoHTML + ' ' + asunto);
      const datosPlantilla: Omit<PlantillaCarta, '_id' | 'createdAt' | 'updatedAt'> = {
        nombre: nombre.trim(),
        asunto: asunto.trim(),
        cuerpoHTML: cuerpoHTML.trim(),
        tipo,
        placeholdersDisponibles: placeholders,
      };

      if (plantilla?._id) {
        await actualizarPlantilla(plantilla._id, datosPlantilla);
      } else {
        await crearPlantilla(datosPlantilla);
      }

      onGuardar();
    } catch (err) {
      setError('Error al guardar la plantilla. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const placeholdersDisponibles = [
    { key: 'nombre_paciente', label: 'Nombre del Paciente' },
    { key: 'apellidos_paciente', label: 'Apellidos del Paciente' },
    { key: 'dni_paciente', label: 'DNI del Paciente' },
    { key: 'telefono_paciente', label: 'Teléfono del Paciente' },
    { key: 'email_paciente', label: 'Email del Paciente' },
    { key: 'fecha_proxima_cita', label: 'Fecha de Próxima Cita' },
    { key: 'hora_proxima_cita', label: 'Hora de Próxima Cita' },
    { key: 'tratamiento_realizado', label: 'Tratamiento Realizado' },
    { key: 'profesional_nombre', label: 'Nombre del Profesional' },
    { key: 'clinica_nombre', label: 'Nombre de la Clínica' },
    { key: 'clinica_direccion', label: 'Dirección de la Clínica' },
    { key: 'clinica_telefono', label: 'Teléfono de la Clínica' },
    { key: 'fecha_actual', label: 'Fecha Actual' },
  ];

  const insertarPlaceholder = (key: string) => {
    const textarea = document.getElementById('cuerpo-editor') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const placeholder = `{{${key}}}`;
      const texto = cuerpoHTML.substring(0, start) + placeholder + cuerpoHTML.substring(end);
      setCuerpoHTML(texto);
      // Restaurar el cursor después del placeholder insertado
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 0);
    } else {
      setCuerpoHTML(cuerpoHTML + `{{${key}}}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {plantilla ? 'Editar Plantilla de Carta' : 'Nueva Plantilla de Carta'}
            </h2>
            <button
              onClick={onCancelar}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Plantilla *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Carta de Bienvenida"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Carta *
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="bienvenida">Bienvenida</option>
              <option value="marketing">Marketing</option>
              <option value="recordatorio">Recordatorio</option>
              <option value="post-operatorio">Post-operatorio</option>
              <option value="cumpleaños">Cumpleaños</option>
              <option value="promocion">Promoción</option>
            </select>
          </div>

          {/* Asunto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asunto de la Carta *
            </label>
            <input
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Bienvenido a nuestra clínica"
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes usar placeholders como {'{{nombre_paciente}}'} en el asunto
            </p>
          </div>

          {/* Placeholders disponibles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placeholders Disponibles
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg">
              {placeholdersDisponibles.map((ph) => (
                <button
                  key={ph.key}
                  type="button"
                  onClick={() => insertarPlaceholder(ph.key)}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-500 transition-colors text-left flex items-center justify-between"
                >
                  <span className="text-gray-700">{ph.label}</span>
                  <span className="text-blue-600 font-mono text-xs">{`{{${ph.key}}}`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cuerpo HTML */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido de la Carta (HTML) *
            </label>
            <textarea
              id="cuerpo-editor"
              value={cuerpoHTML}
              onChange={(e) => setCuerpoHTML(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="Escribe el contenido de la carta aquí. Puedes usar placeholders como {{nombre_paciente}}..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Usa placeholders con doble llave: {'{{nombre_paciente}}'}, {'{{fecha_proxima_cita}}'}, etc.
            </p>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={onCancelar}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Guardar Plantilla</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



