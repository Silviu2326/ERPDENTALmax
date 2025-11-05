import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_LABELS } from '../types/auth';
import { Home, LogOut, Stethoscope, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white flex flex-col shadow-2xl border-r border-blue-800/50 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 border-b border-blue-800/50 bg-gradient-to-b from-blue-900/50 to-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30 flex-shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
              <h2 className="font-bold text-lg bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent whitespace-nowrap">
                DentalERP
              </h2>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-blue-800/50 transition-all duration-200 flex-shrink-0"
            aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-blue-300" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-blue-300" />
            )}
          </button>
        </div>
        <div className={`mt-5 pt-5 border-t border-blue-800/50 bg-gradient-to-br from-blue-800/30 to-indigo-800/30 rounded-xl p-4 backdrop-blur-sm transition-all duration-300 ${isCollapsed ? 'px-2' : ''}`}>
          <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
            <p className="text-xs text-blue-300/80 font-medium uppercase tracking-wide mb-1.5">Usuario</p>
            <p className="font-bold text-base text-white">{user.name}</p>
            <p className="text-xs text-blue-300/70 mt-1.5 font-medium">{ROLE_LABELS[user.role]}</p>
          </div>
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-blue-700/50 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4">
        <button className={`w-full flex items-center rounded-xl bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-900/50 hover:shadow-xl hover:shadow-blue-900/60 transform hover:-translate-y-0.5 border border-blue-700/30 ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}>
          <Home className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Inicio
          </span>
        </button>
      </nav>

      <div className="p-4 border-t border-blue-800/50 bg-gradient-to-t from-blue-900/50 to-transparent">
        <button
          onClick={logout}
          className={`w-full flex items-center rounded-xl hover:bg-gradient-to-r hover:from-red-900/30 hover:to-rose-900/30 transition-all duration-200 text-red-300 hover:text-red-200 font-semibold border-2 border-transparent hover:border-red-800/30 shadow-sm hover:shadow-md ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Cerrar Sesión
          </span>
        </button>
      </div>
    </div>
  );
}
