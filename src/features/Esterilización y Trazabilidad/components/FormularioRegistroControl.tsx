import { useState } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import { NuevoControlEsterilizacion, TipoControl, ResultadoControl } from '../api/controlesApi';
import { Autoclave, obtenerAutoclaves } from '../api/esterilizacionApi';
import SelectorAutoclave from './SelectorAutoclave';

interface FormularioRegistroControlProps {
  onGuardar: (control: NuevoControlEsterilizacion) => void;
  onCancelar: () => void;
  usuarioId?: string;
}

export default function FormularioRegistroControl({
  onGuardar,
  onCancelar,
  usuarioId,
}: FormularioRegistroControlProps) {
  const [tipoControl, setTipoControl] = useState<TipoControl>('quimico');
  const [fechaRegistro, setFechaRegistro] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [resultado, setResultado] = useState<ResultadoControl>('pendiente');
  const [loteIndicador, setLoteIndicador] = useState('');
  const [fechaVencimientoIndicador, setFechaVencimientoIndicador] = useState<string>('');
  const [autoclave, setAutoclave] = useState<Autoclave | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!autoclave) {
      setError('Debe seleccionar un autoclave');
      return;
    }

    if (!loteIndicador.trim()) {
      setError('Debe ingresar el lote del indicador');
      return;
    }

    if (!fechaVencimientoIndicador) {
      setError('Debe ingresar la fecha de vencimiento del indicador');
      return;
    }

    // Validar que la fecha de vencimiento no haya pasado
    const fechaVenc = new Date(fechaVencimientoIndicador);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaVenc < hoy) {
      setError('La fecha de vencimiento del indicador no puede ser anterior a hoy');
      return;
    }

    // Para controles químicos, el resultado no puede ser 'pendiente'
    if (tipoControl === 'quimico' && resultado === 'pendiente') {
      setError('Los controles químicos deben tener un resultado inmediato (positivo o negativo)');
      return;
    }

    const control: NuevoControlEsterilizacion = {
      tipoControl,
      fechaRegistro: new Date(fechaRegistro).toISOString(),
      resultado,
      loteIndicador: loteIndicador.trim(),
      fechaVencimientoIndicador: new Date(fechaVencimientoIndicador).toISOString(),
      idEsterilizador: autoclave._id,
      observaciones: observaciones.trim() || undefined,
    };

    onGuardar(control);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Registrar Nuevo Control de Esterilización
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Control *
              </label>
              <select
                value={tipoControl}
                onChange={(e) => {
                  setTipoControl(e.target.value as TipoControl);
                  // Si es químico, cambiar resultado por defecto
                  if (e.target.value === 'quimico' && resultado === 'pendiente') {
                    setResultado('negativo');
                  }
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="quimico">Químico</option>
                <option value="biologico">Biológico</option>
              </select>
            </div>

            {/* Autoclave */}
            <div>
              <SelectorAutoclave
                autoclaveSeleccionado={autoclave}
                onAutoclaveSeleccionado={setAutoclave}
              />
            </div>

            {/* Fecha de Registro */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Registro *
              </label>
              <input
                type="date"
                value={fechaRegistro}
                onChange={(e) => setFechaRegistro(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Resultado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultado *
              </label>
              <select
                value={resultado}
                onChange={(e) => setResultado(e.target.value as ResultadoControl)}
                disabled={tipoControl === 'quimico'}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                {tipoControl === 'biologico' && (
                  <option value="pendiente">Pendiente (en incubación)</option>
                )}
                <option value="negativo">Negativo (Correcto)</option>
                <option value="positivo">Positivo (Fallido)</option>
                <option value="fallido">Fallido</option>
              </select>
              {tipoControl === 'biologico' && resultado === 'pendiente' && (
                <p className="mt-1 text-xs text-gray-500">
                  El resultado se actualizará después del período de incubación
                </p>
              )}
            </div>

            {/* Lote del Indicador */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lote del Indicador *
              </label>
              <input
                type="text"
                value={loteIndicador}
                onChange={(e) => setLoteIndicador(e.target.value)}
                placeholder="Ej: LOTE-2024-001"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Fecha de Vencimiento del Indicador */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento del Indicador *
              </label>
              <input
                type="date"
                value={fechaVencimientoIndicador}
                onChange={(e) => setFechaVencimientoIndicador(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={4}
              placeholder="Observaciones adicionales sobre el control..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancelar}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Guardar Control</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

