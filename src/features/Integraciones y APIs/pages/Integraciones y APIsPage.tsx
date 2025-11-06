import { useState } from 'react';
import { Plug, MessageSquare, Mail, Smartphone, Settings, CheckCircle, XCircle, AlertCircle, Building2, CreditCard, Activity } from 'lucide-react';
import IntegracionLaboratorioExternoSTL from '../components/IntegracionLaboratorioExternoSTL';
import PasarelasPagoView from '../components/PasarelasPagoView';
import WebhooksView from '../components/WebhooksView';
import APIsPublicasView from '../components/APIsPublicasView';
import MonitorIntegracionesView from '../components/MonitorIntegracionesView';

type VistaIntegraciones = 'conectores-mensajeria' | 'laboratorio-externo-stl' | 'pasarelas-pago' | 'apis-publicas' | 'webhooks' | 'monitor-integraciones' | 'configuracion';

export default function IntegracionesYAPIsPage() {
  const [vistaActual, setVistaActual] = useState<VistaIntegraciones>('conectores-mensajeria');

  const renderVista = () => {
    switch (vistaActual) {
      case 'conectores-mensajeria':
        return <ConectoresMensajeriaView />;
      case 'laboratorio-externo-stl':
        return <IntegracionLaboratorioExternoSTL />;
      case 'pasarelas-pago':
        return <PasarelasPagoView />;
      case 'apis-publicas':
        return <APIsPublicasView />;
      case 'webhooks':
        return <WebhooksView />;
      case 'monitor-integraciones':
        return <MonitorIntegracionesView />;
      case 'configuracion':
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuración</h2>
                <p className="text-gray-600">Esta funcionalidad estará disponible próximamente</p>
              </div>
            </div>
          </div>
        );
      default:
        return <ConectoresMensajeriaView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Módulo */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Plug className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Integraciones y APIs</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gestión de conectores de mensajería, pasarelas de pago, APIs públicas y webhooks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de Submódulos */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-1">
            <button
              onClick={() => setVistaActual('conectores-mensajeria')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'conectores-mensajeria'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Conectores de Mensajería
            </button>
            <button
              onClick={() => setVistaActual('laboratorio-externo-stl')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'laboratorio-externo-stl'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Building2 className="w-4 h-4 inline mr-2" />
              Laboratorio Externo STL
            </button>
            <button
              onClick={() => setVistaActual('pasarelas-pago')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'pasarelas-pago'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Pasarelas de Pago
            </button>
            <button
              onClick={() => setVistaActual('apis-publicas')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'apis-publicas'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Plug className="w-4 h-4 inline mr-2" />
              APIs Públicas
            </button>
            <button
              onClick={() => setVistaActual('webhooks')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'webhooks'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Plug className="w-4 h-4 inline mr-2" />
              Webhooks
            </button>
            <button
              onClick={() => setVistaActual('monitor-integraciones')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'monitor-integraciones'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Monitor
            </button>
            <button
              onClick={() => setVistaActual('configuracion')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'configuracion'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configuración
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto">
        {renderVista()}
      </div>
    </div>
  );
}

// Vista de Conectores de Mensajería
function ConectoresMensajeriaView() {
  const [conectores] = useState([
    {
      id: 'sms',
      nombre: 'SMS',
      proveedor: 'Twilio',
      estado: 'activo',
      icono: Smartphone,
      color: 'green',
      descripcion: 'Envío de mensajes SMS para recordatorios y notificaciones',
      ultimaVerificacion: '2024-01-15 10:30',
    },
    {
      id: 'whatsapp',
      nombre: 'WhatsApp Business',
      proveedor: 'WhatsApp Business API',
      estado: 'activo',
      icono: MessageSquare,
      color: 'green',
      descripcion: 'Integración con WhatsApp Business para comunicación con pacientes',
      ultimaVerificacion: '2024-01-15 10:28',
    },
    {
      id: 'email',
      nombre: 'Email',
      proveedor: 'SendGrid',
      estado: 'activo',
      icono: Mail,
      color: 'blue',
      descripcion: 'Envío de correos electrónicos para comunicaciones y recordatorios',
      ultimaVerificacion: '2024-01-15 10:25',
    },
  ]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Conectores de Mensajería</h2>
        <p className="text-gray-600">
          Gestiona las integraciones con proveedores de SMS, WhatsApp y Email para comunicarte con tus pacientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {conectores.map((conector) => {
          const Icono = conector.icono;
          const estadoColor =
            conector.estado === 'activo'
              ? 'text-green-600 bg-green-100'
              : conector.estado === 'error'
              ? 'text-red-600 bg-red-100'
              : 'text-yellow-600 bg-yellow-100';

          const iconBgColor = conector.color === 'green' ? 'bg-green-100' : conector.color === 'blue' ? 'bg-blue-100' : 'bg-indigo-100';
          const iconTextColor = conector.color === 'green' ? 'text-green-600' : conector.color === 'blue' ? 'text-blue-600' : 'text-indigo-600';

          return (
            <div
              key={conector.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${iconBgColor}`}>
                    <Icono className={`w-6 h-6 ${iconTextColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{conector.nombre}</h3>
                    <p className="text-sm text-gray-500">{conector.proveedor}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor}`}>
                  {conector.estado === 'activo' ? (
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                  ) : conector.estado === 'error' ? (
                    <XCircle className="w-4 h-4 inline mr-1" />
                  ) : (
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                  )}
                  {conector.estado.charAt(0).toUpperCase() + conector.estado.slice(1)}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{conector.descripcion}</p>

              <div className="text-xs text-gray-500 mb-4">
                Última verificación: {conector.ultimaVerificacion}
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                  Configurar
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Probar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Información Importante</h4>
            <p className="text-sm text-blue-800">
              Asegúrate de tener las credenciales correctas de cada proveedor antes de activar los conectores.
              Las credenciales se almacenan de forma segura y encriptada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

