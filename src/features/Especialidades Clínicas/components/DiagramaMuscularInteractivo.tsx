import { useState, useRef, useEffect } from 'react';
import { MapaDolor, PalpacionMuscular } from '../api/atmApi';

interface DiagramaMuscularInteractivoProps {
  mapaDolor?: MapaDolor;
  palpaciones?: PalpacionMuscular[];
  onMapaDolorChange?: (mapa: MapaDolor) => void;
  onPalpacionesChange?: (palpaciones: PalpacionMuscular[]) => void;
  modoLectura?: boolean;
}

export default function DiagramaMuscularInteractivo({
  mapaDolor = {},
  palpaciones = [],
  onMapaDolorChange,
  onPalpacionesChange,
  modoLectura = false,
}: DiagramaMuscularInteractivoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [intensidadSeleccionada, setIntensidadSeleccionada] = useState(5);
  const [musculoSeleccionado, setMusculoSeleccionado] = useState<string>('');

  const musculos = [
    { id: 'masetero', nombre: 'Masetero', x: 50, y: 40 },
    { id: 'temporal', nombre: 'Temporal', x: 50, y: 20 },
    { id: 'pterigoideo-medial', nombre: 'Pterigoideo Medial', x: 30, y: 60 },
    { id: 'pterigoideo-lateral', nombre: 'Pterigoideo Lateral', x: 70, y: 60 },
    { id: 'digastrico', nombre: 'Digástrico', x: 50, y: 80 },
    { id: 'esplenio', nombre: 'Esplenio', x: 20, y: 50 },
    { id: 'esternocleidomastoideo', nombre: 'Esternocleidomastoideo', x: 80, y: 50 },
  ];

  useEffect(() => {
    dibujarDiagrama();
  }, [mapaDolor, palpaciones]);

  const dibujarDiagrama = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar cabeza esquemática
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, 2 * Math.PI);
    ctx.stroke();

    // Dibujar puntos de músculos y dolor
    musculos.forEach((musculo) => {
      const x = (musculo.x / 100) * canvas.width;
      const y = (musculo.y / 100) * canvas.height;

      // Verificar si hay dolor registrado
      const puntoDolor = mapaDolor[musculo.id];
      const palpacion = palpaciones.find((p) => p.musculo === musculo.id);

      if (puntoDolor || palpacion) {
        const intensidad = puntoDolor?.intensidad || palpacion?.dolor || 0;
        const color = intensidad > 7 ? '#dc2626' : intensidad > 4 ? '#f59e0b' : '#3b82f6';
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 8 + intensidad, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        // Punto normal
        ctx.fillStyle = '#9ca3af';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Etiqueta del músculo
      ctx.fillStyle = '#333';
      ctx.font = '10px sans-serif';
      ctx.fillText(musculo.nombre, x + 12, y);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (modoLectura) return;

    const canvas = canvasRef.current;
    if (!canvas || !onMapaDolorChange) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Encontrar el músculo más cercano
    let musculoCercano = musculos[0];
    let distanciaMinima = Infinity;

    musculos.forEach((musculo) => {
      const distancia = Math.sqrt(
        Math.pow(x - musculo.x, 2) + Math.pow(y - musculo.y, 2)
      );
      if (distancia < distanciaMinima) {
        distanciaMinima = distancia;
        musculoCercano = musculo;
      }
    });

    if (distanciaMinima < 15) {
      const nuevoMapa = {
        ...mapaDolor,
        [musculoCercano.id]: {
          x: musculoCercano.x,
          y: musculoCercano.y,
          intensidad: intensidadSeleccionada,
          lado: 'bilateral' as const,
        },
      };
      onMapaDolorChange(nuevoMapa);
    }
  };

  const handleAgregarPalpacion = () => {
    if (!musculoSeleccionado || !onPalpacionesChange) return;

    const nuevaPalpacion: PalpacionMuscular = {
      musculo: musculoSeleccionado,
      lado: 'bilateral',
      dolor: intensidadSeleccionada,
    };

    onPalpacionesChange([...palpaciones, nuevaPalpacion]);
    setMusculoSeleccionado('');
  };

  return (
    <div className="space-y-4">
      {!modoLectura && (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Seleccionar Músculo
            </label>
            <select
              value={musculoSeleccionado}
              onChange={(e) => setMusculoSeleccionado(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              <option value="">Seleccione un músculo</option>
              {musculos.map((musculo) => (
                <option key={musculo.id} value={musculo.id}>
                  {musculo.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Intensidad del Dolor (0-10)
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={intensidadSeleccionada}
              onChange={(e) => setIntensidadSeleccionada(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-slate-600 mt-1">{intensidadSeleccionada}</div>
          </div>
          <button
            onClick={handleAgregarPalpacion}
            disabled={!musculoSeleccionado}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            Agregar
          </button>
        </div>
      )}

      <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onClick={handleCanvasClick}
          className={`w-full ring-1 ring-slate-300 rounded-xl ${modoLectura ? 'cursor-default' : 'cursor-crosshair'}`}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <p className="text-xs text-slate-500 mt-2 text-center">
          {modoLectura ? 'Visualización de mapa de dolor' : 'Haga clic en el diagrama para marcar puntos de dolor'}
        </p>
      </div>

      {palpaciones.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Palpaciones Registradas</h4>
          <div className="space-y-2">
            {palpaciones.map((palpacion, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded-xl ring-1 ring-slate-200">
                <span className="text-sm text-slate-700">
                  {musculos.find((m) => m.id === palpacion.musculo)?.nombre || palpacion.musculo}
                  {' - '}
                  {palpacion.lado}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">Dolor: {palpacion.dolor}/10</span>
                  {!modoLectura && onPalpacionesChange && (
                    <button
                      onClick={() => {
                        onPalpacionesChange(palpaciones.filter((_, i) => i !== index));
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Dolor Leve (0-4)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Dolor Moderado (5-7)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Dolor Severo (8-10)</span>
        </div>
      </div>
    </div>
  );
}



