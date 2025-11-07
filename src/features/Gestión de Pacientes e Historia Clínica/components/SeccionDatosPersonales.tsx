import { DatosPersonales } from '../api/pacientesApi';

interface SeccionDatosPersonalesProps {
  datos: DatosPersonales;
  onChange: (datos: DatosPersonales) => void;
  errores?: Partial<Record<keyof DatosPersonales, string>>;
}

export default function SeccionDatosPersonales({
  datos,
  onChange,
  errores = {},
}: SeccionDatosPersonalesProps) {
  const handleChange = (campo: keyof DatosPersonales, valor: string) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        Datos Personales
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={datos.nombre || ''}
            onChange={(e) => handleChange('nombre', e.target.value)}
            className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errores.nombre ? 'ring-red-300' : 'ring-slate-300'
            }`}
            placeholder="Nombre del paciente"
          />
          {errores.nombre && (
            <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Apellidos <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={datos.apellidos || ''}
            onChange={(e) => handleChange('apellidos', e.target.value)}
            className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errores.apellidos ? 'ring-red-300' : 'ring-slate-300'
            }`}
            placeholder="Apellidos del paciente"
          />
          {errores.apellidos && (
            <p className="mt-1 text-sm text-red-600">{errores.apellidos}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            DNI / Documento de Identidad
          </label>
          <input
            type="text"
            value={datos.dni || ''}
            onChange={(e) => handleChange('dni', e.target.value)}
            className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errores.dni ? 'ring-red-300' : 'ring-slate-300'
            }`}
            placeholder="Ej: 12345678A"
          />
          {errores.dni && (
            <p className="mt-1 text-sm text-red-600">{errores.dni}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            value={datos.fechaNacimiento || ''}
            onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full rounded-xl bg-white text-slate-900 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errores.fechaNacimiento ? 'ring-red-300' : 'ring-slate-300'
            }`}
          />
          {errores.fechaNacimiento && (
            <p className="mt-1 text-sm text-red-600">{errores.fechaNacimiento}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Género
          </label>
          <select
            value={datos.genero || ''}
            onChange={(e) => handleChange('genero', e.target.value)}
            className={`w-full rounded-xl bg-white text-slate-900 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errores.genero ? 'ring-red-300' : 'ring-slate-300'
            }`}
          >
            <option value="">Seleccionar...</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
            <option value="prefiero-no-decir">Prefiero no decir</option>
          </select>
          {errores.genero && (
            <p className="mt-1 text-sm text-red-600">{errores.genero}</p>
          )}
        </div>
      </div>
    </div>
  );
}



