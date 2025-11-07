import { FileText, DollarSign, Calendar } from 'lucide-react';

interface InformacionContractual {
  puesto: string;
  tipoContrato: 'Indefinido' | 'Temporal' | 'Practicas' | 'Otro';
  salario: string;
  fechaContratacion: string;
  numeroSeguridadSocial: string;
  datosBancarios: {
    iban: string;
    titular: string;
  };
}

interface SeccionInformacionContractualProps {
  datos: InformacionContractual;
  onChange: (field: string, value: string) => void;
  onChangeBancarios: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export default function SeccionInformacionContractual({
  datos,
  onChange,
  onChangeBancarios,
  errors = {},
}: SeccionInformacionContractualProps) {
  const tiposContrato = [
    { value: 'Indefinido' as const, label: 'Indefinido' },
    { value: 'Temporal' as const, label: 'Temporal' },
    { value: 'Practicas' as const, label: 'Prácticas' },
    { value: 'Otro' as const, label: 'Otro' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        Información Contractual
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Puesto *
          </label>
          <input
            type="text"
            required
            value={datos.puesto}
            onChange={(e) => onChange('puesto', e.target.value)}
            placeholder="Ej: Odontólogo, Recepcionista..."
            className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errors.puesto ? 'ring-red-500' : 'ring-slate-300'
            }`}
          />
          {errors.puesto && (
            <p className="mt-1 text-sm text-red-600">{errors.puesto}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de Contrato *
          </label>
          <select
            required
            value={datos.tipoContrato}
            onChange={(e) => onChange('tipoContrato', e.target.value)}
            className={`w-full rounded-xl bg-white text-slate-900 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errors.tipoContrato ? 'ring-red-500' : 'ring-slate-300'
            }`}
          >
            {tiposContrato.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          {errors.tipoContrato && (
            <p className="mt-1 text-sm text-red-600">{errors.tipoContrato}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <DollarSign size={16} className="inline" />
            Salario (€) *
          </label>
          <input
            type="number"
            required
            step="0.01"
            min="0"
            value={datos.salario}
            onChange={(e) => onChange('salario', e.target.value)}
            className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errors.salario ? 'ring-red-500' : 'ring-slate-300'
            }`}
          />
          {errors.salario && (
            <p className="mt-1 text-sm text-red-600">{errors.salario}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Calendar size={16} className="inline" />
            Fecha de Contratación *
          </label>
          <input
            type="date"
            required
            value={datos.fechaContratacion}
            onChange={(e) => onChange('fechaContratacion', e.target.value)}
            className={`w-full rounded-xl bg-white text-slate-900 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errors.fechaContratacion ? 'ring-red-500' : 'ring-slate-300'
            }`}
          />
          {errors.fechaContratacion && (
            <p className="mt-1 text-sm text-red-600">{errors.fechaContratacion}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Número de Seguridad Social
          </label>
          <input
            type="text"
            value={datos.numeroSeguridadSocial}
            onChange={(e) => onChange('numeroSeguridadSocial', e.target.value)}
            placeholder="Ej: 123456789012"
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>
      </div>

      {/* Datos Bancarios */}
      <div className="pt-6 border-t border-slate-200">
        <h4 className="text-md font-semibold text-gray-800 mb-4">
          Datos Bancarios
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              IBAN
            </label>
            <input
              type="text"
              value={datos.datosBancarios.iban}
              onChange={(e) => onChangeBancarios('iban', e.target.value)}
              placeholder="ES91 2100 0418 4502 0005 1332"
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Titular
            </label>
            <input
              type="text"
              value={datos.datosBancarios.titular}
              onChange={(e) => onChangeBancarios('titular', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}



