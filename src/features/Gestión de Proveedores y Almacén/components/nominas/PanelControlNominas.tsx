import { useState } from 'react';
import { Calculator, Calendar, CheckCircle2 } from 'lucide-react';
import { calcularNominasPeriodo } from '../../api/nominasApi';

interface PanelControlNominasProps {
  onCalcularCompletado?: () => void;
}

export default function PanelControlNominas({ onCalcularCompletado }: PanelControlNominasProps) {
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [calculando, setCalculando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const handleCalcular = async () => {
    setCalculando(true);
    setMensaje(null);

    try {
      const resultado = await calcularNominasPeriodo(mes, anio);
      setMensaje({
        tipo: 'success',
        texto: `Cálculo de nóminas iniciado para ${meses[mes - 1]} ${anio}. Job ID: ${resultado.jobId}`,
      });
      if (onCalcularCompletado) {
        onCalcularCompletado();
      }
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error instanceof Error ? error.message : 'Error al iniciar el cálculo de nóminas',
      });
    } finally {
      setCalculando(false);
    }
  };

  const anios = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Control de Nóminas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {meses.map((nombreMes, index) => (
              <option key={index} value={index + 1}>
                {nombreMes}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
          <select
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {anios.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleCalcular}
            disabled={calculando}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Calendar className="w-5 h-5" />
            {calculando ? 'Calculando...' : 'Calcular Nóminas'}
          </button>
        </div>
      </div>

      {mensaje && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
            mensaje.tipo === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm">{mensaje.texto}</span>
        </div>
      )}
    </div>
  );
}


