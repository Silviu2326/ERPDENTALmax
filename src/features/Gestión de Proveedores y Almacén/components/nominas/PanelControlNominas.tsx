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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
          <Calculator size={20} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Control de Nóminas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mes
          </label>
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          >
            {meses.map((nombreMes, index) => (
              <option key={index} value={index + 1}>
                {nombreMes}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Año
          </label>
          <select
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ring-1 ring-blue-600/20 font-medium"
          >
            <Calendar size={20} />
            {calculando ? 'Calculando...' : 'Calcular Nóminas'}
          </button>
        </div>
      </div>

      {mensaje && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 ${
            mensaje.tipo === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <CheckCircle2 size={20} />
          <span className="text-sm">{mensaje.texto}</span>
        </div>
      )}
    </div>
  );
}



