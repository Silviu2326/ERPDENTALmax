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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Proveedores y Almacén
              </h1>
              <p className="text-gray-600 mt-1">
                Administra proveedores y catálogo de productos médicos
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-white'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenido de las pestañas */}
          <div className="p-0">
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
    </div>
  );
}

