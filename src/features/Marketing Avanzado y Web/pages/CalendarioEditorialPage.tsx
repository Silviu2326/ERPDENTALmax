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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario Editorial y Redes Sociales</h1>
          <p className="text-gray-600 mt-2">
            Planifica, programa y gestiona todo tu contenido para redes sociales
          </p>
        </div>
        <button
          onClick={() => handleNuevaPublicacion()}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Publicación</span>
        </button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => setVista('mes')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            vista === 'mes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Grid className="w-4 h-4 inline mr-2" />
          Mes
        </button>
        <button
          onClick={() => setVista('semana')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            vista === 'semana'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <List className="w-4 h-4 inline mr-2" />
          Semana
        </button>
        <button
          onClick={() => setVista('dia')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            vista === 'dia'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Día
        </button>
      </div>

      <FiltrosCalendarioEditorial filtros={filtros} onFiltrosChange={setFiltros} />

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


