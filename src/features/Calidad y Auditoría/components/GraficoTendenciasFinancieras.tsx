import { useEffect, useRef } from 'react';
import { PuntoTendenciaFinanciera } from '../api/revisionDireccionApi';
import { TrendingUp, DollarSign } from 'lucide-react';

interface GraficoTendenciasFinancierasProps {
  datos: PuntoTendenciaFinanciera[];
  loading?: boolean;
}

export default function GraficoTendenciasFinancieras({
  datos,
  loading = false,
}: GraficoTendenciasFinancierasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || datos.length === 0 || loading) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    if (datos.length === 0) return;

    // Encontrar máximos y mínimos
    const valores = datos.flatMap((d) => [d.revenue, d.expenses, d.profit]);
    const maxValor = Math.max(...valores, 0);
    const minValor = Math.min(...valores, 0);
    const rango = maxValor - minValor || 1;

    // Escalas
    const xScale = (width - 2 * padding) / (datos.length - 1 || 1);
    const yScale = (height - 2 * padding) / rango;

    // Dibujar ejes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Dibujar líneas
    const colores = {
      revenue: '#3b82f6', // blue
      expenses: '#ef4444', // red
      profit: '#10b981', // green
    };

    // Línea de ingresos
    ctx.strokeStyle = colores.revenue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    datos.forEach((d, i) => {
      const x = padding + i * xScale;
      const y = height - padding - (d.revenue - minValor) * yScale;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Línea de gastos
    ctx.strokeStyle = colores.expenses;
    ctx.beginPath();
    datos.forEach((d, i) => {
      const x = padding + i * xScale;
      const y = height - padding - (d.expenses - minValor) * yScale;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Línea de beneficios
    ctx.strokeStyle = colores.profit;
    ctx.beginPath();
    datos.forEach((d, i) => {
      const x = padding + i * xScale;
      const y = height - padding - (d.profit - minValor) * yScale;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Etiquetas de fechas
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    datos.forEach((d, i) => {
      if (i % Math.ceil(datos.length / 5) === 0 || i === datos.length - 1) {
        const x = padding + i * xScale;
        const fecha = new Date(d.date);
        const label = fecha.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
        });
        ctx.fillText(label, x, height - padding + 20);
      }
    });
  }, [datos, loading]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay datos disponibles para el período seleccionado</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          Tendencias Financieras
        </h3>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={800} height={300} className="w-full h-auto"></canvas>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-600"></div>
          <span className="text-sm text-gray-600">Ingresos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-600"></div>
          <span className="text-sm text-gray-600">Gastos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-600"></div>
          <span className="text-sm text-gray-600">Beneficios</span>
        </div>
      </div>
    </div>
  );
}


