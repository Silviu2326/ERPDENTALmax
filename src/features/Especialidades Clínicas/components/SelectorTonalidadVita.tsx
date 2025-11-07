import { useState } from 'react';
import { Palette } from 'lucide-react';

interface SelectorTonalidadVitaProps {
  valor: string;
  onChange: (tono: string) => void;
  label?: string;
  required?: boolean;
}

// Escala de tonos VITA estándar
const TONOS_VITA = [
  { valor: 'A1', descripcion: 'A1 - Muy claro', color: '#F5F5DC' },
  { valor: 'A2', descripcion: 'A2 - Claro', color: '#F0E68C' },
  { valor: 'A3', descripcion: 'A3 - Medio claro', color: '#DDA0DD' },
  { valor: 'A3.5', descripcion: 'A3.5 - Medio', color: '#D8BFD8' },
  { valor: 'A4', descripcion: 'A4 - Medio oscuro', color: '#DA70D6' },
  { valor: 'B1', descripcion: 'B1 - Muy claro', color: '#FFE4E1' },
  { valor: 'B2', descripcion: 'B2 - Claro', color: '#FFB6C1' },
  { valor: 'B3', descripcion: 'B3 - Medio claro', color: '#FF69B4' },
  { valor: 'B4', descripcion: 'B4 - Medio oscuro', color: '#FF1493' },
  { valor: 'C1', descripcion: 'C1 - Muy claro', color: '#E0E0E0' },
  { valor: 'C2', descripcion: 'C2 - Claro', color: '#C0C0C0' },
  { valor: 'C3', descripcion: 'C3 - Medio claro', color: '#A0A0A0' },
  { valor: 'C4', descripcion: 'C4 - Medio oscuro', color: '#808080' },
  { valor: 'D2', descripcion: 'D2 - Claro', color: '#FDF5E6' },
  { valor: 'D3', descripcion: 'D3 - Medio claro', color: '#FAEBD7' },
  { valor: 'D4', descripcion: 'D4 - Medio oscuro', color: '#DEB887' },
];

export default function SelectorTonalidadVita({
  valor,
  onChange,
  label = 'Tono VITA',
  required = false,
}: SelectorTonalidadVitaProps) {
  const [mostrarSelector, setMostrarSelector] = useState(false);

  const tonoSeleccionado = TONOS_VITA.find((t) => t.valor === valor);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMostrarSelector(!mostrarSelector)}
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {tonoSeleccionado ? (
              <>
                <div
                  className="w-8 h-8 rounded border-2 border-gray-300"
                  style={{ backgroundColor: tonoSeleccionado.color }}
                />
                <span className="text-gray-900 font-medium">{tonoSeleccionado.descripcion}</span>
              </>
            ) : (
              <span className="text-gray-500">Seleccione un tono</span>
            )}
          </div>
          <Palette className="w-5 h-5 text-gray-400" />
        </button>

        {mostrarSelector && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMostrarSelector(false)}
            />
            <div className="absolute z-20 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              <div className="p-2">
                <div className="grid grid-cols-2 gap-2">
                  {TONOS_VITA.map((tono) => (
                    <button
                      key={tono.valor}
                      type="button"
                      onClick={() => {
                        onChange(tono.valor);
                        setMostrarSelector(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg border-2 transition-all ${
                        valor === tono.valor
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: tono.color }}
                      />
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">{tono.valor}</div>
                        <div className="text-xs text-gray-600">{tono.descripcion.split(' - ')[1]}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}



