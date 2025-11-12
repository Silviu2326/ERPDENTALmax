import { useState, useEffect, useMemo, useRef } from 'react';
import { Download, Calendar, TrendingUp, Clock, BarChart3, Filter } from 'lucide-react';
import { Cita, FiltrosCalendario, registrarHoraPico } from '../api/citasApi';

interface AgendaHeatmapCardProps {
  citas: Cita[];
  filtros: FiltrosCalendario;
  onFiltrosChange?: (filtros: FiltrosCalendario) => void;
}

interface DatosHeatmap {
  hora: number;
  dia: number; // 0 = Domingo, 1 = Lunes, etc.
  cantidad: number;
  porcentaje: number;
}

type RangoHeatmap = 'dia' | 'semana' | 'mes';

export default function AgendaHeatmapCard({ citas, filtros, onFiltrosChange }: AgendaHeatmapCardProps) {
  const [rango, setRango] = useState<RangoHeatmap>('semana');
  const [datosHeatmap, setDatosHeatmap] = useState<DatosHeatmap[]>([]);
  const [horaPico, setHoraPico] = useState<{ hora: number; cantidad: number } | null>(null);
  const [exportando, setExportando] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const horas = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 a 20:00

  useEffect(() => {
    calcularHeatmap();
  }, [citas, rango, filtros]);

  const calcularHeatmap = () => {
    const datos: DatosHeatmap[] = [];
    const fechaInicio = new Date(filtros.fecha_inicio);
    const fechaFin = new Date(filtros.fecha_fin);

    // Calcular el rango de días según el tipo seleccionado
    let dias: Date[] = [];
    if (rango === 'dia') {
      dias = [fechaInicio];
    } else if (rango === 'semana') {
      const inicioSemana = new Date(fechaInicio);
      inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
      for (let i = 0; i < 7; i++) {
        const dia = new Date(inicioSemana);
        dia.setDate(dia.getDate() + i);
        dias.push(dia);
      }
    } else {
      // Mes: usar el mes de fechaInicio
      const inicioMes = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
      const finMes = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, 0);
      for (let d = new Date(inicioMes); d <= finMes; d.setDate(d.getDate() + 1)) {
        dias.push(new Date(d));
      }
    }

    // Inicializar contadores
    const contadores: Record<string, number> = {};
    horas.forEach(hora => {
      dias.forEach(dia => {
        const key = `${dia.getDay()}-${hora}`;
        contadores[key] = 0;
      });
    });

    // Contar citas por hora y día
    citas.forEach(cita => {
      const fechaCita = new Date(cita.fecha_hora_inicio);
      const horaCita = fechaCita.getHours();
      const diaCita = fechaCita.getDay();

      if (horas.includes(horaCita)) {
        const key = `${diaCita}-${horaCita}`;
        if (contadores[key] !== undefined) {
          contadores[key]++;
        }
      }
    });

    // Calcular máximo para normalizar porcentajes
    const maxCantidad = Math.max(...Object.values(contadores), 1);

    // Construir datos del heatmap
    horas.forEach(hora => {
      dias.forEach(dia => {
        const key = `${dia.getDay()}-${hora}`;
        const cantidad = contadores[key] || 0;
        datos.push({
          hora,
          dia: dia.getDay(),
          cantidad,
          porcentaje: (cantidad / maxCantidad) * 100,
        });
      });
    });

    setDatosHeatmap(datos);

    // Calcular hora pico
    const horasAgregadas: Record<number, number> = {};
    horas.forEach(hora => {
      horasAgregadas[hora] = 0;
      dias.forEach(dia => {
        const key = `${dia.getDay()}-${hora}`;
        horasAgregadas[hora] += contadores[key] || 0;
      });
    });

    const horaPicoEncontrada = Object.entries(horasAgregadas).reduce((max, [hora, cantidad]) => {
      return cantidad > max.cantidad ? { hora: parseInt(hora), cantidad } : max;
    }, { hora: 0, cantidad: 0 });

    if (horaPicoEncontrada.cantidad > 0) {
      setHoraPico(horaPicoEncontrada);
      // Registrar hora pico en el backend
      registrarHoraPico({
        hora: horaPicoEncontrada.hora,
        cantidad: horaPicoEncontrada.cantidad,
        rango,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
      }).catch(err => console.error('Error al registrar hora pico:', err));
    }
  };

  const getColorIntensidad = (porcentaje: number): string => {
    if (porcentaje === 0) return '#f3f4f6'; // gris claro
    if (porcentaje < 25) return '#dbeafe'; // azul muy claro
    if (porcentaje < 50) return '#93c5fd'; // azul claro
    if (porcentaje < 75) return '#60a5fa'; // azul medio
    if (porcentaje < 90) return '#3b82f6'; // azul
    return '#1e40af'; // azul oscuro
  };

  const getColorTexto = (porcentaje: number): string => {
    return porcentaje > 50 ? '#ffffff' : '#1f2937';
  };

  const obtenerDato = (dia: number, hora: number): DatosHeatmap | undefined => {
    return datosHeatmap.find(d => d.dia === dia && d.hora === hora);
  };

  const handleExportarImagen = async () => {
    if (!canvasRef.current) return;

    setExportando(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Configurar tamaño del canvas
      const cellWidth = 60;
      const cellHeight = 40;
      const padding = 20;
      const headerHeight = 30;
      const leftMargin = 60;

      const width = leftMargin + (diasSemana.length * cellWidth) + padding;
      const height = headerHeight + (horas.length * cellHeight) + padding;

      canvas.width = width;
      canvas.height = height;

      // Fondo blanco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Dibujar encabezados de días
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      diasSemana.forEach((dia, index) => {
        const x = leftMargin + (index * cellWidth) + (cellWidth / 2);
        ctx.fillText(dia, x, headerHeight / 2);
      });

      // Dibujar horas y celdas
      horas.forEach((hora, horaIndex) => {
        const y = headerHeight + (horaIndex * cellHeight) + (cellHeight / 2);

        // Etiqueta de hora
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${hora}:00`, leftMargin - 10, y);

        // Dibujar celdas
        diasSemana.forEach((_, diaIndex) => {
          const dato = obtenerDato(diaIndex, hora);
          const cantidad = dato?.cantidad || 0;
          const porcentaje = dato?.porcentaje || 0;

          const x = leftMargin + (diaIndex * cellWidth);
          const cellY = headerHeight + (horaIndex * cellHeight);

          // Color de fondo
          ctx.fillStyle = getColorIntensidad(porcentaje);
          ctx.fillRect(x, cellY, cellWidth, cellHeight);

          // Borde
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, cellY, cellWidth, cellHeight);

          // Texto (cantidad)
          ctx.fillStyle = getColorTexto(porcentaje);
          ctx.font = 'bold 11px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(cantidad.toString(), x + cellWidth / 2, y);
        });
      });

      // Título
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Heatmap de Ocupación - ${rango.toUpperCase()}`, padding, 20);

      // Descargar imagen
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `heatmap-ocupacion-${rango}-${new Date().toISOString().split('T')[0]}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (err) {
      console.error('Error al exportar imagen:', err);
    } finally {
      setExportando(false);
    }
  };

  const diasVisibles = useMemo(() => {
    if (rango === 'dia') return [new Date(filtros.fecha_inicio).getDay()];
    if (rango === 'semana') return [0, 1, 2, 3, 4, 5, 6];
    // Mes: todos los días
    return [0, 1, 2, 3, 4, 5, 6];
  }, [rango, filtros]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Heatmap de Ocupación</h3>
            <p className="text-sm text-gray-600">Visualización de ocupación por hora y día</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Selector de rango */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setRango('dia')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                rango === 'dia'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Día
            </button>
            <button
              onClick={() => setRango('semana')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                rango === 'semana'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setRango('mes')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                rango === 'mes'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mes
            </button>
          </div>

          {/* Botón exportar */}
          <button
            onClick={handleExportarImagen}
            disabled={exportando}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            {exportando ? 'Exportando...' : 'Exportar Imagen'}
          </button>
        </div>
      </div>

      {/* Hora pico destacada */}
      {horaPico && (
        <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Hora Pico Detectada</p>
                <p className="text-2xl font-bold text-orange-700">
                  {horaPico.hora}:00 - {horaPico.cantidad} {horaPico.cantidad === 1 ? 'cita' : 'citas'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Rango: {rango}</p>
              <p className="text-xs text-gray-600">
                {new Date(filtros.fecha_inicio).toLocaleDateString('es-ES')} - {new Date(filtros.fecha_fin).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-16 p-2 text-xs font-medium text-gray-600 text-right">Hora</th>
                {diasSemana.map((dia, index) => {
                  if (rango === 'dia' && index !== diasVisibles[0]) return null;
                  return (
                    <th key={dia} className="p-2 text-xs font-medium text-gray-600 text-center min-w-[60px]">
                      {dia}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {horas.map((hora) => (
                <tr key={hora}>
                  <td className="p-2 text-xs text-gray-600 text-right font-medium">
                    {hora}:00
                  </td>
                  {diasSemana.map((_, diaIndex) => {
                    if (rango === 'dia' && diaIndex !== diasVisibles[0]) return null;
                    const dato = obtenerDato(diaIndex, hora);
                    const cantidad = dato?.cantidad || 0;
                    const porcentaje = dato?.porcentaje || 0;
                    const esHoraPico = horaPico && hora === horaPico.hora;

                    return (
                      <td
                        key={`${diaIndex}-${hora}`}
                        className="p-2 text-center border border-gray-200"
                        style={{
                          backgroundColor: getColorIntensidad(porcentaje),
                          color: getColorTexto(porcentaje),
                          fontWeight: 'bold',
                          fontSize: '12px',
                          position: 'relative',
                        }}
                        title={`${diasSemana[diaIndex]} ${hora}:00 - ${cantidad} ${cantidad === 1 ? 'cita' : 'citas'} (${porcentaje.toFixed(0)}%)`}
                      >
                        {cantidad}
                        {esHoraPico && (
                          <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full" title="Hora pico"></span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600 font-medium">Intensidad:</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-gray-200 rounded"></div>
            <span className="text-xs text-gray-500">0</span>
            <div className="w-8 h-4 bg-blue-100 rounded"></div>
            <div className="w-8 h-4 bg-blue-300 rounded"></div>
            <div className="w-8 h-4 bg-blue-500 rounded"></div>
            <div className="w-8 h-4 bg-blue-700 rounded"></div>
            <span className="text-xs text-gray-500">Máximo</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Total de citas: {citas.length}
        </div>
      </div>

      {/* Canvas oculto para exportación */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

