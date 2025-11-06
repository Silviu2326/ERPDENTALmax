import { useState, useEffect } from 'react';
import { Plus, Filter, RefreshCw, Video } from 'lucide-react';
import {
  Teleconsulta,
  obtenerTeleconsultas,
  crearTeleconsulta,
  actualizarTeleconsulta,
  eliminarTeleconsulta,
  iniciarSesionVideollamada,
  FiltrosTeleconsultas,
  CrearTeleconsultaData,
  ActualizarTeleconsultaData,
} from '../api/teleconsultasApi';
import CalendarioTeleconsultasView from '../components/CalendarioTeleconsultasView';
import ModalGestionarTeleconsulta from '../components/ModalGestionarTeleconsulta';
import TarjetaDetalleTeleconsulta from '../components/TarjetaDetalleTeleconsulta';

interface TeleodontologíaPageProps {
  onVerInforme?: (teleconsultaId: string) => void;
}

export default function TeleodontologíaPage({ onVerInforme }: TeleodontologíaPageProps = {}) {
  const [teleconsultas, setTeleconsultas] = useState<Teleconsulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [teleconsultaSeleccionada, setTeleconsultaSeleccionada] = useState<Teleconsulta | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());

  // Estado para filtros
  const [filtros, setFiltros] = useState<FiltrosTeleconsultas>(() => {
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 7);
    fechaFin.setHours(23, 59, 59, 999);

    return {
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
    };
  });

  // Datos mock para pacientes y odontólogos (en producción vendrían de APIs)
  const [pacientes] = useState([
    { _id: '1', nombre: 'Juan', apellidos: 'Pérez' },
    { _id: '2', nombre: 'María', apellidos: 'García' },
    { _id: '3', nombre: 'Carlos', apellidos: 'López' },
  ]);

  const [odontologos] = useState([
    { _id: '1', nombre: 'Ana', apellidos: 'Martínez' },
    { _id: '2', nombre: 'Pedro', apellidos: 'Sánchez' },
    { _id: '3', nombre: 'Laura', apellidos: 'Rodríguez' },
  ]);

  // Cargar teleconsultas
  const cargarTeleconsultas = async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerTeleconsultas(filtros);
      setTeleconsultas(datos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar teleconsultas');
      console.error('Error al cargar teleconsultas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTeleconsultas();
  }, [filtros]);

  // Actualizar filtros cuando cambia la fecha seleccionada
  useEffect(() => {
    const fechaInicio = new Date(fechaSeleccionada);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fechaSeleccionada);
    fechaFin.setDate(fechaFin.getDate() + 7);
    fechaFin.setHours(23, 59, 59, 999);

    setFiltros({
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
    });
  }, [fechaSeleccionada]);

  const handleNuevaTeleconsulta = () => {
    setTeleconsultaSeleccionada(null);
    setMostrarModal(true);
  };

  const handleEditarTeleconsulta = (teleconsulta: Teleconsulta) => {
    setTeleconsultaSeleccionada(teleconsulta);
    setMostrarModal(true);
  };

  const handleGuardarTeleconsulta = async (
    datos: CrearTeleconsultaData | ActualizarTeleconsultaData
  ) => {
    try {
      if (teleconsultaSeleccionada) {
        // Actualizar teleconsulta existente
        await actualizarTeleconsulta(teleconsultaSeleccionada._id!, datos as ActualizarTeleconsultaData);
      } else {
        // Crear nueva teleconsulta
        await crearTeleconsulta(datos as CrearTeleconsultaData);
      }
      await cargarTeleconsultas();
      setMostrarModal(false);
      setTeleconsultaSeleccionada(null);
    } catch (err: any) {
      throw err;
    }
  };

  const handleEliminarTeleconsulta = async (id: string) => {
    if (!window.confirm('¿Está seguro de que desea cancelar esta teleconsulta?')) {
      return;
    }

    try {
      await eliminarTeleconsulta(id);
      await cargarTeleconsultas();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar la teleconsulta');
    }
  };

  const handleIniciarVideollamada = async (teleconsulta: Teleconsulta) => {
    if (!window.confirm('¿Desea iniciar la videollamada ahora?')) {
      return;
    }

    try {
      const respuesta = await iniciarSesionVideollamada(teleconsulta._id!);
      // Actualizar el estado de la teleconsulta
      await actualizarTeleconsulta(teleconsulta._id!, { estado: 'En Curso' });
      
      // Abrir el enlace en una nueva ventana
      window.open(respuesta.url, '_blank');
      
      // Recargar teleconsultas para actualizar el estado
      await cargarTeleconsultas();
    } catch (err: any) {
      alert(err.message || 'Error al iniciar la videollamada');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Agenda de Teleconsultas</h1>
              <p className="text-gray-600">
                Gestiona las consultas odontológicas a distancia de manera eficiente
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cargarTeleconsultas}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </button>
              <button
                onClick={handleNuevaTeleconsulta}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Nueva Teleconsulta
              </button>
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filtros (simplificado) */}
        <div className="mb-6 bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filtros</h3>
            <select
              value={filtros.estado || ''}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  estado: e.target.value || undefined,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="Programada">Programada</option>
              <option value="Confirmada">Confirmada</option>
              <option value="En Curso">En Curso</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
              <option value="No Asistió">No Asistió</option>
            </select>
            <select
              value={filtros.odontologoId || ''}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  odontologoId: e.target.value || undefined,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los odontólogos</option>
              {odontologos.map((odontologo) => (
                <option key={odontologo._id} value={odontologo._id}>
                  {odontologo.nombre} {odontologo.apellidos}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendario de Teleconsultas */}
        <CalendarioTeleconsultasView
          teleconsultas={teleconsultas}
          fechaSeleccionada={fechaSeleccionada}
          onFechaChange={setFechaSeleccionada}
          onTeleconsultaClick={handleEditarTeleconsulta}
          onIniciarVideollamada={handleIniciarVideollamada}
          loading={loading}
        />

        {/* Modal para gestionar teleconsulta */}
        <ModalGestionarTeleconsulta
          isOpen={mostrarModal}
          onClose={() => {
            setMostrarModal(false);
            setTeleconsultaSeleccionada(null);
          }}
          teleconsulta={teleconsultaSeleccionada}
          onGuardar={handleGuardarTeleconsulta}
          pacientes={pacientes}
          odontologos={odontologos}
        />
      </div>
    </div>
  );
}

