import { useState, useEffect } from 'react';
import { Calendar, Plus, RefreshCw, Wrench, Loader2, AlertCircle } from 'lucide-react';
import {
  RevisionTecnica,
  FiltrosRevisiones,
  obtenerRevisionesTecnicas,
} from '../api/revisionesTecnicasApi';
import CalendarioRevisionesGrid from '../components/CalendarioRevisionesGrid';
import FiltrosRevisiones from '../components/FiltrosRevisiones';
import ModalFormRevisionTecnica from '../components/ModalFormRevisionTecnica';
import { obtenerEquipos, EquipoClinico } from '../api/equiposApi';

interface CalendarioRevisionesTecnicasPageProps {
  // Props opcionales para futuras funcionalidades
}

export default function CalendarioRevisionesTecnicasPage({}: CalendarioRevisionesTecnicasPageProps = {}) {
  const [revisiones, setRevisiones] = useState<RevisionTecnica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vista, setVista] = useState<'dia' | 'semana' | 'mes'>('semana');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [revisionSeleccionada, setRevisionSeleccionada] = useState<RevisionTecnica | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>();

  // Datos mock para sedes y equipos (en producción vendrían de APIs)
  const [sedes] = useState([
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
  ]);

  const [equipos, setEquipos] = useState<EquipoClinico[]>([]);

  // Inicializar filtros con el mes actual
  const [filtros, setFiltros] = useState<FiltrosRevisiones>(() => {
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    fechaFin.setHours(23, 59, 59, 999);

    return {
      startDate: fechaInicio.toISOString(),
      endDate: fechaFin.toISOString(),
    };
  });

  // Cargar equipos al montar el componente
  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        const response = await obtenerEquipos({ limit: 1000 });
        setEquipos(response.equipos);
      } catch (err) {
        console.error('Error al cargar equipos:', err);
      }
    };
    cargarEquipos();
  }, []);

  const cargarRevisiones = async () => {
    setLoading(true);
    setError(null);
    try {
      // En producción, esto llamaría a la API real
      // const datos = await obtenerRevisionesTecnicas(filtros);
      // setRevisiones(datos);
      
      // Datos mock para desarrollo
      const datosMock: RevisionTecnica[] = [
        {
          _id: '1',
          equipo: { _id: '1', nombre: 'Autoclave A', marca: 'Tuttnauer', modelo: '3870EA' },
          sede: { _id: '1', nombre: 'Sede Central' },
          fechaProgramada: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          estado: 'Programada',
          tecnicoResponsable: 'Juan Pérez',
          descripcionTrabajo: 'Revisión anual completa',
          costo: 250.00,
        },
        {
          _id: '2',
          equipo: { _id: '2', nombre: 'Unidad de Rayos X', marca: 'Dentsply', modelo: 'Sirona' },
          sede: { _id: '1', nombre: 'Sede Central' },
          fechaProgramada: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'Programada',
          tecnicoResponsable: 'María García',
          descripcionTrabajo: 'Calibración y mantenimiento',
          costo: 350.00,
        },
        {
          _id: '3',
          equipo: { _id: '3', nombre: 'Compresor', marca: 'Kaeser', modelo: 'Sigma' },
          sede: { _id: '2', nombre: 'Sede Norte' },
          fechaProgramada: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'Completada',
          tecnicoResponsable: 'Carlos López',
          fechaRealizacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          descripcionTrabajo: 'Cambio de filtros y revisión',
          costo: 150.00,
        },
      ];
      
      // Filtrar revisiones dentro del rango
      const fechaInicio = filtros.startDate ? new Date(filtros.startDate) : new Date();
      const fechaFin = filtros.endDate ? new Date(filtros.endDate) : new Date();
      
      let revisionesFiltradas = datosMock.filter((revision) => {
        const fechaRevision = new Date(revision.fechaProgramada);
        return fechaRevision >= fechaInicio && fechaRevision <= fechaFin;
      });

      // Aplicar filtros adicionales
      if (filtros.sedeId) {
        revisionesFiltradas = revisionesFiltradas.filter(
          (r) => r.sede._id === filtros.sedeId
        );
      }
      if (filtros.equipoId) {
        revisionesFiltradas = revisionesFiltradas.filter(
          (r) => r.equipo._id === filtros.equipoId
        );
      }
      if (filtros.estado) {
        revisionesFiltradas = revisionesFiltradas.filter(
          (r) => r.estado === filtros.estado
        );
      }
      
      setRevisiones(revisionesFiltradas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las revisiones técnicas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRevisiones();
  }, [filtros]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosRevisiones) => {
    setFiltros(nuevosFiltros);
  };

  const handleRevisionClick = (revision: RevisionTecnica) => {
    setRevisionSeleccionada(revision);
    setMostrarModal(true);
  };

  const handleSlotClick = (fecha: Date) => {
    setRevisionSeleccionada(null);
    setFechaSeleccionada(fecha);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setRevisionSeleccionada(null);
    setFechaSeleccionada(undefined);
  };

  const handleGuardarRevision = () => {
    cargarRevisiones();
  };

  const fechaInicio = filtros.startDate ? new Date(filtros.startDate) : new Date();
  const fechaFin = filtros.endDate ? new Date(filtros.endDate) : new Date();

  // Convertir equipos al formato esperado por el modal
  const equiposFormato = equipos.map((equipo) => ({
    _id: equipo._id || '',
    nombre: equipo.nombre,
    marca: equipo.marca,
    modelo: equipo.modelo,
    sede: equipo.ubicacion?.sede,
  }));

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
                  <Wrench size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Calendario de Revisiones Técnicas
                  </h1>
                  <p className="text-gray-600">
                    Gestiona y visualiza todas las revisiones técnicas programadas del equipamiento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => {
                setRevisionSeleccionada(null);
                setFechaSeleccionada(new Date());
                setMostrarModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              <Plus size={20} />
              <span>Nueva Revisión</span>
            </button>
          </div>

          {/* Selector de Vista (Tabs) */}
          <div className="bg-white shadow-sm rounded-lg p-0">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Vista del calendario"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
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
                <button
                  onClick={() => setVista('semana')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    vista === 'semana'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Calendar size={18} className={vista === 'semana' ? 'opacity-100' : 'opacity-70'} />
                  <span>Semana</span>
                </button>
                <button
                  onClick={() => setVista('mes')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    vista === 'mes'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Calendar size={18} className={vista === 'mes' ? 'opacity-100' : 'opacity-70'} />
                  <span>Mes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <FiltrosRevisiones
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
            sedes={sedes}
            equipos={equiposFormato}
          />

          {/* Botón de actualizar */}
          <div className="flex items-center justify-end">
            <button
              onClick={cargarRevisiones}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              <span>Actualizar</span>
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-white shadow-sm rounded-lg p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={cargarRevisiones}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Calendario */}
          {loading ? (
            <div className="bg-white shadow-sm rounded-lg p-8 text-center">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando revisiones técnicas...</p>
            </div>
          ) : (
            <CalendarioRevisionesGrid
              revisiones={revisiones}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              vista={vista}
              onRevisionClick={handleRevisionClick}
              onSlotClick={handleSlotClick}
            />
          )}
        </div>
      </div>

      {/* Modal de Gestión de Revisión */}
      {mostrarModal && (
        <ModalFormRevisionTecnica
          revision={revisionSeleccionada}
          fechaSeleccionada={fechaSeleccionada}
          onClose={handleCerrarModal}
          onSave={handleGuardarRevision}
          sedes={sedes}
          equipos={equiposFormato}
        />
      )}
    </div>
  );
}



