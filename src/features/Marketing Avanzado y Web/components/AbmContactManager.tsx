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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Contactos</h3>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Contacto</span>
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                required
                value={formulario.nombre}
                onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
              <input
                type="text"
                required
                value={formulario.cargo}
                onChange={(e) => setFormulario({ ...formulario, cargo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formulario.email}
                onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                required
                value={formulario.telefono}
                onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="esDecisionMaker"
              checked={formulario.esDecisionMaker}
              onChange={(e) => setFormulario({ ...formulario, esDecisionMaker: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="esDecisionMaker" className="text-sm text-gray-700">
              Es tomador de decisiones
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={cargando}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {contactos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No hay contactos registrados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contactos.map((contacto) => (
            <div
              key={contacto._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{contacto.nombre}</h4>
                    {contacto.esDecisionMaker && (
                      <Crown className="w-4 h-4 text-yellow-500" title="Tomador de decisiones" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      <span>{contacto.cargo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{contacto.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
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
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


