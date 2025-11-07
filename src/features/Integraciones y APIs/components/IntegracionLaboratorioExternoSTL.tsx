import { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  FileText,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
} from 'lucide-react';
import {
  obtenerLaboratoriosExternos,
  crearLaboratorioExterno,
  actualizarLaboratorioExterno,
  eliminarLaboratorioExterno,
  probarConexionLaboratorio,
  obtenerOrdenesSTL,
  crearOrdenSTL,
  eliminarOrdenSTL,
  LaboratorioExterno,
  OrdenSTL,
  NuevaOrdenSTL,
} from '../api/laboratorioExternoApi';

type Vista = 'laboratorios' | 'ordenes' | 'nueva-orden';

export default function IntegracionLaboratorioExternoSTL() {
  const [vistaActual, setVistaActual] = useState<Vista>('laboratorios');
  const [laboratorios, setLaboratorios] = useState<LaboratorioExterno[]>([]);
  const [ordenes, setOrdenes] = useState<OrdenSTL[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalLaboratorio, setMostrarModalLaboratorio] = useState(false);
  const [mostrarModalOrden, setMostrarModalOrden] = useState(false);
  const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState<LaboratorioExterno | null>(null);

  useEffect(() => {
    if (vistaActual === 'laboratorios') {
      cargarLaboratorios();
    } else if (vistaActual === 'ordenes') {
      cargarOrdenes();
    }
  }, [vistaActual]);

  const cargarLaboratorios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerLaboratoriosExternos();
      setLaboratorios(data);
    } catch (err) {
      console.error('Error al cargar laboratorios:', err);
      setError('Error al cargar los laboratorios externos');
    } finally {
      setLoading(false);
    }
  };

  const cargarOrdenes = async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await obtenerOrdenesSTL({ page: 1, limit: 20 });
      setOrdenes(resultado.ordenes);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError('Error al cargar las órdenes STL');
    } finally {
      setLoading(false);
    }
  };

  const handleProbarConexion = async (laboratorioId: string) => {
    try {
      const resultado = await probarConexionLaboratorio(laboratorioId);
      if (resultado.exito) {
        alert(`Conexión exitosa: ${resultado.mensaje}`);
      } else {
        alert(`Error en la conexión: ${resultado.mensaje}`);
      }
    } catch (err) {
      console.error('Error al probar conexión:', err);
      alert('Error al probar la conexión');
    }
  };

  const handleEliminarLaboratorio = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este laboratorio externo?')) {
      return;
    }

    try {
      await eliminarLaboratorioExterno(id);
      await cargarLaboratorios();
    } catch (err) {
      console.error('Error al eliminar laboratorio:', err);
      alert('Error al eliminar el laboratorio');
    }
  };

  const handleEliminarOrden = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta orden STL?')) {
      return;
    }

    try {
      await eliminarOrdenSTL(id);
      await cargarOrdenes();
    } catch (err) {
      console.error('Error al eliminar orden:', err);
      alert('Error al eliminar la orden');
    }
  };

  return (
    <div className="p-6">
      {/* Navegación de pestañas */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setVistaActual('laboratorios')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                vistaActual === 'laboratorios'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Building2 className="w-4 h-4 inline mr-2" />
              Laboratorios Externos
            </button>
            <button
              onClick={() => setVistaActual('ordenes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                vistaActual === 'ordenes'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Órdenes STL
            </button>
            <button
              onClick={() => setMostrarModalOrden(true)}
              className="ml-auto py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Orden STL</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido según la vista */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : vistaActual === 'laboratorios' ? (
        <VistaLaboratorios
          laboratorios={laboratorios}
          onProbarConexion={handleProbarConexion}
          onEditar={(lab) => {
            setLaboratorioSeleccionado(lab);
            setMostrarModalLaboratorio(true);
          }}
          onEliminar={handleEliminarLaboratorio}
          onNuevo={() => {
            setLaboratorioSeleccionado(null);
            setMostrarModalLaboratorio(true);
          }}
        />
      ) : (
        <VistaOrdenes ordenes={ordenes} onEliminar={handleEliminarOrden} />
      )}

      {/* Modal para laboratorio */}
      {mostrarModalLaboratorio && (
        <ModalLaboratorioExterno
          laboratorio={laboratorioSeleccionado}
          onCerrar={() => {
            setMostrarModalLaboratorio(false);
            setLaboratorioSeleccionado(null);
          }}
          onGuardado={() => {
            setMostrarModalLaboratorio(false);
            setLaboratorioSeleccionado(null);
            cargarLaboratorios();
          }}
        />
      )}

      {/* Modal para nueva orden */}
      {mostrarModalOrden && (
        <ModalNuevaOrdenSTL
          laboratorios={laboratorios}
          onCerrar={() => setMostrarModalOrden(false)}
          onGuardado={() => {
            setMostrarModalOrden(false);
            cargarOrdenes();
          }}
        />
      )}
    </div>
  );
}

