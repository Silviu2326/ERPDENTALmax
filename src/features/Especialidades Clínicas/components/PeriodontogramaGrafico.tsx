import { memo } from 'react';
import { Periodontograma, DatosDiente } from '../api/periodontogramaApi';

interface PeriodontogramaGraficoProps {
  periodontograma: Periodontograma;
  periodontogramaComparacion?: Periodontograma | null;
  dienteSeleccionado: string | null;
  onSeleccionarDiente: (numeroDiente: string | null) => void;
  modoEdicion: boolean;
}

// Números de dientes según la nomenclatura dental internacional
const DIENTES_SUPERIORES_DERECHOS = ['18', '17', '16', '15', '14', '13', '12', '11'];
const DIENTES_SUPERIORES_IZQUIERDOS = ['21', '22', '23', '24', '25', '26', '27', '28'];
const DIENTES_INFERIORES_IZQUIERDOS = ['48', '47', '46', '45', '44', '43', '42', '41'];
const DIENTES_INFERIORES_DERECHOS = ['31', '32', '33', '34', '35', '36', '37', '38'];

const PeriodontogramaGrafico = memo(function PeriodontogramaGrafico({
  periodontograma,
  periodontogramaComparacion,
  dienteSeleccionado,
  onSeleccionarDiente,
  modoEdicion,
}: PeriodontogramaGraficoProps) {
  const obtenerDatosDiente = (numeroDiente: string): DatosDiente | undefined => {
    const datos = periodontograma.datosDientes instanceof Map
      ? periodontograma.datosDientes.get(numeroDiente)
      : periodontograma.datosDientes[numeroDiente];
    return datos;
  };

  const obtenerDatosComparacion = (numeroDiente: string): DatosDiente | undefined => {
    if (!periodontogramaComparacion) return undefined;
    const datos = periodontogramaComparacion.datosDientes instanceof Map
      ? periodontogramaComparacion.datosDientes.get(numeroDiente)
      : periodontogramaComparacion.datosDientes[numeroDiente];
    return datos;
  };

  const renderizarDiente = (numeroDiente: string, posicion: 'arriba' | 'abajo') => {
    const datos = obtenerDatosDiente(numeroDiente);
    const datosComp = obtenerDatosComparacion(numeroDiente);
    const estaSeleccionado = dienteSeleccionado === numeroDiente;
    const tieneSangrado = datos?.sangrado.some(s => s) || false;
    const tieneSupuracion = datos?.supuracion.some(s => s) || false;

    return (
      <div
        key={numeroDiente}
        className={`relative inline-block mx-1 ${modoEdicion ? 'cursor-pointer' : ''}`}
        onClick={() => modoEdicion && onSeleccionarDiente(numeroDiente)}
      >
        <div
          className={`
            w-12 h-16 border-2 rounded-lg flex flex-col items-center justify-center
            transition-all duration-200
            ${estaSeleccionado
              ? 'border-blue-500 bg-blue-50 shadow-lg scale-110'
              : tieneSangrado
              ? 'border-red-400 bg-red-50'
              : tieneSupuracion
              ? 'border-yellow-400 bg-yellow-50'
              : 'border-gray-300 bg-white'
            }
            ${modoEdicion ? 'hover:border-blue-300 hover:shadow-md' : ''}
          `}
        >
          <span className="text-xs font-bold text-gray-700">{numeroDiente}</span>
          {datos && (
            <div className="mt-1 flex flex-wrap justify-center gap-0.5">
              {datos.profundidadSondaje.map((prof, idx) => (
                <span
                  key={idx}
                  className="text-[8px] text-gray-600 font-semibold"
                  title={`Profundidad: ${prof}mm`}
                >
                  {prof > 0 ? prof : '-'}
                </span>
              ))}
            </div>
          )}
          {datos?.movilidad && datos.movilidad > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold">
              {datos.movilidad}
            </div>
          )}
          {datos?.afectacionFurca && datos.afectacionFurca > 0 && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold">
              F{datos.afectacionFurca}
            </div>
          )}
        </div>
        {/* Indicadores de comparación */}
        {datosComp && (
          <div className="absolute -left-1 top-0 w-2 h-full bg-green-400 opacity-50 rounded-l"></div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Periodontograma</h3>
        {periodontogramaComparacion && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <div className="w-4 h-4 bg-green-400 opacity-50 rounded"></div>
            <span>Comparación con periodontograma anterior</span>
          </div>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-red-400 bg-red-50 rounded"></div>
            <span>Sangrado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-yellow-400 bg-yellow-50 rounded"></div>
            <span>Supuración</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full text-white text-[8px] flex items-center justify-center">M</div>
            <span>Movilidad</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full text-white text-[8px] flex items-center justify-center">F</div>
            <span>Furca</span>
          </div>
        </div>
      </div>

      {/* Arco Superior Derecho */}
      <div className="mb-2 flex justify-end">
        {DIENTES_SUPERIORES_DERECHOS.map((diente) => renderizarDiente(diente, 'arriba'))}
      </div>

      {/* Arco Superior Izquierdo */}
      <div className="mb-4 flex justify-start">
        {DIENTES_SUPERIORES_IZQUIERDOS.map((diente) => renderizarDiente(diente, 'arriba'))}
      </div>

      {/* Separador */}
      <div className="border-t-2 border-gray-300 my-4"></div>

      {/* Arco Inferior Izquierdo */}
      <div className="mb-2 flex justify-start">
        {DIENTES_INFERIORES_IZQUIERDOS.map((diente) => renderizarDiente(diente, 'abajo'))}
      </div>

      {/* Arco Inferior Derecho */}
      <div className="mb-2 flex justify-end">
        {DIENTES_INFERIORES_DERECHOS.map((diente) => renderizarDiente(diente, 'abajo'))}
      </div>

      {modoEdicion && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Haga clic en un diente para ingresar o editar sus datos</p>
        </div>
      )}
    </div>
  );
});

export default PeriodontogramaGrafico;


