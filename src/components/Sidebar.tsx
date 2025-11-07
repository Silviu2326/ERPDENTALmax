import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';
import { ROLE_LABELS } from '../types/auth';
import { canAccessRoute } from '../utils/rolePermissions';
import { Home, LogOut, Stethoscope, ChevronLeft, ChevronRight, Calendar, Lock, Clock, RefreshCw, Users, Receipt, Calculator, DollarSign, CreditCard, Coins, PercentCircle, FileText, Download, Building2, FileCheck, ClipboardCheck, History, Warehouse, Package, BarChart3, FileBarChart, FileCode, Scan, Smartphone, Wallet, Shield, Activity, Droplets, Wrench, UserCircle, ClipboardList, Video, Building, KeyRound, Target, Megaphone, TrendingUp, Plug } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/' || currentPath === '/dashboard';
    }
    return currentPath.startsWith(path);
  };

  if (!user) return null;
  
  // Función para verificar si el usuario puede ver una ruta
  const canView = (route: string) => {
    return canAccessRoute(user.role, route);
  };


  return (
    <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white flex flex-col shadow-2xl border-r border-blue-800/50 transition-all duration-300 ease-in-out z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 border-b border-blue-800/50 bg-gradient-to-b from-blue-900/50 to-transparent flex-shrink-0">
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

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
        {canView('/dashboard') && (
          <button
            onClick={() => navigate('/dashboard')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/dashboard')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Inicio
            </span>
          </button>
        )}

        {canView('/agenda-citas') && (
          <button
            onClick={() => navigate('/agenda-citas')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/agenda-citas')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Calendar className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Agenda de Citas
            </span>
          </button>
        )}

        {canView('/teleodontologia') && (
          <button
            onClick={() => navigate('/teleodontologia')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/teleodontologia')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Video className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Teleodontología
            </span>
          </button>
        )}

        {canView('/portal-cita-online-movil') && (
          <button
            onClick={() => navigate('/portal-cita-online-movil')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/portal-cita-online-movil')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Smartphone className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Agenda Mobile
            </span>
          </button>
        )}

        {canView('/gestion-pacientes') && (
          <button
            onClick={() => navigate('/gestion-pacientes')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/gestion-pacientes')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Users className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Pacientes
            </span>
          </button>
        )}

        {canView('/presupuestos') && (
          <button
            onClick={() => navigate('/presupuestos')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/presupuestos')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Receipt className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Presupuestos
            </span>
          </button>
        )}

        {canView('/inventario-compras') && (
          <button
            onClick={() => navigate('/inventario-compras')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/inventario-compras')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Warehouse className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Inventario y Compras
            </span>
          </button>
        )}

        {canView('/gestion-proveedores-almacen') && (
          <button
            onClick={() => navigate('/gestion-proveedores-almacen')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/gestion-proveedores-almacen')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Package className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Proveedores y Almacén
            </span>
          </button>
        )}

        {canView('/facturacion-cobros-contabilidad') && (
          <button
            onClick={() => navigate('/facturacion-cobros-contabilidad')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/facturacion-cobros-contabilidad')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <DollarSign className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Facturación y Cobros
            </span>
          </button>
        )}

        {canView('/pasarela-pagos-financiacion') && (
          <button
            onClick={() => navigate('/pasarela-pagos-financiacion')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/pasarela-pagos-financiacion')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Wallet className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Pasarela de Pagos
            </span>
          </button>
        )}

        {canView('/multi-sede-franquicias') && (
          <button
            onClick={() => navigate('/multi-sede-franquicias')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/multi-sede-franquicias') || isActive('/transferencia-pacientes') || isActive('/dashboard-sedes') || isActive('/permisos-roles-sede')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Building className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Multi-sede y Franquicias
            </span>
          </button>
        )}

        {canView('/permisos-roles-sede') && (
          <button
            onClick={() => navigate('/permisos-roles-sede')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/permisos-roles-sede')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <KeyRound className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Permisos y Roles por Sede
            </span>
          </button>
        )}

        {canView('/cuadro-mandos-informes') && (
          <button
            onClick={() => navigate('/cuadro-mandos-informes')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/cuadro-mandos-informes')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <BarChart3 className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Cuadro de Mandos
            </span>
          </button>
        )}

        {canView('/informes-configurables') && (
          <button
            onClick={() => navigate('/informes-configurables')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/informes-configurables')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <FileBarChart className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Informes Configurables
            </span>
          </button>
        )}

        {canView('/analitica-avanzada-data') && (
          <button
            onClick={() => navigate('/analitica-avanzada-data')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/analitica-avanzada-data')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <TrendingUp className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Analítica Avanzada
            </span>
          </button>
        )}

        {canView('/documentacion-protocolos') && (
          <button
            onClick={() => navigate('/documentacion-protocolos')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/documentacion-protocolos')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <FileCode className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Documentación y Protocolos
            </span>
          </button>
        )}

        {canView('/integracion-radiologica') && (
          <button
            onClick={() => navigate('/integracion-radiologica')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/integracion-radiologica')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Scan className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Integración Radiológica
            </span>
          </button>
        )}

        {canView('/especialidades-clinicas') && (
          <button
            onClick={() => navigate('/especialidades-clinicas')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/especialidades-clinicas')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Activity className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Especialidades Clínicas
            </span>
          </button>
        )}

        {canView('/liquidacion-mutuas') && (
          <button
            onClick={() => navigate('/liquidacion-mutuas')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/liquidacion-mutuas')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Liquidación Mutuas
            </span>
          </button>
        )}

        {canView('/exportacion-contabilidad') && (
          <button
            onClick={() => navigate('/exportacion-contabilidad')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/exportacion-contabilidad')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Download className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Exportación Contabilidad
            </span>
          </button>
        )}

        {canView('/gestion-mutuas-seguros') && (
          <button
            onClick={() => navigate('/gestion-mutuas-seguros')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/gestion-mutuas-seguros')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Building2 className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Mutuas y Seguros
            </span>
          </button>
        )}

        {canView('/convenios-acuerdos') && (
          <button
            onClick={() => navigate('/convenios-acuerdos')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/convenios-acuerdos')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <FileCheck className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Convenios y Acuerdos
            </span>
          </button>
        )}

        {canView('/autorizaciones-tratamientos') && (
          <button
            onClick={() => navigate('/autorizaciones-tratamientos')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/autorizaciones-tratamientos')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <ClipboardCheck className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Autorizaciones de Tratamientos
            </span>
          </button>
        )}

        {canView('/historial-pagos-seguros') && (
          <button
            onClick={() => navigate('/historial-pagos-seguros')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/historial-pagos-seguros')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <History className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Historial de Pagos
            </span>
          </button>
        )}

        {canView('/recibos-pagos') && (
          <button
            onClick={() => navigate('/recibos-pagos')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/recibos-pagos')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <CreditCard className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Recibos y Pagos
            </span>
          </button>
        )}

        {canView('/anticipos') && (
          <button
            onClick={() => navigate('/anticipos')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/anticipos')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Coins className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Anticipos y Señales
            </span>
          </button>
        )}

        {canView('/comisiones-profesional') && (
          <button
            onClick={() => navigate('/comisiones-profesional')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/comisiones-profesional')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <PercentCircle className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Comisiones por Profesional
            </span>
          </button>
        )}

        {canView('/simulador-costos') && (
          <button
            onClick={() => navigate('/simulador-costos')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/simulador-costos')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Calculator className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Simulador de Costos
            </span>
          </button>
        )}

        {canView('/administracion-bloqueos') && (
          <button
            onClick={() => navigate('/administracion-bloqueos')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/administracion-bloqueos')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Lock className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Bloqueos
            </span>
          </button>
        )}

        {canView('/gestion-disponibilidad') && (
          <button
            onClick={() => navigate('/gestion-disponibilidad')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/gestion-disponibilidad')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Clock className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Disponibilidad
            </span>
          </button>
        )}

        {canView('/reprogramacion-masiva') && (
          <button
            onClick={() => navigate('/reprogramacion-masiva')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/reprogramacion-masiva')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <RefreshCw className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Reprogramación Masiva
            </span>
          </button>
        )}

        {canView('/seguridad-cumplimiento') && (
          <button
            onClick={() => navigate('/seguridad-cumplimiento')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/seguridad-cumplimiento')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Shield className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Seguridad y Cumplimiento
            </span>
          </button>
        )}

        {canView('/esterilizacion-trazabilidad') && (
          <button
            onClick={() => navigate('/esterilizacion-trazabilidad')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/esterilizacion-trazabilidad')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Droplets className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Esterilización y Trazabilidad
            </span>
          </button>
        )}

        {canView('/informes-trazabilidad') && (
          <button
            onClick={() => navigate('/informes-trazabilidad')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/informes-trazabilidad')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <FileBarChart className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Informes de Trazabilidad
            </span>
          </button>
        )}

        {canView('/mantenimiento-equipamiento') && (
          <button
            onClick={() => navigate('/mantenimiento-equipamiento')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/mantenimiento-equipamiento')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Wrench className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Mantenimiento y Equipamiento
            </span>
          </button>
        )}

        {canView('/gestion-encuestas') && (
          <button
            onClick={() => navigate('/gestion-encuestas')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/gestion-encuestas') || isActive('/resultados-encuesta')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <ClipboardList className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Encuestas de Satisfacción
            </span>
          </button>
        )}

        {canView('/calidad-auditoria') && (
          <button
            onClick={() => navigate('/calidad-auditoria')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/calidad-auditoria')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Target className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Calidad y Auditoría
            </span>
          </button>
        )}

        {canView('/marketing-avanzado-web') && (
          <button
            onClick={() => navigate('/marketing-avanzado-web')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/marketing-avanzado-web')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Megaphone className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Marketing Avanzado y Web
            </span>
          </button>
        )}

        {canView('/integraciones-y-apis') && (
          <button
            onClick={() => navigate('/integraciones-y-apis')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/integraciones-y-apis')
                ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
                : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <Plug className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Integraciones y APIs
            </span>
          </button>
        )}

        <div className="pt-4 mt-4 border-t border-blue-800/50">
          <button
            onClick={() => navigate('/portal-paciente-login')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              isActive('/portal-paciente') || isActive('/portal-paciente-login') || isActive('/portal-paciente-verify-email') || isActive('/portal-paciente-reset-password')
                ? 'bg-gradient-to-r from-green-800/80 to-emerald-800/80 hover:from-green-700 hover:to-emerald-700 border-green-700/30'
                : 'bg-gradient-to-r from-green-800/50 to-emerald-800/50 hover:from-green-700/70 hover:to-emerald-700/70 border-green-700/20'
            } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
          >
            <UserCircle className="w-5 h-5 flex-shrink-0" />
            <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
              Portal del Paciente
            </span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-blue-800/50 bg-gradient-to-t from-blue-900/50 to-transparent flex-shrink-0">
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
