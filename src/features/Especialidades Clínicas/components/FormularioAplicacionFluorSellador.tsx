import { useState } from 'react';
import { Calendar, Save, X } from 'lucide-react';
import { CrearAplicacionData, DienteTratado } from '../api/odontopediatriaApi';
import SelectorDientesInfantil from './SelectorDientesInfantil';

interface FormularioAplicacionFluorSelladorProps {
  pacienteId: string;
  profesionalId: string;
  onSubmit: (datos: CrearAplicacionData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function FormularioAplicacionFluorSellador({
  pacienteId,
  profesionalId,
  onSubmit,
  onCancel,
  loading = false,
}: FormularioAplicacionFluorSelladorProps) {
  const [fechaAplicacion, setFechaAplicacion] = useState(new Date().toISOString().split('T')[0]);
  const [tipoAplicacion, setTipoAplicacion] = useState<'Fluor' | 'Sellador'>('Fluor');
  const [productoUtilizado, setProductoUtilizado] = useState('');
  const [dientesTratados, setDientesTratados] = useState<DienteTratado[]>([]);
  const [notas, setNotas] = useState('');
  const [error, setError] = useState<string | null>(null);

  const productosFluor = [
    'Flúor Tópico (Gel)',
    'Flúor Barniz (Varnish)',
    'Flúor Espuma',
    'Flúor en Gel Neutro',
    'Flúor en Gel Ácido',
    'Otro',
  ];

  const productosSellador = [
    'Sellador de Fosas y Fisuras (Resina)',
    'Sellador de Ionómero de Vidrio',
    'Sellador Fotopolimerizable',
    'Sellador Autopolimerizable',
    'Otro',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fechaAplicacion) {
      setError('La fecha de aplicación es obligatoria');
      return;
    }

    if (!productoUtilizado.trim()) {
      setError('El producto utilizado es obligatorio');
      return;
    }

    if (dientesTratados.length === 0) {
      setError('Debe seleccionar al menos un diente tratado');
      return;
    }

    try {
      await onSubmit({
        fechaAplicacion,
        tipoAplicacion,
        productoUtilizado: productoUtilizado.trim(),
        dientesTratados,
        notas: notas.trim() || undefined,
        profesionalId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la aplicación');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Nueva Aplicación Preventiva</h3>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fecha de Aplicación */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Fecha de Aplicación *
            </label>
            <input
              type="date"
              value={fechaAplicacion}
              onChange={(e) => setFechaAplicacion(e.target.value)}
              required
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>

          {/* Tipo de Aplicación */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Aplicación *
            </label>
            <select
              value={tipoAplicacion}
              onChange={(e) => {
                setTipoAplicacion(e.target.value as 'Fluor' | 'Sellador');
                setProductoUtilizado('');
                setDientesTratados([]);
              }}
              required
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              <option value="Fluor">Flúor</option>
              <option value="Sellador">Sellador</option>
            </select>
          </div>

          {/* Producto Utilizado */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Producto Utilizado *
            </label>
            <select
              value={productoUtilizado}
              onChange={(e) => setProductoUtilizado(e.target.value)}
              required
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              <option value="">Seleccione un producto</option>
              {(tipoAplicacion === 'Fluor' ? productosFluor : productosSellador).map(
                (producto) => (
                  <option key={producto} value={producto}>
                    {producto}
                  </option>
                )
              )}
            </select>
            {productoUtilizado === 'Otro' && (
              <input
                type="text"
                placeholder="Especifique el producto"
                value={productoUtilizado}
                onChange={(e) => setProductoUtilizado(e.target.value)}
                className="w-full mt-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            )}
          </div>
        </div>

        {/* Selector de Dientes */}
        <div className="mt-6">
          <SelectorDientesInfantil
            dientesSeleccionados={dientesTratados}
            onDientesChange={setDientesTratados}
            tipoAplicacion={tipoAplicacion}
          />
        </div>

        {/* Notas */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Notas</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={4}
            placeholder="Observaciones importantes, colaboración del niño, incidencias, etc."
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={18} />
          <span>Cancelar</span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          <span>{loading ? 'Guardando...' : 'Guardar Aplicación'}</span>
        </button>
      </div>
    </form>
  );
}



