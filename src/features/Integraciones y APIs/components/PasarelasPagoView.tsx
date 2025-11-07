import { useState, useEffect } from 'react';
import {
  CreditCard,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  QrCode,
  DollarSign,
} from 'lucide-react';
import {
  obtenerConfiguracionOnePay,
  guardarConfiguracionOnePay,
  obtenerConfiguracionStripe,
  guardarConfiguracionStripe,
  probarConexionOnePay,
  probarConexionStripe,
  obtenerTransaccionesOnePay,
  ConfiguracionOnePay,
  ConfiguracionStripe,
  TransaccionOnePay,
} from '../api/pasarelasPagoApi';
import ModalConfiguracionOnePay from './ModalConfiguracionOnePay';
import ModalConfiguracionStripe from './ModalConfiguracionStripe';
import TablaTransaccionesOnePay from './TablaTransaccionesOnePay';

type VistaPasarela = 'overview' | 'onepay' | 'stripe' | 'transacciones';

export default function PasarelasPagoView() {
  const [vistaActual, setVistaActual] = useState<VistaPasarela>('overview');
  const [configOnePay, setConfigOnePay] = useState<ConfiguracionOnePay | null>(null);
  const [configStripe, setConfigStripe] = useState<ConfiguracionStripe | null>(null);
  const [transacciones, setTransacciones] = useState<TransaccionOnePay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalOnePay, setMostrarModalOnePay] = useState(false);
  const [mostrarModalStripe, setMostrarModalStripe] = useState(false);

  useEffect(() => {
    if (vistaActual === 'overview' || vistaActual === 'onepay') {
      cargarConfiguracionOnePay();
    }
    if (vistaActual === 'overview' || vistaActual === 'stripe') {
      cargarConfiguracionStripe();
    }
    if (vistaActual === 'transacciones') {
      cargarTransacciones();
    }
  }, [vistaActual]);

  const cargarConfiguracionOnePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerConfiguracionOnePay();
      setConfigOnePay(data);
    } catch (err) {
      console.error('Error al cargar configuración One Pay:', err);
      setError('Error al cargar la configuración de One Pay');
    } finally {
      setLoading(false);
    }
  };

  const cargarConfiguracionStripe = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerConfiguracionStripe();
      setConfigStripe(data);
    } catch (err) {
      console.error('Error al cargar configuración Stripe:', err);
      setError('Error al cargar la configuración de Stripe');
    } finally {
      setLoading(false);
    }
  };

  const cargarTransacciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await obtenerTransaccionesOnePay({ page: 1, limit: 50 });
      setTransacciones(resultado.transacciones);
    } catch (err) {
      console.error('Error al cargar transacciones:', err);
      setError('Error al cargar las transacciones');
    } finally {
      setLoading(false);
    }
  };

  const handleProbarConexionOnePay = async () => {
    try {
      const resultado = await probarConexionOnePay();
      if (resultado.exito) {
        alert(`Conexión exitosa: ${resultado.mensaje}`);
      } else {
        alert(`Error en la conexión: ${resultado.mensaje}`);
      }
    } catch (err) {
      console.error('Error al probar conexión:', err);
      alert('Error al probar la conexión con One Pay');
    }
  };

  const handleProbarConexionStripe = async () => {
    try {
      const resultado = await probarConexionStripe();
      if (resultado.exito) {
        alert(`Conexión exitosa: ${resultado.mensaje}`);
      } else {
        alert(`Error en la conexión: ${resultado.mensaje}`);
      }
    } catch (err) {
      console.error('Error al probar conexión:', err);
      alert('Error al probar la conexión con Stripe');
    }
  };

  return (
    <div className="p-6">
      {/* Navegación de pestañas */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setVistaActual('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                vistaActual === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Resumen
            </button>
            <button
              onClick={() => setVistaActual('onepay')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                vistaActual === 'onepay'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <QrCode className="w-4 h-4 inline mr-2" />
              One Pay
            </button>
            <button
              onClick={() => setVistaActual('stripe')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                vistaActual === 'stripe'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Stripe
            </button>
            <button
              onClick={() => setVistaActual('transacciones')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                vistaActual === 'transacciones'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Transacciones
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

      {loading && vistaActual !== 'transacciones' ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : vistaActual === 'overview' ? (
        <VistaResumen
          configOnePay={configOnePay}
          configStripe={configStripe}
          onConfigurarOnePay={() => setMostrarModalOnePay(true)}
          onConfigurarStripe={() => setMostrarModalStripe(true)}
          onProbarOnePay={handleProbarConexionOnePay}
          onProbarStripe={handleProbarConexionStripe}
        />
      ) : vistaActual === 'onepay' ? (
        <VistaOnePay
          config={configOnePay}
          onConfigurar={() => setMostrarModalOnePay(true)}
          onProbarConexion={handleProbarConexionOnePay}
          onRecargar={cargarConfiguracionOnePay}
        />
      ) : vistaActual === 'stripe' ? (
        <VistaStripe
          config={configStripe}
          onConfigurar={() => setMostrarModalStripe(true)}
          onProbarConexion={handleProbarConexionStripe}
          onRecargar={cargarConfiguracionStripe}
        />
      ) : (
        <TablaTransaccionesOnePay
          transacciones={transacciones}
          loading={loading}
          onRecargar={cargarTransacciones}
        />
      )}

      {/* Modales */}
      {mostrarModalOnePay && (
        <ModalConfiguracionOnePay
          configuracion={configOnePay}
          onCerrar={() => {
            setMostrarModalOnePay(false);
          }}
          onGuardado={() => {
            setMostrarModalOnePay(false);
            cargarConfiguracionOnePay();
          }}
        />
      )}

      {mostrarModalStripe && (
        <ModalConfiguracionStripe
          configuracion={configStripe}
          onCerrar={() => {
            setMostrarModalStripe(false);
          }}
          onGuardado={() => {
            setMostrarModalStripe(false);
            cargarConfiguracionStripe();
          }}
        />
      )}
    </div>
  );
}

// Vista de Resumen
function VistaResumen({
  configOnePay,
  configStripe,
  onConfigurarOnePay,
  onConfigurarStripe,
  onProbarOnePay,
  onProbarStripe,
}: {
  configOnePay: ConfiguracionOnePay | null;
  configStripe: ConfiguracionStripe | null;
  onConfigurarOnePay: () => void;
  onConfigurarStripe: () => void;
  onProbarOnePay: () => void;
  onProbarStripe: () => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pasarelas de Pago</h2>
        <p className="text-gray-600">
          Gestiona las integraciones con pasarelas de pago para procesar pagos de forma segura
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* One Pay */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">One Pay (Transbank)</h3>
                <p className="text-sm text-gray-500">Pagos mediante código QR</p>
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                configOnePay?.activa
                  ? 'text-green-600 bg-green-100'
                  : 'text-gray-600 bg-gray-100'
              }`}
            >
              {configOnePay?.activa ? (
                <CheckCircle className="w-4 h-4 inline mr-1" />
              ) : (
                <XCircle className="w-4 h-4 inline mr-1" />
              )}
              {configOnePay?.activa ? 'Activa' : 'No configurada'}
            </div>
          </div>

          {configOnePay && (
            <div className="mb-4 text-sm text-gray-600">
              <p>
                <span className="font-medium">Entorno:</span>{' '}
                {configOnePay.entorno === 'produccion' ? 'Producción' : 'Integración'}
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={onConfigurarOnePay}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              {configOnePay ? 'Editar Configuración' : 'Configurar'}
            </button>
            {configOnePay?.activa && (
              <button
                onClick={onProbarOnePay}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Probar
              </button>
            )}
          </div>
        </div>

        {/* Stripe */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Stripe</h3>
                <p className="text-sm text-gray-500">Pagos con tarjeta de crédito</p>
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                configStripe?.activa
                  ? 'text-green-600 bg-green-100'
                  : 'text-gray-600 bg-gray-100'
              }`}
            >
              {configStripe?.activa ? (
                <CheckCircle className="w-4 h-4 inline mr-1" />
              ) : (
                <XCircle className="w-4 h-4 inline mr-1" />
              )}
              {configStripe?.activa ? 'Activa' : 'No configurada'}
            </div>
          </div>

          {configStripe && (
            <div className="mb-4 text-sm text-gray-600">
              <p>
                <span className="font-medium">Entorno:</span>{' '}
                {configStripe.entorno === 'live' ? 'Producción' : 'Pruebas'}
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={onConfigurarStripe}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              {configStripe ? 'Editar Configuración' : 'Configurar'}
            </button>
            {configStripe?.activa && (
              <button
                onClick={onProbarStripe}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Probar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Información Importante</h4>
            <p className="text-sm text-blue-800">
              Las credenciales de las pasarelas de pago se almacenan de forma segura y encriptada.
              Asegúrate de tener las credenciales correctas antes de activar las integraciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Vista One Pay
function VistaOnePay({
  config,
  onConfigurar,
  onProbarConexion,
  onRecargar,
}: {
  config: ConfiguracionOnePay | null;
  onConfigurar: () => void;
  onProbarConexion: () => void;
  onRecargar: () => void;
}) {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">One Pay (Transbank)</h2>
          <p className="text-gray-600">
            Configura la integración con One Pay para procesar pagos mediante código QR
          </p>
        </div>
        <button
          onClick={onConfigurar}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>{config ? 'Editar Configuración' : 'Configurar'}</span>
        </button>
      </div>

      {config ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-4">Configuración Actual</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Estado:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    config.activa
                      ? 'text-green-600 bg-green-100'
                      : 'text-gray-600 bg-gray-100'
                  }`}
                >
                  {config.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Entorno:</span>
                <span className="ml-2 text-sm text-gray-600">
                  {config.entorno === 'produccion' ? 'Producción' : 'Integración'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">API Key:</span>
                <span className="ml-2 text-sm text-gray-600">****{config.apiKey.slice(-4)}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onProbarConexion}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Probar Conexión
            </button>
            <button
              onClick={onConfigurar}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Editar Configuración
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">One Pay no configurado</h3>
          <p className="text-gray-600 mb-6">
            Configura la integración con One Pay para comenzar a procesar pagos mediante código QR
          </p>
          <button
            onClick={onConfigurar}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Configurar One Pay
          </button>
        </div>
      )}
    </div>
  );
}

// Vista Stripe
function VistaStripe({
  config,
  onConfigurar,
  onProbarConexion,
  onRecargar,
}: {
  config: ConfiguracionStripe | null;
  onConfigurar: () => void;
  onProbarConexion: () => void;
  onRecargar: () => void;
}) {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Stripe</h2>
          <p className="text-gray-600">
            Configura la integración con Stripe para procesar pagos con tarjeta de crédito
          </p>
        </div>
        <button
          onClick={onConfigurar}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>{config ? 'Editar Configuración' : 'Configurar'}</span>
        </button>
      </div>

      {config ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-4">Configuración Actual</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Estado:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    config.activa
                      ? 'text-green-600 bg-green-100'
                      : 'text-gray-600 bg-gray-100'
                  }`}
                >
                  {config.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Entorno:</span>
                <span className="ml-2 text-sm text-gray-600">
                  {config.entorno === 'live' ? 'Producción' : 'Pruebas'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Publishable Key:</span>
                <span className="ml-2 text-sm text-gray-600">
                  {config.publishableKey.substring(0, 20)}...
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onProbarConexion}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Probar Conexión
            </button>
            <button
              onClick={onConfigurar}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Editar Configuración
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Stripe no configurado</h3>
          <p className="text-gray-600 mb-6">
            Configura la integración con Stripe para comenzar a procesar pagos con tarjeta
          </p>
          <button
            onClick={onConfigurar}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Configurar Stripe
          </button>
        </div>
      )}
    </div>
  );
}