// Vista de Laboratorios
function VistaLaboratorios({
  laboratorios,
  onProbarConexion,
  onEditar,
  onEliminar,
  onNuevo,
}: {
  laboratorios: LaboratorioExterno[];
  onProbarConexion: (id: string) => void;
  onEditar: (lab: LaboratorioExterno) => void;
  onEliminar: (id: string) => void;
  onNuevo: () => void;
}) {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Laboratorios Externos</h2>
          <p className="text-gray-600">
            Gestiona las integraciones con laboratorios externos para envío de órdenes STL
          </p>
        </div>
        <button
          onClick={onNuevo}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Laboratorio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {laboratorios.map((laboratorio) => (
          <div
            key={laboratorio._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{laboratorio.nombre}</h3>
                  <p className="text-sm text-gray-500">{laboratorio.email}</p>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  laboratorio.activo
                    ? 'text-green-600 bg-green-100'
                    : 'text-gray-600 bg-gray-100'
                }`}
              >
                {laboratorio.activo ? (
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                ) : (
                  <XCircle className="w-4 h-4 inline mr-1" />
                )}
                {laboratorio.activo ? 'Activo' : 'Inactivo'}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Tipo de integración:</span>{' '}
                {laboratorio.tipoIntegracion.toUpperCase()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Formatos soportados:</span>{' '}
                {laboratorio.formatosSoportados.join(', ')}
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => laboratorio._id && onProbarConexion(laboratorio._id)}
                className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Probar Conexión
              </button>
              <button
                onClick={() => onEditar(laboratorio)}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => laboratorio._id && onEliminar(laboratorio._id)}
                className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {laboratorios.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No hay laboratorios externos configurados</p>
          <button
            onClick={onNuevo}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Agregar Primer Laboratorio
          </button>
        </div>
      )}
    </div>
  );
}

// Vista de Órdenes
function VistaOrdenes({
  ordenes,
  onEliminar,
}: {
  ordenes: OrdenSTL[];
  onEliminar: (id: string) => void;
}) {
  const getEstadoColor = (estado: OrdenSTL['estado']) => {
    switch (estado) {
      case 'completada':
        return 'text-green-600 bg-green-100';
      case 'procesando':
        return 'text-blue-600 bg-blue-100';
      case 'recibida':
        return 'text-indigo-600 bg-indigo-100';
      case 'enviada':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Órdenes STL</h2>
        <p className="text-gray-600">Gestiona las órdenes de archivos STL enviadas a laboratorios externos</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número de Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Laboratorio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Archivos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Envío
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordenes.map((orden) => (
              <tr key={orden._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {orden.numeroOrden}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {orden.laboratorioExternoId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(
                      orden.estado
                    )}`}
                  >
                    {orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {orden.archivosSTL.length} archivo(s)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {orden.fechaEnvio
                    ? new Date(orden.fechaEnvio).toLocaleDateString('es-ES')
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => orden._id && onEliminar(orden._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ordenes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay órdenes STL registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Modal para Laboratorio Externo
function ModalLaboratorioExterno({
  laboratorio,
  onCerrar,
  onGuardado,
}: {
  laboratorio: LaboratorioExterno | null;
  onCerrar: () => void;
  onGuardado: () => void;
}) {
  const [formData, setFormData] = useState({
    nombre: laboratorio?.nombre || '',
    cif: laboratorio?.cif || '',
    direccion: laboratorio?.direccion || '',
    personaContacto: laboratorio?.personaContacto || '',
    email: laboratorio?.email || '',
    telefono: laboratorio?.telefono || '',
    activo: laboratorio?.activo ?? true,
    tipoIntegracion: laboratorio?.tipoIntegracion || 'api',
    formatosSoportados: laboratorio?.formatosSoportados || ['STL'],
    configuracion: laboratorio?.configuracion || {},
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (laboratorio?._id) {
        await actualizarLaboratorioExterno(laboratorio._id, formData);
      } else {
        await crearLaboratorioExterno(formData);
      }
      onGuardado();
    } catch (error) {
      console.error('Error al guardar laboratorio:', error);
      alert('Error al guardar el laboratorio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {laboratorio ? 'Editar Laboratorio Externo' : 'Nuevo Laboratorio Externo'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CIF
              </label>
              <input
                type="text"
                value={formData.cif}
                onChange={(e) => setFormData({ ...formData, cif: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Integración *
            </label>
            <select
              value={formData.tipoIntegracion}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipoIntegracion: e.target.value as 'api' | 'email' | 'ftp' | 'webhook',
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="api">API REST</option>
              <option value="email">Email</option>
              <option value="ftp">FTP</option>
              <option value="webhook">Webhook</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="text-sm font-medium text-gray-700">Activo</label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal para Nueva Orden STL
function ModalNuevaOrdenSTL({
  laboratorios,
  onCerrar,
  onGuardado,
}: {
  laboratorios: LaboratorioExterno[];
  onCerrar: () => void;
  onGuardado: () => void;
}) {
  const [formData, setFormData] = useState({
    ordenLaboratorioId: '',
    laboratorioExternoId: '',
    archivosSTL: [] as File[],
    metadata: {
      tipoProtesis: '',
      material: '',
      color: '',
      instrucciones: '',
    },
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        archivosSTL: Array.from(e.target.files),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.archivosSTL.length === 0) {
      alert('Por favor, seleccione al menos un archivo STL');
      return;
    }

    setLoading(true);
    try {
      await crearOrdenSTL({
        ordenLaboratorioId: formData.ordenLaboratorioId,
        laboratorioExternoId: formData.laboratorioExternoId,
        archivosSTL: formData.archivosSTL,
        metadata: formData.metadata,
      });
      onGuardado();
    } catch (error) {
      console.error('Error al crear orden STL:', error);
      alert('Error al crear la orden STL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Nueva Orden STL</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orden de Laboratorio ID *
            </label>
            <input
              type="text"
              required
              value={formData.ordenLaboratorioId}
              onChange={(e) =>
                setFormData({ ...formData, ordenLaboratorioId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ID de la orden de laboratorio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Laboratorio Externo *
            </label>
            <select
              required
              value={formData.laboratorioExternoId}
              onChange={(e) =>
                setFormData({ ...formData, laboratorioExternoId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccione un laboratorio</option>
              {laboratorios
                .filter((lab) => lab.activo)
                .map((lab) => (
                  <option key={lab._id} value={lab._id}>
                    {lab.nombre}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Archivos STL *
            </label>
            <input
              type="file"
              required
              multiple
              accept=".stl"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formData.archivosSTL.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {formData.archivosSTL.length} archivo(s) seleccionado(s)
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Orden'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



