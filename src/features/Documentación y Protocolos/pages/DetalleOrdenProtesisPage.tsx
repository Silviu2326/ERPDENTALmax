import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, RefreshCw } from 'lucide-react';
import {
  obtenerProtesisPorId,
  actualizarEstadoProtesis,
  subirArchivoProtesis,
  añadirNotaComunicacion,
  Protesis,
  ActualizarEstadoProtesisData,
} from '../api/protesisApi';
import { useAuth } from '../../../contexts/AuthContext';
import TimelineEstadoProtesis from '../components/TimelineEstadoProtesis';
import VisorArchivosAdjuntosProtesis from '../components/VisorArchivosAdjuntosProtesis';
import ChatNotasProtesis from '../components/ChatNotasProtesis';
import ModalActualizarEstadoProtesis from '../components/ModalActualizarEstadoProtesis';

interface DetalleOrdenProtesisPageProps {
  ordenId: string;
  onVolver: () => void;
  onEditar?: (ordenId: string) => void;
}

export default function DetalleOrdenProtesisPage({
  ordenId,
  onVolver,
  onEditar,
}: DetalleOrdenProtesisPageProps) {
  const { user } = useAuth();
  const [orden, setOrden] = useState<Protesis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalEstado, setMostrarModalEstado] = useState(false);

  const cargarOrden = async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerProtesisPorId(ordenId);
      setOrden(datos);
    } catch (err) {
      console.error('Error al cargar orden:', err);
      setError('Error al cargar los detalles de la orden. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrden();
  }, [ordenId]);

  const handleActualizarEstado = async (data: ActualizarEstadoProtesisData) => {
    try {
      const ordenActualizada = await actualizarEstadoProtesis(ordenId, data);
      setOrden(ordenActualizada);
      setMostrarModalEstado(false);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  };

  const handleSubirArchivos = async (archivos: File[]) => {
    try {
      const ordenActualizada = await subirArchivoProtesis(ordenId, archivos);
      setOrden(ordenActualizada);
    } catch (error) {
      console.error('Error al subir archivos:', error);
      throw error;
    }
  };

  const handleEnviarNota = async (contenido: string, tipo: 'clinica' | 'laboratorio') => {
    try {
      const ordenActualizada = await añadirNotaComunicacion(ordenId, contenido, tipo);
      setOrden(ordenActualizada);
    } catch (error) {
      console.error('Error al enviar nota:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-600" />
          <p className="text-gray-600">Cargando detalles de la orden...</p>
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
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al listado</span>
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Orden no encontrada'}</p>
          </div>
        </div>
      </div>
    );
  }

  const esProtésico = user?.role === 'protesico' || user?.role === 'laboratorio';
  const tipoUsuario = esProtésico ? 'laboratorio' : 'clinica';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onVolver}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al listado</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detalle de Orden de Prótesis</h1>
              <p className="text-gray-600 mt-1">ID: {orden._id}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMostrarModalEstado(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Actualizar Estado
              </button>
              {onEditar && (
                <button
                  onClick={() => onEditar(ordenId)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Editar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información General</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Paciente</p>
                  <p className="font-semibold text-gray-900">
                    {orden.paciente.nombre} {orden.paciente.apellidos}
                  </p>
                  {orden.paciente.dni && (
                    <p className="text-sm text-gray-600">DNI: {orden.paciente.dni}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Odontólogo</p>
                  <p className="font-semibold text-gray-900">
                    {orden.odontologo.nombre} {orden.odontologo.apellidos}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Laboratorio</p>
                  <p className="font-semibold text-gray-900">{orden.laboratorio.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tratamiento</p>
                  <p className="font-semibold text-gray-900">{orden.tratamiento.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Prótesis</p>
                  <p className="font-semibold text-gray-900">{orden.tipoProtesis}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Material / Color</p>
                  <p className="font-semibold text-gray-900">
                    {orden.material} - {orden.color}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado Actual</p>
                  <p className="font-semibold text-blue-600">{orden.estado}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Creación</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(orden.fechaCreacion).toLocaleDateString('es-ES')}
                  </p>
                </div>
                {orden.fechaPrevistaEntrega && (
                  <div>
                    <p className="text-sm text-gray-500">Fecha Prevista de Entrega</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(orden.fechaPrevistaEntrega).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
              </div>

              {orden.notasClinica && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Notas de Clínica</p>
                  <p className="text-gray-900">{orden.notasClinica}</p>
                </div>
              )}

              {orden.notasLaboratorio && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Notas de Laboratorio</p>
                  <p className="text-gray-900">{orden.notasLaboratorio}</p>
                </div>
              )}
            </div>

            {/* Archivos Adjuntos */}
            <VisorArchivosAdjuntosProtesis
              archivos={orden.archivosAdjuntos}
              onSubirArchivos={handleSubirArchivos}
              puedeSubir={true}
            />

            {/* Chat de Notas */}
            <ChatNotasProtesis
              notas={orden.notasComunicacion || []}
              onEnviarNota={handleEnviarNota}
              tipoUsuario={tipoUsuario}
            />
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Timeline de Estados */}
            <TimelineEstadoProtesis
              historial={orden.historialEstados}
              estadoActual={orden.estado}
            />
          </div>
        </div>
      </div>

      {/* Modal de Actualizar Estado */}
      <ModalActualizarEstadoProtesis
        estadoActual={orden.estado}
        onActualizar={handleActualizarEstado}
        onCerrar={() => setMostrarModalEstado(false)}
        isOpen={mostrarModalEstado}
      />
    </div>
  );
}


