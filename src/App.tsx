import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AgendaDeCitasYProgramacionPage from './features/Agenda de Citas y Programación/pages/Agenda de Citas y ProgramaciónPage';
import NuevaCitaPage from './features/Agenda de Citas y Programación/pages/NuevaCitaPage';
import AdministracionBloqueosPage from './features/Agenda de Citas y Programación/pages/AdministracionBloqueosPage';
import GestionDisponibilidadPage from './features/Agenda de Citas y Programación/pages/GestionDisponibilidadPage';
import ReprogramacionMasivaPage from './features/Agenda de Citas y Programación/pages/ReprogramacionMasivaPage';
import GestionPacientesHistoriaClinicaPage from './features/Gestión de Pacientes e Historia Clínica/pages/Gestión de Pacientes e Historia ClínicaPage';
import PacientePerfilPage from './features/Gestión de Pacientes e Historia Clínica/pages/PacientePerfilPage';
import NuevaFichaPacientePage from './features/Gestión de Pacientes e Historia Clínica/pages/NuevaFichaPacientePage';
import PresupuestosYPlanesDeTratamientoPage from './features/Presupuestos y Planes de Tratamiento/pages/Presupuestos y Planes de TratamientoPage';
import CrearNuevoPresupuestoPage from './features/Presupuestos y Planes de Tratamiento/pages/CrearNuevoPresupuestoPage';
import EditarPresupuestoPage from './features/Presupuestos y Planes de Tratamiento/pages/EditarPresupuestoPage';
import PlanTratamientoBuilderPage from './features/Presupuestos y Planes de Tratamiento/pages/PlanTratamientoBuilderPage';
import ListaPlanesPacientePage from './features/Presupuestos y Planes de Tratamiento/pages/ListaPlanesPacientePage';
import SimuladorCostosPage from './features/Presupuestos y Planes de Tratamiento/pages/SimuladorCostosPage';
import AprobacionPresupuestoPage from './features/Presupuestos y Planes de Tratamiento/pages/AprobacionPresupuestoPage';
import FacturacionCobrosYContabilidadPage from './features/Facturación, Cobros y Contabilidad/pages/Facturación, Cobros y ContabilidadPage';
import NuevaFacturaPage from './features/Facturación, Cobros y Contabilidad/pages/NuevaFacturaPage';
import EditarFacturaPage from './features/Facturación, Cobros y Contabilidad/pages/EditarFacturaPage';
import RecibosPagosPage from './features/Facturación, Cobros y Contabilidad/pages/RecibosPagosPage';
import AnticiposPage from './features/Facturación, Cobros y Contabilidad/pages/AnticiposPage';
import ComisionesProfesionalPage from './features/Facturación, Cobros y Contabilidad/pages/ComisionesProfesionalPage';
import LiquidacionMutuasPage from './features/Facturación, Cobros y Contabilidad/pages/LiquidacionMutuasPage';
import ExportacionContabilidadPage from './features/Facturación, Cobros y Contabilidad/pages/ExportacionContabilidadPage';
import GestionMutuasSegurosSaludPage from './features/Gestión de Mutuas/Seguros de Salud/pages/Gestión de MutuasSeguros de SaludPage';
import ConveniosAcuerdosPage from './features/Gestión de Mutuas/Seguros de Salud/pages/ConveniosAcuerdosPage';
import AsistenteFacturacionPage from './features/Gestión de Mutuas/Seguros de Salud/pages/AsistenteFacturacionPage';
import AutorizacionesTratamientosPage from './features/Gestión de Mutuas/Seguros de Salud/pages/AutorizacionesTratamientosPage';
import HistorialPagosSeguroPage from './features/Gestión de Mutuas/Seguros de Salud/pages/HistorialPagosSeguroPage';
import InventarioYComprasPage from './features/Inventario y Compras/pages/Inventario y ComprasPage';
import GestionProveedoresYAlmacenPage from './features/Gestión de Proveedores y Almacén/pages/Gestión de Proveedores y AlmacénPage';
import CuadroDeMandosEInformesPage from './features/Cuadro de Mandos e Informes/pages/Cuadro de Mandos e InformesPage';
import InformesConfigurablesPage from './features/Cuadro de Mandos e Informes/pages/InformesConfigurablesPage';
import DocumentacionYProtocolosPage from './features/Documentación y Protocolos/pages/Documentación y ProtocolosPage';
import IntegracionRadiologicaPage from './features/Integración Radiológica/pages/Integración RadiológicaPage';
import PortalDeCitaOnlineYMovilPage from './features/Portal de Cita Online y Móvil/pages/Portal de Cita Online y MóvilPage';
import PasarelaDePagosYFinanciacionPage from './features/Pasarela de Pagos y Financiación/pages/Pasarela de Pagos y FinanciaciónPage';
import SeguridadYCumplimientoPage from './features/Seguridad y Cumplimiento/pages/Seguridad y CumplimientoPage';
import EspecialidadesClinicasPage from './features/Especialidades Clínicas/pages/Especialidades ClínicasPage';
import EndodonciaRegistroPage from './features/Especialidades Clínicas/pages/EndodonciaRegistroPage';
import EsterilizacionYTrazabilidadPage from './features/Esterilización y Trazabilidad/pages/Esterilización y TrazabilidadPage';
import InformesDeTrazabilidadPage from './features/Esterilización y Trazabilidad/pages/InformesDeTrazabilidadPage';
import MantenimientoYEquipamientoPage from './features/Mantenimiento y Equipamiento/pages/Mantenimiento y EquipamientoPage';
import PortalDelPacientePage from './features/Portal del Paciente/pages/Portal del PacientePage';
import MisCitasPage from './features/Portal del Paciente/pages/MisCitasPage';
import MisDocumentosPage from './features/Portal del Paciente/pages/MisDocumentosPage';
import MisImagenesPage from './features/Portal del Paciente/pages/MisImagenesPage';
import LoginPage from './features/Portal del Paciente/pages/LoginPage';
import VerifyEmailPage from './features/Portal del Paciente/pages/VerifyEmailPage';
import ResetPasswordPage from './features/Portal del Paciente/pages/ResetPasswordPage';
import MisPresupuestosPage from './features/Portal del Paciente/pages/MisPresupuestosPage';
import DetallePresupuestoPage from './features/Portal del Paciente/pages/DetallePresupuestoPage';
import MensajeriaPage from './features/Portal del Paciente/pages/MensajeriaPage';
import ResponderEncuestaPage from './features/Portal del Paciente/pages/ResponderEncuestaPage';
import GestionEncuestasPage from './features/Portal del Paciente/pages/GestionEncuestasPage';
import ResultadosEncuestaPage from './features/Portal del Paciente/pages/ResultadosEncuestaPage';
import TeleodontologíaPage from './features/Teleodontología/pages/TeleodontologíaPage';
import InformeTeleconsultaPage from './features/Teleodontología/pages/InformeTeleconsultaPage';
import MultiSedeYFranquiciasPage from './features/Multi-sede y Franquicias/pages/Multi-sede y FranquiciasPage';
import TransferenciaPacientesPage from './features/Multi-sede y Franquicias/pages/TransferenciaPacientesPage';
import DashboardSedesPage from './features/Multi-sede y Franquicias/pages/DashboardSedesPage';
import PermisosRolesSedePage from './features/Multi-sede y Franquicias/pages/PermisosRolesSedePage';
import CalidadYAuditoriaPage from './features/Calidad y Auditoría/pages/Calidad y AuditoríaPage';
import MarketingAvanzadoYWebPage from './features/Marketing Avanzado y Web/pages/Marketing Avanzado y WebPage';
import AnaliticaAvanzadaDataPage from './features/Analítica Avanzada & Data/pages/Analítica Avanzada & DataPage';
import IntegracionesYAPIsPage from './features/Integraciones y APIs/pages/Integraciones y APIsPage';

