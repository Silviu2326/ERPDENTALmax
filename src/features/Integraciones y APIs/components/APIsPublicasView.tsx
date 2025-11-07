import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Shield,
} from 'lucide-react';
import {
  ApiPublica,
  ApiKey,
  obtenerApisPublicas,
  obtenerDocumentacionApi,
  generarApiKey,
  obtenerApiKeys,
  revocarApiKey,
} from '../api/integracionesApi';

const PERMISOS_DISPONIBLES = [
  { value: 'pacientes.read', label: 'Leer Pacientes', descripcion: 'Permite consultar información de pacientes' },
  { value: 'pacientes.write', label: 'Escribir Pacientes', descripcion: 'Permite crear y modificar pacientes' },
  { value: 'citas.read', label: 'Leer Citas', descripcion: 'Permite consultar información de citas' },
  { value: 'citas.write', label: 'Escribir Citas', descripcion: 'Permite crear y modificar citas' },
  { value: 'facturas.read', label: 'Leer Facturas', descripcion: 'Permite consultar información de facturas' },
  { value: 'facturas.write', label: 'Escribir Facturas', descripcion: 'Permite crear y modificar facturas' },
  { value: 'presupuestos.read', label: 'Leer Presupuestos', descripcion: 'Permite consultar información de presupuestos' },
  { value: 'presupuestos.write', label: 'Escribir Presupuestos', descripcion: 'Permite crear y modificar presupuestos' },
];

