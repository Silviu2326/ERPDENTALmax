import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Plus, Save, AlertCircle, User, Calendar, DollarSign } from 'lucide-react';
import {
  ParteAveria,
  obtenerParteAveriaPorId,
  actualizarParteAveria,
  agregarAccionCorrectiva,
  ActualizarParteAveria,
  NuevaAccionCorrectiva,
} from '../api/partesAveriaApi';
import { useAuth } from '../../../contexts/AuthContext';
import VisorDetallesEquipoAveriado from '../components/VisorDetallesEquipoAveriado';
import TimelineHistorialCorrectivos from '../components/TimelineHistorialCorrectivos';
import ModalAsignarTecnico from '../components/ModalAsignarTecnico';
import FormularioCrearEditarParte from '../components/FormularioCrearEditarParte';

interface DetalleParteAveriaPageProps {
  parteId: string;
  onVolver: () => void;
  onEditar?: (parte: ParteAveria) => void;
}

export default function DetalleParteAveriaPage({
  parteId,
  onVolver,
  onEditar,
}: DetalleParteAveriaPageProps) {
  const { user } = useAuth();
  const [parte, setParte] = useState<ParteAveria | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarModalAsignarTecnico, setMostrarModalAsignarTecnico] = useState(false);
  const [mostrarFormularioCorrectivo, setMostrarFormularioCorrectivo] = useState(false);

  // Formulario de acción correctiva
  const [descripcionAccion, setDescripcionAccion] = useState('');
  const [costeMateriales, setCosteMateriales] = useState('');
  const [horasTrabajo, setHorasTrabajo] = useState('');
  const [guardandoCorrectivo, setGuardandoCorrectivo] = useState(false);

  const cargarParte = async () => {
    setLoading(true);
    setError(null);
    try {
      const parteData = await obtenerParteAveriaPorId(parteId);
      setParte(parteData);
    } catch (err) {
      console.error('Error al cargar parte:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el parte de avería');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarParte();
  }, [parteId]);

  const handleActualizar = async (datos: ActualizarParteAveria) => {
    try {
      const parteActualizado = await actualizarParteAveria(parteId, datos);
      setParte(parteActualizado);
      setModoEdicion(false);
      if (onEditar) {
        onEditar(parteActualizado);
      }
    } catch (err) {
      console.error('Error al actualizar parte:', err);
      throw err;
    }
  };

  const handleAsignarTecnico = async (tecnico: string) => {
    try {
      const parteActualizado = await actualizarParteAveria(parteId, {
        tecnicoAsignado: tecnico || undefined,
      });
      setParte(parteActualizado);
      setMostrarModalAsignarTecnico(false);
    } catch (err) {
      console.error('Error al asignar técnico:', err);
      alert('Error al asignar técnico');
    }
  };

  const handleAgregarCorrectivo = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoCorrectivo(true);
    try {
      const correctivo: NuevaAccionCorrectiva = {
        descripcionAccion: descripcionAccion.trim(),
        costeMateriales: costeMateriales ? parseFloat(costeMateriales) : undefined,
        horasTrabajo: horasTrabajo ? parseFloat(horasTrabajo) : undefined,
        realizadoPor: user?.name || user?._id || 'Usuario',
      };

      const parteActualizado = await agregarAccionCorrectiva(parteId, correctivo);
      setParte(parteActualizado);
      setMostrarFormularioCorrectivo(false);
      setDescripcionAccion('');
      setCosteMateriales('');
      setHorasTrabajo('');
    } catch (err) {
      console.error('Error al agregar correctivo:', err);
      alert('Error al agregar la acción correctiva');
    } finally {
      setGuardandoCorrectivo(false);
    }
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'Abierto':
        return 'bg-yellow-100 text-yellow-800';
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800';
      case 'Resuelto':
        return 'bg-green-100 text-green-800';
      case 'Cerrado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadBadgeClass = (prioridad: string) => {
    switch (prioridad) {
      case 'Baja':
        return 'bg-green-100 text-green-800';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alta':
        return 'bg-orange-100 text-orange-800';
      case 'Crítica':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatearFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return fecha;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500 py-12">Cargando parte de avería...</div>
      </div>
    );
  }

  if (error || !parte) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span>{error || 'Parte de avería no encontrado'}</span>
        </div>
        <button
          onClick={onVolver}
          className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    );
  }

  if (modoEdicion) {
    return (
      <div className="p-6">
        <FormularioCrearEditarParte
          parte={parte}
          clinicas={parte.clinica ? [{ _id: parte.clinicaId, nombre: parte.clinica.nombre }] : []}
          reportadoPor={user?._id || user?.name || ''}
          onGuardar={handleActualizar}
          onCancelar={() => setModoEdicion(false)}
          modoEdicion={true}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onVolver}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la lista
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              Parte de Avería #{parte._id?.slice(-6) || 'N/A'}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadgeClass(
                  parte.estado
                )}`}
              >
                {parte.estado}
              </span>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPrioridadBadgeClass(
                  parte.prioridad
                )}`}
              >
                {parte.prioridad}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setModoEdicion(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => setMostrarModalAsignarTecnico(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <User className="w-4 h-4" />
              {parte.tecnicoAsignado ? 'Cambiar Técnico' : 'Asignar Técnico'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del parte */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Parte</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción del Problema</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {parte.descripcionProblema}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Fecha de Avería
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{formatearFecha(parte.fechaAveria)}</p>
                </div>
                {parte.fechaResolucion && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Fecha de Resolución
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{formatearFecha(parte.fechaResolucion)}</p>
                  </div>
                )}
              </div>

              {parte.reportadoPorUsuario && (
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Reportado por
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {parte.reportadoPorUsuario.nombre}
                    {parte.reportadoPorUsuario.apellidos && ` ${parte.reportadoPorUsuario.apellidos}`}
                  </p>
                </div>
              )}

              {parte.tecnicoAsignado && (
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Técnico Asignado
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{parte.tecnicoAsignado}</p>
                </div>
              )}

              {parte.costeTotal !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Coste Total
                  </label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    €{parte.costeTotal.toFixed(2)}
                  </p>
                </div>
              )}

              {parte.notas && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notas Adicionales</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{parte.notas}</p>
                </div>
              )}
            </div>
          </div>

          {/* Historial de correctivos */}
          <TimelineHistorialCorrectivos correctivos={parte.historialCorrectivos || []} />

          {/* Formulario para agregar correctivo */}
          {mostrarFormularioCorrectivo ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Agregar Acción Correctiva
              </h3>
              <form onSubmit={handleAgregarCorrectivo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción de la Acción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={descripcionAccion}
                    onChange={(e) => setDescripcionAccion(e.target.value)}
                    rows={4}
                    placeholder="Describa la acción correctiva realizada..."
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coste de Materiales (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={costeMateriales}
                      onChange={(e) => setCosteMateriales(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horas de Trabajo
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={horasTrabajo}
                      onChange={(e) => setHorasTrabajo(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={guardandoCorrectivo || !descripcionAccion.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormularioCorrectivo(false);
                      setDescripcionAccion('');
                      setCosteMateriales('');
                      setHorasTrabajo('');
                    }}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setMostrarFormularioCorrectivo(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Agregar Acción Correctiva
            </button>
          )}
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          {parte.equipo && <VisorDetallesEquipoAveriado equipo={parte.equipo} />}
        </div>
      </div>

      {/* Modal para asignar técnico */}
      <ModalAsignarTecnico
        isOpen={mostrarModalAsignarTecnico}
        onClose={() => setMostrarModalAsignarTecnico(false)}
        onConfirmar={handleAsignarTecnico}
        tecnicoActual={parte.tecnicoAsignado}
        tecnicosDisponibles={[]} // En producción vendría de una API
      />
    </div>
  );
}


