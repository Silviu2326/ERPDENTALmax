import { useState, useEffect } from 'react';
import { Building2, Plus, AlertCircle, ChevronLeft, ChevronRight, FileText, FileCheck, DollarSign, Handshake, X, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react';
import {
  obtenerMutuas,
  Mutua,
  FiltrosMutuas,
  PaginatedResponse,
  crearMutua,
  actualizarMutua,
  desactivarMutua,
  reactivarMutua,
  NuevaMutua,
} from '../api/mutuasApi';
import BarraBusquedaFiltros from '../components/BarraBusquedaFiltros';
import MutuasTable from '../components/MutuasTable';
import FormularioMutua from '../components/FormularioMutua';
import ConveniosAcuerdosPage from './ConveniosAcuerdosPage';
import AutorizacionesTratamientosPage from './AutorizacionesTratamientosPage';
import HistorialPagosSeguroPage from './HistorialPagosSeguroPage';
import AsistenteFacturacionPage from './AsistenteFacturacionPage';

interface GestionMutuasSegurosSaludPageProps {
  onAsistenteFacturacion?: () => void;
}

type TabType = 'mutuas' | 'convenios' | 'autorizaciones' | 'historial-pagos' | 'asistente-facturacion';

export default function GestionMutuasSegurosSaludPage({ onAsistenteFacturacion }: GestionMutuasSegurosSaludPageProps = { onAsistenteFacturacion: undefined }) {
  const [mutuas, setMutuas] = useState<Mutua[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosMutuas>({
    page: 1,
    limit: 10,
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mutuaEditando, setMutuaEditando] = useState<Mutua | null>(null);
  const [mutuaEliminar, setMutuaEliminar] = useState<Mutua | null>(null);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mutuaDetalle, setMutuaDetalle] = useState<Mutua | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('mutuas');

  const tabs = [
    { id: 'mutuas' as TabType, label: 'Listado de Mutuas', icon: Building2 },
    { id: 'convenios' as TabType, label: 'Convenios y Acuerdos', icon: Handshake },
    { id: 'autorizaciones' as TabType, label: 'Autorizaciones', icon: FileCheck },
    { id: 'historial-pagos' as TabType, label: 'Historial de Pagos', icon: DollarSign },
    { id: 'asistente-facturacion' as TabType, label: 'Asistente de Facturación', icon: FileText },
  ];

  const cargarMutuas = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta: PaginatedResponse<Mutua> = await obtenerMutuas(filtros);
      setMutuas(respuesta.data);
      setPaginacion({
        total: respuesta.total,
        page: respuesta.page,
        limit: respuesta.limit,
        totalPages: respuesta.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el listado de mutuas');
      setMutuas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMutuas();
  }, [filtros]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosMutuas) => {
    setFiltros((prev) => ({
      ...prev,
      ...nuevosFiltros,
    }));
  };

  const handlePageChange = (page: number) => {
    setFiltros((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleNuevaMutua = () => {
    setMutuaEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarMutua = (mutua: Mutua) => {
    setMutuaEditando(mutua);
    setMostrarFormulario(true);
  };

  const handleGuardarMutua = async (datos: NuevaMutua) => {
    setGuardando(true);
    try {
      if (mutuaEditando) {
        await actualizarMutua(mutuaEditando._id!, datos);
      } else {
        await crearMutua(datos);
      }
      setMostrarFormulario(false);
      setMutuaEditando(null);
      await cargarMutuas();
    } catch (err) {
      throw err; // Re-lanzar para que el formulario lo maneje
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setMutuaEditando(null);
  };

  const handleEliminarMutua = (mutua: Mutua) => {
    setMutuaEliminar(mutua);
    setMostrarModalConfirmacion(true);
  };

  const confirmarEliminacion = async () => {
    if (!mutuaEliminar) return;

    try {
      if (mutuaEliminar.activo) {
        await desactivarMutua(mutuaEliminar._id!);
      } else {
        await reactivarMutua(mutuaEliminar._id!);
      }
      setMostrarModalConfirmacion(false);
      setMutuaEliminar(null);
      await cargarMutuas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar el estado de la mutua');
      setMostrarModalConfirmacion(false);
      setMutuaEliminar(null);
    }
  };

  const handleVerDetalle = async (mutua: Mutua) => {
    try {
      const { obtenerMutuaPorId } = await import('../api/mutuasApi');
      const detalle = await obtenerMutuaPorId(mutua._id!);
      setMutuaDetalle(detalle);
      setMostrarModalDetalle(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener el detalle de la mutua');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Building2 size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Gestión de Mutuas y Seguros de Salud
                </h1>
                <p className="text-gray-600">
                  Administra las compañías de seguros y mutuas con las que trabajas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Tabs */}
        <div className="bg-white shadow-sm rounded-xl p-0">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Icon size={18} className={activeTab === tab.id ? 'opacity-100' : 'opacity-70'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenido de las pestañas */}
          <div className="px-4 pb-4">
            {activeTab === 'mutuas' && (
              <div className="mt-6 space-y-6">
                {/* Error message */}
                {error && (
                  <div className="bg-white shadow-sm rounded-xl p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{error}</span>
                      <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-600 hover:text-red-800"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Estadísticas */}
                {mutuas.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-slate-700">Total Mutuas</div>
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900">{paginacion.total}</div>
                      <div className="text-xs text-gray-600 mt-1">Registradas en el sistema</div>
                    </div>
                    <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-green-500">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-slate-700">Activas</div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        {mutuas.filter(m => m.activo).length}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {paginacion.total > 0 
                          ? `${Math.round((mutuas.filter(m => m.activo).length / paginacion.total) * 100)}% del total`
                          : 'En operación'}
                      </div>
                    </div>
                    <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-gray-400">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-slate-700">Inactivas</div>
                        <XCircle className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        {mutuas.filter(m => !m.activo).length}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Desactivadas temporalmente</div>
                    </div>
                    <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-slate-700">En esta página</div>
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900">{mutuas.length}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Página {paginacion.page} de {paginacion.totalPages || 1}
                      </div>
                    </div>
                  </div>
                )}

                {/* Toolbar */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={handleNuevaMutua}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                  >
                    <Plus size={20} className="mr-2" />
                    Nueva Mutua/Seguro
                  </button>
                </div>

                {/* Filtros y búsqueda */}
                <BarraBusquedaFiltros filtros={filtros} onFiltrosChange={handleFiltrosChange} />

                {/* Tabla de mutuas */}
                <MutuasTable
                  mutuas={mutuas}
                  loading={loading}
                  onEditar={handleEditarMutua}
                  onEliminar={handleEliminarMutua}
                  onVerDetalle={handleVerDetalle}
                />

                {/* Paginación */}
                {paginacion.totalPages > 1 && (
                  <div className="bg-white shadow-sm rounded-xl p-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handlePageChange(paginacion.page - 1)}
                        disabled={paginacion.page === 1}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      {Array.from({ length: paginacion.totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === paginacion.totalPages ||
                            (page >= paginacion.page - 1 && page <= paginacion.page + 1)
                        )
                        .map((page, index, array) => (
                          <div key={page} className="flex items-center gap-1">
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-lg transition-all text-sm ${
                                paginacion.page === page
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        ))}
                      <button
                        onClick={() => handlePageChange(paginacion.page + 1)}
                        disabled={paginacion.page === paginacion.totalPages}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'convenios' && <ConveniosAcuerdosPage />}
            {activeTab === 'autorizaciones' && <AutorizacionesTratamientosPage />}
            {activeTab === 'historial-pagos' && <HistorialPagosSeguroPage />}
            {activeTab === 'asistente-facturacion' && (
              <AsistenteFacturacionPage onVolver={() => setActiveTab('mutuas')} />
            )}
          </div>
        </div>
      </div>

      {/* Modal de formulario */}
      {mostrarFormulario && (
        <FormularioMutua
          mutua={mutuaEditando}
          onGuardar={handleGuardarMutua}
          onCancelar={handleCancelarFormulario}
          loading={guardando}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {mostrarModalConfirmacion && mutuaEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {mutuaEliminar.activo ? 'Desactivar Mutua' : 'Reactivar Mutua'}
              </h3>
              <p className="text-gray-600 mb-6">
                {mutuaEliminar.activo
                  ? `¿Estás seguro de que deseas desactivar "${mutuaEliminar.nombreComercial}"? La mutua no aparecerá en las opciones para nuevos pacientes, pero se mantendrá en el historial.`
                  : `¿Deseas reactivar "${mutuaEliminar.nombreComercial}"?`}
              </p>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setMostrarModalConfirmacion(false);
                    setMutuaEliminar(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarEliminacion}
                  className={`px-6 py-2 rounded-lg text-white transition-all shadow-sm ${
                    mutuaEliminar.activo
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {mutuaEliminar.activo ? 'Desactivar' : 'Reactivar'}
                </button>
              </div>
            </div>
          </div>
      )}

      {/* Modal de detalle de mutua */}
      {mostrarModalDetalle && mutuaDetalle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                    <Building2 size={24} className="text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Detalle de Mutua/Seguro
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setMostrarModalDetalle(false);
                    setMutuaDetalle(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nombre Comercial</label>
                    <p className="text-lg font-semibold text-gray-900">{mutuaDetalle.nombreComercial}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Razón Social</label>
                    <p className="text-lg text-gray-900">{mutuaDetalle.razonSocial || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">CIF</label>
                    <p className="text-lg font-mono text-gray-900">{mutuaDetalle.cif}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      mutuaDetalle.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {mutuaDetalle.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>

                {/* Dirección */}
                {mutuaDetalle.direccion && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Dirección
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mutuaDetalle.direccion.calle && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Calle</label>
                          <p className="text-gray-900">{mutuaDetalle.direccion.calle}</p>
                        </div>
                      )}
                      {mutuaDetalle.direccion.ciudad && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Ciudad</label>
                          <p className="text-gray-900">{mutuaDetalle.direccion.ciudad}</p>
                        </div>
                      )}
                      {mutuaDetalle.direccion.codigoPostal && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Código Postal</label>
                          <p className="text-gray-900">{mutuaDetalle.direccion.codigoPostal}</p>
                        </div>
                      )}
                      {mutuaDetalle.direccion.provincia && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Provincia</label>
                          <p className="text-gray-900">{mutuaDetalle.direccion.provincia}</p>
                        </div>
                      )}
                      {mutuaDetalle.direccion.pais && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">País</label>
                          <p className="text-gray-900">{mutuaDetalle.direccion.pais}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contacto */}
                {mutuaDetalle.contacto && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Contacto
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mutuaDetalle.contacto.telefono && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
                          <p className="text-gray-900">{mutuaDetalle.contacto.telefono}</p>
                        </div>
                      )}
                      {mutuaDetalle.contacto.email && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                          <p className="text-gray-900">{mutuaDetalle.contacto.email}</p>
                        </div>
                      )}
                      {mutuaDetalle.contacto.personaContacto && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Persona de Contacto</label>
                          <p className="text-gray-900">{mutuaDetalle.contacto.personaContacto}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Condiciones Generales */}
                {mutuaDetalle.condicionesGenerales && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Condiciones Generales
                    </h3>
                    <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                      {mutuaDetalle.condicionesGenerales}
                    </p>
                  </div>
                )}

                {/* Información de fechas */}
                {(mutuaDetalle.createdAt || mutuaDetalle.updatedAt) && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      {mutuaDetalle.createdAt && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Creación</label>
                          <p className="text-gray-900">{new Date(mutuaDetalle.createdAt).toLocaleString('es-ES')}</p>
                        </div>
                      )}
                      {mutuaDetalle.updatedAt && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Última Actualización</label>
                          <p className="text-gray-900">{new Date(mutuaDetalle.updatedAt).toLocaleString('es-ES')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                <button
                  onClick={() => {
                    setMostrarModalDetalle(false);
                    setMutuaDetalle(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setMostrarModalDetalle(false);
                    handleEditarMutua(mutuaDetalle);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}

