import { useEffect, useRef, useState, useCallback } from 'react';
import { EventoAnotacion, EventoViewport } from '../../api/sesionTeleconsultaApi';
import { HerramientaAnotacion } from './BarraHerramientasAnotacion';

interface LienzoAnotacionProps {
  imagenUrl: string;
  herramientaActiva: HerramientaAnotacion;
  colorSeleccionado: string;
  grosorSeleccionado: number;
  zoom: number;
  panX: number;
  panY: number;
  onAnotacionChange: (anotacion: EventoAnotacion) => void;
  onViewportChange: (viewport: EventoViewport) => void;
  onAnotacionRecibida?: (anotacion: EventoAnotacion) => void;
  onViewportRecibido?: (viewport: EventoViewport) => void;
  usuarioId: string;
}

interface Punto {
  x: number;
  y: number;
}

export default function LienzoAnotacion({
  imagenUrl,
  herramientaActiva,
  colorSeleccionado,
  grosorSeleccionado,
  zoom,
  panX,
  panY,
  onAnotacionChange,
  onViewportChange,
  onAnotacionRecibida,
  onViewportRecibido,
  usuarioId,
}: LienzoAnotacionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagenRef = useRef<HTMLImageElement | null>(null);
  const [estaDibujando, setEstaDibujando] = useState(false);
  const [ultimoPunto, setUltimoPunto] = useState<Punto | null>(null);
  const anotacionesRef = useRef<Array<{ tipo: string; datos: any }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Punto | null>(null);

  // Cargar imagen
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imagenRef.current = img;
      redibujar();
    };
    img.src = imagenUrl;
  }, [imagenUrl]);

  // Redibujar cuando cambian las anotaciones, zoom o pan
  useEffect(() => {
    redibujar();
  }, [zoom, panX, panY, anotacionesRef.current]);

  // Manejar anotaciones recibidas de otros usuarios
  useEffect(() => {
    if (onAnotacionRecibida) {
      // Esta función será llamada desde el componente padre cuando llegue un evento
    }
  }, [onAnotacionRecibida]);

  const redibujar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagenRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    if (!container) return;

    // Ajustar tamaño del canvas
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Guardar estado
    ctx.save();

    // Aplicar transformaciones (zoom y pan)
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Dibujar imagen
    const img = imagenRef.current;
    const imgAspect = img.width / img.height;
    const containerAspect = container.clientWidth / container.clientHeight;

    let drawWidth: number;
    let drawHeight: number;
    let drawX = 0;
    let drawY = 0;

    if (imgAspect > containerAspect) {
      drawWidth = container.clientWidth / zoom;
      drawHeight = drawWidth / imgAspect;
      drawY = (container.clientHeight / zoom - drawHeight) / 2;
    } else {
      drawHeight = container.clientHeight / zoom;
      drawWidth = drawHeight * imgAspect;
      drawX = (container.clientWidth / zoom - drawWidth) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    // Dibujar anotaciones
    anotacionesRef.current.forEach((anotacion) => {
      dibujarAnotacion(ctx, anotacion, drawX, drawY, drawWidth, drawHeight);
    });

    // Restaurar estado
    ctx.restore();
  }, [zoom, panX, panY]);

  const dibujarAnotacion = (
    ctx: CanvasRenderingContext2D,
    anotacion: { tipo: string; datos: any },
    imgX: number,
    imgY: number,
    imgWidth: number,
    imgHeight: number
  ) => {
    const { tipo, datos } = anotacion;

    if (tipo === 'dibujo' && datos.puntos) {
      ctx.strokeStyle = datos.color || '#000000';
      ctx.lineWidth = datos.grosor || 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      datos.puntos.forEach((punto: Punto, index: number) => {
        const x = imgX + (punto.x * imgWidth) / 100;
        const y = imgY + (punto.y * imgHeight) / 100;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }
  };

  const obtenerCoordenadasRelativas = (event: React.MouseEvent<HTMLCanvasElement>): Punto | null => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imagenRef.current) return null;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convertir a coordenadas relativas considerando zoom y pan
    const relX = (x - panX) / zoom;
    const relY = (y - panY) / zoom;

    // Calcular posición relativa dentro de la imagen
    const img = imagenRef.current;
    const imgAspect = img.width / img.height;
    const containerAspect = container.clientWidth / container.clientHeight;

    let imgWidth: number;
    let imgHeight: number;
    let imgX = 0;
    let imgY = 0;

    if (imgAspect > containerAspect) {
      imgWidth = container.clientWidth / zoom;
      imgHeight = imgWidth / imgAspect;
      imgY = (container.clientHeight / zoom - imgHeight) / 2;
    } else {
      imgHeight = container.clientHeight / zoom;
      imgWidth = imgHeight * imgAspect;
      imgX = (container.clientWidth / zoom - imgWidth) / 2;
    }

    // Verificar si está dentro de la imagen
    if (relX < imgX || relX > imgX + imgWidth || relY < imgY || relY > imgY + imgHeight) {
      return null;
    }

    // Convertir a porcentaje relativo a la imagen
    const porcentajeX = ((relX - imgX) / imgWidth) * 100;
    const porcentajeY = ((relY - imgY) / imgHeight) * 100;

    return { x: porcentajeX, y: porcentajeY };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (herramientaActiva === 'mover') {
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
      return;
    }

    if (herramientaActiva !== 'lápiz' && herramientaActiva !== 'borrador') return;

    const punto = obtenerCoordenadasRelativas(event);
    if (!punto) return;

    setEstaDibujando(true);
    setUltimoPunto(punto);

    const puntos: Punto[] = [punto];
    anotacionesRef.current.push({
      tipo: herramientaActiva === 'lápiz' ? 'dibujo' : 'borrar',
      datos: {
        puntos,
        color: herramientaActiva === 'lápiz' ? colorSeleccionado : '#ffffff',
        grosor: grosorSeleccionado,
      },
    });

    redibujar();
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && dragStart) {
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      onViewportChange({
        panX: panX + deltaX,
        panY: panY + deltaY,
        zoom,
        timestamp: Date.now(),
        usuarioId,
      });
      setDragStart({ x: event.clientX, y: event.clientY });
      return;
    }

    if (!estaDibujando || !ultimoPunto) return;

    const punto = obtenerCoordenadasRelativas(event);
    if (!punto) return;

    const ultimaAnotacion = anotacionesRef.current[anotacionesRef.current.length - 1];
    if (ultimaAnotacion && ultimaAnotacion.datos.puntos) {
      ultimaAnotacion.datos.puntos.push(punto);
      setUltimoPunto(punto);
      redibujar();

      // Enviar anotación en tiempo real
      onAnotacionChange({
        tipo: herramientaActiva === 'lápiz' ? 'dibujo' : 'borrar',
        datos: {
          puntos: ultimaAnotacion.datos.puntos,
          color: ultimaAnotacion.datos.color,
          grosor: ultimaAnotacion.datos.grosor,
        },
        timestamp: Date.now(),
        usuarioId,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      return;
    }

    if (estaDibujando && ultimoPunto) {
      const ultimaAnotacion = anotacionesRef.current[anotacionesRef.current.length - 1];
      if (ultimaAnotacion) {
        onAnotacionChange({
          tipo: herramientaActiva === 'lápiz' ? 'dibujo' : 'borrar',
          datos: {
            puntos: ultimaAnotacion.datos.puntos,
            color: ultimaAnotacion.datos.color,
            grosor: ultimaAnotacion.datos.grosor,
          },
          timestamp: Date.now(),
          usuarioId,
        });
      }
    }

    setEstaDibujando(false);
    setUltimoPunto(null);
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const nuevoZoom = Math.max(0.1, Math.min(5, zoom * delta));
    
    onViewportChange({
      zoom: nuevoZoom,
      panX,
      panY,
      timestamp: Date.now(),
      usuarioId,
    });
  };

  // Función para aplicar anotación recibida
  const aplicarAnotacionRecibida = useCallback((anotacion: EventoAnotacion) => {
    if (anotacion.usuarioId === usuarioId) return; // Ignorar nuestras propias anotaciones

    if (anotacion.tipo === 'dibujo' || anotacion.tipo === 'borrar') {
      anotacionesRef.current.push({
        tipo: anotacion.tipo,
        datos: anotacion.datos,
      });
      redibujar();
    } else if (anotacion.tipo === 'limpiar') {
      anotacionesRef.current = [];
      redibujar();
    }
  }, [usuarioId, redibujar]);

  // Exponer función para que el padre pueda llamarla
  useEffect(() => {
    if (onAnotacionRecibida) {
      // El padre debería pasar una función que llame a aplicarAnotacionRecibida
    }
  }, [onAnotacionRecibida]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gray-100 rounded-lg overflow-hidden relative"
      style={{ cursor: herramientaActiva === 'mover' ? 'grab' : herramientaActiva === 'lápiz' ? 'crosshair' : 'default' }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="absolute inset-0"
      />
    </div>
  );
}



