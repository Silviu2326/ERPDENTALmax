import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Plus, Calendar, Building2, Loader2, AlertCircle } from 'lucide-react';
import {
  obtenerEmpresaPorId,
  actualizarEmpresa,
  eliminarEmpresa,
  añadirContactoAEmpresa,
  crearCampanaParaEmpresa,
  registrarInteraccion,
  EmpresaObjetivo,
  EstadoEmpresa,
  CrearContactoRequest,
  CrearCampanaRequest,
  CrearInteraccionRequest,
} from '../api/abmApi';
import AbmEmpresaProfileCard from '../components/AbmEmpresaProfileCard';
import AbmContactManager from '../components/AbmContactManager';
import AbmCampaignForm from '../components/AbmCampaignForm';
import AbmInteractionLog from '../components/AbmInteractionLog';

interface AbmEmpresaDetailPageProps {
  empresaId: string;
  onVolver: () => void;
}

export default function AbmEmpresaDetailPage({
  empresaId,
  onVolver,
}: AbmEmpresaDetailPageProps) {
  const [empresa, setEmpresa] = useState<EmpresaObjetivo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormularioCampana, setMostrarFormularioCampana] = useState(false);

  useEffect(() => {
    cargarEmpresa();
  }, [empresaId]);

  const cargarEmpresa = async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerEmpresaPorId(empresaId);
      setEmpresa(datos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la empresa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarEstado = async (nuevoEstado: EstadoEmpresa) => {
    if (!empresa?._id) return;
    setLoading(true);
    setError(null);
    try {
      const actualizada = await actualizarEmpresa(empresa._id, { estado: nuevoEstado });
      setEmpresa(actualizada);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAñadirContacto = async (datos: CrearContactoRequest) => {
    if (!empresa?._id) return;
    await añadirContactoAEmpresa(empresa._id, datos);
    await cargarEmpresa();
  };

  const handleCrearCampana = async (datos: CrearCampanaRequest) => {
    if (!empresa?._id) return;
    await crearCampanaParaEmpresa(empresa._id, datos);
    setMostrarFormularioCampana(false);
    await cargarEmpresa();
  };

  const handleRegistrarInteraccion = async (datos: CrearInteraccionRequest) => {
    if (!empresa?._id) return;
    await registrarInteraccion(empresa._id, datos);
    await cargarEmpresa();
  };

  const handleEliminarEmpresa = async () => {
    if (!empresa?._id) return;
    if (!confirm('¿Estás seguro de eliminar esta empresa? Esta acción no se puede deshacer.')) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await eliminarEmpresa(empresa._id);
      onVolver();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la empresa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !empresa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando empresa...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">No se encontró la empresa solicitada</p>
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              <ArrowLeft size={20} />
              <span>Volver al dashboard</span>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Building2 size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {empresa.nombre}
                  </h1>
                  <p className="text-gray-600">
                    Detalle de empresa objetivo - ABM
                  </p>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onVolver}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/70 rounded-xl transition-all"
                >
                  <ArrowLeft size={18} />
                  <span>Volver</span>
                </button>
                <select
                  value={empresa.estado}
                  onChange={(e) => handleActualizarEstado(e.target.value as EstadoEmpresa)}
                  className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2 text-sm font-medium"
                >
                  <option value="Identificada">Identificada</option>
                  <option value="Contactada">Contactada</option>
                  <option value="Negociando">Negociando</option>
                  <option value="Cliente">Cliente</option>
                  <option value="Descartada">Descartada</option>
                </select>
                <button
                  onClick={handleEliminarEmpresa}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
                >
                  <Trash2 size={18} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {error && (
            <div className="bg-white shadow-sm rounded-lg p-4 border-l-4 border-red-500">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-red-500" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <AbmEmpresaProfileCard empresa={empresa} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AbmContactManager
              contactos={empresa.contactos || []}
              onAñadirContacto={handleAñadirContacto}
            />

            <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Campañas</h3>
                <button
                  onClick={() => setMostrarFormularioCampana(!mostrarFormularioCampana)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  <Plus size={18} />
                  <span>Nueva Campaña</span>
                </button>
              </div>

              {mostrarFormularioCampana && (
                <AbmCampaignForm
                  onSubmit={handleCrearCampana}
                  onCancelar={() => setMostrarFormularioCampana(false)}
                />
              )}

              {empresa.campañasAsociadas && empresa.campañasAsociadas.length > 0 ? (
                <div className="space-y-3">
                  {empresa.campañasAsociadas.map((campana) => (
                    <div
                      key={campana._id}
                      className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{campana.nombre}</h4>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            campana.estado === 'Activa'
                              ? 'bg-green-100 text-green-700'
                              : campana.estado === 'Finalizada'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {campana.estado}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{new Date(campana.fechaInicio).toLocaleDateString('es-ES')}</span>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                          {campana.tipo}
                        </span>
                      </div>
                      {campana.contenido && (
                        <p className="text-sm text-gray-700 mt-2">{campana.contenido}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                !mostrarFormularioCampana && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No hay campañas registradas</p>
                  </div>
                )
              )}
            </div>
          </div>

          <AbmInteractionLog
            interacciones={empresa.historialInteracciones || []}
            contactos={empresa.contactos || []}
            onRegistrarInteraccion={handleRegistrarInteraccion}
          />
        </div>
      </div>
    </div>
  );
}



