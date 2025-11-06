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
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl flex items-center justify-between">
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos por Superficie</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Superficie</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-700">Prof. Sondaje (mm)</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-700">Nivel Ins. (mm)</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-700">Recesión (mm)</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-700">Sangrado</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-700">Supuración</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-700">Placa</th>
                  </tr>
                </thead>
                <tbody>
                  {SUPERFICIES.map((superficie) => (
                    <tr key={superficie.indice} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-700">
                        {superficie.nombre}
                        <span className="text-gray-500 ml-2">({superficie.abreviacion})</span>
                      </td>
                      <td className="px-3 py-2">
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
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </td>
                      <td className="px-3 py-2">
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
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </td>
                      <td className="px-3 py-2">
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
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={datos.sangrado[superficie.indice]}
                          onChange={(e) =>
                            actualizarBooleano(superficie.indice, 'sangrado', e.target.checked)
                          }
                          className="w-5 h-5 text-red-600"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={datos.supuracion[superficie.indice]}
                          onChange={(e) =>
                            actualizarBooleano(superficie.indice, 'supuracion', e.target.checked)
                          }
                          className="w-5 h-5 text-yellow-600"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={datos.placa[superficie.indice]}
                          onChange={(e) =>
                            actualizarBooleano(superficie.indice, 'placa', e.target.checked)
                          }
                          className="w-5 h-5 text-gray-600"
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
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Movilidad Dental (0-3)
              </label>
              <select
                value={datos.movilidad}
                onChange={(e) => actualizarGeneral('movilidad', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={0}>0 - Normal</option>
                <option value={1}>1 - Movilidad leve</option>
                <option value={2}>2 - Movilidad moderada</option>
                <option value={3}>3 - Movilidad severa</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Afectación de Furca (0-3)
              </label>
              <select
                value={datos.afectacionFurca}
                onChange={(e) => actualizarGeneral('afectacionFurca', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={0}>0 - Sin afectación</option>
                <option value={1}>1 - Afectación leve</option>
                <option value={2}>2 - Afectación moderada</option>
                <option value={3}>3 - Afectación severa</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancelar}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar Datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


