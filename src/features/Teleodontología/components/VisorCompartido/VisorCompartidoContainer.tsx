import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import LienzoAnotacion from './LienzoAnotacion';
import BarraHerramientasAnotacion, { HerramientaAnotacion } from './BarraHerramientasAnotacion';
import SelectorArchivosTeleconsulta from './SelectorArchivosTeleconsulta';
import {
  SesionWebSocket,
  EventoAnotacion,
  EventoViewport,
  DocumentoPaciente,
} from '../../api/sesionTeleconsultaApi';
import { useAuth } from '../../../../contexts/AuthContext';

interface VisorCompartidoContainerProps {
  sesionId: string;
  pacienteId: string;
  documentoInicial?: DocumentoPaciente;
  isOpen: boolean;
  onClose: () => void;
  onDocumentoGuardado?: (documento: DocumentoPaciente) => void;
}

export default function VisorCompartidoContainer({
  sesionId,
  pacienteId,
  documentoInicial,
  isOpen,
  onClose,
  onDocumentoGuardado,
}: VisorCompartidoContainerProps) {
  const { user } = useAuth();
  const [documentoActivo, setDocumentoActivo] = useState<DocumentoPaciente | null>(documentoInicial || null);
  const [herramientaActiva, setHerramientaActiva] = useState<HerramientaAnotacion>(null);
  const [colorSeleccionado, setColorSeleccionado] = useState('#ef4444');
  const [grosorSeleccionado, setGrosorSeleccionado] = useState(3);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [mostrarSelectorArchivos, setMostrarSelectorArchivos] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const wsRef = useRef<SesionWebSocket | null>(null);
  const lienzoRef = useRef<{ aplicarAnotacion: (anotacion: EventoAnotacion) => void } | null>(null);

  useEffect(() => {
    if (!isOpen || !sesionId) return;

    // Conectar WebSocket
    const ws = new SesionWebSocket(sesionId);
    wsRef.current = ws;

    ws.connect()
      .then(() => {
        console.log('WebSocket conectado para sesión:', sesionId);

        // Suscribirse a eventos
        ws.on('evento-anotacion', (data: EventoAnotacion) => {
          if (lienzoRef.current) {
            lienzoRef.current.aplicarAnotacion(data);
          }
        });

        ws.on('evento-viewport', (data: EventoViewport) => {
          if (data.usuarioId !== user?._id) {
            setZoom(data.zoom);
            setPanX(data.panX);
            setPanY(data.panY);
          }
        });

        ws.on('cambio-documento', (data: { documento: DocumentoPaciente }) => {
          setDocumentoActivo(data.documento);
        });

        ws.on('error', (data: { mensaje: string }) => {
          console.error('Error en WebSocket:', data.mensaje);
        });
      })
      .catch((error) => {
        console.error('Error al conectar WebSocket:', error);
      });

    return () => {
      ws.disconnect();
      wsRef.current = null;
    };
  }, [isOpen, sesionId, user?._id]);

  const handleAnotacionChange = useCallback((anotacion: EventoAnotacion) => {
    if (wsRef.current?.estaConectado) {
      anotacion.usuarioId = user?._id || '';
      wsRef.current.enviarAnotacion(anotacion);
    }
  }, [user?._id]);

  const handleViewportChange = useCallback((viewport: EventoViewport) => {
    setZoom(viewport.zoom);
    setPanX(viewport.panX);
    setPanY(viewport.panY);
    
    if (wsRef.current?.estaConectado) {
      viewport.usuarioId = user?._id || '';
      wsRef.current.enviarViewport(viewport);
    }
  }, [user?._id]);

  const handleZoomIn = () => {
    const nuevoZoom = Math.min(5, zoom * 1.2);
    handleViewportChange({
      zoom: nuevoZoom,
      panX,
      panY,
      timestamp: Date.now(),
      usuarioId: user?._id || '',
    });
  };

  const handleZoomOut = () => {
    const nuevoZoom = Math.max(0.1, zoom / 1.2);
    handleViewportChange({
      zoom: nuevoZoom,
      panX,
      panY,
      timestamp: Date.now(),
      usuarioId: user?._id || '',
    });
  };

  const handleResetZoom = () => {
    handleViewportChange({
      zoom: 1,
      panX: 0,
      panY: 0,
      timestamp: Date.now(),
      usuarioId: user?._id || '',
    });
  };

  const handleLimpiarAnotaciones = () => {
    if (wsRef.current?.estaConectado && user?._id) {
      const evento: EventoAnotacion = {
        tipo: 'limpiar',
        datos: {},
        timestamp: Date.now(),
        usuarioId: user._id,
      };
      wsRef.current.enviarAnotacion(evento);
    }
  };

  const handleDocumentoSeleccionado = (documento: DocumentoPaciente) => {
    setDocumentoActivo(documento);
    setMostrarSelectorArchivos(false);
    handleResetZoom();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center ${
        isFullscreen ? 'p-0' : 'p-4'
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl flex flex-col ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-7xl h-[90vh]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Compartir Imagen/Documento
            </h2>
            {documentoActivo && (
              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-300">
                {documentoActivo.nombreArchivo}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors text-gray-700"
              title="Cerrar visor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Selector de archivos (collapsible) */}
          {mostrarSelectorArchivos && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <SelectorArchivosTeleconsulta
                sesionId={sesionId}
                pacienteId={pacienteId}
                documentoActivo={documentoActivo?.id}
                onDocumentoSeleccionado={handleDocumentoSeleccionado}
              />
            </div>
          )}

          {/* Barra de herramientas */}
          <div className="p-3 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <BarraHerramientasAnotacion
                herramientaActiva={herramientaActiva}
                colorSeleccionado={colorSeleccionado}
                grosorSeleccionado={grosorSeleccionado}
                zoom={zoom}
                onHerramientaChange={setHerramientaActiva}
                onColorChange={setColorSeleccionado}
                onGrosorChange={setGrosorSeleccionado}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetZoom={handleResetZoom}
                onLimpiarAnotaciones={handleLimpiarAnotaciones}
                puedeGuardar={!!documentoActivo}
              />
              
              <button
                onClick={() => setMostrarSelectorArchivos(!mostrarSelectorArchivos)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                {mostrarSelectorArchivos ? 'Ocultar' : 'Mostrar'} Archivos
              </button>
            </div>
          </div>

          {/* Lienzo */}
          <div className="flex-1 p-4 bg-gray-100 overflow-hidden">
            {documentoActivo ? (
              <LienzoAnotacion
                imagenUrl={documentoActivo.url}
                herramientaActiva={herramientaActiva}
                colorSeleccionado={colorSeleccionado}
                grosorSeleccionado={grosorSeleccionado}
                zoom={zoom}
                panX={panX}
                panY={panY}
                onAnotacionChange={handleAnotacionChange}
                onViewportChange={handleViewportChange}
                usuarioId={user?._id || ''}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">No hay documento seleccionado</p>
                  <button
                    onClick={() => setMostrarSelectorArchivos(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Seleccionar Documento
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


