import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Plus, Calendar } from 'lucide-react';
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
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-4">Cargando empresa...</p>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          No se encontró la empresa solicitada
        </div>
        <button
          onClick={onVolver}
          className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onVolver}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Dashboard</span>
        </button>
        <div className="flex gap-2">
          <select
            value={empresa.estado}
            onChange={(e) => handleActualizarEstado(e.target.value as EstadoEmpresa)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Identificada">Identificada</option>
            <option value="Contactada">Contactada</option>
            <option value="Negociando">Negociando</option>
            <option value="Cliente">Cliente</option>
            <option value="Descartada">Descartada</option>
          </select>
          <button
            onClick={handleEliminarEmpresa}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <AbmEmpresaProfileCard empresa={empresa} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AbmContactManager
          contactos={empresa.contactos || []}
          onAñadirContacto={handleAñadirContacto}
        />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Campañas</h3>
            <button
              onClick={() => setMostrarFormularioCampana(!mostrarFormularioCampana)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Campaña</span>
            </button>
          </div>

          {mostrarFormularioCampana && (
            <AbmCampaignForm
              onSubmit={handleCrearCampana}
              onCancelar={() => setMostrarFormularioCampana(false)}
            />
          )}

          {empresa.campañasAsociadas && empresa.campañasAsociadas.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 space-y-3">
              {empresa.campañasAsociadas.map((campana) => (
                <div
                  key={campana._id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{campana.nombre}</h4>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
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
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(campana.fechaInicio).toLocaleDateString('es-ES')}</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {campana.tipo}
                    </span>
                  </div>
                  {campana.contenido && (
                    <p className="text-sm text-gray-700 mt-2">{campana.contenido}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AbmInteractionLog
        interacciones={empresa.historialInteracciones || []}
        contactos={empresa.contactos || []}
        onRegistrarInteraccion={handleRegistrarInteraccion}
      />
    </div>
  );
}