// Componente Layout que incluye el Sidebar
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;

  // Páginas del Portal del Paciente que no deben mostrar el Sidebar
  const portalPacientePages = ['/portal-paciente-login', '/portal-paciente-verify-email', '/portal-paciente-reset-password'];
  const portalPacientePagesWithSidebar = ['/portal-paciente', '/portal-paciente-mis-citas', '/portal-paciente-mis-documentos', '/portal-paciente-mis-imagenes', '/portal-paciente-mis-presupuestos', '/portal-paciente-detalle-presupuesto', '/portal-paciente-mensajeria', '/portal-paciente-responder-encuesta'];
  
  const shouldShowSidebar = !portalPacientePages.includes(pathname) && !portalPacientePagesWithSidebar.includes(pathname);

  // Si es una página del portal del paciente (sin sidebar), no mostrar sidebar
  if (portalPacientePagesWithSidebar.includes(pathname) || portalPacientePages.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

// Componente ProtectedRoute para proteger rutas que requieren autenticación
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Guardar la ruta desde donde se intentó acceder para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

// Componentes wrapper para páginas con parámetros
function PacientePerfilWrapper() {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const navigate = useNavigate();
  
  if (!pacienteId) {
    return <Navigate to="/gestion-pacientes" replace />;
  }
  
  return (
    <PacientePerfilPage
      pacienteId={pacienteId}
      onVolver={() => navigate('/gestion-pacientes')}
    />
  );
}

function EditarPresupuestoWrapper() {
  const { presupuestoId } = useParams<{ presupuestoId: string }>();
  const navigate = useNavigate();
  
  if (!presupuestoId) {
    return <Navigate to="/presupuestos" replace />;
  }
  
  return (
    <EditarPresupuestoPage
      presupuestoId={presupuestoId}
      onVolver={() => navigate('/presupuestos')}
    />
  );
}

function AprobarPresupuestoWrapper() {
  const { presupuestoId } = useParams<{ presupuestoId: string }>();
  const navigate = useNavigate();
  
  if (!presupuestoId) {
    return <Navigate to="/presupuestos" replace />;
  }
  
  return (
    <AprobacionPresupuestoPage
      presupuestoId={presupuestoId}
      onVolver={() => navigate('/presupuestos')}
      onAprobado={() => navigate('/presupuestos')}
    />
  );
}

function PlanTratamientoBuilderWrapper() {
  const { pacienteId, planId } = useParams<{ pacienteId?: string; planId?: string }>();
  const navigate = useNavigate();
  
  return (
    <PlanTratamientoBuilderPage
      pacienteId={pacienteId}
      planId={planId}
      onVolver={() => {
        if (pacienteId) {
          navigate(`/lista-planes-paciente/${pacienteId}`);
        } else {
          navigate('/presupuestos');
        }
      }}
      onGuardado={(planId) => {
        if (pacienteId) {
          navigate(`/lista-planes-paciente/${pacienteId}`);
        } else {
          navigate('/presupuestos');
        }
      }}
    />
  );
}

function ListaPlanesPacienteWrapper() {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const navigate = useNavigate();
  
  if (!pacienteId) {
    return <Navigate to="/gestion-pacientes" replace />;
  }
  
  return (
    <ListaPlanesPacientePage
      pacienteId={pacienteId}
      onVolver={() => navigate(`/paciente-perfil/${pacienteId}`)}
      onCrearNuevo={() => navigate(`/plan-tratamiento-builder/${pacienteId}`)}
      onEditar={(planId) => navigate(`/plan-tratamiento-builder/${pacienteId}/${planId}`)}
      onVerDetalle={(planId) => navigate(`/plan-tratamiento-builder/${pacienteId}/${planId}`)}
    />
  );
}

function SimuladorCostosWrapper() {
  const { pacienteId } = useParams<{ pacienteId?: string }>();
  const navigate = useNavigate();
  
  return (
    <SimuladorCostosPage
      pacienteId={pacienteId}
      onVolver={() => navigate('/presupuestos')}
      onGenerarPresupuesto={() => navigate('/crear-presupuesto')}
    />
  );
}

function EditarFacturaWrapper() {
  const { facturaId } = useParams<{ facturaId: string }>();
  const navigate = useNavigate();
  
  if (!facturaId) {
    return <Navigate to="/facturacion-cobros-contabilidad" replace />;
  }
  
  return (
    <EditarFacturaPage
      facturaId={facturaId}
      onVolver={() => navigate('/facturacion-cobros-contabilidad')}
      onFacturaActualizada={() => navigate('/facturacion-cobros-contabilidad')}
    />
  );
}

function EndodonciaRegistroWrapper() {
  const { tratamientoId, pacienteId, diente } = useParams<{ tratamientoId?: string; pacienteId?: string; diente?: string }>();
  const navigate = useNavigate();
  
  return (
    <EndodonciaRegistroPage
      tratamientoId={tratamientoId}
      pacienteId={pacienteId}
      numeroDiente={diente ? parseInt(diente) : undefined}
      onVolver={() => navigate('/especialidades-clinicas')}
    />
  );
}

function DetallePresupuestoPacienteWrapper() {
  const { presupuestoId } = useParams<{ presupuestoId: string }>();
  const navigate = useNavigate();
  
  if (!presupuestoId) {
    return <Navigate to="/portal-paciente-mis-presupuestos" replace />;
  }
  
  return (
    <DetallePresupuestoPage
      presupuestoId={presupuestoId}
      onVolver={() => navigate('/portal-paciente-mis-presupuestos')}
      onPresupuestoActualizado={() => navigate('/portal-paciente-mis-presupuestos')}
    />
  );
}

function ResponderEncuestaWrapper() {
  const { respuestaId } = useParams<{ respuestaId?: string }>();
  const navigate = useNavigate();
  
  return (
    <ResponderEncuestaPage
      respuestaId={respuestaId}
      onVolver={() => navigate('/portal-paciente')}
      onEnviar={() => navigate('/portal-paciente')}
    />
  );
}

function ResultadosEncuestaWrapper() {
  const { plantillaId } = useParams<{ plantillaId: string }>();
  const navigate = useNavigate();
  
  if (!plantillaId) {
    return <Navigate to="/gestion-encuestas" replace />;
  }
  
  return (
    <ResultadosEncuestaPage
      plantillaId={plantillaId}
      onVolver={() => navigate('/gestion-encuestas')}
    />
  );
}

function InformeTeleconsultaWrapper() {
  const { teleconsultaId } = useParams<{ teleconsultaId: string }>();
  const navigate = useNavigate();
  
  if (!teleconsultaId) {
    return <Navigate to="/teleodontologia" replace />;
  }
  
  return (
    <InformeTeleconsultaPage
      teleconsultaId={teleconsultaId}
      onVolver={() => navigate('/teleodontologia')}
    />
  );
}

function VerifyEmailWrapper() {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  
  return (
    <VerifyEmailPage
      token={token}
      onSuccess={() => navigate('/portal-paciente-login')}
      onBack={() => navigate('/portal-paciente-login')}
    />
  );
}

function ResetPasswordWrapper() {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  
  return (
    <ResetPasswordPage
      token={token}
      onSuccess={() => navigate('/portal-paciente-login')}
      onBack={() => navigate('/portal-paciente-login')}
    />
  );
}

// Componentes wrapper para páginas que navegan
function GestionPacientesWrapper() {
  const navigate = useNavigate();
  
  return (
    <GestionPacientesHistoriaClinicaPage
      onVerPaciente={(pacienteId) => navigate(`/paciente-perfil/${pacienteId}`)}
      onNuevoPaciente={() => navigate('/nueva-ficha-paciente')}
    />
  );
}

function NuevaFichaPacienteWrapper() {
  const navigate = useNavigate();
  
  return (
    <NuevaFichaPacientePage
      onPacienteCreado={(paciente) => {
        if (paciente._id) {
          navigate(`/paciente-perfil/${paciente._id}`);
        }
      }}
      onVolver={() => navigate('/gestion-pacientes')}
    />
  );
}

function PresupuestosWrapper() {
  const navigate = useNavigate();
  
  return (
    <PresupuestosYPlanesDeTratamientoPage
      onNuevoPresupuesto={() => navigate('/crear-presupuesto')}
      onEditarPresupuesto={(presupuestoId) => navigate(`/editar-presupuesto/${presupuestoId}`)}
      onAprobarPresupuesto={(presupuestoId) => navigate(`/aprobar-presupuesto/${presupuestoId}`)}
    />
  );
}

function FacturacionWrapper() {
  const navigate = useNavigate();
  
  return (
    <FacturacionCobrosYContabilidadPage
      onNuevaFactura={() => navigate('/nueva-factura')}
      onEditarFactura={(facturaId) => navigate(`/editar-factura/${facturaId}`)}
    />
  );
}

function GestionMutuasWrapper() {
  const navigate = useNavigate();
  
  return (
    <GestionMutuasSegurosSaludPage
      onAsistenteFacturacion={() => navigate('/asistente-facturacion')}
    />
  );
}

function EspecialidadesClinicasWrapper() {
  const navigate = useNavigate();
  
  return (
    <EspecialidadesClinicasPage
      onRegistroEndodoncia={(tratamientoId, pacienteId, diente) => {
        const params = new URLSearchParams();
        if (tratamientoId) params.set('tratamientoId', tratamientoId);
        if (pacienteId) params.set('pacienteId', pacienteId);
        if (diente) params.set('diente', diente.toString());
        navigate(`/endodoncia-registro?${params.toString()}`);
      }}
    />
  );
}

function PortalDelPacienteWrapper() {
  const navigate = useNavigate();
  
  return (
    <PortalDelPacientePage
      onLogout={() => navigate('/portal-paciente-login')}
      onGoToLogin={() => navigate('/portal-paciente-login')}
      onGoToMisCitas={() => navigate('/portal-paciente-mis-citas')}
      onGoToMisDocumentos={() => navigate('/portal-paciente-mis-documentos')}
      onGoToMisImagenes={() => navigate('/portal-paciente-mis-imagenes')}
      onGoToMisPresupuestos={() => navigate('/portal-paciente-mis-presupuestos')}
      onGoToMensajeria={() => navigate('/portal-paciente-mensajeria')}
      onResponderEncuesta={(respuestaId) => navigate(`/portal-paciente-responder-encuesta/${respuestaId}`)}
    />
  );
}

function MisPresupuestosWrapper() {
  const navigate = useNavigate();
  
  return (
    <MisPresupuestosPage
      onVolver={() => navigate('/portal-paciente')}
      onVerDetalle={(presupuestoId) => navigate(`/portal-paciente-detalle-presupuesto/${presupuestoId}`)}
    />
  );
}

function GestionEncuestasWrapper() {
  const navigate = useNavigate();
  
  return (
    <GestionEncuestasPage
      onVolver={() => navigate('/dashboard')}
      onVerResultados={(plantillaId) => navigate(`/resultados-encuesta/${plantillaId}`)}
    />
  );
}

function TeleodontologiaWrapper() {
  const navigate = useNavigate();
  
  return (
    <TeleodontologíaPage
      onVerInforme={(teleconsultaId) => navigate(`/informe-teleconsulta/${teleconsultaId}`)}
    />
  );
}

function MultiSedeWrapper() {
  const navigate = useNavigate();
  
  return (
    <MultiSedeYFranquiciasPage
      onTransferenciaPacientes={() => navigate('/transferencia-pacientes')}
      onCuadroMandosSedes={() => navigate('/dashboard-sedes')}
      onPermisosRoles={() => navigate('/permisos-roles-sede')}
    />
  );
}

function AgendaCitasWrapper() {
  const navigate = useNavigate();
  
  return (
    <AgendaDeCitasYProgramacionPage
      onNuevaCita={() => navigate('/nueva-cita')}
    />
  );
}

function LoginPageWrapper() {
  const navigate = useNavigate();
  
  return (
    <LoginPage
      onGoToPortal={() => navigate('/portal-paciente')}
      onLoginSuccess={() => navigate('/portal-paciente')}
    />
  );
}

function AppContent() {
  return (
    <Routes>
      {/* Ruta de login principal */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                {/* Dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Agenda de Citas */}
                <Route path="/agenda-citas" element={<AgendaCitasWrapper />} />
                <Route path="/nueva-cita" element={<NuevaCitaPage onVolver={() => window.history.back()} />} />
                <Route path="/administracion-bloqueos" element={<AdministracionBloqueosPage />} />
                <Route path="/gestion-disponibilidad" element={<GestionDisponibilidadPage />} />
                <Route path="/reprogramacion-masiva" element={<ReprogramacionMasivaPage />} />
                
                {/* Gestión de Pacientes */}
                <Route path="/gestion-pacientes" element={<GestionPacientesWrapper />} />
                <Route path="/nueva-ficha-paciente" element={<NuevaFichaPacienteWrapper />} />
                <Route path="/paciente-perfil/:pacienteId" element={<PacientePerfilWrapper />} />
                
                {/* Presupuestos */}
                <Route path="/presupuestos" element={<PresupuestosWrapper />} />
                <Route path="/crear-presupuesto" element={<CrearNuevoPresupuestoPage onVolver={() => window.history.back()} />} />
                <Route path="/editar-presupuesto/:presupuestoId" element={<EditarPresupuestoWrapper />} />
                <Route path="/aprobar-presupuesto/:presupuestoId" element={<AprobarPresupuestoWrapper />} />
                <Route path="/plan-tratamiento-builder/:pacienteId?" element={<PlanTratamientoBuilderWrapper />} />
                <Route path="/plan-tratamiento-builder/:pacienteId/:planId" element={<PlanTratamientoBuilderWrapper />} />
                <Route path="/lista-planes-paciente/:pacienteId" element={<ListaPlanesPacienteWrapper />} />
                <Route path="/simulador-costos/:pacienteId?" element={<SimuladorCostosWrapper />} />
                
                {/* Facturación */}
                <Route path="/facturacion-cobros-contabilidad" element={<FacturacionWrapper />} />
                <Route path="/nueva-factura" element={<NuevaFacturaPage onVolver={() => window.history.back()} />} />
                <Route path="/editar-factura/:facturaId" element={<EditarFacturaWrapper />} />
                <Route path="/recibos-pagos" element={<RecibosPagosPage />} />
                <Route path="/anticipos" element={<AnticiposPage />} />
                <Route path="/comisiones-profesional" element={<ComisionesProfesionalPage />} />
                <Route path="/liquidacion-mutuas" element={<LiquidacionMutuasPage />} />
                <Route path="/exportacion-contabilidad" element={<ExportacionContabilidadPage />} />
                
                {/* Mutuas y Seguros */}
                <Route path="/gestion-mutuas-seguros" element={<GestionMutuasWrapper />} />
                <Route path="/convenios-acuerdos" element={<ConveniosAcuerdosPage />} />
                <Route path="/asistente-facturacion" element={<AsistenteFacturacionPage />} />
                <Route path="/autorizaciones-tratamientos" element={<AutorizacionesTratamientosPage />} />
                <Route path="/historial-pagos-seguros" element={<HistorialPagosSeguroPage />} />
                
                {/* Inventario y Compras */}
                <Route path="/inventario-compras" element={<InventarioYComprasPage />} />
                <Route path="/gestion-proveedores-almacen" element={<GestionProveedoresYAlmacenPage />} />
                
                {/* Cuadro de Mandos */}
                <Route path="/cuadro-mandos-informes" element={<CuadroDeMandosEInformesPage />} />
                <Route path="/informes-configurables" element={<InformesConfigurablesPage />} />
                
                {/* Documentación */}
                <Route path="/documentacion-protocolos" element={<DocumentacionYProtocolosPage />} />
                
                {/* Integración Radiológica */}
                <Route path="/integracion-radiologica" element={<IntegracionRadiologicaPage />} />
                
                {/* Portal de Cita Online */}
                <Route path="/portal-cita-online-movil" element={<PortalDeCitaOnlineYMovilPage />} />
                
                {/* Pasarela de Pagos */}
                <Route path="/pasarela-pagos-financiacion" element={<PasarelaDePagosYFinanciacionPage />} />
                
                {/* Seguridad */}
                <Route path="/seguridad-cumplimiento" element={<SeguridadYCumplimientoPage />} />
                
                {/* Especialidades Clínicas */}
                <Route path="/especialidades-clinicas" element={<EspecialidadesClinicasWrapper />} />
                <Route path="/endodoncia-registro" element={<EndodonciaRegistroWrapper />} />
                
                {/* Esterilización */}
                <Route path="/esterilizacion-trazabilidad" element={<EsterilizacionYTrazabilidadPage />} />
                <Route path="/informes-trazabilidad" element={<InformesDeTrazabilidadPage />} />
                
                {/* Mantenimiento */}
                <Route path="/mantenimiento-equipamiento" element={<MantenimientoYEquipamientoPage />} />
                
                {/* Encuestas */}
                <Route path="/gestion-encuestas" element={<GestionEncuestasWrapper />} />
                <Route path="/resultados-encuesta/:plantillaId" element={<ResultadosEncuestaWrapper />} />
                
                {/* Teleodontología */}
                <Route path="/teleodontologia" element={<TeleodontologiaWrapper />} />
                <Route path="/informe-teleconsulta/:teleconsultaId" element={<InformeTeleconsultaWrapper />} />
                
                {/* Multi-sede */}
                <Route path="/multi-sede-franquicias" element={<MultiSedeWrapper />} />
                <Route path="/transferencia-pacientes" element={<TransferenciaPacientesPage />} />
                <Route path="/dashboard-sedes" element={<DashboardSedesPage />} />
                <Route path="/permisos-roles-sede" element={<PermisosRolesSedePage />} />
                
                {/* Calidad */}
                <Route path="/calidad-auditoria" element={<CalidadYAuditoriaPage />} />
                
                {/* Marketing */}
                <Route path="/marketing-avanzado-web" element={<MarketingAvanzadoYWebPage />} />
                
                {/* Analítica */}
                <Route path="/analitica-avanzada-data" element={<AnaliticaAvanzadaDataPage />} />
                
                {/* Integraciones */}
                <Route path="/integraciones-y-apis" element={<IntegracionesYAPIsPage />} />
                
                {/* Portal del Paciente - Rutas sin sidebar */}
                <Route path="/portal-paciente" element={<PortalDelPacienteWrapper />} />
                <Route path="/portal-paciente-mis-citas" element={<MisCitasPage onVolver={() => window.history.back()} />} />
                <Route path="/portal-paciente-mis-documentos" element={<MisDocumentosPage onVolver={() => window.history.back()} />} />
                <Route path="/portal-paciente-mis-imagenes" element={<MisImagenesPage onVolver={() => window.history.back()} />} />
                <Route path="/portal-paciente-mis-presupuestos" element={<MisPresupuestosWrapper />} />
                <Route path="/portal-paciente-detalle-presupuesto/:presupuestoId" element={<DetallePresupuestoPacienteWrapper />} />
                <Route path="/portal-paciente-mensajeria" element={<MensajeriaPage onVolver={() => window.history.back()} />} />
                <Route path="/portal-paciente-responder-encuesta/:respuestaId?" element={<ResponderEncuestaWrapper />} />
                
                {/* Portal del Paciente - Autenticación (sin sidebar) */}
                <Route path="/portal-paciente-login" element={<LoginPageWrapper />} />
                <Route path="/portal-paciente-verify-email/:token?" element={<VerifyEmailWrapper />} />
                <Route path="/portal-paciente-reset-password/:token?" element={<ResetPasswordWrapper />} />
                
                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
