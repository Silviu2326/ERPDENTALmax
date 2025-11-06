import { useState, FormEvent } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { solicitarRecuperacionPassword } from '../api/authApi';

interface ForgotPasswordFormProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function ForgotPasswordForm({ onBack, onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await solicitarRecuperacionPassword(email);
      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al solicitar la recuperación de contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <p className="font-semibold mb-1">¡Correo enviado!</p>
          <p>Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor, revisa tu bandeja de entrada.</p>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al inicio de sesión</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Correo electrónico
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="tu@email.com"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Enviar enlace de recuperación</span>
          </>
        )}
      </button>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al inicio de sesión</span>
        </button>
      )}
    </form>
  );
}


