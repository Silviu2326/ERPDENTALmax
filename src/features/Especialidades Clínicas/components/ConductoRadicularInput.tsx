import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { ConductoRadicular } from '../api/endodonciaApi';

interface ConductoRadicularInputProps {
  conducto: ConductoRadicular;
  index: number;
  onChange: (index: number, conducto: ConductoRadicular) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const OPCIONES_CONDUCTO: ConductoRadicular['nombreConducto'][] = [
  'Mesiobucal',
  'Distobucal',
  'Palatino',
  'Vestibular',
  'Lingual',
  'Mesial',
  'Distal',
  'MV',
  'ML',
  'DV',
  'DL',
  'Otro',
];

const TECNICAS_OBTURACION = [
  'Condensación lateral',
  'Condensación vertical caliente',
  'Obturación termoplástica',
  'Inyección termoplástica',
  'Otra',
];

const SELLADORES = [
  'AH Plus',
  'Sealapex',
  'Tubli-Seal',
  'EndoRez',
  'Pulp Canal Sealer',
  'Otro',
];

export default function ConductoRadicularInput({
  conducto,
  index,
  onChange,
  onRemove,
  canRemove,
}: ConductoRadicularInputProps) {
  const [nombreConductoOtro, setNombreConductoOtro] = useState('');
  const [tecnicaOtro, setTecnicaOtro] = useState('');
  const [selladorOtro, setSelladorOtro] = useState('');

  const handleChange = (field: keyof ConductoRadicular, value: any) => {
    const updated: ConductoRadicular = {
      ...conducto,
      [field]: value,
    };
    onChange(index, updated);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-5 shadow-sm hover:border-blue-300 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800">
          Conducto {index + 1}
        </h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            aria-label="Eliminar conducto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre del conducto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nombre del Conducto <span className="text-red-500">*</span>
          </label>
          <select
            value={conducto.nombreConducto}
            onChange={(e) => handleChange('nombreConducto', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {OPCIONES_CONDUCTO.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
          {conducto.nombreConducto === 'Otro' && (
            <input
              type="text"
              value={nombreConductoOtro}
              onChange={(e) => {
                setNombreConductoOtro(e.target.value);
                // Aquí podrías guardar el valor personalizado si lo necesitas
              }}
              placeholder="Especificar nombre del conducto"
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>

        {/* Longitud de trabajo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Longitud de Trabajo (mm) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="50"
            value={conducto.longitudTrabajo || ''}
            onChange={(e) => handleChange('longitudTrabajo', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Instrumento apical */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Instrumento Apical (Última Lima) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={conducto.instrumentoApical || ''}
            onChange={(e) => handleChange('instrumentoApical', e.target.value)}
            placeholder="Ej: K-File 25, ProTaper F2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Cono maestro */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Cono Maestro <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={conducto.conoMaestro || ''}
            onChange={(e) => handleChange('conoMaestro', e.target.value)}
            placeholder="Ej: 25, 30, 35"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Técnica de obturación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Técnica de Obturación
          </label>
          <select
            value={conducto.tecnicaObturacion || ''}
            onChange={(e) => handleChange('tecnicaObturacion', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar...</option>
            {TECNICAS_OBTURACION.map((tecnica) => (
              <option key={tecnica} value={tecnica}>
                {tecnica}
              </option>
            ))}
          </select>
          {conducto.tecnicaObturacion === 'Otra' && (
            <input
              type="text"
              value={tecnicaOtro}
              onChange={(e) => {
                setTecnicaOtro(e.target.value);
              }}
              placeholder="Especificar técnica"
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>

        {/* Sellador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Sellador
          </label>
          <select
            value={conducto.sellador || ''}
            onChange={(e) => handleChange('sellador', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar...</option>
            {SELLADORES.map((sellador) => (
              <option key={sellador} value={sellador}>
                {sellador}
              </option>
            ))}
          </select>
          {conducto.sellador === 'Otro' && (
            <input
              type="text"
              value={selladorOtro}
              onChange={(e) => {
                setSelladorOtro(e.target.value);
              }}
              placeholder="Especificar sellador"
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>

        {/* Observaciones del conducto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Observaciones del Conducto
          </label>
          <textarea
            value={conducto.observacionesConducto || ''}
            onChange={(e) => handleChange('observacionesConducto', e.target.value)}
            placeholder="Ej: Conducto calcificado, curvatura pronunciada, perforación, etc."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}


