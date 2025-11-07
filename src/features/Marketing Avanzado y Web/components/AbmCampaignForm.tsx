import { useState } from 'react';
import { Send, Calendar, FileText, Megaphone, Radio } from 'lucide-react';
import { CrearCampanaRequest, TipoCampana } from '../api/abmApi';

interface AbmCampaignFormProps {
  onSubmit: (datos: CrearCampanaRequest) => Promise<void>;
  onCancelar?: () => void;
  loading?: boolean;
}

const TIPO_CAMPANA_ICONS: Record<TipoCampana, typeof Send> = {
  Email: Send,
  Llamada: Radio,
  Evento: Calendar,
  'Publicidad Digital': Megaphone,
};

const TIPO_CAMPANA_OPTIONS: TipoCampana[] = ['Email', 'Llamada', 'Evento', 'Publicidad Digital'];

export default function AbmCampaignForm({ onSubmit, onCancelar, loading: loadingProp }: AbmCampaignFormProps) {
  const [formulario, setFormulario] = useState<CrearCampanaRequest>({
    nombre: '',
    tipo: 'Email',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
    contenido: '',
  });
  const [cargando, setCargando] = useState(false);

  const loading = loadingProp || cargando;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    try {
      await onSubmit(formulario);
      setFormulario({
        nombre: '',
        tipo: 'Email',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: '',
        contenido: '',
      });
    } catch (error) {
      console.error('Error al crear campaña:', error);
      // Error handling is done in parent component
    } finally {
      setCargando(false);
    }
  };

  const IconoSeleccionado = TIPO_CAMPANA_ICONS[formulario.tipo];

  return (
    <div className="bg-white shadow-sm rounded-lg ring-1 ring-slate-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Detalles de la Campaña</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre de la campaña
          </label>
          <input
            type="text"
            required
            value={formulario.nombre}
            onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            placeholder="Ej: Campaña de presentación - Empresa XYZ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de campaña
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TIPO_CAMPANA_OPTIONS.map((tipo) => {
              const Icono = TIPO_CAMPANA_ICONS[tipo];
              const estaSeleccionado = formulario.tipo === tipo;
              return (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setFormulario({ ...formulario, tipo })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ring-1 ${
                    estaSeleccionado
                      ? 'ring-blue-500 bg-blue-50 shadow-sm'
                      : 'ring-slate-200 hover:ring-slate-300 bg-white'
                  }`}
                >
                  <Icono size={20} className={estaSeleccionado ? 'text-blue-600' : 'text-slate-400'} />
                  <span className={`text-xs font-medium ${estaSeleccionado ? 'text-blue-600' : 'text-slate-600'}`}>
                    {tipo}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de inicio
            </label>
            <input
              type="date"
              required
              value={formulario.fechaInicio}
              onChange={(e) => setFormulario({ ...formulario, fechaInicio: e.target.value })}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de fin (opcional)
            </label>
            <input
              type="date"
              value={formulario.fechaFin}
              onChange={(e) => setFormulario({ ...formulario, fechaFin: e.target.value })}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Contenido / Descripción
          </label>
          <textarea
            value={formulario.contenido}
            onChange={(e) => setFormulario({ ...formulario, contenido: e.target.value })}
            rows={4}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 resize-none"
            placeholder="Describe el contenido o mensaje de la campaña..."
          />
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconoSeleccionado size={18} />
            {loading ? 'Creando...' : 'Crear Campaña'}
          </button>
          {onCancelar && (
            <button
              type="button"
              onClick={onCancelar}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}



