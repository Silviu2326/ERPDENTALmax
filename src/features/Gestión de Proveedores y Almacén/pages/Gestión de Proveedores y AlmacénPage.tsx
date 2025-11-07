import { useState } from 'react';
import { Building2, Package, Warehouse, ArrowRightLeft, Truck, Users, Clock, TrendingUp, Shield, DollarSign, BarChart3, Mail, MessageSquare, Bell, FileText, Repeat, Target, Tag } from 'lucide-react';
import CatalogoProductosPage from './CatalogoProductosPage';
import GestionProveedoresTab from '../components/GestionProveedoresTab';
import GestionAlmacenesTab from '../components/GestionAlmacenesTab';
import TransferenciasAlmacenesPage from './TransferenciasAlmacenesPage';
import DetalleTransferenciaPage from './DetalleTransferenciaPage';
import RecepcionMercanciasPage from './RecepcionMercanciasPage';
import ListadoEmpleadosPage from './ListadoEmpleadosPage';
import GestionHorariosTurnosPage from './GestionHorariosTurnosPage';
import ProductividadProfesionalPage from './ProductividadProfesionalPage';
import PermisosRolesPage from './PermisosRolesPage';
import NominasSalariosPage from './NominasSalariosPage';
import CrmDashboardPage from './CrmDashboardPage';
import EmailCampaignsPage from './EmailCampaignsPage';
import CampanasSmsPage from './CampanasSmsPage';
import RecordatoriosCitasPage from './RecordatoriosCitasPage';
import ConfiguracionPlantillasPage from './ConfiguracionPlantillasPage';
import CircuitosRecallsPage from './CircuitosRecallsPage';
import ListasPacientesPage from './ListasPacientesPage';
import SeguimientoCampanasPage from './SeguimientoCampanasPage';
import DetalleCampanaPage from './DetalleCampanaPage';
import PromocionesOfertasPage from './PromocionesOfertasPage';

type TabType = 'proveedores' | 'catalogo-productos' | 'almacenes' | 'transferencias' | 'recepcion-mercancias' | 'empleados' | 'horarios-turnos' | 'productividad-profesional' | 'permisos-roles' | 'nominas-salarios' | 'crm-dashboard' | 'campanas-email' | 'campanas-sms' | 'recordatorios-citas' | 'configuracion-plantillas' | 'circuitos-recalls' | 'listas-pacientes' | 'seguimiento-campanas' | 'promociones-ofertas';

export default function GestionProveedoresYAlmacenPage() {
  const [activeTab, setActiveTab] = useState<TabType>('proveedores');
  const [transferenciaSeleccionadaId, setTransferenciaSeleccionadaId] = useState<string | null>(null);
  const [campanaSeleccionadaId, setCampanaSeleccionadaId] = useState<string | null>(null);
  const tabs = [
    { id: 'proveedores' as TabType, label: 'Proveedores', icon: Building2 },
    { id: 'crm-dashboard' as TabType, label: 'Panel de CRM', icon: BarChart3 },
    { id: 'seguimiento-campanas' as TabType, label: 'Seguimiento de Campañas', icon: Target },
    { id: 'circuitos-recalls' as TabType, label: 'Circuitos Automáticos (Recalls)', icon: Repeat },
    { id: 'campanas-email' as TabType, label: 'Campañas de Email', icon: Mail },
    { id: 'campanas-sms' as TabType, label: 'Campañas de SMS', icon: MessageSquare },
    { id: 'recordatorios-citas' as TabType, label: 'Recordatorios de Citas', icon: Bell },
    { id: 'configuracion-plantillas' as TabType, label: 'Configuración Plantillas', icon: FileText },
    { id: 'listas-pacientes' as TabType, label: 'Listas de Pacientes', icon: Users },
    { id: 'promociones-ofertas' as TabType, label: 'Promociones y Ofertas', icon: Tag },
    { id: 'catalogo-productos' as TabType, label: 'Catálogo de Productos', icon: Package },
    { id: 'almacenes' as TabType, label: 'Almacenes', icon: Warehouse },
    { id: 'transferencias' as TabType, label: 'Transferencias', icon: ArrowRightLeft },
    { id: 'recepcion-mercancias' as TabType, label: 'Recepción de Mercancías', icon: Truck },
    { id: 'empleados' as TabType, label: 'Empleados', icon: Users },
    { id: 'horarios-turnos' as TabType, label: 'Horarios y Turnos', icon: Clock },
    { id: 'productividad-profesional' as TabType, label: 'Productividad por Profesional', icon: TrendingUp },
    { id: 'nominas-salarios' as TabType, label: 'Nóminas y Salarios', icon: DollarSign },
    { id: 'permisos-roles' as TabType, label: 'Permisos y Roles', icon: Shield },
  ];

  const handleVerDetalleTransferencia = (transferenciaId: string) => {
    setTransferenciaSeleccionadaId(transferenciaId);
  };

  const handleVolverATransferencias = () => {
    setTransferenciaSeleccionadaId(null);
  };

  const handleVerDetalleCampana = (campanaId: string) => {
    setCampanaSeleccionadaId(campanaId);
  };

  const handleVolverACampanas = () => {
    setCampanaSeleccionadaId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Building2 size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Gestión de Proveedores y Almacén
                </h1>
                <p className="text-gray-600">
                  Administra proveedores y catálogo de productos médicos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <div className="bg-white shadow-sm rounded-lg p-0 mb-6">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenido de las pestañas */}
        <div className="mt-6">
          {activeTab === 'proveedores' && <GestionProveedoresTab />}
          {activeTab === 'crm-dashboard' && <CrmDashboardPage />}
          {activeTab === 'seguimiento-campanas' && (
            <>
              {campanaSeleccionadaId ? (
                <DetalleCampanaPage
                  campanaId={campanaSeleccionadaId}
                  onVolver={handleVolverACampanas}
                />
              ) : (
                <SeguimientoCampanasPage onVerDetalle={handleVerDetalleCampana} />
              )}
            </>
          )}
          {activeTab === 'circuitos-recalls' && <CircuitosRecallsPage />}
          {activeTab === 'campanas-email' && <EmailCampaignsPage />}
          {activeTab === 'campanas-sms' && <CampanasSmsPage />}
          {activeTab === 'recordatorios-citas' && <RecordatoriosCitasPage />}
          {activeTab === 'configuracion-plantillas' && <ConfiguracionPlantillasPage />}
          {activeTab === 'listas-pacientes' && <ListasPacientesPage />}
          {activeTab === 'promociones-ofertas' && <PromocionesOfertasPage />}
          {activeTab === 'catalogo-productos' && <CatalogoProductosPage />}
          {activeTab === 'almacenes' && <GestionAlmacenesTab />}
          {activeTab === 'transferencias' && (
            <>
              {transferenciaSeleccionadaId ? (
                <DetalleTransferenciaPage
                  transferenciaId={transferenciaSeleccionadaId}
                  onVolver={handleVolverATransferencias}
                />
              ) : (
                <TransferenciasAlmacenesPage onVerDetalle={handleVerDetalleTransferencia} />
              )}
            </>
          )}
          {activeTab === 'recepcion-mercancias' && <RecepcionMercanciasPage />}
          {activeTab === 'empleados' && <ListadoEmpleadosPage />}
          {activeTab === 'horarios-turnos' && <GestionHorariosTurnosPage />}
          {activeTab === 'productividad-profesional' && <ProductividadProfesionalPage />}
          {activeTab === 'nominas-salarios' && <NominasSalariosPage />}
          {activeTab === 'permisos-roles' && <PermisosRolesPage />}
        </div>
      </div>
    </div>
  );
}

