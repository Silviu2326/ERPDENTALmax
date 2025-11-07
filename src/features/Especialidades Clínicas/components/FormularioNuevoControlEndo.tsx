import { useState } from 'react';
import { Calendar, FileText, Save, X } from 'lucide-react';
import { NuevoControlEndodontico } from '../api/controlesEndodonciaApi';
import ModalAdjuntarRadiografia from './ModalAdjuntarRadiografia';

interface FormularioNuevoControlEndoProps {
  tratamientoId: string;
  pacienteId: string;
  onGuardar: (control: NuevoControlEndodontico) => Promise<void>;
  onCancelar: () => void;
  controlEditar?: {
    _id: string;
    fechaControl: string;
    sintomatologia: string;
    signosClinicos: string;
    hallazgosRadiograficos: string;
    diagnosticoEvolutivo: string;
    observaciones?: string;
  };
}

export default function FormularioNuevoControlEndo({
  tratamientoId,
  pacienteId,
  onGuardar,
  onCancelar,
  controlEditar,
}: FormularioNuevoControlEndoProps) {
  const [fechaControl, setFechaControl] = useState(
    controlEditar?.fechaControl.split('T')[0] || new Date().toISOString().split('T')[0]
  );
  const [sintomatologia, setSintomatologia] = useState<
    'Asintomático' | 'Dolor espontáneo' | 'Sensibilidad a la percusión' | 'Sensibilidad a la palpación'
  >((controlEditar?.sintomatologia as any) || 'Asintomático');
  const [signosClinicos, setSignosClinicos] = useState<
    'Ninguno' | 'Fístula' | 'Edema' | 'Movilidad aumentada'
  >((controlEditar?.signosClinicos as any) || 'Ninguno');
  const [hallazgosRadiograficos, setHallazgosRadiograficos] = useState(
    controlEditar?.hallazgosRadiograficos || ''
  );
  const [diagnosticoEvolutivo, setDiagnosticoEvolutivo] = useState<
    'Éxito (curación)' | 'En progreso' | 'Dudoso' | 'Fracaso'
  >((controlEditar?.diagnosticoEvolutivo as any) || 'En progreso');
  const [observaciones, setObservaciones] = useState(controlEditar?.observaciones || '');
  const [archivosAdjuntos, setArchivosAdjuntos] = useState<File[]>([]);
  const [mostrarModalAdjuntos, setMostrarModalAdjuntos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const control: NuevoControlEndodontico = {
        tratamientoId,
        pacienteId,
        fechaControl: new Date(fechaControl).toISOString(),
        sintomatologia,
        signosClinicos,
        hallazgosRadiograficos,
        diagnosticoEvolutivo,
        observaciones: observaciones || undefined,
        adjuntos: archivosAdjuntos.length > 0 ? archivosAdjuntos : undefined,
      };

      await onGuardar(control);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el control');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText size={20} className="text-blue-600" />
          {controlEditar ? 'Editar Control Postoperatorio' : 'Nuevo Control Postoperatorio'}
        </h2>
        <button
          onClick={onCancelar}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fecha del control */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Calendar size={16} className="inline mr-1" />
            Fecha del Control
          </label>
          <input
            type="date"
            value={fechaControl}
            onChange={(e) => setFechaControl(e.target.value)}
            required
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
          />
        </div>

        {/* Sintomatología */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Sintomatología
          </label>
          <select
            value={sintomatologia}
            onChange={(e) => setSintomatologia(e.target.value as any)}
            required
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
          >
            <option value="Asintomático">Asintomático</option>
            <option value="Dolor espontáneo">Dolor espontáneo</option>
            <option value="Sensibilidad a la percusión">Sensibilidad a la percusión</option>
            <option value="Sensibilidad a la palpación">Sensibilidad a la palpación</option>
          </select>
        </div>

        {/* Signos Clínicos */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Signos Clínicos
          </label>
          <select
            value={signosClinicos}
            onChange={(e) => setSignosClinicos(e.target.value as any)}
            required
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
          >
            <option value="Ninguno">Ninguno</option>
            <option value="Fístula">Fístula</option>
            <option value="Edema">Edema</option>
            <option value="Movilidad aumentada">Movilidad aumentada</option>
          </select>
        </div>

        {/* Hallazgos Radiográficos */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Hallazgos Radiográficos
          </label>
          <textarea
            value={hallazgosRadiograficos}
            onChange={(e) => setHallazgosRadiograficos(e.target.value)}
            required
            rows={4}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
            placeholder="Describa los hallazgos observados en la radiografía..."
          />
        </div>

        {/* Diagnóstico Evolutivo */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Diagnóstico Evolutivo
          </label>
          <select
            value={diagnosticoEvolutivo}
            onChange={(e) => setDiagnosticoEvolutivo(e.target.value as any)}
            required
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
          >
            <option value="En progreso">En progreso</option>
            <option value="Éxito (curación)">Éxito (curación)</option>
            <option value="Dudoso">Dudoso</option>
            <option value="Fracaso">Fracaso</option>
          </select>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Observaciones (Opcional)
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={3}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
            placeholder="Observaciones adicionales..."
          />
        </div>

        {/* Adjuntos */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Radiografías Adjuntas
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMostrarModalAdjuntos(true)}
              className="px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              {archivosAdjuntos.length > 0
                ? `${archivosAdjuntos.length} archivo(s) seleccionado(s)`
                : 'Adjuntar Radiografías'}
            </button>
            {archivosAdjuntos.length > 0 && (
              <button
                type="button"
                onClick={() => setArchivosAdjuntos([])}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Botones */}
        <div className="flex items-center justify-end gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            {loading ? 'Guardando...' : controlEditar ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>

      <ModalAdjuntarRadiografia
        isOpen={mostrarModalAdjuntos}
        onClose={() => setMostrarModalAdjuntos(false)}
        onAdjuntar={(archivos) => {
          setArchivosAdjuntos([...archivosAdjuntos, ...archivos]);
          setMostrarModalAdjuntos(false);
        }}
      />
    </div>
  );
}



