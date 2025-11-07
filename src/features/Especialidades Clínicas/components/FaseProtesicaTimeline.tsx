import { useState } from 'react';
import { Calendar, Upload, FileText, CheckCircle, X } from 'lucide-react';
import { FaseProtesica, HistorialAccion } from '../api/cargaInmediataApi';

interface FaseProtesicaTimelineProps {
  faseProtesica?: FaseProtesica;
  historial?: HistorialAccion[];
  onGuardar: (faseProtesica: FaseProtesica) => void;
  onCancelar?: () => void;
}

export default function FaseProtesicaTimeline({
  faseProtesica,
  historial = [],
  onGuardar,
  onCancelar,
}: FaseProtesicaTimelineProps) {
  const [fechaColocacion, setFechaColocacion] = useState(
    faseProtesica?.fechaColocacion || new Date().toISOString().split('T')[0]
  );
  const [tipoProtesis, setTipoProtesis] = useState(faseProtesica?.tipoProtesis || '');
  const [material, setMaterial] = useState(faseProtesica?.material || '');
  const [notas, setNotas] = useState(faseProtesica?.notas || '');
  const [archivos, setArchivos] = useState<File[]>([]);
  const [archivosPreview, setArchivosPreview] = useState<string[]>(faseProtesica?.archivos || []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nuevosArchivos = Array.from(e.target.files);
      setArchivos([...archivos, ...nuevosArchivos]);
    }
  };

  const handleEliminarArchivoPreview = (index: number) => {
    const nuevosPreview = archivosPreview.filter((_, i) => i !== index);
    setArchivosPreview(nuevosPreview);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({
      fechaColocacion,
      tipoProtesis,
      material,
      notas,
      archivos: archivosPreview,
    });
  };

  return (
    <div className="space-y-6">
      {/* Timeline del historial */}
      {historial.length > 0 && (
        <div className="bg-white shadow-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial del Protocolo</h3>
          <div className="space-y-4">
            {historial.map((accion, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 pb-4 border-l-2 border-gray-200 pl-4">
                  <p className="text-sm text-gray-700">{accion.accion}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(accion.fecha).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario de fase protésica */}
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fase Protésica</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fechaColocacion" className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Colocación
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  id="fechaColocacion"
                  value={fechaColocacion}
                  onChange={(e) => setFechaColocacion(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="tipoProtesis" className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Prótesis
              </label>
              <select
                id="tipoProtesis"
                value={tipoProtesis}
                onChange={(e) => setTipoProtesis(e.target.value)}
                className="w-full px-4 pr-3 py-2.5 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Seleccione...</option>
                <option value="Provisional">Provisional</option>
                <option value="Definitiva">Definitiva</option>
                <option value="Híbrida">Híbrida</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="material" className="block text-sm font-medium text-slate-700 mb-2">
              Material
            </label>
            <input
              type="text"
              id="material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
              placeholder="Ej: Zirconia, Acrílico, PMMA..."
              required
            />
          </div>

          <div>
            <label htmlFor="notas" className="block text-sm font-medium text-slate-700 mb-2">
              Notas y Ajustes
            </label>
            <textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
              placeholder="Registre ajustes realizados, oclusión, estética, y cualquier observación relevante..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Archivos (Fotos, Escaneos, Diseños)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors bg-slate-50">
              <input
                type="file"
                id="archivos-protesica"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.stl"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="archivos-protesica"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Haga clic para subir archivos o arrastre y suelte
                </span>
              </label>
            </div>

            {archivosPreview.length > 0 && (
              <div className="mt-4 space-y-2">
                {archivosPreview.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-blue-50 p-3 rounded-xl ring-1 ring-blue-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-700">{url}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEliminarArchivoPreview(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {onCancelar && (
            <button
              type="button"
              onClick={onCancelar}
              className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm"
          >
            <CheckCircle size={18} />
            Finalizar Fase Protésica
          </button>
        </div>
      </form>
    </div>
  );
}

