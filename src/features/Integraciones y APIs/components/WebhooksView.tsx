import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Copy,
  ExternalLink,
  Clock,
} from 'lucide-react';
import {
  Webhook,
  WebhookLog,
  WebhookEvento,
  obtenerWebhooks,
  crearWebhook,
  actualizarWebhook,
  eliminarWebhook,
  probarWebhook,
  obtenerLogsWebhook,
} from '../api/integracionesApi';

const EVENTOS_DISPONIBLES: { value: WebhookEvento; label: string; descripcion: string }[] = [
  { value: 'cita.creada', label: 'Cita Creada', descripcion: 'Se dispara cuando se crea una nueva cita' },
  { value: 'cita.actualizada', label: 'Cita Actualizada', descripcion: 'Se dispara cuando se modifica una cita existente' },
  { value: 'cita.cancelada', label: 'Cita Cancelada', descripcion: 'Se dispara cuando se cancela una cita' },
  { value: 'factura.creada', label: 'Factura Creada', descripcion: 'Se dispara cuando se genera una nueva factura' },
  { value: 'factura.pagada', label: 'Factura Pagada', descripcion: 'Se dispara cuando se registra el pago de una factura' },
  { value: 'paciente.creado', label: 'Paciente Creado', descripcion: 'Se dispara cuando se registra un nuevo paciente' },
  { value: 'paciente.actualizado', label: 'Paciente Actualizado', descripcion: 'Se dispara cuando se actualiza la información de un paciente' },
  { value: 'presupuesto.aprobado', label: 'Presupuesto Aprobado', descripcion: 'Se dispara cuando un paciente aprueba un presupuesto' },
  { value: 'presupuesto.rechazado', label: 'Presupuesto Rechazado', descripcion: 'Se dispara cuando un paciente rechaza un presupuesto' },
];

