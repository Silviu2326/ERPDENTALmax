import { useMemo } from 'react';
import { AtmEvaluacion } from '../api/atmApi';
import { TrendingUp } from 'lucide-react';

interface GraficoEvolucionDolorProps {
  evaluaciones: AtmEvaluacion[];
}

export default function GraficoEvolucionDolor({ evaluaciones }: GraficoEvolucionDolorProps) {
  const datosGrafico = useMemo(() => {
    if (evaluaciones.length === 0) return [];

    return evaluaciones
      .filter((eval) => eval.anamnesis?.indiceFonseca !== undefined)
      .map((eval) => {
        const fecha = new Date(eval.fechaEvaluacion);
        const promedioDolor = eval.examenClinico?.palpacionMuscular?.length
          ? eval.examenClinico.palpacionMuscular.reduce((sum, p) => sum + p.dolor, 0) /
            eval.examenClinico.palpacionMuscular.length
          : 0;

        return {
          fecha: fecha.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
          fechaCompleta: eval.fechaEvaluacion,
          indiceFonseca: eval.anamnesis?.indiceFonseca || 0,
          promedioDolor: Number(promedioDolor.toFixed(1)),
          aperturaMaxima: eval.examenClinico?.rangosMovimiento?.aperturaMaxima || 0,
        };
      })
      .sort((a, b) => new Date(a.fechaCompleta).getTime() - new Date(b.fechaCompleta).getTime());
  }, [evaluaciones]);

  if (evaluaciones.length === 0 || datosGrafico.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Evolución del Dolor</h2>
        <div className="text-center py-8 text-slate-500">
          <p>No hay datos suficientes para mostrar el gráfico</p>
          <p className="text-sm mt-2">Complete al menos una evaluación con datos de dolor</p>
        </div>
      </div>
    );
  }

  const maxValor = Math.max(
    ...datosGrafico.map((d) => Math.max(d.indiceFonseca, d.promedioDolor * 10)),
    100
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Evolución del Dolor</h2>
      <div className="h-64 relative">
        <div className="absolute inset-0 flex flex-col justify-between">
          {/* Eje Y */}
          <div className="flex-1 flex flex-col justify-between pb-8 pr-2">
            {[100, 75, 50, 25, 0].map((valor) => (
              <div key={valor} className="text-xs text-slate-500">
                {valor}
              </div>
            ))}
          </div>
          {/* Gráfico */}
          <div className="flex-1 flex items-end gap-2 px-4 pb-8">
            {datosGrafico.map((dato, index) => {
              const alturaFonseca = (dato.indiceFonseca / maxValor) * 100;
              const alturaDolor = ((dato.promedioDolor * 10) / maxValor) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full relative h-full flex items-end gap-0.5">
                    <div
                      className="bg-blue-500 rounded-t w-1/2"
                      style={{ height: `${alturaFonseca}%` }}
                      title={`Índice Fonseca: ${dato.indiceFonseca.toFixed(1)}%`}
                    />
                    <div
                      className="bg-red-500 rounded-t w-1/2"
                      style={{ height: `${alturaDolor}%` }}
                      title={`Dolor Promedio: ${dato.promedioDolor}/10`}
                    />
                  </div>
                  <div className="text-xs text-slate-600 mt-1 transform -rotate-45 origin-left whitespace-nowrap">
                    {dato.fecha}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-slate-600">Índice Fonseca (%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-slate-600">Dolor Promedio (0-10)</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-500">
        <p>Índice Fonseca: porcentaje de disfunción temporomandibular</p>
        <p>Dolor Promedio: promedio de intensidad de dolor en palpaciones musculares</p>
      </div>
    </div>
  );
}

