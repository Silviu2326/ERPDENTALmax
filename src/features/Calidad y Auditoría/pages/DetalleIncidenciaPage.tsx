import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Save, X, AlertCircle, Package, User, Shield, Activity, Calendar, FileText, Loader2 } from 'lucide-react';
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
        return <Package size={24} />;
      case 'Incidencia Clínica':
        return <Activity size={24} />;
      case 'Queja Paciente':
        return <User size={24} />;
      case 'Incidente Seguridad':
        return <Shield size={24} />;
      default:
        return <AlertCircle size={24} />;
    }
  };

  const getEstadoBadge = (estado: Incidencia['estado']) => {
    const estilos = {
      Abierta: 'bg-red-100 text-red-800',
      'En Investigación': 'bg-yellow-100 text-yellow-800',
      Resuelta: 'bg-blue-100 text-blue-800',
      Cerrada: 'bg-green-100 text-green-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${estilos[estado] || 'bg-gray-100 text-gray-800'}`}
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm p-8 text-center rounded-xl">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando incidencia...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!incidencia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <button
            onClick={onVolver}
            className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
          <div className="bg-white shadow-sm p-8 text-center rounded-xl">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Incidencia no encontrada</h3>
            <p className="text-gray-600 mb-4">No se pudo cargar la información de la incidencia</p>
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
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Volver a la lista
            </button>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  {getTipoIcon(incidencia.tipo)}
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {incidencia.folio}
                  </h1>
                  <p className="text-gray-600">
                    {incidencia.tipo}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getEstadoBadge(incidencia.estado)}
                {isAdmin && (
                  <select
                    value={estadoEditando}
                    onChange={(e) => handleCambiarEstado(e.target.value as Incidencia['estado'])}
                    className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 text-sm"
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
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <div className="bg-white shadow-sm p-6 rounded-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información General</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{incidencia.descripcion_detallada}</p>
                </div>
                {incidencia.area_afectada && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Área Afectada</label>
                    <p className="text-gray-900">{incidencia.area_afectada}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Calendar size={16} className="inline mr-1" />
                      Fecha de Detección
                    </label>
                    <p className="text-gray-900">{formatFecha(incidencia.fecha_deteccion)}</p>
                  </div>
                  {incidencia.fecha_cierre && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Calendar size={16} className="inline mr-1" />
                        Fecha de Cierre
                      </label>
                      <p className="text-gray-900">{formatFecha(incidencia.fecha_cierre)}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Reportado por</label>
                  <p className="text-gray-900">
                    {incidencia.reportado_por?.nombre} {incidencia.reportado_por?.apellidos}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Clínica</label>
                  <p className="text-gray-900">{incidencia.clinica?.nombre}</p>
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
              <div className="bg-white shadow-sm p-6 rounded-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  Evidencia Adjunta
                </h2>
                <div className="space-y-2">
                  {incidencia.evidencia_adjunta.map((evidencia, index) => (
                    <a
                      key={evidencia._id || index}
                      href={evidencia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors ring-1 ring-slate-200"
                    >
                      <FileText size={16} className="text-slate-600" />
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
            <div className="bg-white shadow-sm p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Estado</p>
                  <div>{getEstadoBadge(incidencia.estado)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Tipo</p>
                  <p className="text-gray-900">{incidencia.tipo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Acciones Correctivas</p>
                  <p className="text-gray-900">
                    {incidencia.acciones_correctivas.length} total
                    {incidencia.acciones_correctivas.filter(a => a.completada).length > 0 && (
                      <span className="text-green-600 ml-2">
                        ({incidencia.acciones_correctivas.filter(a => a.completada).length} completadas)
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Acciones Preventivas</p>
                  <p className="text-gray-900">
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



