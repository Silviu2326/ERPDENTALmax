import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_USERS, ROLE_LABELS } from '../types/auth';
import { Stethoscope } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);
    if (!success) {
      setError('Credenciales incorrectas');
    }
  };

  const handleQuickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');
    const success = login(userEmail, userPassword);
    if (!success) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 border border-gray-100/50 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl mb-5 shadow-lg shadow-blue-500/30">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            DentalERP
          </h1>
          <p className="text-gray-500 mt-3 text-sm font-medium">Sistema de Gestión Clínica</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2.5">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-gray-50 placeholder:text-gray-400 text-gray-700 font-medium"
              placeholder="usuario@clinica.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2.5">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-gray-50 placeholder:text-gray-400 text-gray-700 font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm font-medium shadow-sm animate-in fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-semibold mb-4 uppercase tracking-wide">Usuarios disponibles:</p>
          <div className="grid grid-cols-2 gap-3">
            {MOCK_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleQuickLogin(user.email, user.password)}
                className="text-xs p-3 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 rounded-xl border-2 border-blue-100 hover:border-blue-200 transition-all duration-200 font-medium text-left shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <div className="truncate font-semibold">{user.name}</div>
                <div className="text-xs opacity-70 truncate mt-0.5">{ROLE_LABELS[user.role]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
