import { useState } from 'react';
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

type Page = 'dashboard' | 'agenda-citas' | 'nueva-cita' | 'administracion-bloqueos' | 'gestion-disponibilidad' | 'reprogramacion-masiva' | 'gestion-pacientes' | 'paciente-perfil' | 'nueva-ficha-paciente' | 'presupuestos' | 'crear-presupuesto' | 'editar-presupuesto' | 'plan-tratamiento-builder' | 'lista-planes-paciente' | 'simulador-costos' | 'aprobar-presupuesto' | 'facturacion-cobros-contabilidad' | 'nueva-factura' | 'editar-factura' | 'recibos-pagos' | 'anticipos' | 'comisiones-profesional' | 'liquidacion-mutuas' | 'exportacion-contabilidad' | 'gestion-mutuas-seguros' | 'convenios-acuerdos' | 'asistente-facturacion' | 'autorizaciones-tratamientos' | 'historial-pagos-seguros' | 'inventario-compras' | 'gestion-proveedores-almacen' | 'cuadro-mandos-informes' | 'informes-configurables' | 'documentacion-protocolos' | 'integracion-radiologica' | 'portal-cita-online-movil' | 'pasarela-pagos-financiacion' | 'seguridad-cumplimiento' | 'especialidades-clinicas' | 'endodoncia-registro' | 'esterilizacion-trazabilidad' | 'informes-trazabilidad' | 'mantenimiento-equipamiento' | 'portal-paciente' | 'portal-paciente-mis-citas' | 'portal-paciente-mis-documentos' | 'portal-paciente-mis-imagenes' | 'portal-paciente-mis-presupuestos' | 'portal-paciente-detalle-presupuesto' | 'portal-paciente-mensajeria' | 'portal-paciente-login' | 'portal-paciente-verify-email' | 'portal-paciente-reset-password' | 'portal-paciente-responder-encuesta' | 'gestion-encuestas' | 'resultados-encuesta' | 'teleodontologia' | 'informe-teleconsulta' | 'multi-sede-franquicias' | 'transferencia-pacientes' | 'dashboard-sedes' | 'permisos-roles-sede' | 'calidad-auditoria' | 'marketing-avanzado-web' | 'analitica-avanzada-data' | 'integraciones-y-apis';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [pacienteSeleccionadoId, setPacienteSeleccionadoId] = useState<string | null>(null);
  const [presupuestoSeleccionadoId, setPresupuestoSeleccionadoId] = useState<string | null>(null);
  const [planTratamientoId, setPlanTratamientoId] = useState<string | null>(null);
  const [facturaSeleccionadaId, setFacturaSeleccionadaId] = useState<string | null>(null);
  const [endodonciaTratamientoId, setEndodonciaTratamientoId] = useState<string | null>(null);
  const [endodonciaPacienteId, setEndodonciaPacienteId] = useState<string | null>(null);
  const [endodonciaDiente, setEndodonciaDiente] = useState<number | undefined>(undefined);
  const [portalPacienteToken, setPortalPacienteToken] = useState<string | null>(null);
  const [presupuestoPacienteSeleccionadoId, setPresupuestoPacienteSeleccionadoId] = useState<string | null>(null);
  const [encuestaRespuestaId, setEncuestaRespuestaId] = useState<string | null>(null);
  const [encuestaPlantillaId, setEncuestaPlantillaId] = useState<string | null>(null);
  const [teleconsultaSeleccionadaId, setTeleconsultaSeleccionadaId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'agenda-citas':
        return <AgendaDeCitasYProgramacionPage onNuevaCita={() => setCurrentPage('nueva-cita')} />;
      case 'nueva-cita':
        return <NuevaCitaPage onVolver={() => setCurrentPage('agenda-citas')} />;
      case 'administracion-bloqueos':
        return <AdministracionBloqueosPage />;
      case 'gestion-disponibilidad':
        return <GestionDisponibilidadPage />;
      case 'reprogramacion-masiva':
        return <ReprogramacionMasivaPage />;
      case 'gestion-pacientes':
        return (
          <GestionPacientesHistoriaClinicaPage
            onVerPaciente={(pacienteId) => {
              setPacienteSeleccionadoId(pacienteId);
              setCurrentPage('paciente-perfil');
            }}
            onNuevoPaciente={() => setCurrentPage('nueva-ficha-paciente')}
          />
        );
      case 'nueva-ficha-paciente':
        return (
          <NuevaFichaPacientePage
            onPacienteCreado={(paciente) => {
              if (paciente._id) {
                setPacienteSeleccionadoId(paciente._id);
                setCurrentPage('paciente-perfil');
              }
            }}
            onVolver={() => setCurrentPage('gestion-pacientes')}
          />
        );
      case 'paciente-perfil':
        return (
          pacienteSeleccionadoId && (
            <PacientePerfilPage
              pacienteId={pacienteSeleccionadoId}
              onVolver={() => {
                setCurrentPage('gestion-pacientes');
                setPacienteSeleccionadoId(null);
              }}
            />
          )
        );
      case 'presupuestos':
        return (
          <PresupuestosYPlanesDeTratamientoPage
            onNuevoPresupuesto={() => setCurrentPage('crear-presupuesto')}
            onEditarPresupuesto={(presupuestoId) => {
              setPresupuestoSeleccionadoId(presupuestoId);
              setCurrentPage('editar-presupuesto');
            }}
            onAprobarPresupuesto={(presupuestoId) => {
              setPresupuestoSeleccionadoId(presupuestoId);
              setCurrentPage('aprobar-presupuesto');
            }}
          />
        );
      case 'aprobar-presupuesto':
        return (
          presupuestoSeleccionadoId && (
            <AprobacionPresupuestoPage
              presupuestoId={presupuestoSeleccionadoId}
              onVolver={() => {
                setCurrentPage('presupuestos');
                setPresupuestoSeleccionadoId(null);
              }}
              onAprobado={() => {
                setCurrentPage('presupuestos');
                setPresupuestoSeleccionadoId(null);
              }}
            />
          )
        );
      case 'simulador-costos':
        return (
          <SimuladorCostosPage
            pacienteId={pacienteSeleccionadoId || undefined}
            onVolver={() => setCurrentPage('presupuestos')}
            onGenerarPresupuesto={(simulacion) => {
              // Redirigir a crear presupuesto con los datos de la simulación
              setCurrentPage('crear-presupuesto');
            }}
          />
        );
      case 'crear-presupuesto':
        return <CrearNuevoPresupuestoPage onVolver={() => setCurrentPage('presupuestos')} />;
      case 'editar-presupuesto':
        return (
          presupuestoSeleccionadoId && (
            <EditarPresupuestoPage
              presupuestoId={presupuestoSeleccionadoId}
              onVolver={() => {
                setCurrentPage('presupuestos');
                setPresupuestoSeleccionadoId(null);
              }}
            />
          )
        );
      case 'plan-tratamiento-builder':
        return (
          <PlanTratamientoBuilderPage
            pacienteId={pacienteSeleccionadoId || undefined}
            planId={planTratamientoId || undefined}
            onVolver={() => {
              if (pacienteSeleccionadoId) {
                setCurrentPage('lista-planes-paciente');
              } else {
                setCurrentPage('presupuestos');
              }
              setPlanTratamientoId(null);
            }}
            onGuardado={(planId) => {
              setPlanTratamientoId(null);
              if (pacienteSeleccionadoId) {
                setCurrentPage('lista-planes-paciente');
              } else {
                setCurrentPage('presupuestos');
              }
            }}
          />
        );
      case 'lista-planes-paciente':
        return (
          pacienteSeleccionadoId && (
            <ListaPlanesPacientePage
              pacienteId={pacienteSeleccionadoId}
              onVolver={() => {
                setCurrentPage('paciente-perfil');
              }}
              onCrearNuevo={() => {
                setCurrentPage('plan-tratamiento-builder');
              }}
              onEditar={(planId) => {
                setPlanTratamientoId(planId);
                setCurrentPage('plan-tratamiento-builder');
              }}
              onVerDetalle={(planId) => {
                setPlanTratamientoId(planId);
                setCurrentPage('plan-tratamiento-builder');
              }}
            />
          )
        );
      case 'facturacion-cobros-contabilidad':
        return (
          <FacturacionCobrosYContabilidadPage
            onNuevaFactura={() => setCurrentPage('nueva-factura')}
            onEditarFactura={(facturaId) => {
              setFacturaSeleccionadaId(facturaId);
              setCurrentPage('editar-factura');
            }}
          />
        );
      case 'nueva-factura':
        return (
          <NuevaFacturaPage
            onVolver={() => setCurrentPage('facturacion-cobros-contabilidad')}
            onFacturaCreada={() => {
              // Opcional: redirigir después de crear factura
              // setCurrentPage('facturacion-cobros-contabilidad');
            }}
          />
        );
      case 'editar-factura':
        return (
          facturaSeleccionadaId && (
            <EditarFacturaPage
              facturaId={facturaSeleccionadaId}
              onVolver={() => {
                setCurrentPage('facturacion-cobros-contabilidad');
                setFacturaSeleccionadaId(null);
              }}
              onFacturaActualizada={() => {
                setCurrentPage('facturacion-cobros-contabilidad');
                setFacturaSeleccionadaId(null);
              }}
            />
          )
        );
      case 'recibos-pagos':
        return <RecibosPagosPage />;
      case 'anticipos':
        return <AnticiposPage />;
      case 'comisiones-profesional':
        return <ComisionesProfesionalPage />;
      case 'liquidacion-mutuas':
        return <LiquidacionMutuasPage />;
      case 'exportacion-contabilidad':
        return <ExportacionContabilidadPage />;
      case 'gestion-mutuas-seguros':
        return (
          <GestionMutuasSegurosSaludPage
            onAsistenteFacturacion={() => setCurrentPage('asistente-facturacion')}
          />
        );
      case 'asistente-facturacion':
        return (
          <AsistenteFacturacionPage
            onVolver={() => setCurrentPage('gestion-mutuas-seguros')}
          />
        );
      case 'convenios-acuerdos':
        return <ConveniosAcuerdosPage />;
      case 'autorizaciones-tratamientos':
        return <AutorizacionesTratamientosPage />;
      case 'historial-pagos-seguros':
        return <HistorialPagosSeguroPage />;
      case 'inventario-compras':
        return <InventarioYComprasPage />;
      case 'gestion-proveedores-almacen':
        return <GestionProveedoresYAlmacenPage />;
      case 'cuadro-mandos-informes':
        return <CuadroDeMandosEInformesPage />;
      case 'informes-configurables':
        return <InformesConfigurablesPage />;
      case 'documentacion-protocolos':
        return <DocumentacionYProtocolosPage />;
      case 'integracion-radiologica':
        return <IntegracionRadiologicaPage />;
      case 'portal-cita-online-movil':
        return <PortalDeCitaOnlineYMovilPage />;
      case 'pasarela-pagos-financiacion':
        return <PasarelaDePagosYFinanciacionPage />;
      case 'seguridad-cumplimiento':
        return <SeguridadYCumplimientoPage />;
      case 'especialidades-clinicas':
        return (
          <EspecialidadesClinicasPage
            onRegistroEndodoncia={(tratamientoId, pacienteId, diente) => {
              // Almacenar parámetros para la página de registro
              setEndodonciaTratamientoId(tratamientoId);
              setEndodonciaPacienteId(pacienteId);
              setEndodonciaDiente(diente);
              setCurrentPage('endodoncia-registro');
            }}
          />
        );
      case 'endodoncia-registro':
        return (
          <EndodonciaRegistroPage
            tratamientoId={endodonciaTratamientoId || undefined}
            pacienteId={endodonciaPacienteId || undefined}
            numeroDiente={endodonciaDiente}
            onVolver={() => {
              setCurrentPage('especialidades-clinicas');
              setEndodonciaTratamientoId(null);
              setEndodonciaPacienteId(null);
              setEndodonciaDiente(undefined);
            }}
          />
        );
      case 'esterilizacion-trazabilidad':
        return <EsterilizacionYTrazabilidadPage />;
      case 'informes-trazabilidad':
        return <InformesDeTrazabilidadPage />;
      case 'mantenimiento-equipamiento':
        return <MantenimientoYEquipamientoPage />;
      case 'portal-paciente':
        return (
          <PortalDelPacientePage
            onLogout={() => setCurrentPage('portal-paciente-login')}
            onGoToLogin={() => setCurrentPage('portal-paciente-login')}
            onGoToMisCitas={() => setCurrentPage('portal-paciente-mis-citas')}
            onGoToMisDocumentos={() => setCurrentPage('portal-paciente-mis-documentos')}
            onGoToMisImagenes={() => setCurrentPage('portal-paciente-mis-imagenes')}
            onGoToMisPresupuestos={() => setCurrentPage('portal-paciente-mis-presupuestos')}
            onGoToMensajeria={() => setCurrentPage('portal-paciente-mensajeria')}
            onResponderEncuesta={(respuestaId) => {
              setEncuestaRespuestaId(respuestaId);
              setCurrentPage('portal-paciente-responder-encuesta');
            }}
          />
        );
      case 'portal-paciente-mis-citas':
        return (
          <MisCitasPage
            onVolver={() => setCurrentPage('portal-paciente')}
          />
        );
      case 'portal-paciente-mis-documentos':
        return (
          <MisDocumentosPage
            onVolver={() => setCurrentPage('portal-paciente')}
          />
        );
      case 'portal-paciente-mis-imagenes':
        return (
          <MisImagenesPage
            onVolver={() => setCurrentPage('portal-paciente')}
          />
        );
      case 'portal-paciente-mis-presupuestos':
        return (
          <MisPresupuestosPage
            onVolver={() => setCurrentPage('portal-paciente')}
            onVerDetalle={(presupuestoId) => {
              setPresupuestoPacienteSeleccionadoId(presupuestoId);
              setCurrentPage('portal-paciente-detalle-presupuesto');
            }}
          />
        );
      case 'portal-paciente-detalle-presupuesto':
        return (
          presupuestoPacienteSeleccionadoId && (
            <DetallePresupuestoPage
              presupuestoId={presupuestoPacienteSeleccionadoId}
              onVolver={() => {
                setCurrentPage('portal-paciente-mis-presupuestos');
                setPresupuestoPacienteSeleccionadoId(null);
              }}
              onPresupuestoActualizado={() => {
                // Opcional: actualizar la lista de presupuestos
                setCurrentPage('portal-paciente-mis-presupuestos');
                setPresupuestoPacienteSeleccionadoId(null);
              }}
            />
          )
        );
      case 'portal-paciente-mensajeria':
        return (
          <MensajeriaPage
            onVolver={() => setCurrentPage('portal-paciente')}
          />
        );
      case 'portal-paciente-login':
        return (
          <LoginPage
            onGoToPortal={() => setCurrentPage('portal-paciente')}
            onLoginSuccess={() => setCurrentPage('portal-paciente')}
          />
        );
      case 'portal-paciente-verify-email':
        return (
          <VerifyEmailPage
            token={portalPacienteToken || undefined}
            onSuccess={() => setCurrentPage('portal-paciente-login')}
            onBack={() => setCurrentPage('portal-paciente-login')}
          />
        );
      case 'portal-paciente-reset-password':
        return (
          <ResetPasswordPage
            token={portalPacienteToken || undefined}
            onSuccess={() => setCurrentPage('portal-paciente-login')}
            onBack={() => setCurrentPage('portal-paciente-login')}
          />
        );
      case 'portal-paciente-responder-encuesta':
        return (
          <ResponderEncuestaPage
            respuestaId={encuestaRespuestaId || undefined}
            onVolver={() => {
              setCurrentPage('portal-paciente');
              setEncuestaRespuestaId(null);
            }}
            onEnviar={() => {
              setCurrentPage('portal-paciente');
              setEncuestaRespuestaId(null);
            }}
          />
        );
      case 'gestion-encuestas':
        return (
          <GestionEncuestasPage
            onVolver={() => setCurrentPage('dashboard')}
            onVerResultados={(plantillaId) => {
              setEncuestaPlantillaId(plantillaId);
              setCurrentPage('resultados-encuesta');
            }}
          />
        );
      case 'resultados-encuesta':
        return (
          encuestaPlantillaId && (
            <ResultadosEncuestaPage
              plantillaId={encuestaPlantillaId}
              onVolver={() => {
                setCurrentPage('gestion-encuestas');
                setEncuestaPlantillaId(null);
              }}
            />
          )
        );
      case 'teleodontologia':
        return (
          <TeleodontologíaPage
            onVerInforme={(teleconsultaId) => {
              setTeleconsultaSeleccionadaId(teleconsultaId);
              setCurrentPage('informe-teleconsulta');
            }}
          />
        );
      case 'informe-teleconsulta':
        return (
          teleconsultaSeleccionadaId && (
            <InformeTeleconsultaPage
              teleconsultaId={teleconsultaSeleccionadaId}
              onVolver={() => {
                setCurrentPage('teleodontologia');
                setTeleconsultaSeleccionadaId(null);
              }}
            />
          )
        );
      case 'multi-sede-franquicias':
        return (
          <MultiSedeYFranquiciasPage
            onTransferenciaPacientes={() => setCurrentPage('transferencia-pacientes')}
            onCuadroMandosSedes={() => setCurrentPage('dashboard-sedes')}
            onPermisosRoles={() => setCurrentPage('permisos-roles-sede')}
          />
        );
      case 'transferencia-pacientes':
        return (
          <TransferenciaPacientesPage
            onVolver={() => setCurrentPage('multi-sede-franquicias')}
          />
        );
      case 'dashboard-sedes':
        return (
          <DashboardSedesPage />
        );
      case 'permisos-roles-sede':
        return (
          <PermisosRolesSedePage />
        );
      case 'calidad-auditoria':
        return <CalidadYAuditoriaPage />;
      case 'marketing-avanzado-web':
        return <MarketingAvanzadoYWebPage />;
      case 'analitica-avanzada-data':
        return <AnaliticaAvanzadaDataPage />;
      case 'integraciones-y-apis':
        return <IntegracionesYAPIsPage />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  // Páginas del Portal del Paciente que no deben mostrar el Sidebar
  const portalPacientePages = ['portal-paciente-login', 'portal-paciente-verify-email', 'portal-paciente-reset-password'];
  const shouldShowSidebar = !portalPacientePages.includes(currentPage);

  // Si es una página del portal del paciente (sin sidebar), no mostrar sidebar
  if (currentPage === 'portal-paciente' || currentPage === 'portal-paciente-mis-citas' || currentPage === 'portal-paciente-mis-documentos' || currentPage === 'portal-paciente-mis-imagenes' || currentPage === 'portal-paciente-mis-presupuestos' || currentPage === 'portal-paciente-detalle-presupuesto' || currentPage === 'portal-paciente-mensajeria' || currentPage === 'portal-paciente-responder-encuesta') {
    return renderPage();
  }

  // Si es una página de autenticación del portal, no mostrar sidebar
  if (!shouldShowSidebar) {
    return renderPage();
  }

  return (
    <div className="flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1">
        {renderPage()}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
