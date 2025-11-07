import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Download, Calendar, User, Building2, FileText, Loader2, AlertCircle } from 'lucide-react';
import { obtenerOrdenPorId, actualizarEstadoOrden, eliminarOrden, EstadoOrden, OrdenLaboratorio } from '../api/ordenesLaboratorioApi';
import TimelineEstadoOrden from '../components/TimelineEstadoOrden';
import UploaderArchivosAdjuntos from '../components/UploaderArchivosAdjuntos';
import { subirArchivosAdjuntos, eliminarArchivoAdjunto } from '../api/ordenesLaboratorioApi';

interface DetalleOrdenLaboratorioPageProps {
  ordenId: string;
  onVolver: () => void;
  onEditar?: (ordenId: string) => void;
}

const ESTADOS: EstadoOrden[] = [
  'Borrador',
  'Enviada',
  'Recibida',
  'En Proceso',
  'Control Calidad',
  'Enviada a Clínica',
  'Recibida en Clínica',
  'Completada',
];

const ESTADO_COLORS: Record<EstadoOrden, string> = {
  'Borrador': 'bg-gray-100 text-gray-800',
  'Enviada': 'bg-blue-100 text-blue-800',
  'Recibida': 'bg-yellow-100 text-yellow-800',
  'En Proceso': 'bg-orange-100 text-orange-800',
  'Control Calidad': 'bg-purple-100 text-purple-800',
  'Enviada a Clínica': 'bg-indigo-100 text-indigo-800',
  'Recibida en Clínica': 'bg-green-100 text-green-800',
  'Completada': 'bg-emerald-100 text-emerald-800',
};

export default function DetalleOrdenLaboratorioPage({
  ordenId,
  onVolver,
  onEditar,
}: DetalleOrdenLaboratorioPageProps) {
  const [orden, setOrden] = useState<OrdenLaboratorio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoOrden | ''>('');
  const [notasCambioEstado, setNotasCambioEstado] = useState('');

  useEffect(() => {
    cargarOrden();
  }, [ordenId]);

  const cargarOrden = async () => {
    setLoading(true);
    setError(null);
    try {
      const ordenData = await obtenerOrdenPorId(ordenId);
      setOrden(ordenData);
      setNuevoEstado(ordenData.estado);
    } catch (err) {
      console.error('Error al cargar orden:', err);
      setError('Error al cargar los detalles de la orden');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async () => {
    if (!nuevoEstado || !orden?._id) return;

    if (nuevoEstado === orden.estado) {
      alert('El estado seleccionado es el mismo que el actual');
      return;
    }

    setCambiandoEstado(true);
    try {
      const ordenActualizada = await actualizarEstadoOrden(orden._id, nuevoEstado, notasCambioEstado || undefined);
      setOrden(ordenActualizada);
      setNotasCambioEstado('');
      alert('Estado actualizado correctamente');
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al actualizar el estado');
    } finally {
      setCambiandoEstado(false);
    }
  };

  const handleEliminar = async () => {
    if (!orden?._id) return;

    if (!confirm('¿Está seguro de que desea eliminar esta orden?')) {
      return;
    }

    try {
      await eliminarOrden(orden._id);
      alert('Orden eliminada correctamente');
      onVolver();
    } catch (err) {
      console.error('Error al eliminar orden:', err);
      alert('Error al eliminar la orden');
    }
  };

  const handleSubirArchivos = async (files: File[]) => {
    if (!orden?._id) return;

    try {
      const nuevosArchivos = await subirArchivosAdjuntos(orden._id, files);
      setOrden({
        ...orden,
        adjuntos: [...orden.adjuntos, ...nuevosArchivos],
      });
    } catch (error) {
      console.error('Error al subir archivos:', error);
      alert('Error al subir los archivos');
    }
  };

  const handleEliminarArchivo = async (archivoId: string) => {
    if (!orden?._id) return;

    try {
      await eliminarArchivoAdjunto(orden._id, archivoId);
      setOrden({
        ...orden,
        adjuntos: orden.adjuntos.filter((a) => a._id !== archivoId),
      });
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      alert('Error al eliminar el archivo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando detalles de la orden...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error || 'Orden no encontrada'}</p>
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Volver a Órdenes</span>
            </button>
          </div>
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
            <button
              onClick={onVolver}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver a Órdenes</span>
            </button>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileText size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Orden de Laboratorio #{orden._id?.slice(-6)}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-gray-600">
                      Detalles y seguimiento de la orden
                    </p>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        ESTADO_COLORS[orden.estado] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {orden.estado}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onEditar && (
                  <button
                    onClick={() => onEditar(orden._id!)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm"
                  >
                    <Edit size={20} />
                    <span>Editar</span>
                  </button>
                )}
                <button
                  onClick={handleEliminar}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-sm"
                >
                  <Trash2 size={20} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de la Orden */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información de la Orden</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    Paciente
                  </label>
                  <p className="text-gray-900 font-medium">
                    {orden.paciente.nombre} {orden.paciente.apellidos}
                  </p>
                  {orden.paciente.dni && (
                    <p className="text-sm text-gray-600 mt-1">DNI: {orden.paciente.dni}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Building2 size={16} className="inline mr-1" />
                    Laboratorio
                  </label>
                  <p className="text-gray-900 font-medium">{orden.laboratorio.nombre}</p>
                  {orden.laboratorio.personaContacto && (
                    <p className="text-sm text-gray-600 mt-1">{orden.laboratorio.personaContacto}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <FileText size={16} className="inline mr-1" />
                    Tipo de Trabajo
                  </label>
                  <p className="text-gray-900">{orden.tipoTrabajo}</p>
                </div>

                {orden.materiales && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Materiales
                    </label>
                    <p className="text-gray-900">{orden.materiales}</p>
                  </div>
                )}

                {orden.color && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Color
                    </label>
                    <p className="text-gray-900">{orden.color}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Creación
                  </label>
                  <p className="text-gray-900">
                    {new Date(orden.fechaCreacion).toLocaleString('es-ES')}
                  </p>
                </div>

                {orden.fechaEntregaPrevista && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Entrega Prevista
                    </label>
                    <p className="text-gray-900">
                      {new Date(orden.fechaEntregaPrevista).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
              </div>

              {orden.instrucciones && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Instrucciones
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">{orden.instrucciones}</p>
                </div>
              )}
            </div>

            {/* Archivos Adjuntos */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Archivos Adjuntos</h2>
              <UploaderArchivosAdjuntos
                archivos={orden.adjuntos || []}
                onArchivosSubidos={handleSubirArchivos}
                onEliminarArchivo={handleEliminarArchivo}
              />
            </div>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Cambiar Estado */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Estado</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nuevo Estado
                  </label>
                  <select
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value as EstadoOrden)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  >
                    {ESTADOS.map((est) => (
                      <option key={est} value={est}>
                        {est}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={notasCambioEstado}
                    onChange={(e) => setNotasCambioEstado(e.target.value)}
                    rows={3}
                    placeholder="Notas sobre el cambio de estado..."
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 resize-none"
                  />
                </div>
                <button
                  onClick={handleCambiarEstado}
                  disabled={cambiandoEstado || nuevoEstado === orden.estado}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cambiandoEstado ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Actualizando...</span>
                    </>
                  ) : (
                    'Actualizar Estado'
                  )}
                </button>
              </div>
            </div>

            {/* Historial de Estados */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <TimelineEstadoOrden historial={orden.historialEstados || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



