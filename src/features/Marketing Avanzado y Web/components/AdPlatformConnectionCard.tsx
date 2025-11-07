import { useState } from 'react';
import { CheckCircle2, XCircle, Link2, ExternalLink, Loader2 } from 'lucide-react';
import { PlatformConnection, Platform, initiateOAuthConnection, disconnectPlatform } from '../api/adsIntegrationApi';

interface AdPlatformConnectionCardProps {
  connection: PlatformConnection;
  onConnectionChange: () => void;
}

export default function AdPlatformConnectionCard({
  connection,
  onConnectionChange,
}: AdPlatformConnectionCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const platformName = connection.platform === 'google' ? 'Google Ads' : 'Meta Ads';
  const isGoogle = connection.platform === 'google';

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { redirectUrl } = await initiateOAuthConnection(connection.platform);
      // Redirigir a la URL de autorización
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Error al conectar:', error);
      alert('Error al iniciar la conexión. Por favor, inténtalo de nuevo.');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm(`¿Estás seguro de que deseas desconectar ${platformName}?`)) {
      return;
    }

    setIsDisconnecting(true);
    try {
      await disconnectPlatform(connection.platform);
      onConnectionChange();
    } catch (error) {
      console.error('Error al desconectar:', error);
      alert('Error al desconectar la plataforma. Por favor, inténtalo de nuevo.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md ${
      connection.connected 
        ? (isGoogle ? 'ring-1 ring-blue-200' : 'ring-1 ring-purple-200')
        : 'ring-1 ring-slate-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ring-1 ${
            isGoogle 
              ? 'bg-blue-100 ring-blue-200/70' 
              : 'bg-purple-100 ring-purple-200/70'
          }`}>
            {connection.platform === 'google' ? (
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{platformName}</h3>
            <p className="text-sm text-gray-600">
              {connection.connected ? 'Plataforma conectada' : 'No conectada'}
            </p>
          </div>
        </div>
        <div>
          {connection.connected ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-gray-400" />
          )}
        </div>
      </div>

      {connection.connected ? (
        <div className="space-y-3">
          {connection.accountName && (
            <div className="text-sm text-gray-600">
              <span className="font-medium text-slate-700">Cuenta:</span> {connection.accountName}
            </div>
          )}
          {connection.connectedAt && (
            <div className="text-sm text-gray-600">
              <span className="font-medium text-slate-700">Conectada el:</span>{' '}
              {new Date(connection.connectedAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          )}
          <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
            <button
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium ring-1 ring-red-200"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Desconectando...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Desconectar</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Conecta tu cuenta de {platformName} para sincronizar datos de campañas y enviar conversiones offline.
          </p>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm ring-1 ${
              isGoogle 
                ? 'bg-blue-600 hover:bg-blue-700 ring-blue-600/20' 
                : 'bg-purple-600 hover:bg-purple-700 ring-purple-600/20'
            }`}
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                <span>Conectar {platformName}</span>
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

