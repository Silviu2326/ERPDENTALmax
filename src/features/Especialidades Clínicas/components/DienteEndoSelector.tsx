import { Circle } from 'lucide-react';

interface DienteEndoSelectorProps {
  dienteSeleccionado?: number;
  onDienteSeleccionado: (diente: number) => void;
}

// Sistema de numeración dental FDI (Federation Dentaire Internationale)
const DIENTES = [
  // Maxilar Superior Derecho
  { num: 18, nombre: 'M3 Sup Der' },
  { num: 17, nombre: 'M2 Sup Der' },
  { num: 16, nombre: 'M1 Sup Der' },
  { num: 15, nombre: 'PM2 Sup Der' },
  { num: 14, nombre: 'PM1 Sup Der' },
  { num: 13, nombre: 'C Sup Der' },
  { num: 12, nombre: 'I2 Sup Der' },
  { num: 11, nombre: 'I1 Sup Der' },
  // Maxilar Superior Izquierdo
  { num: 21, nombre: 'I1 Sup Izq' },
  { num: 22, nombre: 'I2 Sup Izq' },
  { num: 23, nombre: 'C Sup Izq' },
  { num: 24, nombre: 'PM1 Sup Izq' },
  { num: 25, nombre: 'PM2 Sup Izq' },
  { num: 26, nombre: 'M1 Sup Izq' },
  { num: 27, nombre: 'M2 Sup Izq' },
  { num: 28, nombre: 'M3 Sup Izq' },
  // Mandíbula Inferior Izquierda
  { num: 38, nombre: 'M3 Inf Izq' },
  { num: 37, nombre: 'M2 Inf Izq' },
  { num: 36, nombre: 'M1 Inf Izq' },
  { num: 35, nombre: 'PM2 Inf Izq' },
  { num: 34, nombre: 'PM1 Inf Izq' },
  { num: 33, nombre: 'C Inf Izq' },
  { num: 32, nombre: 'I2 Inf Izq' },
  { num: 31, nombre: 'I1 Inf Izq' },
  // Mandíbula Inferior Derecha
  { num: 41, nombre: 'I1 Inf Der' },
  { num: 42, nombre: 'I2 Inf Der' },
  { num: 43, nombre: 'C Inf Der' },
  { num: 44, nombre: 'PM1 Inf Der' },
  { num: 45, nombre: 'PM2 Inf Der' },
  { num: 46, nombre: 'M1 Inf Der' },
  { num: 47, nombre: 'M2 Inf Der' },
  { num: 48, nombre: 'M3 Inf Der' },
];

export default function DienteEndoSelector({
  dienteSeleccionado,
  onDienteSeleccionado,
}: DienteEndoSelectorProps) {
  return (
    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-6">
      <label className="block text-sm font-medium text-slate-700 mb-4">
        Diente a Tratar
      </label>
      <div className="grid grid-cols-8 gap-2">
        {DIENTES.map((diente) => (
          <button
            key={diente.num}
            onClick={() => onDienteSeleccionado(diente.num)}
            className={`
              p-3 rounded-xl ring-1 transition-all
              ${dienteSeleccionado === diente.num
                ? 'bg-blue-600 ring-blue-600 text-white shadow-sm'
                : 'bg-white ring-slate-300 text-gray-700 hover:ring-blue-400 hover:bg-blue-50'
              }
            `}
            title={diente.nombre}
          >
            <Circle size={24} className="mx-auto mb-1" />
            <span className="text-xs font-semibold">{diente.num}</span>
          </button>
        ))}
      </div>
      {dienteSeleccionado && (
        <div className="mt-4 p-3 bg-blue-50 ring-1 ring-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Diente seleccionado:</span>{' '}
            {dienteSeleccionado} - {DIENTES.find(d => d.num === dienteSeleccionado)?.nombre}
          </p>
        </div>
      )}
    </div>
  );
}



