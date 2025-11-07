import { useState, useEffect } from 'react';
import { Plus, RefreshCw, AlertCircle, Wrench } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Autoclave,
  FiltrosAutoclaves,
  obtenerAutoclaves,
  crearAutoclave,
  actualizarAutoclave,
  NuevoAutoclave,
  ActualizarAutoclave,
} from '../api/mantenimientoAutoclaveApi';
import TablaAutoclaves from '../components/TablaAutoclaves';
import ModalDetalleAutoclave from '../components/ModalDetalleAutoclave';
import AlertaProximoMantenimiento from '../components/AlertaProximoMantenimiento';
import FormularioRegistroMantenimiento from '../components/FormularioRegistroMantenimiento';

export default function MantenimientoAutoclavesPage() {
  const { user } = useAuth();
  const [autoclaves, setAutoclaves] = useState<Autoclave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false);
  const [autoclaveSeleccionado, setAutoclaveSeleccionado] = useState<Autoclave | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [autoclaveEditando, setAutoclaveEditando] = useState<Autoclave | null>(null);
  const [mostrarFormularioMantenimiento, setMostrarFormularioMantenimiento] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosAutoclaves>({});

  useEffect(() => {
    cargarAutoclaves();
  }, [filtros]);

  const cargarAutoclaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const datos = await obtenerAutoclaves(filtros);
      setAutoclaves(datos);
    } catch (err: any) {
      console.error('Error al cargar autoclaves:', err);
      setError(err.message || 'Error al cargar los autoclaves. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearAutoclave = async (autoclave: NuevoAutoclave) => {
    try {
      setError(null);
      await crearAutoclave(autoclave);
      setMostrarFormularioNuevo(false);
      await cargarAutoclaves();
    } catch (err: any) {
      console.error('Error al crear autoclave:', err);
      setError(err.message || 'Error al crear el autoclave');
    }
  };

  const handleVerDetalle = (autoclave: Autoclave) => {
    setAutoclaveSeleccionado(autoclave);
    setMostrarModalDetalle(true);
  };

  const handleRegistrarMantenimiento = (autoclave: Autoclave) => {
    setAutoclaveSeleccionado(autoclave);
    setMostrarFormularioMantenimiento(true);
  };

  const handleMantenimientoRegistrado = async () => {
    setMostrarFormularioMantenimiento(false);
    setAutoclaveSeleccionado(null);
    await cargarAutoclaves();
  };

  const handleEditarAutoclave = (autoclave: Autoclave) => {
    setAutoclaveEditando(autoclave);
    setMostrarFormularioNuevo(true);
  };

  const handleActualizarAutoclave = async (datos: ActualizarAutoclave) => {
    if (!autoclaveEditando?._id) return;

    try {
      setError(null);
      await actualizarAutoclave(autoclaveEditando._id, datos);
      setMostrarFormularioNuevo(false);
      setAutoclaveEditando(null);
      await cargarAutoclaves();
    } catch (err: any) {
      console.error('Error al actualizar autoclave:', err);
      setError(err.message || 'Error al actualizar el autoclave');
    }
  };

  // Formulario simple para crear/editar autoclave
  if (mostrarFormularioNuevo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {autoclaveEditando ? 'Editar Autoclave' : 'Nuevo Autoclave'}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const datos: NuevoAutoclave = {
                  nombre: formData.get('nombre') as string,
                  marca: formData.get('marca') as string,
                  modelo: formData.get('modelo') as string,
                  numeroSerie: formData.get('numeroSerie') as string,
                  fechaInstalacion: formData.get('fechaInstalacion') as string,
                  ubicacion: formData.get('ubicacion') as string,
                  proximoMantenimiento: formData.get('proximoMantenimiento') as string,
                  estado: (formData.get('estado') as any) || 'activo',
                };

                if (autoclaveEditando) {
                  await handleActualizarAutoclave(datos);
                } else {
                  await handleCrearAutoclave(datos);
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={autoclaveEditando?.nombre}
                    required
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Marca *</label>
                  <input
                    type="text"
                    name="marca"
                    defaultValue={autoclaveEditando?.marca}
                    required
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Modelo *</label>
                  <input
                    type="text"
                    name="modelo"
                    defaultValue={autoclaveEditando?.modelo}
                    required
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Número de Serie *</label>
                  <input
                    type="text"
                    name="numeroSerie"
                    defaultValue={autoclaveEditando?.numeroSerie}
                    required
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Instalación *</label>
                  <input
                    type="date"
                    name="fechaInstalacion"
                    defaultValue={
                      autoclaveEditando?.fechaInstalacion
                        ? new Date(autoclaveEditando.fechaInstalacion).toISOString().split('T')[0]
                        : ''
                    }
                    required
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Próximo Mantenimiento *</label>
                  <input
                    type="date"
                    name="proximoMantenimiento"
                    defaultValue={
                      autoclaveEditando?.proximoMantenimiento
                        ? new Date(autoclaveEditando.proximoMantenimiento).toISOString().split('T')[0]
                        : ''
                    }
                    required
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ubicación *</label>
                  <input
                    type="text"
                    name="ubicacion"
                    defaultValue={autoclaveEditando?.ubicacion}
                    required
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Estado *</label>
                  <select
                    name="estado"
                    defaultValue={autoclaveEditando?.estado || 'activo'}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="en_reparacion">En Reparación</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormularioNuevo(false);
                    setAutoclaveEditando(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {autoclaveEditando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de mantenimiento
  if (mostrarFormularioMantenimiento && autoclaveSeleccionado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <FormularioRegistroMantenimiento
              autoclaveId={autoclaveSeleccionado._id!}
              onGuardar={handleMantenimientoRegistrado}
              onCancelar={() => {
                setMostrarFormularioMantenimiento(false);
                setAutoclaveSeleccionado(null);
              }}
            />
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
                  <Wrench size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Mantenimiento de Autoclaves
                  </h1>
                  <p className="text-gray-600">
                    Gestión del ciclo de vida, estado e historial de mantenimiento de los equipos de esterilización
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={cargarAutoclaves}
                  disabled={loading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  <span>Actualizar</span>
                </button>
                <button
                  onClick={() => setMostrarFormularioNuevo(true)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <Plus size={20} />
                  <span>Nuevo Autoclave</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Alertas */}
          <AlertaProximoMantenimiento autoclaves={autoclaves} />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {/* Tabla de Autoclaves */}
          <TablaAutoclaves
            autoclaves={autoclaves}
            loading={loading}
            onVerDetalle={handleVerDetalle}
            onRegistrarMantenimiento={handleRegistrarMantenimiento}
            filtros={filtros}
            onFiltrosChange={setFiltros}
          />
        </div>
      </div>

      {/* Modal de Detalle */}
      {mostrarModalDetalle && autoclaveSeleccionado && (
        <ModalDetalleAutoclave
          autoclaveId={autoclaveSeleccionado._id!}
          onCerrar={() => {
            setMostrarModalDetalle(false);
            setAutoclaveSeleccionado(null);
          }}
          onEditar={handleEditarAutoclave}
          onMantenimientoRegistrado={handleMantenimientoRegistrado}
        />
      )}
    </div>
  );
}



