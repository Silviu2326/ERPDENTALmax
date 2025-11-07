import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, RefreshCw, Package, AlertCircle, Loader2 } from 'lucide-react';
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
            <span>Volver al listado</span>
          </button>
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error || 'Orden no encontrada'}</p>
          </div>
        </div>
      </div>
    );
  }

  const esProtésico = user?.role === 'protesico' || user?.role === 'laboratorio';
  const tipoUsuario = esProtésico ? 'laboratorio' : 'clinica';

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
              <span>Volver al listado</span>
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Package size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Detalle de Orden de Prótesis
                  </h1>
                  <p className="text-gray-600">ID: {orden._id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMostrarModalEstado(true)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  Actualizar Estado
                </button>
                {onEditar && (
                  <button
                    onClick={() => onEditar(ordenId)}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-slate-600 text-white hover:bg-slate-700 shadow-sm"
                  >
                    <Edit size={18} />
                    <span>Editar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información General */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Información General</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Paciente</p>
                    <p className="font-semibold text-gray-900">
                      {orden.paciente.nombre} {orden.paciente.apellidos}
                    </p>
                    {orden.paciente.dni && (
                      <p className="text-sm text-gray-600 mt-1">DNI: {orden.paciente.dni}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Odontólogo</p>
                    <p className="font-semibold text-gray-900">
                      {orden.odontologo.nombre} {orden.odontologo.apellidos}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Laboratorio</p>
                    <p className="font-semibold text-gray-900">{orden.laboratorio.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Tratamiento</p>
                    <p className="font-semibold text-gray-900">{orden.tratamiento.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Tipo de Prótesis</p>
                    <p className="font-semibold text-gray-900">{orden.tipoProtesis}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Material / Color</p>
                    <p className="font-semibold text-gray-900">
                      {orden.material} - {orden.color}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Estado Actual</p>
                    <p className="font-semibold text-blue-600">{orden.estado}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Fecha de Creación</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(orden.fechaCreacion).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  {orden.fechaPrevistaEntrega && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Fecha Prevista de Entrega</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(orden.fechaPrevistaEntrega).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}
                </div>

                {orden.notasClinica && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-slate-700 mb-2">Notas de Clínica</p>
                    <p className="text-gray-900">{orden.notasClinica}</p>
                  </div>
                )}

                {orden.notasLaboratorio && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-slate-700 mb-2">Notas de Laboratorio</p>
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



