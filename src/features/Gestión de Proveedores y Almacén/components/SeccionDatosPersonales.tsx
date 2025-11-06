import { User, Mail, Phone, Calendar, MapPin } from 'lucide-react';

interface DatosPersonales {
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  email: string;
  telefono: string;
  direccion: {
    calle: string;
    numero: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
    pais: string;
  };
}

interface SeccionDatosPersonalesProps {
  datos: DatosPersonales;
  onChange: (field: string, value: string) => void;
  onChangeDireccion: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export default function SeccionDatosPersonales({
  datos,
  onChange,
  onChangeDireccion,
  errors = {},
}: SeccionDatosPersonalesProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" />
        Datos Personales
      </h3>

      {/* Datos básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre *
          </label>
          <input
            type="text"
            required
            value={datos.nombre}
            onChange={(e) => onChange('nombre', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellidos *
          </label>
          <input
            type="text"
            required
            value={datos.apellidos}
            onChange={(e) => onChange('apellidos', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.apellidos ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.apellidos && (
            <p className="mt-1 text-sm text-red-600">{errors.apellidos}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DNI *
          </label>
          <input
            type="text"
            required
            value={datos.dni}
            onChange={(e) => onChange('dni', e.target.value)}
            placeholder="12345678A"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.dni ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dni && (
            <p className="mt-1 text-sm text-red-600">{errors.dni}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            value={datos.fechaNacimiento}
            onChange={(e) => onChange('fechaNacimiento', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email *
          </label>
          <input
            type="email"
            required
            value={datos.email}
            onChange={(e) => onChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Teléfono
          </label>
          <input
            type="tel"
            value={datos.telefono}
            onChange={(e) => onChange('telefono', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Dirección */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-blue-600" />
          Dirección
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calle
              </label>
              <input
                type="text"
                value={datos.direccion.calle}
                onChange={(e) => onChangeDireccion('calle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número
              </label>
              <input
                type="text"
                value={datos.direccion.numero}
                onChange={(e) => onChangeDireccion('numero', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <input
              type="text"
              value={datos.direccion.ciudad}
              onChange={(e) => onChangeDireccion('ciudad', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provincia
            </label>
            <input
              type="text"
              value={datos.direccion.provincia}
              onChange={(e) => onChangeDireccion('provincia', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código Postal
            </label>
            <input
              type="text"
              value={datos.direccion.codigoPostal}
              onChange={(e) => onChangeDireccion('codigoPostal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País
            </label>
            <input
              type="text"
              value={datos.direccion.pais}
              onChange={(e) => onChangeDireccion('pais', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