export default function WebhooksView() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [webhookEditando, setWebhookEditando] = useState<Webhook | null>(null);
  const [webhookSeleccionado, setWebhookSeleccionado] = useState<string | null>(null);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [mostrarLogs, setMostrarLogs] = useState(false);

  const [formData, setFormData] = useState({
    url: '',
    evento: '' as WebhookEvento | '',
    secret: '',
    estado: 'activo' as 'activo' | 'inactivo',
  });

  useEffect(() => {
    cargarWebhooks();
  }, []);

  useEffect(() => {
    if (webhookSeleccionado && mostrarLogs) {
      cargarLogs(webhookSeleccionado);
    }
  }, [webhookSeleccionado, mostrarLogs]);

  const cargarWebhooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerWebhooks();
      setWebhooks(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los webhooks');
    } finally {
      setLoading(false);
    }
  };

  const cargarLogs = async (webhookId: string) => {
    try {
      const data = await obtenerLogsWebhook(webhookId, 1, 50);
      setLogs(data.logs);
    } catch (err: any) {
      console.error('Error al cargar logs:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.url || !formData.evento) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    // Validar que la URL sea HTTPS
    if (!formData.url.startsWith('https://')) {
      setError('La URL debe ser HTTPS por seguridad');
      return;
    }

    try {
      if (webhookEditando) {
        await actualizarWebhook(webhookEditando.id, formData);
      } else {
        await crearWebhook(formData);
      }
      await cargarWebhooks();
      setMostrarFormulario(false);
      setWebhookEditando(null);
      setFormData({ url: '', evento: '' as WebhookEvento | '', secret: '', estado: 'activo' });
    } catch (err: any) {
      setError(err.message || 'Error al guardar el webhook');
    }
  };

  const handleEditar = (webhook: Webhook) => {
    setWebhookEditando(webhook);
    setFormData({
      url: webhook.url,
      evento: webhook.evento as WebhookEvento,
      secret: webhook.secret || '',
      estado: webhook.estado,
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este webhook?')) {
      return;
    }

    try {
      await eliminarWebhook(id);
      await cargarWebhooks();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el webhook');
    }
  };

  const handleProbar = async (id: string) => {
    try {
      const resultado = await probarWebhook(id);
      if (resultado.exito) {
        alert(`Webhook probado exitosamente: ${resultado.mensaje}`);
      } else {
        alert(`Error al probar webhook: ${resultado.mensaje}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message || 'Error al probar el webhook'}`);
    }
  };

  const handleVerLogs = (id: string) => {
    setWebhookSeleccionado(id);
    setMostrarLogs(true);
  };

  const copiarUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copiada al portapapeles');
  };

  const getEventoLabel = (evento: string) => {
    const eventoObj = EVENTOS_DISPONIBLES.find((e) => e.value === evento);
    return eventoObj?.label || evento;
  };

  if (mostrarLogs && webhookSeleccionado) {
    const webhook = webhooks.find((w) => w.id === webhookSeleccionado);
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => {
                setMostrarLogs(false);
                setWebhookSeleccionado(null);
              }}
              className="text-indigo-600 hover:text-indigo-800 mb-2 flex items-center"
            >
              ← Volver a webhooks
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Logs del Webhook</h2>
            <p className="text-sm text-gray-600 mt-1">{webhook?.url}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código HTTP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Error
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No hay logs disponibles
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.intentadoEn).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.evento}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.exito ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Exitoso
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Fallido
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.statusCode || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.error || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Webhooks</h2>
          <p className="text-gray-600">
            Configura webhooks para recibir notificaciones automáticas cuando ocurran eventos en el sistema.
          </p>
        </div>
        <button
          onClick={() => {
            setMostrarFormulario(true);
            setWebhookEditando(null);
            setFormData({ url: '', evento: '' as WebhookEvento | '', secret: '', estado: 'activo' });
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Webhook
        </button>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {webhookEditando ? 'Editar Webhook' : 'Nuevo Webhook'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL del Webhook <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://ejemplo.com/webhook"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Debe ser una URL HTTPS válida</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Evento <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.evento}
                onChange={(e) => setFormData({ ...formData, evento: e.target.value as WebhookEvento })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Selecciona un evento</option>
                {EVENTOS_DISPONIBLES.map((evento) => (
                  <option key={evento.value} value={evento.value}>
                    {evento.label} - {evento.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secreto (opcional)
              </label>
              <input
                type="text"
                value={formData.secret}
                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                placeholder="Secreto para validar la firma HMAC"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Secreto compartido para validar la autenticidad de las solicitudes (HMAC-SHA256)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'activo' | 'inactivo' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {webhookEditando ? 'Actualizar' : 'Crear'} Webhook
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false);
                  setWebhookEditando(null);
                  setFormData({ url: '', evento: '' as WebhookEvento | '', secret: '', estado: 'activo' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Cargando webhooks...</p>
        </div>
      ) : webhooks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay webhooks configurados</h3>
          <p className="text-gray-600 mb-4">
            Crea tu primer webhook para recibir notificaciones automáticas de eventos del sistema.
          </p>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Webhook
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {webhooks.map((webhook) => (
                  <tr key={webhook.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 truncate max-w-xs">{webhook.url}</span>
                        <button
                          onClick={() => copiarUrl(webhook.url)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          title="Copiar URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{getEventoLabel(webhook.evento)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {webhook.estado === 'activo' ? (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {webhook.createdAt ? new Date(webhook.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleVerLogs(webhook.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Ver logs"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleProbar(webhook.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Probar webhook"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditar(webhook)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEliminar(webhook.id)}
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
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Información sobre Webhooks</h4>
            <p className="text-sm text-blue-800 mb-2">
              Los webhooks envían solicitudes HTTP POST a la URL configurada cuando ocurre el evento seleccionado.
              Se recomienda usar un secreto compartido para validar la autenticidad de las solicitudes mediante firma HMAC-SHA256.
            </p>
            <p className="text-sm text-blue-800">
              El sistema realizará hasta 3 reintentos automáticos si el webhook falla, con un tiempo de espera de 10 segundos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


