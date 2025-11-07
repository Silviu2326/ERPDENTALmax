import { CreditCard, Building2, FileText } from 'lucide-react';

interface InformacionBancaria {
  banco?: string;
  iban?: string;
}

interface InformacionFiscalBancaria {
  informacionBancaria?: InformacionBancaria;
}

interface InformacionFiscalBancariaSectionProps {
  datos: InformacionFiscalBancaria;
  onChange: (datos: InformacionFiscalBancaria) => void;
  errores?: Partial<Record<'informacionBancaria.iban' | 'informacionBancaria.banco', string>>;
}

export default function InformacionFiscalBancariaSection({
  datos,
  onChange,
  errores = {},
}: InformacionFiscalBancariaSectionProps) {
  const handleBancariaChange = (campo: keyof InformacionBancaria, valor: string) => {
    onChange({
      ...datos,
      informacionBancaria: {
        ...datos.informacionBancaria,
        [campo]: valor,
      },
    });
  };

  // Validación básica de formato IBAN (formato español: ES + 2 dígitos + 4 letras + 20 dígitos)
  const validarIBAN = (iban: string): boolean => {
    if (!iban) return true; // Opcional
    // Formato básico: permite letras y números, entre 15 y 34 caracteres
    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/;
    return ibanRegex.test(iban.replace(/\s/g, ''));
  };

  const handleIbanBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const iban = e.target.value.replace(/\s/g, '').toUpperCase();
    if (iban && !validarIBAN(iban)) {
      // El error se manejará en el componente padre
    } else {
      // Formatear IBAN con espacios cada 4 caracteres
      const formatted = iban.match(/.{1,4}/g)?.join(' ') || iban;
      handleBancariaChange('iban', formatted);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        Información Fiscal y Bancaria
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              Banco
            </label>
            <input
              type="text"
              value={datos.informacionBancaria?.banco || ''}
              onChange={(e) => handleBancariaChange('banco', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores['informacionBancaria.banco'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nombre del banco"
            />
            {errores['informacionBancaria.banco'] && (
              <p className="mt-1 text-sm text-red-600">{errores['informacionBancaria.banco']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <FileText className="w-4 h-4" />
              IBAN
            </label>
            <input
              type="text"
              value={datos.informacionBancaria?.iban || ''}
              onChange={(e) => {
                const valor = e.target.value.replace(/\s/g, '').toUpperCase();
                handleBancariaChange('iban', valor);
              }}
              onBlur={handleIbanBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                errores['informacionBancaria.iban'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ES91 2100 0418 4502 0005 1332"
              maxLength={34}
            />
            {errores['informacionBancaria.iban'] && (
              <p className="mt-1 text-sm text-red-600">{errores['informacionBancaria.iban']}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Formato: ES + 2 dígitos + 4 letras + 20 dígitos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



