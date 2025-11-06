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
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-red-500 to-pink-500 p-2 rounded-lg">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Monitor de Signos Vitales</h3>
      </div>

      {/* Valores actuales */}
      {ultimoSigno && (
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-gray-600">Presión Arterial</span>
            </div>
            <p className="text-xl font-bold text-red-700">{ultimoSigno.presionArterial}</p>
            <p className="text-xs text-gray-500">mmHg</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-gray-600">Frecuencia Cardíaca</span>
            </div>
            <p className="text-xl font-bold text-red-700">{ultimoSigno.frecuenciaCardiaca}</p>
            <p className="text-xs text-gray-500">lpm</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Droplet className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-gray-600">SpO2</span>
            </div>
            <p className="text-xl font-bold text-red-700">{ultimoSigno.spo2}</p>
            <p className="text-xs text-gray-500">%</p>
          </div>
        </div>
      )}

      {/* Formulario para agregar signos vitales */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Presión Arterial</label>
          <input
            type="text"
            value={presionArterial}
            onChange={(e) => setPresionArterial(e.target.value)}
            placeholder="120/80"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia Cardíaca</label>
          <input
            type="number"
            value={frecuenciaCardiaca}
            onChange={(e) => setFrecuenciaCardiaca(e.target.value)}
            placeholder="70"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SpO2 (%)</label>
          <input
            type="number"
            value={spo2}
            onChange={(e) => setSpo2(e.target.value)}
            placeholder="98"
            min="0"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <button
        onClick={handleAgregar}
        className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold py-2 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Registrar Signos Vitales
      </button>

      {/* Historial */}
      {signosVitales.length > 1 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Historial</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {signosVitales.slice(0, -1).reverse().map((signo, index) => (
              <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
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


