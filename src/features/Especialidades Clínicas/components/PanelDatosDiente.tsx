import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { DatosDiente } from '../api/periodontogramaApi';

interface PanelDatosDienteProps {
  numeroDiente: string;
  datos?: DatosDiente;
  onGuardar: (datos: DatosDiente) => void;
  onCancelar: () => void;
}

// Nombres de las 6 superficies dentales
const SUPERFICIES = [
  { nombre: 'Mesiovestibular', abreviacion: 'MV', indice: 0 },
  { nombre: 'Vestibular', abreviacion: 'V', indice: 1 },
  { nombre: 'Distovestibular', abreviacion: 'DV', indice: 2 },
  { nombre: 'Mesiolingual/Palatino', abreviacion: 'ML/P', indice: 3 },
  { nombre: 'Lingual/Palatino', abreviacion: 'L/P', indice: 4 },
  { nombre: 'Distolingual/Palatino', abreviacion: 'DL/P', indice: 5 },
];

export default function PanelDatosDiente({
  numeroDiente,
  datos: datosIniciales,
  onGuardar,
  onCancelar,
}: PanelDatosDienteProps) {
  const [datos, setDatos] = useState<DatosDiente>(() => {
    if (datosIniciales) {
      return { ...datosIniciales };
    }
    return {
      profundidadSondaje: [0, 0, 0, 0, 0, 0],
      nivelInsercion: [0, 0, 0, 0, 0, 0],
      sangrado: [false, false, false, false, false, false],
      supuracion: [false, false, false, false, false, false],
      movilidad: 0,
      afectacionFurca: 0,
      placa: [false, false, false, false, false, false],
      recesion: [0, 0, 0, 0, 0, 0],
    };
  });

  const actualizarSuperficie = (
    indice: number,
    campo: 'profundidadSondaje' | 'nivelInsercion' | 'recesion',
    valor: number
  ) => {
    const nuevosDatos = { ...datos };
    nuevosDatos[campo] = [...datos[campo]];
    nuevosDatos[campo][indice] = valor;
    setDatos(nuevosDatos);
  };

  const actualizarBooleano = (
    indice: number,
    campo: 'sangrado' | 'supuracion' | 'placa',
    valor: boolean
  ) => {
    const nuevosDatos = { ...datos };
    nuevosDatos[campo] = [...datos[campo]];
    nuevosDatos[campo][indice] = valor;
    setDatos(nuevosDatos);
  };

  const actualizarGeneral = (campo: 'movilidad' | 'afectacionFurca', valor: number) => {
    setDatos({ ...datos, [campo]: valor });
  };

  const handleGuardar = () => {
    onGuardar(datos);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl flex items-center justify-between">
          <h2 className="text-xl font-bold">Datos del Diente {numeroDiente}</h2>
          <button
            onClick={onCancelar}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Tabla de superficies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos por Superficie</h3>
            <div className="overflow-x-auto rounded-xl ring-1 ring-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Superficie</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Prof. Sondaje (mm)</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Nivel Ins. (mm)</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Recesión (mm)</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Sangrado</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Supuración</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Placa</th>
                  </tr>
                </thead>
                <tbody>
                  {SUPERFICIES.map((superficie) => (
                    <tr key={superficie.indice} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {superficie.nombre}
                        <span className="text-slate-500 ml-2">({superficie.abreviacion})</span>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={datos.profundidadSondaje[superficie.indice]}
                          onChange={(e) =>
                            actualizarSuperficie(
                              superficie.indice,
                              'profundidadSondaje',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={datos.nivelInsercion[superficie.indice]}
                          onChange={(e) =>
                            actualizarSuperficie(
                              superficie.indice,
                              'nivelInsercion',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={datos.recesion[superficie.indice]}
                          onChange={(e) =>
                            actualizarSuperficie(
                              superficie.indice,
                              'recesion',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={datos.sangrado[superficie.indice]}
                          onChange={(e) =>
                            actualizarBooleano(superficie.indice, 'sangrado', e.target.checked)
                          }
                          className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-400"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={datos.supuracion[superficie.indice]}
                          onChange={(e) =>
                            actualizarBooleano(superficie.indice, 'supuracion', e.target.checked)
                          }
                          className="w-5 h-5 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-400"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={datos.placa[superficie.indice]}
                          onChange={(e) =>
                            actualizarBooleano(superficie.indice, 'placa', e.target.checked)
                          }
                          className="w-5 h-5 text-slate-600 rounded focus:ring-2 focus:ring-slate-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Datos generales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-xl ring-1 ring-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Movilidad Dental (0-3)
              </label>
              <select
                value={datos.movilidad}
                onChange={(e) => actualizarGeneral('movilidad', parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value={0}>0 - Normal</option>
                <option value={1}>1 - Movilidad leve</option>
                <option value={2}>2 - Movilidad moderada</option>
                <option value={3}>3 - Movilidad severa</option>
              </select>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl ring-1 ring-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Afectación de Furca (0-3)
              </label>
              <select
                value={datos.afectacionFurca}
                onChange={(e) => actualizarGeneral('afectacionFurca', parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value={0}>0 - Sin afectación</option>
                <option value={1}>1 - Afectación leve</option>
                <option value={2}>2 - Afectación moderada</option>
                <option value={3}>3 - Afectación severa</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onCancelar}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
            >
              <Save size={20} />
              Guardar Datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



