import { User, Mail, Phone, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface Contacto {
  nombre: string;
  email?: string;
  telefono?: string;
}

interface DatosContacto {
  contactoPrincipal: Contacto;
  contactosAdicionales?: Contacto[];
}

interface DatosContactoSectionProps {
  datos: DatosContacto;
  onChange: (datos: DatosContacto) => void;
  errores?: Partial<Record<'contactoPrincipal.nombre' | 'contactoPrincipal.email' | 'contactoPrincipal.telefono', string>>;
}

export default function DatosContactoSection({
  datos,
  onChange,
  errores = {},
}: DatosContactoSectionProps) {
  const [mostrarAgregarContacto, setMostrarAgregarContacto] = useState(false);
  const [nuevoContacto, setNuevoContacto] = useState<Contacto>({
    nombre: '',
    email: '',
    telefono: '',
  });

  const handleContactoPrincipalChange = (campo: keyof Contacto, valor: string) => {
    onChange({
      ...datos,
      contactoPrincipal: {
        ...datos.contactoPrincipal,
        [campo]: valor,
      },
    });
  };

  const handleAgregarContacto = () => {
    if (!nuevoContacto.nombre.trim()) return;

    onChange({
      ...datos,
      contactosAdicionales: [
        ...(datos.contactosAdicionales || []),
        nuevoContacto,
      ],
    });

    setNuevoContacto({ nombre: '', email: '', telefono: '' });
    setMostrarAgregarContacto(false);
  };

  const handleEliminarContacto = (index: number) => {
    const contactos = [...(datos.contactosAdicionales || [])];
    contactos.splice(index, 1);
    onChange({
      ...datos,
      contactosAdicionales: contactos,
    });
  };

  const handleEditarContactoAdicional = (index: number, campo: keyof Contacto, valor: string) => {
    const contactos = [...(datos.contactosAdicionales || [])];
    contactos[index] = {
      ...contactos[index],
      [campo]: valor,
    };
    onChange({
      ...datos,
      contactosAdicionales: contactos,
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Datos de Contacto
      </h3>
      <div className="space-y-4">
        {/* Contacto Principal */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Contacto Principal</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={datos.contactoPrincipal.nombre}
                onChange={(e) => handleContactoPrincipalChange('nombre', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores['contactoPrincipal.nombre'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nombre del contacto"
              />
              {errores['contactoPrincipal.nombre'] && (
                <p className="mt-1 text-sm text-red-600">{errores['contactoPrincipal.nombre']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={datos.contactoPrincipal.email || ''}
                onChange={(e) => handleContactoPrincipalChange('email', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores['contactoPrincipal.email'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="email@ejemplo.com"
              />
              {errores['contactoPrincipal.email'] && (
                <p className="mt-1 text-sm text-red-600">{errores['contactoPrincipal.email']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Teléfono
              </label>
              <input
                type="tel"
                value={datos.contactoPrincipal.telefono || ''}
                onChange={(e) => handleContactoPrincipalChange('telefono', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores['contactoPrincipal.telefono'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+34 123 456 789"
              />
              {errores['contactoPrincipal.telefono'] && (
                <p className="mt-1 text-sm text-red-600">{errores['contactoPrincipal.telefono']}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contactos Adicionales */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-medium text-gray-900">Contactos Adicionales</h4>
            {!mostrarAgregarContacto && (
              <button
                type="button"
                onClick={() => setMostrarAgregarContacto(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar Contacto
              </button>
            )}
          </div>

          {/* Lista de contactos adicionales */}
          {datos.contactosAdicionales && datos.contactosAdicionales.length > 0 && (
            <div className="space-y-3 mb-3">
              {datos.contactosAdicionales.map((contacto, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={contacto.nombre}
                        onChange={(e) => handleEditarContactoAdicional(index, 'nombre', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        value={contacto.email || ''}
                        onChange={(e) => handleEditarContactoAdicional(index, 'email', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="email@ejemplo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        value={contacto.telefono || ''}
                        onChange={(e) => handleEditarContactoAdicional(index, 'telefono', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Teléfono"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleEliminarContacto(index)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Eliminar contacto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Formulario para agregar nuevo contacto */}
          {mostrarAgregarContacto && (
            <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nuevoContacto.nombre}
                    onChange={(e) => setNuevoContacto({ ...nuevoContacto, nombre: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={nuevoContacto.email}
                    onChange={(e) => setNuevoContacto({ ...nuevoContacto, email: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={nuevoContacto.telefono}
                    onChange={(e) => setNuevoContacto({ ...nuevoContacto, telefono: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Teléfono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarAgregarContacto(false);
                    setNuevoContacto({ nombre: '', email: '', telefono: '' });
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAgregarContacto}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



