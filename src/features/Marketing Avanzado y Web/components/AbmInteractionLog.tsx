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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Historial de Interacciones</h3>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Interacción</span>
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de interacción</label>
              <select
                required
                value={formulario.tipo}
                onChange={(e) => setFormulario({ ...formulario, tipo: e.target.value as TipoInteraccion })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Llamada">Llamada</option>
                <option value="Email">Email</option>
                <option value="Reunion">Reunión</option>
                <option value="Evento">Evento</option>
                <option value="Otra">Otra</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                required
                value={formulario.fecha}
                onChange={(e) => setFormulario({ ...formulario, fecha: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {contactos.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contacto (opcional)</label>
                <select
                  value={formulario.contactoId || ''}
                  onChange={(e) => setFormulario({ ...formulario, contactoId: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              required
              value={formulario.notas}
              onChange={(e) => setFormulario({ ...formulario, notas: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe la interacción, puntos clave, próximos pasos..."
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={cargando}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {interacciones.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No hay interacciones registradas</p>
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
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icono className="w-5 h-5" />
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


