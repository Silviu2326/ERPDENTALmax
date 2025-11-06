import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Download, Calendar, User, Building2, FileText } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando detalles de la orden...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onVolver}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error || 'Orden no encontrada'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onVolver}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Órdenes</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Orden de Laboratorio #{orden._id?.slice(-6)}
              </h1>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  ESTADO_COLORS[orden.estado] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {orden.estado}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {onEditar && (
                <button
                  onClick={() => onEditar(orden._id!)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Editar</span>
                </button>
              )}
              <button
                onClick={handleEliminar}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de la Orden */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de la Orden</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Paciente</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {orden.paciente.nombre} {orden.paciente.apellidos}
                  </p>
                  {orden.paciente.dni && (
                    <p className="text-sm text-gray-500">DNI: {orden.paciente.dni}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Laboratorio</span>
                  </div>
                  <p className="text-gray-900 font-medium">{orden.laboratorio.nombre}</p>
                  {orden.laboratorio.personaContacto && (
                    <p className="text-sm text-gray-500">{orden.laboratorio.personaContacto}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Tipo de Trabajo</span>
                  </div>
                  <p className="text-gray-900">{orden.tipoTrabajo}</p>
                </div>

                {orden.materiales && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Materiales</span>
                    <p className="text-gray-900">{orden.materiales}</p>
                  </div>
                )}

                {orden.color && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Color</span>
                    <p className="text-gray-900">{orden.color}</p>
                  </div>
                )}

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Fecha Creación</span>
                  </div>
                  <p className="text-gray-900">
                    {new Date(orden.fechaCreacion).toLocaleString('es-ES')}
                  </p>
                </div>

                {orden.fechaEntregaPrevista && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Entrega Prevista</span>
                    <p className="text-gray-900">
                      {new Date(orden.fechaEntregaPrevista).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
              </div>

              {orden.instrucciones && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-600 block mb-2">Instrucciones</span>
                  <p className="text-gray-900 whitespace-pre-wrap">{orden.instrucciones}</p>
                </div>
              )}
            </div>

            {/* Archivos Adjuntos */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Archivos Adjuntos</h2>
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
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Estado</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nuevo Estado
                  </label>
                  <select
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value as EstadoOrden)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {ESTADOS.map((est) => (
                      <option key={est} value={est}>
                        {est}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={notasCambioEstado}
                    onChange={(e) => setNotasCambioEstado(e.target.value)}
                    rows={3}
                    placeholder="Notas sobre el cambio de estado..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleCambiarEstado}
                  disabled={cambiandoEstado || nuevoEstado === orden.estado}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cambiandoEstado ? 'Actualizando...' : 'Actualizar Estado'}
                </button>
              </div>
            </div>

            {/* Historial de Estados */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <TimelineEstadoOrden historial={orden.historialEstados || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


