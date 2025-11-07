import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Plus, Save, AlertCircle, User, Calendar, DollarSign, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando parte de avería...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !parte) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error || 'Parte de avería no encontrado'}</p>
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (modoEdicion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <FormularioCrearEditarParte
            parte={parte}
            clinicas={parte.clinica ? [{ _id: parte.clinicaId, nombre: parte.clinica.nombre }] : []}
            reportadoPor={user?._id || user?.name || ''}
            onGuardar={handleActualizar}
            onCancelar={() => setModoEdicion(false)}
            modoEdicion={true}
          />
        </div>
      </div>
    );
  }

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
                  <AlertCircle size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Parte de Avería #{parte._id?.slice(-6) || 'N/A'}
                  </h1>
                  <p className="text-gray-600">
                    Detalle del parte de avería y acciones correctivas
                  </p>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onVolver}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <ArrowLeft size={20} />
                  Volver
                </button>
                <button
                  onClick={() => setModoEdicion(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <Edit size={20} />
                  Editar
                </button>
                <button
                  onClick={() => setMostrarModalAsignarTecnico(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
                >
                  <User size={20} />
                  {parte.tecnicoAsignado ? 'Cambiar Técnico' : 'Asignar Técnico'}
                </button>
              </div>
            </div>
            
            {/* Badges de estado y prioridad */}
            <div className="flex items-center gap-3 mt-4">
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
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del parte */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Parte</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción del Problema
                  </label>
                  <p className="text-sm text-gray-900 whitespace-pre-line bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
                    {parte.descripcionProblema}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Calendar size={16} className="inline mr-1" />
                      Fecha de Avería
                    </label>
                    <p className="text-sm text-gray-900">{formatearFecha(parte.fechaAveria)}</p>
                  </div>
                  {parte.fechaResolucion && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Calendar size={16} className="inline mr-1" />
                        Fecha de Resolución
                      </label>
                      <p className="text-sm text-gray-900">{formatearFecha(parte.fechaResolucion)}</p>
                    </div>
                  )}
                </div>

                {parte.reportadoPorUsuario && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <User size={16} className="inline mr-1" />
                      Reportado por
                    </label>
                    <p className="text-sm text-gray-900">
                      {parte.reportadoPorUsuario.nombre}
                      {parte.reportadoPorUsuario.apellidos && ` ${parte.reportadoPorUsuario.apellidos}`}
                    </p>
                  </div>
                )}

                {parte.tecnicoAsignado && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <User size={16} className="inline mr-1" />
                      Técnico Asignado
                    </label>
                    <p className="text-sm text-gray-900">{parte.tecnicoAsignado}</p>
                  </div>
                )}

                {parte.costeTotal !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <DollarSign size={16} className="inline mr-1" />
                      Coste Total
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      €{parte.costeTotal.toFixed(2)}
                    </p>
                  </div>
                )}

                {parte.notas && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Notas Adicionales</label>
                    <p className="text-sm text-gray-900 whitespace-pre-line bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">{parte.notas}</p>
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Descripción de la Acción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={descripcionAccion}
                      onChange={(e) => setDescripcionAccion(e.target.value)}
                      rows={4}
                      placeholder="Describa la acción correctiva realizada..."
                      required
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Coste de Materiales (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={costeMateriales}
                        onChange={(e) => setCosteMateriales(e.target.value)}
                        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Horas de Trabajo
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={horasTrabajo}
                        onChange={(e) => setHorasTrabajo(e.target.value)}
                        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={guardandoCorrectivo || !descripcionAccion.trim()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
                    >
                      <Save size={20} />
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
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white shadow-sm ring-1 ring-slate-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setMostrarFormularioCorrectivo(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 text-gray-700 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
              >
                <Plus size={20} />
                Agregar Acción Correctiva
              </button>
            )}
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {parte.equipo && <VisorDetallesEquipoAveriado equipo={parte.equipo} />}
          </div>
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



