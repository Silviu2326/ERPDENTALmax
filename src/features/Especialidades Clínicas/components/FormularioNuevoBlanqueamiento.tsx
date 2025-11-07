import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { CrearBlanqueamientoData } from '../api/blanqueamientoApi';
import SelectorTonalidadVita from './SelectorTonalidadVita';

interface FormularioNuevoBlanqueamientoProps {
  pacienteId: string;
  profesionalId: string;
  onSubmit: (datos: CrearBlanqueamientoData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function FormularioNuevoBlanqueamiento({
  pacienteId,
  profesionalId,
  onSubmit,
  onCancel,
  loading = false,
}: FormularioNuevoBlanqueamientoProps) {
  const [formulario, setFormulario] = useState<CrearBlanqueamientoData>({
    pacienteId,
    odontologoId: profesionalId,
    fechaInicio: new Date().toISOString().split('T')[0],
    tipoBlanqueamiento: 'En Clínica',
    productoUtilizado: '',
    concentracion: '',
    tonoInicial: '',
    notasGenerales: '',
  });
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await onSubmit(formulario);
    } catch (error) {
      console.error('Error al crear tratamiento:', error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Nuevo Tratamiento de Blanqueamiento</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de Inicio <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formulario.fechaInicio}
              onChange={(e) => setFormulario({ ...formulario, fechaInicio: e.target.value })}
              required
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Blanqueamiento <span className="text-red-500">*</span>
            </label>
            <select
              value={formulario.tipoBlanqueamiento}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  tipoBlanqueamiento: e.target.value as 'En Clínica' | 'En Casa' | 'Combinado',
                })
              }
              required
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              <option value="En Clínica">En Clínica</option>
              <option value="En Casa">En Casa</option>
              <option value="Combinado">Combinado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Producto Utilizado <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formulario.productoUtilizado}
              onChange={(e) => setFormulario({ ...formulario, productoUtilizado: e.target.value })}
              required
              placeholder="Ej: Peróxido de hidrógeno 35%"
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Concentración</label>
            <input
              type="text"
              value={formulario.concentracion}
              onChange={(e) => setFormulario({ ...formulario, concentracion: e.target.value })}
              placeholder="Ej: 35%, 10%"
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
        </div>

        <div>
          <SelectorTonalidadVita
            valor={formulario.tonoInicial}
            onChange={(tono) => setFormulario({ ...formulario, tonoInicial: tono })}
            label="Tono Inicial VITA"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Notas Generales</label>
          <textarea
            value={formulario.notasGenerales}
            onChange={(e) => setFormulario({ ...formulario, notasGenerales: e.target.value })}
            rows={4}
            placeholder="Ingrese notas adicionales sobre el tratamiento..."
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>

        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            type="submit"
            disabled={enviando || loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Save size={20} />
            {enviando ? 'Guardando...' : 'Guardar Tratamiento'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <X size={20} />
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}



