import { useMemo } from 'react';
import { SesionMantenimientoPeriodontal } from '../api/periodonciaApi';

interface GraficoEvolucionPeriodontalProps {
  sesiones: SesionMantenimientoPeriodontal[];
}

export default function GraficoEvolucionPeriodontal({
  sesiones,
}: GraficoEvolucionPeriodontalProps) {
  const datosGrafico = useMemo(() => {
    if (sesiones.length === 0) return { fechas: [], placa: [], sangrado: [] };

    const sesionesOrdenadas = [...sesiones].sort((a, b) => {
      const fechaA = new Date(a.fechaSesion).getTime();
      const fechaB = new Date(b.fechaSesion).getTime();
      return fechaA - fechaB;
    });

    const fechas = sesionesOrdenadas.map(s => {
      const fecha = new Date(s.fechaSesion);
      return fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    });

    const placa = sesionesOrdenadas.map(s => s.indicePlacaGeneral || 0);
    const sangrado = sesionesOrdenadas.map(s => s.indiceSangradoGeneral || 0);

    return { fechas, placa, sangrado };
  }, [sesiones]);

  const maxValor = Math.max(
    ...datosGrafico.placa,
    ...datosGrafico.sangrado,
    100
  );

  const calcularY = (valor: number, altura: number) => {
    if (maxValor === 0) return altura;
    return altura - (valor / maxValor) * altura;
  };

  const generarPuntos = (valores: number[], ancho: number, altura: number) => {
    if (valores.length === 0) return '';
    const puntos = valores.map((valor, idx) => {
      const x = (idx / (valores.length - 1 || 1)) * ancho;
      const y = calcularY(valor, altura);
      return `${x},${y}`;
    });
    return puntos.join(' ');
  };

  if (sesiones.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Índices Periodontales</h3>
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No hay datos históricos disponibles</p>
          <p className="text-sm mt-2">Las mediciones aparecerán aquí después de guardar sesiones</p>
        </div>
      </div>
    );
  }

  const anchoGrafico = 600;
  const alturaGrafico = 300;
  const padding = 40;

  const puntosPlaca = generarPuntos(
    datosGrafico.placa,
    anchoGrafico - padding * 2,
    alturaGrafico - padding * 2
  );
  const puntosSangrado = generarPuntos(
    datosGrafico.sangrado,
    anchoGrafico - padding * 2,
    alturaGrafico - padding * 2
  );

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Índices Periodontales</h3>
      
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-slate-700">Índice de Placa (%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-slate-700">Índice de Sangrado - BOP (%)</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          width={anchoGrafico}
          height={alturaGrafico}
          className="border border-gray-200 rounded"
          viewBox={`0 0 ${anchoGrafico} ${alturaGrafico}`}
        >
          {/* Grid horizontal */}
          {[0, 25, 50, 75, 100].map(valor => {
            const y = calcularY(valor, alturaGrafico - padding * 2) + padding;
            return (
              <g key={valor}>
                <line
                  x1={padding}
                  y1={y}
                  x2={anchoGrafico - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {valor}%
                </text>
              </g>
            );
          })}

          {/* Eje Y */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={alturaGrafico - padding}
            stroke="#374151"
            strokeWidth="2"
          />

          {/* Eje X */}
          <line
            x1={padding}
            y1={alturaGrafico - padding}
            x2={anchoGrafico - padding}
            y2={alturaGrafico - padding}
            stroke="#374151"
            strokeWidth="2"
          />

          {/* Línea de Placa */}
          {datosGrafico.placa.length > 1 && (
            <polyline
              points={puntosPlaca.split(' ').map((p, idx) => {
                const [x, y] = p.split(',').map(Number);
                return `${x + padding},${y + padding}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Línea de Sangrado */}
          {datosGrafico.sangrado.length > 1 && (
            <polyline
              points={puntosSangrado.split(' ').map((p, idx) => {
                const [x, y] = p.split(',').map(Number);
                return `${x + padding},${y + padding}`;
              }).join(' ')}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Puntos de Placa */}
          {datosGrafico.placa.map((valor, idx) => {
            const x = (idx / (datosGrafico.placa.length - 1 || 1)) * (anchoGrafico - padding * 2) + padding;
            const y = calcularY(valor, alturaGrafico - padding * 2) + padding;
            return (
              <circle
                key={`placa-${idx}`}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          {/* Puntos de Sangrado */}
          {datosGrafico.sangrado.map((valor, idx) => {
            const x = (idx / (datosGrafico.sangrado.length - 1 || 1)) * (anchoGrafico - padding * 2) + padding;
            const y = calcularY(valor, alturaGrafico - padding * 2) + padding;
            return (
              <circle
                key={`sangrado-${idx}`}
                cx={x}
                cy={y}
                r="4"
                fill="#ef4444"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          {/* Etiquetas de fechas */}
          {datosGrafico.fechas.map((fecha, idx) => {
            const x = (idx / (datosGrafico.fechas.length - 1 || 1)) * (anchoGrafico - padding * 2) + padding;
            return (
              <text
                key={`fecha-${idx}`}
                x={x}
                y={alturaGrafico - padding + 20}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
                transform={`rotate(-45 ${x} ${alturaGrafico - padding + 20})`}
              >
                {fecha}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Resumen numérico */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 ring-1 ring-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Índice de Placa</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600">
              {datosGrafico.placa.length > 0
                ? datosGrafico.placa[datosGrafico.placa.length - 1].toFixed(1)
                : '0.0'}
              %
            </span>
            {datosGrafico.placa.length > 1 && (
              <span className={`text-sm ${
                datosGrafico.placa[datosGrafico.placa.length - 1] < datosGrafico.placa[datosGrafico.placa.length - 2]
                  ? 'text-green-600'
                  : datosGrafico.placa[datosGrafico.placa.length - 1] > datosGrafico.placa[datosGrafico.placa.length - 2]
                  ? 'text-red-600'
                  : 'text-slate-600'
              }`}>
                {datosGrafico.placa[datosGrafico.placa.length - 1] < datosGrafico.placa[datosGrafico.placa.length - 2]
                  ? '↓ Mejorando'
                  : datosGrafico.placa[datosGrafico.placa.length - 1] > datosGrafico.placa[datosGrafico.placa.length - 2]
                  ? '↑ Empeorando'
                  : '→ Estable'}
              </span>
            )}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 ring-1 ring-red-200">
          <h4 className="text-sm font-semibold text-red-800 mb-2">Índice de Sangrado (BOP)</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600">
              {datosGrafico.sangrado.length > 0
                ? datosGrafico.sangrado[datosGrafico.sangrado.length - 1].toFixed(1)
                : '0.0'}
              %
            </span>
            {datosGrafico.sangrado.length > 1 && (
              <span className={`text-sm ${
                datosGrafico.sangrado[datosGrafico.sangrado.length - 1] < datosGrafico.sangrado[datosGrafico.sangrado.length - 2]
                  ? 'text-green-600'
                  : datosGrafico.sangrado[datosGrafico.sangrado.length - 1] > datosGrafico.sangrado[datosGrafico.sangrado.length - 2]
                  ? 'text-red-600'
                  : 'text-slate-600'
              }`}>
                {datosGrafico.sangrado[datosGrafico.sangrado.length - 1] < datosGrafico.sangrado[datosGrafico.sangrado.length - 2]
                  ? '↓ Mejorando'
                  : datosGrafico.sangrado[datosGrafico.sangrado.length - 1] > datosGrafico.sangrado[datosGrafico.sangrado.length - 2]
                  ? '↑ Empeorando'
                  : '→ Estable'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



