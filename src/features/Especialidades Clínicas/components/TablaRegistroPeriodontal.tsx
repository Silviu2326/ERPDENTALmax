import { useState, useEffect } from 'react';
import { MedicionDiente } from '../api/periodonciaApi';

interface TablaRegistroPeriodontalProps {
  mediciones: MedicionDiente[];
  onMedicionesChange: (mediciones: MedicionDiente[]) => void;
}

// Números de dientes según la nomenclatura dental internacional
const DIENTES = [
  // Superior derecho
  18, 17, 16, 15, 14, 13, 12, 11,
  // Superior izquierdo
  21, 22, 23, 24, 25, 26, 27, 28,
  // Inferior izquierdo
  38, 37, 36, 35, 34, 33, 32, 31,
  // Inferior derecho
  48, 47, 46, 45, 44, 43, 42, 41,
];

// Superficies dentales: Mesial, Vestibular, Distal, Palatino/Lingual, Oclusal Incisal, Oclusal Distal
const SUPERFICIES = ['M', 'V', 'D', 'P/L', 'OI', 'OD'];

export default function TablaRegistroPeriodontal({
  mediciones,
  onMedicionesChange,
}: TablaRegistroPeriodontalProps) {
  const [medicionesMap, setMedicionesMap] = useState<Map<number, MedicionDiente>>(new Map());

  useEffect(() => {
    const mapa = new Map<number, MedicionDiente>();
    mediciones.forEach(med => {
      mapa.set(med.diente, med);
    });
    setMedicionesMap(mapa);
  }, [mediciones]);

  const obtenerMedicion = (diente: number): MedicionDiente => {
    const existente = medicionesMap.get(diente);
    if (existente) return existente;

    const nueva: MedicionDiente = {
      diente,
      profundidadSondaje: [0, 0, 0, 0, 0, 0],
      sangradoAlSondaje: [false, false, false, false, false, false],
      supuracion: [false, false, false, false, false, false],
      placaVisible: [false, false, false, false, false, false],
      nivelInsercion: [0, 0, 0, 0, 0, 0],
      movilidad: 0,
      afectacionFurca: '',
    };
    return nueva;
  };

  const actualizarMedicion = (diente: number, campo: keyof MedicionDiente, valor: any, indice?: number) => {
    const medicion = obtenerMedicion(diente);
    const nuevaMedicion = { ...medicion };

    if (indice !== undefined && Array.isArray(medicion[campo])) {
      const array = [...(medicion[campo] as any[])];
      array[indice] = valor;
      (nuevaMedicion[campo] as any) = array;
    } else {
      (nuevaMedicion[campo] as any) = valor;
    }

    const nuevoMapa = new Map(medicionesMap);
    nuevoMapa.set(diente, nuevaMedicion);
    setMedicionesMap(nuevoMapa);

    const nuevasMediciones = Array.from(nuevoMapa.values());
    onMedicionesChange(nuevasMediciones);
  };

  const toggleBoolean = (diente: number, campo: 'sangradoAlSondaje' | 'supuracion' | 'placaVisible', indice: number) => {
    const medicion = obtenerMedicion(diente);
    const array = [...(medicion[campo] as boolean[])];
    array[indice] = !array[indice];
    actualizarMedicion(diente, campo, array);
  };

  const renderFila = (diente: number, esSuperior: boolean) => {
    const medicion = obtenerMedicion(diente);
    const tieneDatos = medicionesMap.has(diente);
    const tieneSangrado = medicion.sangradoAlSondaje.some(s => s);
    const tienePlaca = medicion.placaVisible.some(s => s);

    return (
      <tr
        key={diente}
        className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
          tieneDatos ? 'bg-blue-50' : ''
        }`}
      >
        <td className="px-4 py-2 font-semibold text-center">
          <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center ${
            tieneSangrado ? 'border-red-400 bg-red-50' :
            tienePlaca ? 'border-yellow-400 bg-yellow-50' :
            tieneDatos ? 'border-blue-400 bg-blue-50' :
            'border-gray-300 bg-white'
          }`}>
            {diente}
          </div>
        </td>

        {/* Profundidad de Sondaje */}
        {SUPERFICIES.map((_, idx) => (
          <td key={`prof-${idx}`} className="px-1 py-2">
            <input
              type="number"
              min="0"
              max="15"
              step="0.5"
              value={medicion.profundidadSondaje[idx] || 0}
              onChange={(e) => {
                const valor = parseFloat(e.target.value) || 0;
                actualizarMedicion(diente, 'profundidadSondaje', valor, idx);
              }}
              className="w-12 px-1 py-1 text-center text-sm rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              tabIndex={idx + 1}
            />
          </td>
        ))}

        {/* Sangrado al Sondaje */}
        {SUPERFICIES.map((_, idx) => (
          <td key={`sang-${idx}`} className="px-1 py-2 text-center">
            <button
              onClick={() => toggleBoolean(diente, 'sangradoAlSondaje', idx)}
              className={`w-8 h-8 rounded border-2 transition-all ${
                medicion.sangradoAlSondaje[idx]
                  ? 'bg-red-500 border-red-700 text-white'
                  : 'bg-white border-gray-300 hover:border-red-400'
              }`}
              title={medicion.sangradoAlSondaje[idx] ? 'Sangrado presente' : 'Sin sangrado'}
            >
              {medicion.sangradoAlSondaje[idx] ? '✓' : ''}
            </button>
          </td>
        ))}

        {/* Placa Visible */}
        {SUPERFICIES.map((_, idx) => (
          <td key={`placa-${idx}`} className="px-1 py-2 text-center">
            <button
              onClick={() => toggleBoolean(diente, 'placaVisible', idx)}
              className={`w-8 h-8 rounded border-2 transition-all ${
                medicion.placaVisible[idx]
                  ? 'bg-yellow-500 border-yellow-700 text-white'
                  : 'bg-white border-gray-300 hover:border-yellow-400'
              }`}
              title={medicion.placaVisible[idx] ? 'Placa presente' : 'Sin placa'}
            >
              {medicion.placaVisible[idx] ? '✓' : ''}
            </button>
          </td>
        ))}

        {/* Movilidad */}
        <td className="px-2 py-2">
          <select
            value={medicion.movilidad || 0}
            onChange={(e) => actualizarMedicion(diente, 'movilidad', parseInt(e.target.value))}
            className="w-16 px-2 py-1 text-center text-sm rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value={0}>0</option>
            <option value={1}>I</option>
            <option value={2}>II</option>
            <option value={3}>III</option>
          </select>
        </td>

        {/* Afectación Furca */}
        <td className="px-2 py-2">
          <select
            value={medicion.afectacionFurca || ''}
            onChange={(e) => actualizarMedicion(diente, 'afectacionFurca', e.target.value)}
            className="w-20 px-2 py-1 text-center text-sm rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-</option>
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
          </select>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Registro de Mediciones Periodontales</h3>
        <p className="text-sm text-gray-600 mt-1">
          Complete las mediciones para cada diente. Use las teclas Tab para navegar rápidamente.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">
                Diente
              </th>
              <th colSpan={6} className="px-2 py-3 text-center font-semibold text-gray-700 border-b border-gray-300 border-l border-gray-300">
                Profundidad Sondaje (mm)
              </th>
              <th colSpan={6} className="px-2 py-3 text-center font-semibold text-gray-700 border-b border-gray-300 border-l border-gray-300">
                Sangrado
              </th>
              <th colSpan={6} className="px-2 py-3 text-center font-semibold text-gray-700 border-b border-gray-300 border-l border-gray-300">
                Placa
              </th>
              <th className="px-2 py-3 text-center font-semibold text-gray-700 border-b border-gray-300 border-l border-gray-300">
                Movilidad
              </th>
              <th className="px-2 py-3 text-center font-semibold text-gray-700 border-b border-gray-300 border-l border-gray-300">
                Furca
              </th>
            </tr>
            <tr className="bg-gray-50">
              <th className="px-4 py-2"></th>
              {SUPERFICIES.map((sup, idx) => (
                <th key={idx} className="px-1 py-2 text-xs text-gray-600 font-medium border-l border-gray-200">
                  {sup}
                </th>
              ))}
              {SUPERFICIES.map((sup, idx) => (
                <th key={`sang-${idx}`} className="px-1 py-2 text-xs text-gray-600 font-medium border-l border-gray-200">
                  {sup}
                </th>
              ))}
              {SUPERFICIES.map((sup, idx) => (
                <th key={`placa-${idx}`} className="px-1 py-2 text-xs text-gray-600 font-medium border-l border-gray-200">
                  {sup}
                </th>
              ))}
              <th className="px-2 py-2 text-xs text-gray-600 font-medium border-l border-gray-200">0-I-III</th>
              <th className="px-2 py-2 text-xs text-gray-600 font-medium border-l border-gray-200">I-III</th>
            </tr>
          </thead>
          <tbody>
            {/* Arco Superior */}
            <tr>
              <td colSpan={26} className="px-4 py-2 bg-gray-200 font-semibold text-gray-700">
                Arco Superior
              </td>
            </tr>
            {/* Superior derecho */}
            {DIENTES.slice(0, 8).reverse().map(diente => renderFila(diente, true))}
            {/* Superior izquierdo */}
            {DIENTES.slice(8, 16).map(diente => renderFila(diente, true))}

            {/* Arco Inferior */}
            <tr>
              <td colSpan={26} className="px-4 py-2 bg-gray-200 font-semibold text-gray-700">
                Arco Inferior
              </td>
            </tr>
            {/* Inferior izquierdo */}
            {DIENTES.slice(16, 24).map(diente => renderFila(diente, false))}
            {/* Inferior derecho */}
            {DIENTES.slice(24, 32).map(diente => renderFila(diente, false))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 bg-slate-50">
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 ring-1 ring-red-400 bg-red-50 rounded"></div>
            <span>Sangrado presente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 ring-1 ring-yellow-400 bg-yellow-50 rounded"></div>
            <span>Placa presente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 ring-1 ring-blue-400 bg-blue-50 rounded"></div>
            <span>Datos registrados</span>
          </div>
        </div>
      </div>
    </div>
  );
}



