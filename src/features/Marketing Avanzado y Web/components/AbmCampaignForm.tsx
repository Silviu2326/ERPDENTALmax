import { useState } from 'react';
import { Send, Calendar, FileText, Megaphone, Radio } from 'lucide-react';
import { CrearCampanaRequest, TipoCampana } from '../api/abmApi';

interface AbmCampaignFormProps {
  onSubmit: (datos: CrearCampanaRequest) => Promise<void>;
  onCancelar?: () => void;
}

const TIPO_CAMPANA_ICONS: Record<TipoCampana, typeof Send> = {
  Email: Send,
  Llamada: Radio,
  Evento: Calendar,
  'Publicidad Digital': Megaphone,
};

const TIPO_CAMPANA_OPTIONS: TipoCampana[] = ['Email', 'Llamada', 'Evento', 'Publicidad Digital'];

export default function AbmCampaignForm({ onSubmit, onCancelar }: AbmCampaignFormProps) {
  const [formulario, setFormulario] = useState<CrearCampanaRequest>({
    nombre: '',
    tipo: 'Email',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
    contenido: '',
  });
  const [cargando, setCargando] = useState(false);

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
      alert('Error al crear la campaña');
    } finally {
      setCargando(false);
    }
  };

  const IconoSeleccionado = TIPO_CAMPANA_ICONS[formulario.tipo];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Campaña</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la campaña</label>
          <input
            type="text"
            required
            value={formulario.nombre}
            onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Campaña de presentación - Empresa XYZ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de campaña</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TIPO_CAMPANA_OPTIONS.map((tipo) => {
              const Icono = TIPO_CAMPANA_ICONS[tipo];
              const estaSeleccionado = formulario.tipo === tipo;
              return (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setFormulario({ ...formulario, tipo })}
                  className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                    estaSeleccionado
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icono className={`w-5 h-5 ${estaSeleccionado ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-xs font-medium ${estaSeleccionado ? 'text-blue-600' : 'text-gray-600'}`}>
                    {tipo}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
            <input
              type="date"
              required
              value={formulario.fechaInicio}
              onChange={(e) => setFormulario({ ...formulario, fechaInicio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin (opcional)</label>
            <input
              type="date"
              value={formulario.fechaFin}
              onChange={(e) => setFormulario({ ...formulario, fechaFin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contenido / Descripción</label>
          <textarea
            value={formulario.contenido}
            onChange={(e) => setFormulario({ ...formulario, contenido: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe el contenido o mensaje de la campaña..."
          />
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          disabled={cargando}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <IconoSeleccionado className="w-4 h-4" />
          {cargando ? 'Creando...' : 'Crear Campaña'}
        </button>
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}


