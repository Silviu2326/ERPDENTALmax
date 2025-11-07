import { useState } from 'react';
import { Plus, User, Mail, Phone, Briefcase, Crown, Trash2, Edit2 } from 'lucide-react';
import { ContactoEmpresa, CrearContactoRequest } from '../api/abmApi';

interface AbmContactManagerProps {
  contactos: ContactoEmpresa[];
  onAñadirContacto: (datos: CrearContactoRequest) => Promise<void>;
  onEliminarContacto?: (contactoId: string) => void;
}

export default function AbmContactManager({
  contactos,
  onAñadirContacto,
  onEliminarContacto,
}: AbmContactManagerProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState<CrearContactoRequest>({
    nombre: '',
    cargo: '',
    email: '',
    telefono: '',
    esDecisionMaker: false,
  });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    try {
      await onAñadirContacto(formulario);
      setFormulario({
        nombre: '',
        cargo: '',
        email: '',
        telefono: '',
        esDecisionMaker: false,
      });
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error al añadir contacto:', error);
      alert('Error al añadir el contacto');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Contactos</h3>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
        >
          <Plus size={18} />
          <span>Nuevo Contacto</span>
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                required
                value={formulario.nombre}
                onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cargo</label>
              <input
                type="text"
                required
                value={formulario.cargo}
                onChange={(e) => setFormulario({ ...formulario, cargo: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                placeholder="Cargo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formulario.email}
                onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                placeholder="email@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
              <input
                type="tel"
                required
                value={formulario.telefono}
                onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                placeholder="Teléfono"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="esDecisionMaker"
              checked={formulario.esDecisionMaker}
              onChange={(e) => setFormulario({ ...formulario, esDecisionMaker: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ring-1 ring-slate-300"
            />
            <label htmlFor="esDecisionMaker" className="text-sm text-slate-700">
              Es tomador de decisiones
            </label>
          </div>
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {cargando ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMostrarFormulario(false);
                setFormulario({
                  nombre: '',
                  cargo: '',
                  email: '',
                  telefono: '',
                  esDecisionMaker: false,
                });
              }}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {contactos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <User size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay contactos</h3>
          <p className="text-sm text-gray-600">Comienza añadiendo un nuevo contacto</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contactos.map((contacto) => (
            <div
              key={contacto._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{contacto.nombre}</h4>
                    {contacto.esDecisionMaker && (
                      <Crown size={16} className="text-yellow-500" title="Tomador de decisiones" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Briefcase size={14} />
                      <span>{contacto.cargo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      <span>{contacto.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      <span>{contacto.telefono}</span>
                    </div>
                  </div>
                </div>
              </div>
              {onEliminarContacto && contacto._id && (
                <button
                  onClick={() => onEliminarContacto(contacto._id!)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar contacto"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



