import { useState } from 'react';
import { Save, Activity } from 'lucide-react';

interface PeriodontogramaGraficoProps {
  pacienteId: string;
  periodontogramaData: Record<string, any>;
  onUpdate: (data: Record<string, any>) => void;
}

interface MedicionPeriodontal {
  diente: number;
  vestibular: { mesial: number; medio: number; distal: number };
  palatino: { mesial: number; medio: number; distal: number };
  movilidad?: number;
  sangrado?: boolean;
  placa?: boolean;
}

// Dientes a medir en periodontograma (solo los indexados)
const DIENTES_INDEXADOS = [16, 11, 26, 36, 31, 46];

export default function PeriodontogramaGrafico({
  pacienteId,
  periodontogramaData,
  onUpdate,
}: PeriodontogramaGraficoProps) {
  const [mediciones, setMediciones] = useState<Record<number, MedicionPeriodontal>>(() => {
    const estadoInicial: Record<number, MedicionPeriodontal> = {};
    DIENTES_INDEXADOS.forEach((num) => {
      estadoInicial[num] = periodontogramaData[num] || {
        diente: num,
        vestibular: { mesial: 0, medio: 0, distal: 0 },
        palatino: { mesial: 0, medio: 0, distal: 0 },
        movilidad: 0,
        sangrado: false,
        placa: false,
      };
    });
    return estadoInicial;
  });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(
    null
  );

  const handleMedicionChange = (
    diente: number,
    superficie: 'vestibular' | 'palatino',
    posicion: 'mesial' | 'medio' | 'distal',
    valor: number
  ) => {
    setMediciones({
      ...mediciones,
      [diente]: {
        ...mediciones[diente],
        [superficie]: {
          ...mediciones[diente][superficie],
          [posicion]: Math.max(0, Math.min(15, valor)), // Limitar entre 0 y 15mm
        },
      },
    });
  };

  const handleSave = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      // TODO: Implementar API call cuando esté disponible
      // await actualizarPeriodontograma(pacienteId, mediciones);
      onUpdate(mediciones);
      setMensaje({ tipo: 'success', texto: 'Periodontograma actualizado correctamente' });
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err instanceof Error ? err.message : 'Error al guardar el periodontograma',
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Periodontograma
        </h3>
        <button
          onClick={handleSave}
          disabled={guardando}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {guardando ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {mensaje && (
        <div
          className={`px-4 py-3 rounded-lg ${
            mensaje.tipo === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="text-sm text-gray-600 mb-4">
        Registre las mediciones de sondaje periodontal (profundidad de bolsa en mm) para los dientes
        indexados.
      </div>

      {/* Estadísticas del periodontograma */}
      {Object.keys(mediciones).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profundidad Promedio</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(() => {
                    const todasMediciones = Object.values(mediciones).flatMap(m => [
                      ...Object.values(m.vestibular),
                      ...Object.values(m.palatino),
                    ]);
                    const promedio = todasMediciones.reduce((sum, val) => sum + val, 0) / todasMediciones.length;
                    return promedio.toFixed(1);
                  })()} mm
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bolsa Profunda</p>
                <p className="text-2xl font-bold text-red-600">
                  {(() => {
                    const todasMediciones = Object.values(mediciones).flatMap(m => [
                      ...Object.values(m.vestibular),
                      ...Object.values(m.palatino),
                    ]);
                    return todasMediciones.filter(v => v >= 5).length;
                  })()}
                </p>
                <p className="text-xs text-gray-500 mt-1">≥5mm</p>
              </div>
              <Activity className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sangrado</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {Object.values(mediciones).filter(m => m.sangrado).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Dientes</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Movilidad</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Object.values(mediciones).filter(m => (m.movilidad || 0) > 0).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Dientes afectados</p>
              </div>
              <Activity className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Tabla de mediciones */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                Diente
              </th>
              <th colSpan={3} className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                Vestibular
              </th>
              <th colSpan={3} className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                Palatino/Lingual
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                Movilidad
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                Observaciones
              </th>
            </tr>
            <tr>
              <th className="border-r"></th>
              <th className="px-2 py-2 text-xs font-medium text-gray-600 border-r">Mesial</th>
              <th className="px-2 py-2 text-xs font-medium text-gray-600 border-r">Medio</th>
              <th className="px-2 py-2 text-xs font-medium text-gray-600 border-r">Distal</th>
              <th className="px-2 py-2 text-xs font-medium text-gray-600 border-r">Mesial</th>
              <th className="px-2 py-2 text-xs font-medium text-gray-600 border-r">Medio</th>
              <th className="px-2 py-2 text-xs font-medium text-gray-600 border-r">Distal</th>
              <th className="px-2 py-2 text-xs font-medium text-gray-600 border-r">Grado</th>
              <th className="px-2 py-2 text-xs font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {DIENTES_INDEXADOS.map((dienteNum) => {
              const medicion = mediciones[dienteNum];
              return (
                <tr key={dienteNum} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 border-r">
                    {dienteNum}
                  </td>
                  {/* Vestibular */}
                  <td className="px-2 py-2 border-r">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={medicion.vestibular.mesial}
                      onChange={(e) =>
                        handleMedicionChange(dienteNum, 'vestibular', 'mesial', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-2 py-2 border-r">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={medicion.vestibular.medio}
                      onChange={(e) =>
                        handleMedicionChange(dienteNum, 'vestibular', 'medio', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-2 py-2 border-r">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={medicion.vestibular.distal}
                      onChange={(e) =>
                        handleMedicionChange(dienteNum, 'vestibular', 'distal', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  {/* Palatino */}
                  <td className="px-2 py-2 border-r">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={medicion.palatino.mesial}
                      onChange={(e) =>
                        handleMedicionChange(dienteNum, 'palatino', 'mesial', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-2 py-2 border-r">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={medicion.palatino.medio}
                      onChange={(e) =>
                        handleMedicionChange(dienteNum, 'palatino', 'medio', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-2 py-2 border-r">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={medicion.palatino.distal}
                      onChange={(e) =>
                        handleMedicionChange(dienteNum, 'palatino', 'distal', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  {/* Movilidad */}
                  <td className="px-2 py-2 border-r">
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={medicion.movilidad || 0}
                      onChange={(e) =>
                        setMediciones({
                          ...mediciones,
                          [dienteNum]: {
                            ...medicion,
                            movilidad: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  {/* Observaciones */}
                  <td className="px-2 py-2">
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={medicion.sangrado || false}
                          onChange={(e) =>
                            setMediciones({
                              ...mediciones,
                              [dienteNum]: {
                                ...medicion,
                                sangrado: e.target.checked,
                              },
                            })
                          }
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-red-600">Sangrado</span>
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={medicion.placa || false}
                          onChange={(e) =>
                            setMediciones({
                              ...mediciones,
                              [dienteNum]: {
                                ...medicion,
                                placa: e.target.checked,
                              },
                            })
                          }
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="text-yellow-600">Placa</span>
                      </label>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Las mediciones se registran en milímetros (mm). Movilidad: 0 = Normal,
          1 = Movilidad leve, 2 = Movilidad moderada, 3 = Movilidad severa.
        </p>
      </div>
    </div>
  );
}


