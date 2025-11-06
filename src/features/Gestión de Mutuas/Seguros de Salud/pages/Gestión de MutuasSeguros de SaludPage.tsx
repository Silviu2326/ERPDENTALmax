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

export default function GestionMutuasSegurosSaludPage({ onAsistenteFacturacion }: GestionMutuasSegurosSaludPageProps = {}) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Mutuas y Seguros de Salud
              </h1>
              <p className="text-gray-600 mt-1">
                Administra las compañías de seguros y mutuas con las que trabajas
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-white'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenido de las pestañas */}
          <div className="p-0">
            {activeTab === 'mutuas' && (
              <div className="p-6">
                {/* Error message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                    <button
                      onClick={() => setError(null)}
                      className="ml-auto text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Estadísticas */}
                {mutuas.length > 0 && (
                  <div className="space-y-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-5 border border-blue-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-blue-700">Total Mutuas</div>
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-3xl font-bold text-blue-900">{paginacion.total}</div>
                        <div className="text-xs text-blue-600 mt-2">Registradas en el sistema</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-5 border border-green-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-green-700">Activas</div>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-green-900">
                          {mutuas.filter(m => m.activo).length}
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          {paginacion.total > 0 
                            ? `${Math.round((mutuas.filter(m => m.activo).length / paginacion.total) * 100)}% del total`
                            : 'En operación'}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-5 border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-gray-700">Inactivas</div>
                          <XCircle className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          {mutuas.filter(m => !m.activo).length}
                        </div>
                        <div className="text-xs text-gray-600 mt-2">Desactivadas temporalmente</div>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg p-5 border border-indigo-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-indigo-700">En esta página</div>
                          <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="text-3xl font-bold text-indigo-900">{mutuas.length}</div>
                        <div className="text-xs text-indigo-600 mt-2">
                          Página {paginacion.page} de {paginacion.totalPages || 1}
                        </div>
                      </div>
                    </div>

                    {/* Resumen de mutuas por región */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Distribución Geográfica
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(() => {
                          const porProvincia = mutuas.reduce((acc, mutua) => {
                            const provincia = mutua.direccion?.provincia || 'No especificada';
                            if (!acc[provincia]) {
                              acc[provincia] = { provincia, total: 0, activas: 0 };
                            }
                            acc[provincia].total += 1;
                            if (mutua.activo) acc[provincia].activas += 1;
                            return acc;
                          }, {} as Record<string, { provincia: string; total: number; activas: number }>);

                          return Object.values(porProvincia)
                            .sort((a, b) => b.total - a.total)
                            .slice(0, 4)
                            .map((item) => (
                              <div key={item.provincia} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="font-semibold text-gray-900 mb-2">{item.provincia}</div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span className="font-medium">{item.total}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Activas:</span>
                                    <span className="font-medium text-green-600">{item.activas}</span>
                                  </div>
                                </div>
                              </div>
                            ));
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Botón Nueva Mutua */}
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={handleNuevaMutua}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                  >
                    <Plus className="w-5 h-5" />
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
                  <div className="mt-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Mostrando {mutuas.length} de {paginacion.total} mutuas
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(paginacion.page - 1)}
                          disabled={paginacion.page === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Anterior
                        </button>
                        <div className="flex items-center gap-1">
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
                                  className={`px-4 py-2 rounded-lg transition-colors ${
                                    paginacion.page === page
                                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                      : 'border border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              </div>
                            ))}
                        </div>
                        <button
                          onClick={() => handlePageChange(paginacion.page + 1)}
                          disabled={paginacion.page === paginacion.totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          Siguiente
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
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
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setMostrarModalConfirmacion(false);
                    setMutuaEliminar(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarEliminacion}
                  className={`px-6 py-2 rounded-lg text-white transition-colors ${
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
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-xl">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  Detalle de Mutua/Seguro
                </h2>
                <button
                  onClick={() => {
                    setMostrarModalDetalle(false);
                    setMutuaDetalle(null);
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Nombre Comercial</label>
                    <p className="text-lg font-semibold text-gray-900">{mutuaDetalle.nombreComercial}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Razón Social</label>
                    <p className="text-lg text-gray-900">{mutuaDetalle.razonSocial || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">CIF</label>
                    <p className="text-lg font-mono text-gray-900">{mutuaDetalle.cif}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
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
                          <label className="block text-sm font-medium text-gray-500 mb-1">Calle</label>
                          <p className="text-gray-900">{mutuaDetalle.direccion.calle}</p>
                        </div>
                      )}
                      {mutuaDetalle.direccion.ciudad && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Ciudad</label>
                          <p className="text-gray-900">{mutuaDetalle.direccion.ciudad}</p>
                        </div>
                      )}
                      {mutuaDetalle.direccion.codigoPostal && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Código Postal</label>
                          <p className="text-gray-900">{mutuaDetalle.direccion.codigoPostal}</p>
                        </div>
                      )}
                      {mutuaDetalle.direccion.provincia && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Provincia</label>
                          <p className="text-gray-900">{mutuaDetalle.direccion.provincia}</p>
                        </div>
                      )}
                      {mutuaDetalle.direccion.pais && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">País</label>
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
                          <label className="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
                          <p className="text-gray-900">{mutuaDetalle.contacto.telefono}</p>
                        </div>
                      )}
                      {mutuaDetalle.contacto.email && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                          <p className="text-gray-900">{mutuaDetalle.contacto.email}</p>
                        </div>
                      )}
                      {mutuaDetalle.contacto.personaContacto && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Persona de Contacto</label>
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
                          <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Creación</label>
                          <p>{new Date(mutuaDetalle.createdAt).toLocaleString('es-ES')}</p>
                        </div>
                      )}
                      {mutuaDetalle.updatedAt && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Última Actualización</label>
                          <p>{new Date(mutuaDetalle.updatedAt).toLocaleString('es-ES')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                <button
                  onClick={() => {
                    setMostrarModalDetalle(false);
                    setMutuaDetalle(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setMostrarModalDetalle(false);
                    handleEditarMutua(mutuaDetalle);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

