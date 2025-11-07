import { useState } from 'react';
import { X, AlertTriangle, RotateCcw, Shield, Eye, EyeOff } from 'lucide-react';
import { BackupLog, formatFileSize } from '../api/backupApi';

interface RestoreBackupModalProps {
  backup: BackupLog | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmationToken: string) => Promise<void>;
  loading?: boolean;
}

export default function RestoreBackupModal({
  backup,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: RestoreBackupModalProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactorCode, setShowTwoFactorCode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !backup) return null;

  const formatearFecha = (fecha: Date | string) => {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isFormValid = () => {
    return (
      confirmationText === 'RESTAURAR SISTEMA' &&
      twoFactorCode.length === 6 &&
      /^\d+$/.test(twoFactorCode)
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError('Por favor, completa todos los campos correctamente');
      return;
    }

    setError(null);
    try {
      await onConfirm(twoFactorCode);
      // Reset form on success
      setConfirmationText('');
      setTwoFactorCode('');
      setShowTwoFactorCode(false);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar la restauración');
    }
  };

  const handleClose = () => {
    if (!loading) {
      setConfirmationText('');
      setTwoFactorCode('');
      setShowTwoFactorCode(false);
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Restaurar Sistema desde Copia de Seguridad</h2>
              <p className="text-sm text-red-100">Operación crítica - Requiere confirmación de seguridad</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Advertencia */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 mb-2">Advertencia: Operación Destructiva</p>
                <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                  <li>Esta operación restaurará el sistema a un estado anterior</li>
                  <li>Todos los datos creados después de esta copia se perderán permanentemente</li>
                  <li>El sistema entrará en modo de mantenimiento durante la restauración</li>
                  <li>Esta acción NO se puede deshacer</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Información de la copia de seguridad */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Información de la copia de seguridad:</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Fecha de creación:</span>
                <p className="font-medium text-gray-900">{formatearFecha(backup.timestamp)}</p>
              </div>
              <div>
                <span className="text-gray-600">Tipo:</span>
                <p className="font-medium text-gray-900">
                  {backup.type === 'manual' ? 'Manual' : 'Automática'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Tamaño:</span>
                <p className="font-medium text-gray-900">
                  {backup.size ? formatFileSize(backup.size) : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Creado por:</span>
                <p className="font-medium text-gray-900">{backup.createdBy?.nombre || 'Sistema'}</p>
              </div>
            </div>
            {backup.description && (
              <div className="mt-3">
                <span className="text-gray-600 text-sm">Descripción:</span>
                <p className="text-sm text-gray-900 mt-1">{backup.description}</p>
              </div>
            )}
          </div>

          {/* Confirmación de texto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Para confirmar, escribe exactamente: <span className="font-mono text-red-600">RESTAURAR SISTEMA</span>
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value);
                setError(null);
              }}
              placeholder="Escribe: RESTAURAR SISTEMA"
              disabled={loading}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                confirmationText === 'RESTAURAR SISTEMA'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {confirmationText && confirmationText !== 'RESTAURAR SISTEMA' && (
              <p className="mt-1 text-sm text-red-600">El texto no coincide</p>
            )}
          </div>

          {/* Código de autenticación de dos factores */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="w-4 h-4 inline mr-1" />
              Código de Autenticación de Dos Factores (2FA)
            </label>
            <div className="relative">
              <input
                type={showTwoFactorCode ? 'text' : 'password'}
                value={twoFactorCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setTwoFactorCode(value);
                  setError(null);
                }}
                placeholder="000000"
                disabled={loading}
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-center text-lg tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowTwoFactorCode(!showTwoFactorCode)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showTwoFactorCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Ingresa el código de 6 dígitos de tu aplicación de autenticación
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Iniciando restauración...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Confirmar Restauración</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



