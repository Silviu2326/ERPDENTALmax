import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_LABELS } from '../types/auth';
import { Home, LogOut, Stethoscope, ChevronLeft, ChevronRight, Calendar, Lock, Clock, RefreshCw, Users, Receipt, Calculator, DollarSign, CreditCard, Coins, PercentCircle, FileText, Download, Building2, FileCheck, ClipboardCheck, History, Warehouse, Package, BarChart3, FileBarChart, FileCode, Scan, Smartphone, Wallet, Shield, Activity, Droplets, Wrench, UserCircle, ClipboardList, Video, Building, KeyRound, Target, Megaphone, TrendingUp, Plug } from 'lucide-react';

type Page = 'dashboard' | 'agenda-citas' | 'nueva-cita' | 'administracion-bloqueos' | 'gestion-disponibilidad' | 'reprogramacion-masiva' | 'gestion-pacientes' | 'paciente-perfil' | 'nueva-ficha-paciente' | 'presupuestos' | 'crear-presupuesto' | 'editar-presupuesto' | 'plan-tratamiento-builder' | 'lista-planes-paciente' | 'simulador-costos' | 'aprobar-presupuesto' | 'facturacion-cobros-contabilidad' | 'nueva-factura' | 'recibos-pagos' | 'anticipos' | 'comisiones-profesional' | 'liquidacion-mutuas' | 'exportacion-contabilidad' | 'gestion-mutuas-seguros' | 'convenios-acuerdos' | 'asistente-facturacion' | 'autorizaciones-tratamientos' | 'historial-pagos-seguros' | 'inventario-compras' | 'gestion-proveedores-almacen' | 'cuadro-mandos-informes' | 'informes-configurables' | 'documentacion-protocolos' | 'integracion-radiologica' | 'portal-cita-online-movil' | 'pasarela-pagos-financiacion' | 'seguridad-cumplimiento' | 'especialidades-clinicas' | 'esterilizacion-trazabilidad' | 'informes-trazabilidad' | 'mantenimiento-equipamiento' | 'portal-paciente' | 'portal-paciente-mis-citas' | 'portal-paciente-mis-documentos' | 'portal-paciente-mis-imagenes' | 'portal-paciente-mis-presupuestos' | 'portal-paciente-detalle-presupuesto' | 'portal-paciente-mensajeria' | 'portal-paciente-login' | 'portal-paciente-verify-email' | 'portal-paciente-reset-password' | 'portal-paciente-responder-encuesta' | 'gestion-encuestas' | 'resultados-encuesta' | 'teleodontologia' | 'multi-sede-franquicias' | 'transferencia-pacientes' | 'dashboard-sedes' | 'permisos-roles-sede' | 'calidad-auditoria' | 'marketing-avanzado-web' | 'analitica-avanzada-data' | 'integraciones-y-apis';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
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

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <button
          onClick={() => onPageChange('dashboard')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'dashboard'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Inicio
          </span>
        </button>

        <button
          onClick={() => onPageChange('agenda-citas')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'agenda-citas'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Calendar className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Agenda de Citas
          </span>
        </button>

        <button
          onClick={() => onPageChange('teleodontologia')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'teleodontologia'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Video className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Teleodontología
          </span>
        </button>

        <button
          onClick={() => onPageChange('portal-cita-online-movil')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'portal-cita-online-movil'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Smartphone className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Agenda Mobile
          </span>
        </button>

        <button
          onClick={() => onPageChange('gestion-pacientes')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'gestion-pacientes'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Users className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Pacientes
          </span>
        </button>

        <button
          onClick={() => onPageChange('presupuestos')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'presupuestos'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Receipt className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Presupuestos
          </span>
        </button>

        <button
          onClick={() => onPageChange('inventario-compras')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'inventario-compras'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Warehouse className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Inventario y Compras
          </span>
        </button>

        <button
          onClick={() => onPageChange('gestion-proveedores-almacen')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'gestion-proveedores-almacen'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Package className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Proveedores y Almacén
          </span>
        </button>

        <button
          onClick={() => onPageChange('facturacion-cobros-contabilidad')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'facturacion-cobros-contabilidad'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <DollarSign className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Facturación y Cobros
          </span>
        </button>

        <button
          onClick={() => onPageChange('pasarela-pagos-financiacion')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'pasarela-pagos-financiacion'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Wallet className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Pasarela de Pagos
          </span>
        </button>

        <button
          onClick={() => onPageChange('multi-sede-franquicias')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'multi-sede-franquicias' || currentPage === 'transferencia-pacientes' || currentPage === 'dashboard-sedes' || currentPage === 'permisos-roles-sede'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Building className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Multi-sede y Franquicias
          </span>
        </button>

        <button
          onClick={() => onPageChange('permisos-roles-sede')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'permisos-roles-sede'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <KeyRound className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Permisos y Roles por Sede
          </span>
        </button>

        <button
          onClick={() => onPageChange('cuadro-mandos-informes')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'cuadro-mandos-informes'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <BarChart3 className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Cuadro de Mandos
          </span>
        </button>

        <button
          onClick={() => onPageChange('informes-configurables')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'informes-configurables'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <FileBarChart className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Informes Configurables
          </span>
        </button>

        <button
          onClick={() => onPageChange('analitica-avanzada-data')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'analitica-avanzada-data'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <TrendingUp className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Analítica Avanzada
          </span>
        </button>

        <button
          onClick={() => onPageChange('documentacion-protocolos')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'documentacion-protocolos'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <FileCode className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Documentación y Protocolos
          </span>
        </button>

        <button
          onClick={() => onPageChange('integracion-radiologica')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'integracion-radiologica'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Scan className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Integración Radiológica
          </span>
        </button>

        <button
          onClick={() => onPageChange('especialidades-clinicas')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'especialidades-clinicas'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Activity className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Especialidades Clínicas
          </span>
        </button>

        <button
          onClick={() => onPageChange('liquidacion-mutuas')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'liquidacion-mutuas'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Liquidación Mutuas
          </span>
        </button>

        <button
          onClick={() => onPageChange('exportacion-contabilidad')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'exportacion-contabilidad'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Download className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Exportación Contabilidad
          </span>
        </button>

        <button
          onClick={() => onPageChange('gestion-mutuas-seguros')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'gestion-mutuas-seguros'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Building2 className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Mutuas y Seguros
          </span>
        </button>

        <button
          onClick={() => onPageChange('convenios-acuerdos')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'convenios-acuerdos'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <FileCheck className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Convenios y Acuerdos
          </span>
        </button>

        <button
          onClick={() => onPageChange('autorizaciones-tratamientos')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'autorizaciones-tratamientos'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <ClipboardCheck className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Autorizaciones de Tratamientos
          </span>
        </button>

        <button
          onClick={() => onPageChange('historial-pagos-seguros')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'historial-pagos-seguros'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <History className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Historial de Pagos
          </span>
        </button>

        <button
          onClick={() => onPageChange('recibos-pagos')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'recibos-pagos'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <CreditCard className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Recibos y Pagos
          </span>
        </button>

        <button
          onClick={() => onPageChange('anticipos')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'anticipos'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Coins className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Anticipos y Señales
          </span>
        </button>

        <button
          onClick={() => onPageChange('comisiones-profesional')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'comisiones-profesional'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <PercentCircle className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Comisiones por Profesional
          </span>
        </button>

        <button
          onClick={() => onPageChange('simulador-costos')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'simulador-costos'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Calculator className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Simulador de Costos
          </span>
        </button>

        <button
          onClick={() => onPageChange('administracion-bloqueos')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'administracion-bloqueos'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Lock className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Bloqueos
          </span>
        </button>

        <button
          onClick={() => onPageChange('gestion-disponibilidad')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'gestion-disponibilidad'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Clock className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Disponibilidad
          </span>
        </button>

        <button
          onClick={() => onPageChange('reprogramacion-masiva')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'reprogramacion-masiva'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <RefreshCw className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Reprogramación Masiva
          </span>
        </button>

        <button
          onClick={() => onPageChange('seguridad-cumplimiento')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'seguridad-cumplimiento'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Shield className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Seguridad y Cumplimiento
          </span>
        </button>

        <button
          onClick={() => onPageChange('esterilizacion-trazabilidad')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'esterilizacion-trazabilidad'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Droplets className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Esterilización y Trazabilidad
          </span>
        </button>

        <button
          onClick={() => onPageChange('informes-trazabilidad')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'informes-trazabilidad'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <FileBarChart className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Informes de Trazabilidad
          </span>
        </button>

        <button
          onClick={() => onPageChange('mantenimiento-equipamiento')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'mantenimiento-equipamiento'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Wrench className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Mantenimiento y Equipamiento
          </span>
        </button>

        <button
          onClick={() => onPageChange('gestion-encuestas')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'gestion-encuestas' || currentPage === 'resultados-encuesta'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <ClipboardList className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Encuestas de Satisfacción
          </span>
        </button>

        <button
          onClick={() => onPageChange('calidad-auditoria')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'calidad-auditoria'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Target className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Calidad y Auditoría
          </span>
        </button>

        <button
          onClick={() => onPageChange('marketing-avanzado-web')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'marketing-avanzado-web'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Megaphone className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Marketing Avanzado y Web
          </span>
        </button>

        <button
          onClick={() => onPageChange('integraciones-y-apis')}
          className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
            currentPage === 'integraciones-y-apis'
              ? 'bg-gradient-to-r from-blue-800/80 to-indigo-800/80 hover:from-blue-700 hover:to-indigo-700 border-blue-700/30'
              : 'bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/70 hover:to-indigo-700/70 border-blue-700/20'
          } ${isCollapsed ? 'justify-center px-3 py-3.5' : 'space-x-3 px-4 py-3.5'}`}
        >
          <Plug className="w-5 h-5 flex-shrink-0" />
          <span className={`font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-0'}`}>
            Integraciones y APIs
          </span>
        </button>

        <div className="pt-4 mt-4 border-t border-blue-800/50">
          <button
            onClick={() => onPageChange('portal-paciente-login')}
            className={`w-full flex items-center rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
              currentPage === 'portal-paciente' || currentPage === 'portal-paciente-login' || currentPage === 'portal-paciente-verify-email' || currentPage === 'portal-paciente-reset-password'
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
