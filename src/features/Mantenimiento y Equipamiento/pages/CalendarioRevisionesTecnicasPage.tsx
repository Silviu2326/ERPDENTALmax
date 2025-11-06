import { useState, useEffect } from 'react';
import { Calendar, Plus, RefreshCw, Wrench } from 'lucide-react';
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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
              <Wrench className="w-8 h-8 text-blue-600" />
              <span>Calendario de Revisiones Técnicas</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona y visualiza todas las revisiones técnicas programadas del equipamiento
            </p>
          </div>
          <button
            onClick={() => {
              setRevisionSeleccionada(null);
              setFechaSeleccionada(new Date());
              setMostrarModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Revisión</span>
          </button>
        </div>

        {/* Selector de Vista */}
        <div className="mb-4 flex items-center space-x-2">
          <button
            onClick={() => setVista('dia')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              vista === 'dia'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Día
          </button>
          <button
            onClick={() => setVista('semana')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              vista === 'semana'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setVista('mes')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              vista === 'mes'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Mes
          </button>
        </div>

        {/* Filtros */}
        <FiltrosRevisiones
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          sedes={sedes}
          equipos={equiposFormato}
        />

        {/* Botón de actualizar */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={cargarRevisiones}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Calendario */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
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
    </div>
  );
}


