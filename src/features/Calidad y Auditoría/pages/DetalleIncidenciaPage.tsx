import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Save, X, AlertCircle, Package, User, Shield, Activity, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  obtenerIncidenciaPorId,
  actualizarIncidencia,
  Incidencia,
  AccionCorrectiva,
  AccionPreventiva,
} from '../api/incidenciasApi';
import AnalisisCausaRaizInput from '../components/AnalisisCausaRaizInput';
import PlanAccionCard from '../components/PlanAccionCard';

interface DetalleIncidenciaPageProps {
  incidenciaId: string;
  onVolver: () => void;
}

export default function DetalleIncidenciaPage({
  incidenciaId,
  onVolver,
}: DetalleIncidenciaPageProps) {
  const { user } = useAuth();
  const [incidencia, setIncidencia] = useState<Incidencia | null>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [estadoEditando, setEstadoEditando] = useState<string>('');

  useEffect(() => {
    cargarIncidencia();
  }, [incidenciaId]);

  const cargarIncidencia = async () => {
    try {
      setLoading(true);
      const data = await obtenerIncidenciaPorId(incidenciaId);
      setIncidencia(data);
      setEstadoEditando(data.estado);
    } catch (error) {
      console.error('Error al cargar incidencia:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarAnalisis = async (analisis: string) => {
    if (!incidencia?._id) return;
    try {
      await actualizarIncidencia(incidencia._id, { analisis_causa_raiz: analisis });
      cargarIncidencia();
    } catch (error) {
      console.error('Error al actualizar análisis:', error);
      throw error;
    }
  };

  const handleCambiarEstado = async (nuevoEstado: Incidencia['estado']) => {
    if (!incidencia?._id) return;
    try {
      const datos: any = { estado: nuevoEstado };
      if (nuevoEstado === 'Cerrada') {
        datos.fecha_cierre = new Date().toISOString();
      }
      await actualizarIncidencia(incidencia._id, datos);
      setEstadoEditando(nuevoEstado);
      cargarIncidencia();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado de la incidencia');
    }
  };

  const handleMarcarAccionCompletada = async (accionId: string, tipo: 'correctiva' | 'preventiva') => {
    if (!incidencia?._id) return;
    try {
      const acciones = tipo === 'correctiva' ? incidencia.acciones_correctivas : incidencia.acciones_preventivas;
      const accionActualizada = acciones.map(accion =>
        accion._id === accionId
          ? { ...accion, completada: true, fecha_completada: new Date().toISOString() }
          : accion
      );

      if (tipo === 'correctiva') {
        await actualizarIncidencia(incidencia._id, { acciones_correctivas: accionActualizada as AccionCorrectiva[] });
      } else {
        await actualizarIncidencia(incidencia._id, { acciones_preventivas: accionActualizada as AccionPreventiva[] });
      }

      cargarIncidencia();
    } catch (error) {
      console.error('Error al marcar acción como completada:', error);
      alert('Error al actualizar la acción');
    }
  };

  const getTipoIcon = (tipo: Incidencia['tipo']) => {
    switch (tipo) {
      case 'No Conformidad Producto':
        return <Package className="w-5 h-5" />;
      case 'Incidencia Clínica':
        return <Activity className="w-5 h-5" />;
      case 'Queja Paciente':
        return <User className="w-5 h-5" />;
      case 'Incidente Seguridad':
        return <Shield className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getEstadoBadge = (estado: Incidencia['estado']) => {
    const estilos = {
      Abierta: 'bg-red-100 text-red-800 border-red-300',
      'En Investigación': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Resuelta: 'bg-blue-100 text-blue-800 border-blue-300',
      Cerrada: 'bg-green-100 text-green-800 border-green-300',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${estilos[estado] || 'bg-gray-100 text-gray-800 border-gray-300'}`}
      >
        {estado}
      </span>
    );
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAdmin = user?.role === 'director' || user?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando incidencia...</p>
        </div>
      </div>
    );
  }

  if (!incidencia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onVolver}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Incidencia no encontrada</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onVolver}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la lista
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-red-600 to-orange-600 p-3 rounded-xl shadow-lg">
                {getTipoIcon(incidencia.tipo)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{incidencia.folio}</h1>
                <p className="text-gray-600">{incidencia.tipo}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getEstadoBadge(incidencia.estado)}
              {isAdmin && (
                <select
                  value={estadoEditando}
                  onChange={(e) => handleCambiarEstado(e.target.value as Incidencia['estado'])}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Abierta">Abierta</option>
                  <option value="En Investigación">En Investigación</option>
                  <option value="Resuelta">Resuelta</option>
                  <option value="Cerrada">Cerrada</option>
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información General</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Descripción</label>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">{incidencia.descripcion_detallada}</p>
                </div>
                {incidencia.area_afectada && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Área Afectada</label>
                    <p className="text-gray-900 mt-1">{incidencia.area_afectada}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha de Detección</label>
                    <p className="text-gray-900 mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatFecha(incidencia.fecha_deteccion)}
                    </p>
                  </div>
                  {incidencia.fecha_cierre && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha de Cierre</label>
                      <p className="text-gray-900 mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatFecha(incidencia.fecha_cierre)}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Reportado por</label>
                  <p className="text-gray-900 mt-1">
                    {incidencia.reportado_por?.nombre} {incidencia.reportado_por?.apellidos}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Clínica</label>
                  <p className="text-gray-900 mt-1">{incidencia.clinica?.nombre}</p>
                </div>
              </div>
            </div>

            {/* Análisis de Causa Raíz */}
            <AnalisisCausaRaizInput
              valor={incidencia.analisis_causa_raiz || ''}
              onGuardar={handleActualizarAnalisis}
              readonly={!isAdmin}
            />

            {/* Planes de Acción */}
            <PlanAccionCard
              tipo="correctiva"
              acciones={incidencia.acciones_correctivas}
              onMarcarCompletada={(id) => handleMarcarAccionCompletada(id, 'correctiva')}
              readonly={!isAdmin}
            />

            <PlanAccionCard
              tipo="preventiva"
              acciones={incidencia.acciones_preventivas}
              onMarcarCompletada={(id) => handleMarcarAccionCompletada(id, 'preventiva')}
              readonly={!isAdmin}
            />

            {/* Evidencia Adjunta */}
            {incidencia.evidencia_adjunta && incidencia.evidencia_adjunta.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Evidencia Adjunta
                </h2>
                <div className="space-y-2">
                  {incidencia.evidencia_adjunta.map((evidencia, index) => (
                    <a
                      key={evidencia._id || index}
                      href={evidencia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-900">{evidencia.nombre_archivo}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resumen Rápido */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <div className="mt-1">{getEstadoBadge(incidencia.estado)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="text-gray-900 mt-1">{incidencia.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Acciones Correctivas</p>
                  <p className="text-gray-900 mt-1">
                    {incidencia.acciones_correctivas.length} total
                    {incidencia.acciones_correctivas.filter(a => a.completada).length > 0 && (
                      <span className="text-green-600 ml-2">
                        ({incidencia.acciones_correctivas.filter(a => a.completada).length} completadas)
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Acciones Preventivas</p>
                  <p className="text-gray-900 mt-1">
                    {incidencia.acciones_preventivas.length} total
                    {incidencia.acciones_preventivas.filter(a => a.completada).length > 0 && (
                      <span className="text-green-600 ml-2">
                        ({incidencia.acciones_preventivas.filter(a => a.completada).length} completadas)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


