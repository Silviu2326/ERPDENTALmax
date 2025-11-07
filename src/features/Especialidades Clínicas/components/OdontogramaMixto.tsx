import { useState } from 'react';
import { Edit2, X, Save } from 'lucide-react';
import { Odontograma, DienteOdontograma } from '../api/fichasPediatricasAPI';

interface OdontogramaMixtoProps {
  odontograma: Odontograma;
  onChange: (odontograma: Odontograma) => void;
  readonly?: boolean;
}

// Dientes temporales (deciduos): 51-55 (superior derecho), 61-65 (superior izquierdo), 71-75 (inferior izquierdo), 81-85 (inferior derecho)
// Dientes permanentes: 11-18 (superior derecho), 21-28 (superior izquierdo), 31-38 (inferior izquierdo), 41-48 (inferior derecho)
const DIENTES_TEMPORALES_SUPERIORES = [
  { numero: 55, nombre: '55' }, { numero: 54, nombre: '54' }, { numero: 53, nombre: '53' }, { numero: 52, nombre: '52' }, { numero: 51, nombre: '51' },
  { numero: 61, nombre: '61' }, { numero: 62, nombre: '62' }, { numero: 63, nombre: '63' }, { numero: 64, nombre: '64' }, { numero: 65, nombre: '65' },
];

const DIENTES_TEMPORALES_INFERIORES = [
  { numero: 85, nombre: '85' }, { numero: 84, nombre: '84' }, { numero: 83, nombre: '83' }, { numero: 82, nombre: '82' }, { numero: 81, nombre: '81' },
  { numero: 71, nombre: '71' }, { numero: 72, nombre: '72' }, { numero: 73, nombre: '73' }, { numero: 74, nombre: '74' }, { numero: 75, nombre: '75' },
];

const DIENTES_PERMANENTES_SUPERIORES = [
  { numero: 18, nombre: '18' }, { numero: 17, nombre: '17' }, { numero: 16, nombre: '16' }, { numero: 15, nombre: '15' }, { numero: 14, nombre: '14' }, { numero: 13, nombre: '13' }, { numero: 12, nombre: '12' }, { numero: 11, nombre: '11' },
  { numero: 21, nombre: '21' }, { numero: 22, nombre: '22' }, { numero: 23, nombre: '23' }, { numero: 24, nombre: '24' }, { numero: 25, nombre: '25' }, { numero: 26, nombre: '26' }, { numero: 27, nombre: '27' }, { numero: 28, nombre: '28' },
];

const DIENTES_PERMANENTES_INFERIORES = [
  { numero: 48, nombre: '48' }, { numero: 47, nombre: '47' }, { numero: 46, nombre: '46' }, { numero: 45, nombre: '45' }, { numero: 44, nombre: '44' }, { numero: 43, nombre: '43' }, { numero: 42, nombre: '42' }, { numero: 41, nombre: '41' },
  { numero: 31, nombre: '31' }, { numero: 32, nombre: '32' }, { numero: 33, nombre: '33' }, { numero: 34, nombre: '34' }, { numero: 35, nombre: '35' }, { numero: 36, nombre: '36' }, { numero: 37, nombre: '37' }, { numero: 38, nombre: '38' },
];

const ESTADOS_DIENTE: DienteOdontograma['estado'][] = ['sano', 'caries', 'ausente', 'sellado', 'extraido', 'en_erupcion', 'obturado'];
const TIPOS_DIENTE: DienteOdontograma['tipo'][] = ['temporal', 'permanente', 'mixto'];

const getEstadoColor = (estado: DienteOdontograma['estado']) => {
  switch (estado) {
    case 'sano':
      return 'bg-green-100 border-green-400 text-green-800';
    case 'caries':
      return 'bg-red-100 border-red-400 text-red-800';
    case 'ausente':
      return 'bg-gray-100 border-gray-400 text-gray-600';
    case 'sellado':
      return 'bg-blue-100 border-blue-400 text-blue-800';
    case 'extraido':
      return 'bg-gray-200 border-gray-500 text-gray-700';
    case 'en_erupcion':
      return 'bg-yellow-100 border-yellow-400 text-yellow-800';
    case 'obturado':
      return 'bg-purple-100 border-purple-400 text-purple-800';
    default:
      return 'bg-white border-gray-300 text-gray-700';
  }
};

const getEstadoLabel = (estado: DienteOdontograma['estado']) => {
  switch (estado) {
    case 'sano':
      return 'Sano';
    case 'caries':
      return 'Caries';
    case 'ausente':
      return 'Ausente';
    case 'sellado':
      return 'Sellado';
    case 'extraido':
      return 'Extraído';
    case 'en_erupcion':
      return 'En Erupción';
    case 'obturado':
      return 'Obturado';
    default:
      return estado;
  }
};

