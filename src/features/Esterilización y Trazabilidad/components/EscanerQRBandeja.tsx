import { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, X, AlertCircle } from 'lucide-react';

interface EscanerQRBandejaProps {
  onCodigoEscaneado: (codigo: string) => void;
  onCerrar?: () => void;
}

export default function EscanerQRBandeja({ onCodigoEscaneado, onCerrar }: EscanerQRBandejaProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codigoManual, setCodigoManual] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Limpiar stream al desmontar
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const iniciarEscaner = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Cámara trasera en móviles
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setError('No se pudo acceder a la cámara. Por favor, permita el acceso a la cámara.');
    }
  };

  const detenerEscaner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleInputManual = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodigoManual(e.target.value);
  };

  const handleEnviarCodigoManual = () => {
    if (codigoManual.trim()) {
      onCodigoEscaneado(codigoManual.trim());
      setCodigoManual('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEnviarCodigoManual();
    }
  };

  // Nota: Para una implementación completa de escaneo QR, se necesitaría una librería
  // como 'html5-qrcode' o 'react-qr-reader'. Esta es una versión básica que permite
  // entrada manual y prepara la estructura para integrar el escáner real.

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-blue-600" />
          <span>Escanear Código QR de Bandeja</span>
        </h3>
        {onCerrar && (
          <button
            onClick={onCerrar}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Área de escaneo */}
      <div className="mb-4">
        {!isScanning ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">
              Inicie el escáner para leer el código QR de la bandeja
            </p>
            <button
              onClick={iniciarEscaner}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Iniciar Escáner
            </button>
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg border-2 border-blue-500"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-4 border-blue-500 rounded-lg w-64 h-64 opacity-75"></div>
            </div>
            <button
              onClick={detenerEscaner}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Entrada manual */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 mb-2">O ingrese el código manualmente:</p>
        <div className="flex space-x-2">
          <input
            type="text"
            value={codigoManual}
            onChange={handleInputManual}
            onKeyPress={handleKeyPress}
            placeholder="Código de la bandeja..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleEnviarCodigoManual}
            disabled={!codigoManual.trim()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Nota técnica */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Nota:</strong> Para una implementación completa, se recomienda integrar una librería
          como 'html5-qrcode' o 'react-qr-reader' para el escaneo automático de códigos QR.
        </p>
      </div>
    </div>
  );
}


