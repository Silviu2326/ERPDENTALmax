import { useState } from 'react';
import { RecordatorioPlantilla } from '../api/recordatoriosApi';
import { Save, Eye, X, Mail, MessageSquare, Smartphone } from 'lucide-react';

interface EditorPlantillasMensajesProps {
  plantilla?: RecordatorioPlantilla;
  onGuardar: (plantilla: Omit<RecordatorioPlantilla, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

const VARIABLES_DISPONIBLES = [
  { variable: '{{nombre_paciente}}', descripcion: 'Nombre del paciente' },
  { variable: '{{apellidos_paciente}}', descripcion: 'Apellidos del paciente' },
  { variable: '{{fecha_cita}}', descripcion: 'Fecha de la cita' },
  { variable: '{{hora_cita}}', descripcion: 'Hora de la cita' },
  { variable: '{{tratamiento}}', descripcion: 'Nombre del tratamiento' },
  { variable: '{{profesional}}', descripcion: 'Nombre del profesional' },
  { variable: '{{sede}}', descripcion: 'Nombre de la sede' },
];

export default function EditorPlantillasMensajes({
  plantilla,
  onGuardar,
  onCancelar,
  loading = false,
}: EditorPlantillasMensajesProps) {
  const [nombre, setNombre] = useState(plantilla?.nombre || '');
  const [tipo, setTipo] = useState<RecordatorioPlantilla['tipo']>(
    plantilla?.tipo || 'SMS'
  );
  const [asunto, setAsunto] = useState(plantilla?.asunto || '');
  const [cuerpo, setCuerpo] = useState(plantilla?.cuerpo || '');
  const [activo, setActivo] = useState(plantilla?.activo ?? true);

  const handleInsertarVariable = (variable: string) => {
    const textarea = document.getElementById('cuerpo-plantilla') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const nuevoTexto =
        cuerpo.substring(0, start) + variable + cuerpo.substring(end);
      setCuerpo(nuevoTexto);
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    } else {
      setCuerpo(cuerpo + variable);
    }
  };

  const handleGuardar = async () => {
    // Extraer variables del cuerpo
    const variables = VARIABLES_DISPONIBLES.filter((v) =>
      cuerpo.includes(v.variable)
    ).map((v) => v.variable);

    await onGuardar({
      nombre,
      tipo,
      asunto: tipo !== 'SMS' ? asunto : undefined,
      cuerpo,
      variables,
      activo,
    });
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'SMS':
        return <Smartphone className="w-4 h-4" />;
      case 'Email':
        return <Mail className="w-4 h-4" />;
      case 'WhatsApp':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {plantilla ? 'Editar Plantilla' : 'Nueva Plantilla'}
        </h3>
        <button
          onClick={onCancelar}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nombre y tipo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Plantilla
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Recordatorio SMS 48h"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Canal
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as RecordatorioPlantilla['tipo'])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="SMS">SMS</option>
            <option value="Email">Email</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
        </div>
      </div>

      {/* Asunto (solo para Email) */}
      {tipo === 'Email' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asunto del Email
          </label>
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            placeholder="Ej: Recordatorio de su cita dental"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Variables disponibles */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Variables Disponibles
        </label>
        <div className="grid grid-cols-2 gap-2">
          {VARIABLES_DISPONIBLES.map((v) => (
            <button
              key={v.variable}
              onClick={() => handleInsertarVariable(v.variable)}
              className="text-left px-3 py-2 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
            >
              <code className="text-blue-600 font-mono">{v.variable}</code>
              <p className="text-gray-500 text-xs mt-1">{v.descripcion}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cuerpo del mensaje */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cuerpo del Mensaje
        </label>
        <textarea
          id="cuerpo-plantilla"
          value={cuerpo}
          onChange={(e) => setCuerpo(e.target.value)}
          placeholder="Ej: Hola {{nombre_paciente}}, te recordamos tu cita el {{fecha_cita}} a las {{hora_cita}}. Responde SÍ para confirmar."
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
        {tipo === 'SMS' && (
          <p className="text-sm text-gray-500 mt-2">
            Caracteres: {cuerpo.length} / 160 (SMS estándar)
          </p>
        )}
      </div>

      {/* Estado activo */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="activo"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="activo" className="text-sm font-medium text-gray-700">
          Plantilla activa (visible para uso en reglas)
        </label>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancelar}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          disabled={loading || !nombre || !cuerpo}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Guardando...' : 'Guardar Plantilla'}
        </button>
      </div>
    </div>
  );
}