export default function OdontogramaMixto({
  odontograma,
  onChange,
  readonly = false,
}: OdontogramaMixtoProps) {
  const [dienteEditando, setDienteEditando] = useState<number | null>(null);
  const [edicionDiente, setEdicionDiente] = useState<Partial<DienteOdontograma>>({});

  const obtenerDiente = (numero: number): DienteOdontograma | undefined => {
    return odontograma.dientes.find((d) => d.numero === numero);
  };

  const obtenerOInicializarDiente = (numero: number, tipo: DienteOdontograma['tipo']): DienteOdontograma => {
    const existente = obtenerDiente(numero);
    if (existente) return existente;
    return {
      numero,
      tipo,
      estado: 'sano',
    };
  };

  const actualizarDiente = (numero: number, updates: Partial<DienteOdontograma>) => {
    const dientes = [...odontograma.dientes];
    const indice = dientes.findIndex((d) => d.numero === numero);

    if (indice >= 0) {
      dientes[indice] = { ...dientes[indice], ...updates };
    } else {
      const nuevoDiente: DienteOdontograma = {
        numero,
        tipo: updates.tipo || 'permanente',
        estado: updates.estado || 'sano',
        observaciones: updates.observaciones,
      };
      dientes.push(nuevoDiente);
    }

    onChange({ dientes });
  };

  const handleDienteClick = (numero: number, tipo: DienteOdontograma['tipo']) => {
    if (readonly) return;
    const diente = obtenerOInicializarDiente(numero, tipo);
    setDienteEditando(numero);
    setEdicionDiente(diente);
  };

  const handleGuardarEdicion = () => {
    if (dienteEditando === null) return;
    actualizarDiente(dienteEditando, edicionDiente);
    setDienteEditando(null);
    setEdicionDiente({});
  };

  const handleCancelarEdicion = () => {
    setDienteEditando(null);
    setEdicionDiente({});
  };

  const renderDiente = (numero: number, tipo: DienteOdontograma['tipo']) => {
    const diente = obtenerOInicializarDiente(numero, tipo);
    const isEditing = dienteEditando === numero;
    const estado = diente.estado;

    return (
      <div key={numero} className="relative">
        <button
          onClick={() => handleDienteClick(numero, tipo)}
          disabled={readonly}
          className={`
            w-12 h-12 border-2 rounded-lg transition-all font-semibold text-sm
            ${getEstadoColor(estado)}
            ${readonly ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}
            ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
          `}
          title={`${diente.tipo === 'temporal' ? 'Temporal' : 'Permanente'} - ${getEstadoLabel(estado)}`}
        >
          {numero}
        </button>
        {diente.observaciones && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" title={diente.observaciones} />
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Odontograma Mixto (Temporal/Permanente)</h3>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Temporal</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">Permanente</span>
        </div>
      </div>

      {/* Leyenda de Estados */}
      <div className="mb-4 p-3 bg-slate-50 rounded-2xl ring-1 ring-slate-200">
        <p className="text-xs font-medium text-slate-700 mb-2">Leyenda de Estados:</p>
        <div className="flex flex-wrap gap-2">
          {ESTADOS_DIENTE.map((estado) => (
            <div key={estado} className={`px-2 py-1 rounded text-xs ${getEstadoColor(estado)}`}>
              {getEstadoLabel(estado)}
            </div>
          ))}
        </div>
      </div>

      {/* Odontograma Superior - Temporales */}
      <div className="mb-4">
        <div className="text-xs text-slate-700 mb-2 font-medium">Arco Superior - Dientes Temporales</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {DIENTES_TEMPORALES_SUPERIORES.map((d) => renderDiente(d.numero, 'temporal'))}
        </div>
      </div>

      {/* Odontograma Superior - Permanentes */}
      <div className="mb-4">
        <div className="text-xs text-slate-700 mb-2 font-medium">Arco Superior - Dientes Permanentes</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {DIENTES_PERMANENTES_SUPERIORES.map((d) => renderDiente(d.numero, 'permanente'))}
        </div>
      </div>

      {/* Odontograma Inferior - Permanentes */}
      <div className="mb-4">
        <div className="text-xs text-slate-700 mb-2 font-medium">Arco Inferior - Dientes Permanentes</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {DIENTES_PERMANENTES_INFERIORES.map((d) => renderDiente(d.numero, 'permanente'))}
        </div>
      </div>

      {/* Odontograma Inferior - Temporales */}
      <div className="mb-4">
        <div className="text-xs text-slate-700 mb-2 font-medium">Arco Inferior - Dientes Temporales</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {DIENTES_TEMPORALES_INFERIORES.map((d) => renderDiente(d.numero, 'temporal'))}
        </div>
      </div>

      {/* Modal de Edición */}
      {dienteEditando !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white shadow-sm rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Editar Diente {dienteEditando}
              </h4>
              <button
                onClick={handleCancelarEdicion}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Diente
                </label>
                <select
                  value={edicionDiente.tipo || 'permanente'}
                  onChange={(e) => setEdicionDiente({ ...edicionDiente, tipo: e.target.value as DienteOdontograma['tipo'] })}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  {TIPOS_DIENTE.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo === 'temporal' ? 'Temporal' : tipo === 'permanente' ? 'Permanente' : 'Mixto'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={edicionDiente.estado || 'sano'}
                  onChange={(e) => setEdicionDiente({ ...edicionDiente, estado: e.target.value as DienteOdontograma['estado'] })}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  {ESTADOS_DIENTE.map((estado) => (
                    <option key={estado} value={estado}>
                      {getEstadoLabel(estado)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={edicionDiente.observaciones || ''}
                  onChange={(e) => setEdicionDiente({ ...edicionDiente, observaciones: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Observaciones sobre el diente..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleGuardarEdicion}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Save size={20} />
                  Guardar
                </button>
                <button
                  onClick={handleCancelarEdicion}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

