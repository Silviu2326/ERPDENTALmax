import { useState } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import { ActualizarControlEsterilizacion, ResultadoControl, ControlEsterilizacion } from '../api/controlesApi';

interface FormularioActualizarResultadoProps {
  control: ControlEsterilizacion;
  onGuardar: (datos: ActualizarControlEsterilizacion) => void;
  onCancelar: () => void;
}

export default function FormularioActualizarResultado({
  control,
  onGuardar,
  onCancelar,
}: FormularioActualizarResultadoProps) {
  const [resultado, setResultado] = useState<ResultadoControl>(control.resultado);
  const [fechaResultado, setFechaResultado] = useState<string>(
    control.fechaResultado
      ? new Date(control.fechaResultado).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [observaciones, setObservaciones] = useState(control.observaciones || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar que si el resultado ya no es pendiente, se haya cambiado
    if (control.resultado === resultado && control.resultado !== 'pendiente') {
      setError('Debe cambiar el resultado del control');
      return;
    }

    // Si el resultado es positivo o fallido, se recomienda agregar observaciones
    if ((resultado === 'positivo' || resultado === 'fallido') && !observaciones.trim()) {
      setError('Es recomendable agregar observaciones cuando el resultado es positivo o fallido');
    }

    const datos: ActualizarControlEsterilizacion = {
      resultado,
      fechaResultado: new Date(fechaResultado).toISOString(),
      observaciones: observaciones.trim() || undefined,
    };

    onGuardar(datos);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Actualizar Resultado del Control
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Control {control.tipoControl === 'biologico' ? 'Biológico' : 'Químico'}</strong> - 
            Lote: {control.loteIndicador} - 
            Autoclave: {control.idEsterilizador.nombre}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resultado */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Resultado *
            </label>
            <select
              value={resultado}
              onChange={(e) => setResultado(e.target.value as ResultadoControl)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              required
            >
              {control.resultado === 'pendiente' && (
                <option value="pendiente">Pendiente</option>
              )}
              <option value="negativo">Negativo (Correcto)</option>
              <option value="positivo">Positivo (Fallido)</option>
              <option value="fallido">Fallido</option>
            </select>
            {resultado === 'positivo' && (
              <p className="mt-2 text-xs text-red-600 font-medium">
                ⚠️ Un resultado positivo indica un fallo en la esterilización. Se activará una alerta.
              </p>
            )}
          </div>

          {/* Fecha de Resultado */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de Resultado *
            </label>
            <input
              type="date"
              value={fechaResultado}
              onChange={(e) => setFechaResultado(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              required
            />
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Observaciones
            {(resultado === 'positivo' || resultado === 'fallido') && (
              <span className="text-red-600 ml-1">(Recomendado)</span>
            )}
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={4}
            placeholder="Agregue observaciones sobre el resultado del control..."
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancelar}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
          >
            <X className="w-5 h-5" />
            <span>Cancelar</span>
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md"
          >
            <Save className="w-5 h-5" />
            <span>Guardar Resultado</span>
          </button>
        </div>
      </form>
    </div>
  );
}



