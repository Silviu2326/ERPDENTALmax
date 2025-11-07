import { useState, FormEvent } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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
        <div className="rounded-2xl bg-green-50 ring-1 ring-green-200 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-900 mb-1">¡Correo enviado!</p>
              <p className="text-sm text-green-700">
                Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor, revisa tu bandeja de entrada.
              </p>
            </div>
          </div>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft size={18} className="opacity-100" />
            <span>Volver al inicio de sesión</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-sm text-gray-600">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
          <Mail size={16} className="inline mr-1" />
          Correo electrónico
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5 transition-all"
            placeholder="tu@email.com"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <Send size={18} className="opacity-100" />
            <span>Enviar enlace de recuperación</span>
          </>
        )}
      </button>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        >
          <ArrowLeft size={18} className="opacity-70" />
          <span>Volver al inicio de sesión</span>
        </button>
      )}
    </form>
  );
}



