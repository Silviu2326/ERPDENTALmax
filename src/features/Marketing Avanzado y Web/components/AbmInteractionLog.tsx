import { useState } from 'react';
import { Plus, Phone, Mail, Calendar, Users, FileText, Clock } from 'lucide-react';
import { Interaccion, TipoInteraccion, CrearInteraccionRequest } from '../api/abmApi';

interface AbmInteractionLogProps {
  interacciones: Interaccion[];
  contactos: Array<{ _id?: string; nombre: string }>;
  onRegistrarInteraccion: (datos: CrearInteraccionRequest) => Promise<void>;
}

const TIPO_ICONS: Record<TipoInteraccion, typeof Phone> = {
  Llamada: Phone,
  Email: Mail,
  Reunion: Calendar,
  Evento: Users,
  Otra: FileText,
};

const TIPO_COLORS: Record<TipoInteraccion, string> = {
  Llamada: 'bg-blue-100 text-blue-600',
  Email: 'bg-purple-100 text-purple-600',
  Reunion: 'bg-green-100 text-green-600',
  Evento: 'bg-orange-100 text-orange-600',
  Otra: 'bg-gray-100 text-gray-600',
};

export default function AbmInteractionLog({
  interacciones,
  contactos,
  onRegistrarInteraccion,
}: AbmInteractionLogProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState<CrearInteraccionRequest>({
    tipo: 'Llamada',
    fecha: new Date().toISOString().split('T')[0],
    notas: '',
  });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    try {
      await onRegistrarInteraccion(formulario);
      setFormulario({
        tipo: 'Llamada',
        fecha: new Date().toISOString().split('T')[0],
        notas: '',
      });
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error al registrar interacción:', error);
      alert('Error al registrar la interacción');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Historial de Interacciones</h3>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
        >
          <Plus size={18} />
          <span>Registrar Interacción</span>
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de interacción</label>
              <select
                required
                value={formulario.tipo}
                onChange={(e) => setFormulario({ ...formulario, tipo: e.target.value as TipoInteraccion })}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              >
                <option value="Llamada">Llamada</option>
                <option value="Email">Email</option>
                <option value="Reunion">Reunión</option>
                <option value="Evento">Evento</option>
                <option value="Otra">Otra</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
              <input
                type="date"
                required
                value={formulario.fecha}
                onChange={(e) => setFormulario({ ...formulario, fecha: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              />
            </div>
            {contactos.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contacto (opcional)</label>
                <select
                  value={formulario.contactoId || ''}
                  onChange={(e) => setFormulario({ ...formulario, contactoId: e.target.value || undefined })}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                >
                  <option value="">Ninguno</option>
                  {contactos.map((contacto) => (
                    <option key={contacto._id} value={contacto._id}>
                      {contacto.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notas</label>
            <textarea
              required
              value={formulario.notas}
              onChange={(e) => setFormulario({ ...formulario, notas: e.target.value })}
              rows={3}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 resize-none"
              placeholder="Describe la interacción, puntos clave, próximos pasos..."
            />
          </div>
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? 'Registrando...' : 'Registrar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMostrarFormulario(false);
                setFormulario({
                  tipo: 'Llamada',
                  fecha: new Date().toISOString().split('T')[0],
                  notas: '',
                });
              }}
              className="px-4 py-2.5 text-sm font-medium bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {interacciones.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay interacciones</h3>
          <p className="text-sm text-gray-600">Comienza registrando una nueva interacción</p>
        </div>
      ) : (
        <div className="space-y-3">
          {interacciones
            .sort((a, b) => {
              const fechaA = new Date(a.fecha).getTime();
              const fechaB = new Date(b.fecha).getTime();
              return fechaB - fechaA;
            })
            .map((interaccion) => {
              const Icono = TIPO_ICONS[interaccion.tipo];
              const colorClass = TIPO_COLORS[interaccion.tipo];

              return (
                <div
                  key={interaccion._id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icono size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{interaccion.tipo}</span>
                        {interaccion.contacto && (
                          <span className="text-sm text-gray-500">con {interaccion.contacto.nombre}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{formatearFecha(interaccion.fecha)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{interaccion.notas}</p>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}



