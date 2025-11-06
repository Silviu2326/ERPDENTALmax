import { useState } from 'react';
import { Save, Calendar, X } from 'lucide-react';
import { SmsCampaign, TargetSegment } from '../api/campanasSmsApi';
import SelectorSegmentoPacientes from './SelectorSegmentoPacientes';
import VisualizadorMensajeSms from './VisualizadorMensajeSms';

interface FormularioNuevaCampanaSmsProps {
  campana?: SmsCampaign;
  onGuardar: (campana: {
    name: string;
    message: string;
    targetSegment: TargetSegment;
    scheduledAt?: string;
  }) => Promise<void>;
  onCancelar: () => void;
}

export default function FormularioNuevaCampanaSms({
  campana,
  onGuardar,
  onCancelar,
}: FormularioNuevaCampanaSmsProps) {
  const [nombre, setNombre] = useState(campana?.name || '');
  const [mensaje, setMensaje] = useState(campana?.message || '');
  const [segmento, setSegmento] = useState<TargetSegment>(
    campana?.targetSegment || { marketingConsent: true }
  );
  const [fechaProgramada, setFechaProgramada] = useState<string>(
    campana?.scheduledAt ? new Date(campana.scheduledAt).toISOString().slice(0, 16) : ''
  );
  const [programarEnvio, setProgramarEnvio] = useState(!!campana?.scheduledAt);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError('El nombre de la campaña es requerido');
      return;
    }

    if (!mensaje.trim()) {
      setError('El mensaje es requerido');
      return;
    }

    if (programarEnvio && !fechaProgramada) {
      setError('Debes seleccionar una fecha y hora para programar el envío');
      return;
    }

    // Validar que la fecha programada sea futura
    if (programarEnvio && fechaProgramada) {
      const fechaProg = new Date(fechaProgramada);
      if (fechaProg <= new Date()) {
        setError('La fecha programada debe ser en el futuro');
        return;
      }
    }

    setGuardando(true);
    try {
      await onGuardar({
        name: nombre.trim(),
        message: mensaje.trim(),
        targetSegment: segmento,
        scheduledAt: programarEnvio ? new Date(fechaProgramada).toISOString() : undefined,
      });
    } catch (err: any) {
      setError(err.message || 'Error al guardar la campaña');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-600" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Nombre de la campaña */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la Campaña *
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Promoción Blanqueamiento Dental - Octubre"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Mensaje SMS */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mensaje SMS *
        </label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje aquí..."
          rows={4}
          maxLength={1600}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {mensaje.length} caracteres (máximo recomendado: 160 por SMS)
        </p>
      </div>

      {/* Visualizador de mensaje */}
      {mensaje && <VisualizadorMensajeSms mensaje={mensaje} />}

      {/* Selector de segmento */}
      <SelectorSegmentoPacientes segmento={segmento} onChange={setSegmento} />

      {/* Programación */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Programación de Envío</h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={programarEnvio}
              onChange={(e) => setProgramarEnvio(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Programar envío para fecha y hora específica
            </span>
          </label>

          {programarEnvio && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y Hora de Envío *
              </label>
              <input
                type="datetime-local"
                value={fechaProgramada}
                onChange={(e) => setFechaProgramada(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={programarEnvio}
              />
              <p className="text-xs text-gray-500 mt-1">
                Si no programas el envío, la campaña se guardará como borrador
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {guardando ? 'Guardando...' : campana ? 'Actualizar Campaña' : 'Guardar como Borrador'}
        </button>
      </div>
    </form>
  );
}


