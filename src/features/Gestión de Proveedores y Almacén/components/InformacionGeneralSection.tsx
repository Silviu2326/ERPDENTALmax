import { FileText, MapPin, Building2 } from 'lucide-react';

interface Direccion {
  calle?: string;
  ciudad?: string;
  codigoPostal?: string;
  pais?: string;
}

interface InformacionGeneral {
  nombreComercial: string;
  razonSocial?: string;
  cifnif?: string;
  direccion?: Direccion;
}

interface InformacionGeneralSectionProps {
  datos: InformacionGeneral;
  onChange: (datos: InformacionGeneral) => void;
  errores?: Partial<Record<keyof InformacionGeneral | 'direccion.calle' | 'direccion.ciudad' | 'direccion.codigoPostal' | 'direccion.pais', string>>;
  onCifChange?: (cif: string) => void;
  cifExiste?: boolean;
}

export default function InformacionGeneralSection({
  datos,
  onChange,
  errores = {},
  onCifChange,
  cifExiste = false,
}: InformacionGeneralSectionProps) {
  const handleChange = (campo: keyof InformacionGeneral, valor: string) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  const handleDireccionChange = (campo: keyof Direccion, valor: string) => {
    onChange({
      ...datos,
      direccion: {
        ...datos.direccion,
        [campo]: valor,
      },
    });
  };

  const handleCifChange = (valor: string) => {
    handleChange('cifnif', valor);
    if (onCifChange) {
      onCifChange(valor);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Información General
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Comercial <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={datos.nombreComercial}
              onChange={(e) => handleChange('nombreComercial', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.nombreComercial ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Proveedor XYZ"
            />
            {errores.nombreComercial && (
              <p className="mt-1 text-sm text-red-600">{errores.nombreComercial}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Razón Social
            </label>
            <input
              type="text"
              value={datos.razonSocial || ''}
              onChange={(e) => handleChange('razonSocial', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Razón social completa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CIF/NIF <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={datos.cifnif || ''}
              onChange={(e) => handleCifChange(e.target.value.toUpperCase())}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.cifnif || cifExiste ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: B12345678"
              maxLength={20}
            />
            {errores.cifnif && (
              <p className="mt-1 text-sm text-red-600">{errores.cifnif}</p>
            )}
            {cifExiste && (
              <p className="mt-1 text-sm text-orange-600 flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                Este CIF/NIF ya está registrado en el sistema
              </p>
            )}
          </div>
        </div>

        {/* Sección de Dirección */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Dirección Fiscal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calle
              </label>
              <input
                type="text"
                value={datos.direccion?.calle || ''}
                onChange={(e) => handleDireccionChange('calle', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores['direccion.calle'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Calle y número"
              />
              {errores['direccion.calle'] && (
                <p className="mt-1 text-sm text-red-600">{errores['direccion.calle']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                value={datos.direccion?.ciudad || ''}
                onChange={(e) => handleDireccionChange('ciudad', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores['direccion.ciudad'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ciudad"
              />
              {errores['direccion.ciudad'] && (
                <p className="mt-1 text-sm text-red-600">{errores['direccion.ciudad']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal
              </label>
              <input
                type="text"
                value={datos.direccion?.codigoPostal || ''}
                onChange={(e) => handleDireccionChange('codigoPostal', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores['direccion.codigoPostal'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Código postal"
              />
              {errores['direccion.codigoPostal'] && (
                <p className="mt-1 text-sm text-red-600">{errores['direccion.codigoPostal']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <input
                type="text"
                value={datos.direccion?.pais || ''}
                onChange={(e) => handleDireccionChange('pais', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores['direccion.pais'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="País"
              />
              {errores['direccion.pais'] && (
                <p className="mt-1 text-sm text-red-600">{errores['direccion.pais']}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


