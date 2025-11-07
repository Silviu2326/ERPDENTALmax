import { useState } from 'react';
import { Heart, Activity, Droplet } from 'lucide-react';
import { SignoVital } from '../../api/cirugiaApi';

interface VitalSignsMonitorProps {
  signosVitales: SignoVital[];
  onAgregarSignoVital: (signo: Omit<SignoVital, 'hora'>) => void;
}

export default function VitalSignsMonitor({ signosVitales, onAgregarSignoVital }: VitalSignsMonitorProps) {
  const [presionArterial, setPresionArterial] = useState('');
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState('');
  const [spo2, setSpo2] = useState('');

  const handleAgregar = () => {
    if (!presionArterial || !frecuenciaCardiaca || !spo2) {
      alert('Por favor complete todos los campos');
      return;
    }

    onAgregarSignoVital({
      presionArterial,
      frecuenciaCardiaca: parseInt(frecuenciaCardiaca),
      spo2: parseInt(spo2),
    });

    // Limpiar campos
    setPresionArterial('');
    setFrecuenciaCardiaca('');
    setSpo2('');
  };

  const ultimoSigno = signosVitales[signosVitales.length - 1];

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
          <Heart size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Monitor de Signos Vitales</h3>
      </div>

      {/* Valores actuales */}
      {ultimoSigno && (
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Activity size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-slate-700">Presión Arterial</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{ultimoSigno.presionArterial}</p>
            <p className="text-xs text-gray-600">mmHg</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Heart size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-slate-700">Frecuencia Cardíaca</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{ultimoSigno.frecuenciaCardiaca}</p>
            <p className="text-xs text-gray-600">lpm</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Droplet size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-slate-700">SpO2</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{ultimoSigno.spo2}</p>
            <p className="text-xs text-gray-600">%</p>
          </div>
        </div>
      )}

      {/* Formulario para agregar signos vitales */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Presión Arterial</label>
          <input
            type="text"
            value={presionArterial}
            onChange={(e) => setPresionArterial(e.target.value)}
            placeholder="120/80"
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Frecuencia Cardíaca</label>
          <input
            type="number"
            value={frecuenciaCardiaca}
            onChange={(e) => setFrecuenciaCardiaca(e.target.value)}
            placeholder="70"
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">SpO2 (%)</label>
          <input
            type="number"
            value={spo2}
            onChange={(e) => setSpo2(e.target.value)}
            placeholder="98"
            min="0"
            max="100"
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>
      </div>

      <button
        onClick={handleAgregar}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm"
      >
        Registrar Signos Vitales
      </button>

      {/* Historial */}
      {signosVitales.length > 1 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Historial</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {signosVitales.slice(0, -1).reverse().map((signo, index) => (
              <div key={index} className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-xl ring-1 ring-slate-200">
                <span className="text-gray-600">
                  {new Date(signo.hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex gap-4 text-gray-700">
                  <span>PA: {signo.presionArterial}</span>
                  <span>FC: {signo.frecuenciaCardiaca}</span>
                  <span>SpO2: {signo.spo2}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



