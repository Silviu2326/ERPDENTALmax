import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { RangosMovimiento } from '../api/atmApi';

interface ModalRegistroMovimientoMandibularProps {
  rangosMovimiento: RangosMovimiento;
  onGuardar?: (rangos: RangosMovimiento) => void;
  onCerrar: () => void;
  modoLectura?: boolean;
}

export default function ModalRegistroMovimientoMandibular({
  rangosMovimiento,
  onGuardar,
  onCerrar,
  modoLectura = false,
}: ModalRegistroMovimientoMandibularProps) {
  const [rangos, setRangos] = useState<RangosMovimiento>(rangosMovimiento);

  useEffect(() => {
    setRangos(rangosMovimiento);
  }, [rangosMovimiento]);

  const handleGuardar = () => {
    if (onGuardar) {
      onGuardar(rangos);
    }
    onCerrar();
  };

  const rangosNormales = {
    aperturaSinDolor: 40,
    aperturaMaxima: 50,
    lateralidadDerecha: 10,
    lateralidadIzquierda: 10,
    protrusion: 8,
  };

  const getColorPorRango = (valor: number, normal: number, tipo: 'apertura' | 'lateralidad' | 'protrusion') => {
    if (tipo === 'apertura') {
      if (valor >= normal * 0.9) return 'text-green-600';
      if (valor >= normal * 0.7) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (valor >= normal * 0.8) return 'text-green-600';
      if (valor >= normal * 0.6) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Rangos de Movimiento Mandibular</h2>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-xl ring-1 ring-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Rangos normales de referencia:</strong> Apertura: 40-50mm, Lateralidad: 8-10mm, Protrusión: 6-8mm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Apertura sin dolor */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Apertura sin Dolor (mm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={rangos.aperturaSinDolor}
                  onChange={(e) =>
                    setRangos({ ...rangos, aperturaSinDolor: Number(e.target.value) })
                  }
                  disabled={modoLectura}
                  className={`w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
                    modoLectura ? 'bg-slate-100' : ''
                  } ${getColorPorRango(rangos.aperturaSinDolor, rangosNormales.aperturaSinDolor, 'apertura')}`}
                />
                <span className="absolute right-3 top-2.5 text-sm text-slate-500">
                  Normal: {rangosNormales.aperturaSinDolor}mm
                </span>
              </div>
            </div>

            {/* Apertura máxima */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Apertura Máxima (mm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={rangos.aperturaMaxima}
                  onChange={(e) =>
                    setRangos({ ...rangos, aperturaMaxima: Number(e.target.value) })
                  }
                  disabled={modoLectura}
                  className={`w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
                    modoLectura ? 'bg-slate-100' : ''
                  } ${getColorPorRango(rangos.aperturaMaxima, rangosNormales.aperturaMaxima, 'apertura')}`}
                />
                <span className="absolute right-3 top-2.5 text-sm text-slate-500">
                  Normal: {rangosNormales.aperturaMaxima}mm
                </span>
              </div>
            </div>

            {/* Lateralidad derecha */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lateralidad Derecha (mm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={rangos.lateralidadDerecha}
                  onChange={(e) =>
                    setRangos({ ...rangos, lateralidadDerecha: Number(e.target.value) })
                  }
                  disabled={modoLectura}
                  className={`w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
                    modoLectura ? 'bg-slate-100' : ''
                  } ${getColorPorRango(rangos.lateralidadDerecha, rangosNormales.lateralidadDerecha, 'lateralidad')}`}
                />
                <span className="absolute right-3 top-2.5 text-sm text-slate-500">
                  Normal: {rangosNormales.lateralidadDerecha}mm
                </span>
              </div>
            </div>

            {/* Lateralidad izquierda */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lateralidad Izquierda (mm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={rangos.lateralidadIzquierda}
                  onChange={(e) =>
                    setRangos({ ...rangos, lateralidadIzquierda: Number(e.target.value) })
                  }
                  disabled={modoLectura}
                  className={`w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
                    modoLectura ? 'bg-slate-100' : ''
                  } ${getColorPorRango(rangos.lateralidadIzquierda, rangosNormales.lateralidadIzquierda, 'lateralidad')}`}
                />
                <span className="absolute right-3 top-2.5 text-sm text-slate-500">
                  Normal: {rangosNormales.lateralidadIzquierda}mm
                </span>
              </div>
            </div>

            {/* Protrusión */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Protrusión (mm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={rangos.protrusion}
                  onChange={(e) =>
                    setRangos({ ...rangos, protrusion: Number(e.target.value) })
                  }
                  disabled={modoLectura}
                  className={`w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
                    modoLectura ? 'bg-slate-100' : ''
                  } ${getColorPorRango(rangos.protrusion, rangosNormales.protrusion, 'protrusion')}`}
                />
                <span className="absolute right-3 top-2.5 text-sm text-slate-500">
                  Normal: {rangosNormales.protrusion}mm
                </span>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-slate-50 p-4 rounded-xl ring-1 ring-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Resumen</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-600">Apertura reducida:</span>{' '}
                <span className="font-medium">
                  {rangos.aperturaMaxima < rangosNormales.aperturaMaxima * 0.9 ? 'Sí' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Lateralidad reducida:</span>{' '}
                <span className="font-medium">
                  {rangos.lateralidadDerecha < rangosNormales.lateralidadDerecha * 0.8 ||
                  rangos.lateralidadIzquierda < rangosNormales.lateralidadIzquierda * 0.8
                    ? 'Sí'
                    : 'No'}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Protrusión reducida:</span>{' '}
                <span className="font-medium">
                  {rangos.protrusion < rangosNormales.protrusion * 0.8 ? 'Sí' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Diferencia lateral:</span>{' '}
                <span className="font-medium">
                  {Math.abs(rangos.lateralidadDerecha - rangos.lateralidadIzquierda).toFixed(1)}mm
                </span>
              </div>
            </div>
          </div>
        </div>

        {!modoLectura && (
          <div className="sticky bottom-0 bg-slate-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onCerrar}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium"
            >
              Cancelar
            </button>
            {onGuardar && (
              <button
                onClick={handleGuardar}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <Save size={18} />
                Guardar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