export default function APIsPublicasView() {
  const [apis, setApis] = useState<ApiPublica[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarDocumentacion, setMostrarDocumentacion] = useState(false);
  const [documentacion, setDocumentacion] = useState<any>(null);
  const [nuevaClaveGenerada, setNuevaClaveGenerada] = useState<string | null>(null);
  const [claveVisible, setClaveVisible] = useState<{ [key: string]: boolean }>({});

  const [formData, setFormData] = useState({
    nombre: '',
    permisos: [] as string[],
    expiracion: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [apisData, keysData] = await Promise.all([
        obtenerApisPublicas(),
        obtenerApiKeys(),
      ]);
      setApis(apisData);
      setApiKeys(keysData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const cargarDocumentacion = async () => {
    try {
      const data = await obtenerDocumentacionApi();
      setDocumentacion(data);
      setMostrarDocumentacion(true);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la documentación');
    }
  };

  const handleGenerarClave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nombre || formData.permisos.length === 0) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const data: any = {
        nombre: formData.nombre,
        permisos: formData.permisos,
      };

      if (formData.expiracion) {
        data.expiracion = new Date(formData.expiracion).toISOString();
      }

      const nuevaClave = await generarApiKey(data);
      setNuevaClaveGenerada(nuevaClave.clave || '');
      await cargarDatos();
      setFormData({ nombre: '', permisos: [], expiracion: '' });
      setMostrarFormulario(false);
    } catch (err: any) {
      setError(err.message || 'Error al generar la clave de API');
    }
  };

  const handleRevocar = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas revocar esta clave de API? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await revocarApiKey(id);
      await cargarDatos();
    } catch (err: any) {
      setError(err.message || 'Error al revocar la clave de API');
    }
  };

  const copiarClave = (clave: string) => {
    navigator.clipboard.writeText(clave);
    alert('Clave copiada al portapapeles');
  };

  const togglePermiso = (permiso: string) => {
    setFormData((prev) => ({
      ...prev,
      permisos: prev.permisos.includes(permiso)
        ? prev.permisos.filter((p) => p !== permiso)
        : [...prev.permisos, permiso],
    }));
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (mostrarDocumentacion && documentacion) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => {
                setMostrarDocumentacion(false);
                setDocumentacion(null);
              }}
              className="text-indigo-600 hover:text-indigo-800 mb-2 flex items-center"
            >
              ← Volver a APIs Públicas
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Documentación de la API</h2>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="prose max-w-none">
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(documentacion, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (nuevaClaveGenerada) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-2">¡Clave de API Generada!</h3>
                <p className="text-sm text-yellow-800 mb-4">
                  Esta es la única vez que podrás ver esta clave. Asegúrate de copiarla y guardarla en un lugar seguro.
                  No podrás verla de nuevo después de cerrar esta ventana.
                </p>
                <div className="bg-white rounded-lg p-4 border border-yellow-300 mb-4">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono text-gray-900 break-all">{nuevaClaveGenerada}</code>
                    <button
                      onClick={() => copiarClave(nuevaClaveGenerada)}
                      className="ml-4 text-yellow-600 hover:text-yellow-800 flex-shrink-0"
                      title="Copiar clave"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setNuevaClaveGenerada(null);
                    cargarDatos();
                  }}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Entendido, he guardado la clave
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">API Pública</h2>
          <p className="text-gray-600">
            Gestiona las claves de API para permitir que aplicaciones externas accedan a los datos del ERP de forma segura.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={cargarDocumentacion}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            Ver Documentación
          </button>
          <button
            onClick={() => {
              setMostrarFormulario(true);
              setFormData({ nombre: '', permisos: [], expiracion: '' });
            }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Generar Clave de API
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 mb-1">Error</h4>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {mostrarFormulario && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generar Nueva Clave de API</h3>
          <form onSubmit={handleGenerarClave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Clave <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Aplicación de Contabilidad"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Un nombre descriptivo para identificar esta clave</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permisos <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                {PERMISOS_DISPONIBLES.map((permiso) => (
                  <label
                    key={permiso.value}
                    className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.permisos.includes(permiso.value)}
                      onChange={() => togglePermiso(permiso.value)}
                      className="mt-1 mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{permiso.label}</div>
                      <div className="text-sm text-gray-500">{permiso.descripcion}</div>
                    </div>
                  </label>
                ))}
              </div>
              {formData.permisos.length === 0 && (
                <p className="mt-1 text-xs text-red-500">Debes seleccionar al menos un permiso</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Expiración (opcional)
              </label>
              <input
                type="date"
                value={formData.expiracion}
                onChange={(e) => setFormData({ ...formData, expiracion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">La clave expirará automáticamente en esta fecha</p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={formData.permisos.length === 0}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Generar Clave
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false);
                  setFormData({ nombre: '', permisos: [], expiracion: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Endpoints Disponibles */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Endpoints Disponibles</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Cargando endpoints...</p>
          </div>
        ) : apis.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay endpoints disponibles</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apis.map((api) => (
                    <tr key={api.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm font-mono text-gray-900">{api.endpoint}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            api.metodo === 'GET'
                              ? 'bg-blue-100 text-blue-800'
                              : api.metodo === 'POST'
                              ? 'bg-green-100 text-green-800'
                              : api.metodo === 'PUT'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {api.metodo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{api.nombre}</div>
                        <div className="text-xs text-gray-500">{api.descripcion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {api.estado === 'activo' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactivo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Claves de API */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Claves de API Activas</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Cargando claves...</p>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay claves de API</h3>
            <p className="text-gray-600 mb-4">
              Genera una nueva clave de API para permitir que aplicaciones externas accedan a los datos del ERP.
            </p>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Generar Clave de API
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permisos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Utilización
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiración
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{key.nombre}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {key.permisos.slice(0, 3).map((permiso) => (
                            <span
                              key={permiso}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {permiso}
                            </span>
                          ))}
                          {key.permisos.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{key.permisos.length - 3} más
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatearFecha(key.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatearFecha(key.ultimaUtilizacion)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatearFecha(key.expiracion)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRevocar(key.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Revocar clave"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Seguridad de la API</h4>
            <p className="text-sm text-blue-800 mb-2">
              Las claves de API deben tratarse como contraseñas. No las compartas públicamente y revócalas inmediatamente
              si sospechas que han sido comprometidas.
            </p>
            <p className="text-sm text-blue-800">
              Todas las solicitudes a la API pública deben incluir la clave en el header: <code className="bg-blue-100 px-1 rounded">Authorization: Bearer {'{tu_clave}'}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



