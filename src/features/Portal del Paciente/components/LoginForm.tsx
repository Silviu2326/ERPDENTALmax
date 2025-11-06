import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { iniciarSesion, DatosLogin } from '../api/authApi';

interface LoginFormProps {
  onLoginSuccess?: (token: string) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export default function LoginForm({ onLoginSuccess, onForgotPassword, onRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const datos: DatosLogin = { email, password };
      const respuesta = await iniciarSesion(datos);
      
      if (respuesta.token) {
        // Guardar token en localStorage
        localStorage.setItem('patientToken', respuesta.token);
        if (onLoginSuccess) {
          onLoginSuccess(respuesta.token);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Iniciando sesión...</span>
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            <span>Iniciar sesión</span>
          </>
        )}
      </button>

      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onRegister}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </form>
  );
}


