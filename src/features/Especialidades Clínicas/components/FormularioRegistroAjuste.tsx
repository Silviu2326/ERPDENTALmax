import { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { NuevoAjuste } from '../api/protesisRemovibleApi';

interface FormularioRegistroAjusteProps {
  tratamientoId: string;
  odontologoId: string;
  onGuardar: (ajuste: NuevoAjuste) => Promise<void>;
  onCancelar: () => void;
}

// Zonas comunes de ajuste en prótesis removibles
const ZONAS_AJUSTE = [
  'Borde vestibular superior',
  'Borde vestibular inferior',
  'Borde lingual/palatino',
  'Zona de retención',
  'Superficie oclusal',
  'Base de prótesis',
  'Ganchos de retención',
  'Zona de apoyo',
  'Área de descarga',
  'Otras zonas',
];

export default function FormularioRegistroAjuste({
  tratamientoId,
  odontologoId,
  onGuardar,
  onCancelar,
}: FormularioRegistroAjusteProps) {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [zonasSeleccionadas, setZonasSeleccionadas] = useState<string[]>([]);
  const [zonaPersonalizada, setZonaPersonalizada] = useState('');
  const [feedbackPaciente, setFeedbackPaciente] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleToggleZona = (zona: string) => {
    setZonasSeleccionadas((prev) =>
      prev.includes(zona) ? prev.filter((z) => z !== zona) : [...prev, zona]
    );
  };

  const handleAgregarZonaPersonalizada = () => {
    if (zonaPersonalizada.trim() && !zonasSeleccionadas.includes(zonaPersonalizada.trim())) {
      setZonasSeleccionadas((prev) => [...prev, zonaPersonalizada.trim()]);
      setZonaPersonalizada('');
    }
  };

  const handleEliminarZona = (zona: string) => {
    setZonasSeleccionadas((prev) => prev.filter((z) => z !== zona));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      alert('Por favor, ingrese una descripción del ajuste');
      return;
    }

    if (zonasSeleccionadas.length === 0) {
      alert('Por favor, seleccione al menos una zona ajustada');
      return;
    }

    setGuardando(true);
    try {
      await onGuardar({
        tratamientoId,
        odontologoId,
        fecha: new Date(fecha).toISOString(),
        descripcionAjuste: descripcion,
        zonasAjustadas: zonasSeleccionadas,
        feedbackPaciente: feedbackPaciente.trim() || undefined,
      });
      
      // Resetear formulario
      setDescripcion('');
      setZonasSeleccionadas([]);
      setFeedbackPaciente('');
      setFecha(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error al guardar ajuste:', error);
      alert('Error al guardar el ajuste. Por favor, intente nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Registrar Nuevo Ajuste</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fecha del ajuste */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Fecha del Ajuste <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
          />
        </div>

        {/* Zonas ajustadas */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Zonas Ajustadas <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {ZONAS_AJUSTE.map((zona) => (
              <button
                key={zona}
                type="button"
                onClick={() => handleToggleZona(zona)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ring-1 ${
                  zonasSeleccionadas.includes(zona)
                    ? 'bg-blue-600 text-white ring-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 ring-slate-300 hover:ring-blue-400 hover:bg-blue-50'
                }`}
              >
                {zona}
              </button>
            ))}
          </div>
          
          {/* Zona personalizada */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={zonaPersonalizada}
              onChange={(e) => setZonaPersonalizada(e.target.value)}
              placeholder="Agregar zona personalizada..."
              className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAgregarZonaPersonalizada();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAgregarZonaPersonalizada}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={18} />
              Agregar
            </button>
          </div>

          {/* Zonas seleccionadas */}
          {zonasSeleccionadas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {zonasSeleccionadas.map((zona) => (
                <span
                  key={zona}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {zona}
                  <button
                    type="button"
                    onClick={() => handleEliminarZona(zona)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Descripción del ajuste */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción del Ajuste <span className="text-red-500">*</span>
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={4}
            placeholder="Describa detalladamente los ajustes realizados en la prótesis..."
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
          />
        </div>

        {/* Feedback del paciente */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Feedback del Paciente
          </label>
          <textarea
            value={feedbackPaciente}
            onChange={(e) => setFeedbackPaciente(e.target.value)}
            rows={3}
            placeholder="Comentarios o quejas del paciente sobre la prótesis..."
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={guardando}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Save size={20} />
            {guardando ? 'Guardando...' : 'Guardar Ajuste'}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            disabled={guardando}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <X size={20} />
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}



