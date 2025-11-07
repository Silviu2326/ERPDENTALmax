import { DatosSeguro } from '../api/pacientesApi';

interface SeccionDatosSeguroProps {
  datos: DatosSeguro;
  onChange: (datos: DatosSeguro) => void;
  errores?: Partial<Record<keyof DatosSeguro, string>>;
}

export default function SeccionDatosSeguro({
  datos,
  onChange,
  errores = {},
}: SeccionDatosSeguroProps) {
  const handleChange = (campo: keyof DatosSeguro, valor: string) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        Datos del Seguro Dental
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Aseguradora
          </label>
          <input
            type="text"
            value={datos.aseguradora || ''}
            onChange={(e) => handleChange('aseguradora', e.target.value)}
            className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errores.aseguradora ? 'ring-red-300' : 'ring-slate-300'
            }`}
            placeholder="Nombre de la aseguradora"
          />
          {errores.aseguradora && (
            <p className="mt-1 text-sm text-red-600">{errores.aseguradora}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Número de Póliza
          </label>
          <input
            type="text"
            value={datos.numeroPoliza || ''}
            onChange={(e) => handleChange('numeroPoliza', e.target.value)}
            className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errores.numeroPoliza ? 'ring-red-300' : 'ring-slate-300'
            }`}
            placeholder="Número de póliza o tarjeta"
          />
          {errores.numeroPoliza && (
            <p className="mt-1 text-sm text-red-600">{errores.numeroPoliza}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de Plan
          </label>
          <select
            value={datos.tipoPlan || ''}
            onChange={(e) => handleChange('tipoPlan', e.target.value)}
            className={`w-full rounded-xl bg-white text-slate-900 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errores.tipoPlan ? 'ring-red-300' : 'ring-slate-300'
            }`}
          >
            <option value="">Seleccionar tipo de plan...</option>
            <option value="basico">Básico</option>
            <option value="completo">Completo</option>
            <option value="premium">Premium</option>
            <option value="otro">Otro</option>
          </select>
          {errores.tipoPlan && (
            <p className="mt-1 text-sm text-red-600">{errores.tipoPlan}</p>
          )}
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Esta información es opcional pero recomendada para agilizar los trámites de facturación posteriores.
      </p>
    </div>
  );
}



