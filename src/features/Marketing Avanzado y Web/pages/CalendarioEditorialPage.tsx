import { useState, useEffect } from 'react';
import { Calendar, Plus, Grid, List, Eye } from 'lucide-react';
import CalendarioEditorialGrid from '../components/CalendarioEditorialGrid';
import ModalGestionPublicacion from '../components/ModalGestionPublicacion';
import FiltrosCalendarioEditorial from '../components/FiltrosCalendarioEditorial';
import PanelIdeasContenido from '../components/PanelIdeasContenido';
import {
  PublicacionSocial,
  FiltrosPublicaciones,
  obtenerPublicaciones,
  eliminarPublicacion,
} from '../api/publicacionesSocialesApi';

export default function CalendarioEditorialPage() {
  const [vista, setVista] = useState<'mes' | 'semana' | 'dia'>('mes');
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(() => {
    const fin = new Date();
    fin.setMonth(fin.getMonth() + 1);
    return fin;
  });
  const [filtros, setFiltros] = useState<FiltrosPublicaciones>({});
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState<PublicacionSocial | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ideasContenido, setIdeasContenido] = useState<any[]>([]);

  const handleNuevaPublicacion = (fecha?: Date) => {
    setFechaSeleccionada(fecha);
    setPublicacionSeleccionada(null);
    setMostrarModal(true);
  };

  const handlePublicacionClick = (publicacion: PublicacionSocial) => {
    setPublicacionSeleccionada(publicacion);
    setFechaSeleccionada(undefined);
    setMostrarModal(true);
  };

  const handleGuardarPublicacion = () => {
    // Recargar publicaciones
    setMostrarModal(false);
    setPublicacionSeleccionada(null);
    setFechaSeleccionada(undefined);
  };

  const handleReprogramarPublicacion = async (publicacionId: string, nuevaFecha: Date) => {
    try {
      // Aquí se llamaría a la API para reprogramar
      // Por ahora solo mostramos un mensaje
      console.log('Reprogramar publicación', publicacionId, nuevaFecha);
    } catch (error) {
      console.error('Error al reprogramar:', error);
    }
  };

  const handleAgregarIdea = (idea: any) => {
    setIdeasContenido([...ideasContenido, { ...idea, _id: Date.now().toString() }]);
  };

  const handleEliminarIdea = (id: string) => {
    setIdeasContenido(ideasContenido.filter((i) => i._id !== id));
  };

  const handleUsarIdea = (idea: any) => {
    setPublicacionSeleccionada({
      contenido: idea.descripcion,
      mediaUrls: [],
      plataformas: [],
      estado: 'borrador',
    } as PublicacionSocial);
    setMostrarModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Calendar size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Calendario Editorial y Redes Sociales
                  </h1>
                  <p className="text-gray-600">
                    Planifica, programa y gestiona todo tu contenido para redes sociales
                  </p>
                </div>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleNuevaPublicacion()}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  <Plus size={20} />
                  <span>Nueva Publicación</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Sistema de Tabs */}
          <div className="bg-white shadow-sm rounded-lg p-0">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Vista del calendario"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                <button
                  onClick={() => setVista('mes')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    vista === 'mes'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Grid size={18} className={vista === 'mes' ? 'opacity-100' : 'opacity-70'} />
                  <span>Mes</span>
                </button>
                <button
                  onClick={() => setVista('semana')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    vista === 'semana'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <List size={18} className={vista === 'semana' ? 'opacity-100' : 'opacity-70'} />
                  <span>Semana</span>
                </button>
                <button
                  onClick={() => setVista('dia')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    vista === 'dia'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Calendar size={18} className={vista === 'dia' ? 'opacity-100' : 'opacity-70'} />
                  <span>Día</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <FiltrosCalendarioEditorial filtros={filtros} onFiltrosChange={setFiltros} />

          {/* Contenido Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <CalendarioEditorialGrid
                vista={vista}
                fechaInicio={fechaInicio}
                fechaFin={fechaFin}
                filtros={filtros}
                onPublicacionClick={handlePublicacionClick}
                onNuevaPublicacion={handleNuevaPublicacion}
                onReprogramarPublicacion={handleReprogramarPublicacion}
              />
            </div>

            <div className="lg:col-span-1">
              <PanelIdeasContenido
                ideas={ideasContenido}
                onAgregarIdea={handleAgregarIdea}
                onEliminarIdea={handleEliminarIdea}
                onUsarIdea={handleUsarIdea}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <ModalGestionPublicacion
          publicacion={publicacionSeleccionada}
          fechaSeleccionada={fechaSeleccionada}
          onClose={() => {
            setMostrarModal(false);
            setPublicacionSeleccionada(null);
            setFechaSeleccionada(undefined);
          }}
          onSave={handleGuardarPublicacion}
        />
      )}
    </div>
  );
}



