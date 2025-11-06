import { useState } from 'react';
import { DienteTratado } from '../api/odontopediatriaApi';
import { Tooth } from 'lucide-react';

interface SelectorDientesInfantilProps {
  dientesSeleccionados: DienteTratado[];
  onDientesChange: (dientes: DienteTratado[]) => void;
  tipoAplicacion: 'Fluor' | 'Sellador';
}

// Dientes temporales (deciduos): 51-55 (superior derecho), 61-65 (superior izquierdo), 71-75 (inferior izquierdo), 81-85 (inferior derecho)
// Dientes permanentes: 11-18 (superior derecho), 21-28 (superior izquierdo), 31-38 (inferior izquierdo), 41-48 (inferior derecho)
const DIENTES_TEMPORALES_SUPERIORES = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
const DIENTES_TEMPORALES_INFERIORES = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];
const DIENTES_PERMANENTES_SUPERIORES = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const DIENTES_PERMANENTES_INFERIORES = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const SUPERFICIES = ['Oclusal', 'Vestibular', 'Lingual', 'Mesial', 'Distal', 'Palatino', 'Completo'];

export default function SelectorDientesInfantil({
  dientesSeleccionados,
  onDientesChange,
  tipoAplicacion,
}: SelectorDientesInfantilProps) {
  const [dienteEditando, setDienteEditando] = useState<number | null>(null);
  const [superficiesSeleccionadas, setSuperficiesSeleccionadas] = useState<string[]>([]);

  const esDienteSeleccionado = (numero: number) => {
    return dientesSeleccionados.some((dt) => dt.diente === numero);
  };

  const obtenerSuperficiesDiente = (numero: number): string[] => {
    return dientesSeleccionados.filter((dt) => dt.diente === numero).map((dt) => dt.superficie);
  };

  const toggleDiente = (numero: number) => {
    if (esDienteSeleccionado(numero)) {
      // Eliminar todas las entradas de este diente
      onDientesChange(dientesSeleccionados.filter((dt) => dt.diente !== numero));
      setDienteEditando(null);
    } else {
      // Agregar diente con superficie "Completo" por defecto
      onDientesChange([...dientesSeleccionados, { diente: numero, superficie: 'Completo' }]);
      setDienteEditando(numero);
      setSuperficiesSeleccionadas(['Completo']);
    }
  };

  const toggleSuperficie = (diente: number, superficie: string) => {
    const dientesActualizados = dientesSeleccionados.filter((dt) => dt.diente !== diente);
    
    if (superficiesSeleccionadas.includes(superficie)) {
      // Eliminar superficie
      setSuperficiesSeleccionadas(superficiesSeleccionadas.filter((s) => s !== superficie));
      if (superficiesSeleccionadas.length === 1) {
        // Si era la última superficie, eliminar el diente completamente
        onDientesChange(dientesActualizados);
        setDienteEditando(null);
      } else {
        // Actualizar sin esa superficie
        const nuevasSuperficies = superficiesSeleccionadas.filter((s) => s !== superficie);
        onDientesChange([
          ...dientesActualizados,
          ...nuevasSuperficies.map((s) => ({ diente, superficie: s })),
        ]);
        setSuperficiesSeleccionadas(nuevasSuperficies);
      }
    } else {
      // Agregar superficie
      const nuevasSuperficies = [...superficiesSeleccionadas, superficie];
      setSuperficiesSeleccionadas(nuevasSuperficies);
      onDientesChange([
        ...dientesActualizados,
        ...nuevasSuperficies.map((s) => ({ diente, superficie: s })),
      ]);
    }
  };

  const iniciarEdicionSuperficies = (numero: number) => {
    setDienteEditando(numero);
    setSuperficiesSeleccionadas(obtenerSuperficiesDiente(numero));
  };

  const renderDiente = (numero: number, esTemporal: boolean) => {
    const seleccionado = esDienteSeleccionado(numero);
    const editando = dienteEditando === numero;

    return (
      <div key={numero} className="relative">
        <button
          type="button"
          onClick={() => {
            if (seleccionado && !editando) {
              iniciarEdicionSuperficies(numero);
            } else {
              toggleDiente(numero);
            }
          }}
          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
            seleccionado
              ? 'bg-blue-500 border-blue-600 text-white shadow-md'
              : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
          } ${editando ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
          title={`Diente ${numero} ${esTemporal ? '(Temporal)' : '(Permanente)'}`}
        >
          <Tooth className="w-5 h-5" />
        </button>
        <span className="text-xs text-gray-600 mt-1 block text-center">{numero}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Seleccione los dientes tratados con {tipoAplicacion === 'Fluor' ? 'Flúor' : 'Sellador'}
        </h3>
        
        {/* Dientes Superiores */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Dientes Superiores</h4>
          
          {/* Temporales Superiores */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Temporales (Deciduos)</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {DIENTES_TEMPORALES_SUPERIORES.map((numero) => renderDiente(numero, true))}
            </div>
          </div>
          
          {/* Permanentes Superiores */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Permanentes</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {DIENTES_PERMANENTES_SUPERIORES.map((numero) => renderDiente(numero, false))}
            </div>
          </div>
        </div>

        {/* Dientes Inferiores */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Dientes Inferiores</h4>
          
          {/* Temporales Inferiores */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Temporales (Deciduos)</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {DIENTES_TEMPORALES_INFERIORES.map((numero) => renderDiente(numero, true))}
            </div>
          </div>
          
          {/* Permanentes Inferiores */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Permanentes</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {DIENTES_PERMANENTES_INFERIORES.map((numero) => renderDiente(numero, false))}
            </div>
          </div>
        </div>
      </div>

      {/* Panel de edición de superficies */}
      {dienteEditando && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">
              Superficies tratadas - Diente {dienteEditando}
            </h4>
            <button
              type="button"
              onClick={() => {
                setDienteEditando(null);
                setSuperficiesSeleccionadas([]);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUPERFICIES.map((superficie) => {
              const seleccionada = superficiesSeleccionadas.includes(superficie);
              return (
                <button
                  key={superficie}
                  type="button"
                  onClick={() => toggleSuperficie(dienteEditando, superficie)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    seleccionada
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {superficie}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Resumen de dientes seleccionados */}
      {dientesSeleccionados.length > 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Resumen de dientes tratados</h4>
          <div className="text-sm text-gray-600">
            <p>
              <strong>{new Set(dientesSeleccionados.map((dt) => dt.diente)).size}</strong> diente(s) seleccionado(s)
            </p>
            <div className="mt-2 space-y-1">
              {Array.from(new Set(dientesSeleccionados.map((dt) => dt.diente))).map((diente) => {
                const superficies = dientesSeleccionados
                  .filter((dt) => dt.diente === diente)
                  .map((dt) => dt.superficie)
                  .join(', ');
                return (
                  <p key={diente} className="text-xs">
                    Diente {diente}: {superficies}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


