import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Calendar, Plus, RefreshCw, TrendingUp, CheckCircle, Clock, X, Users, MapPin, BarChart3, Activity, Zap, Bell, AlertCircle, List, AlertTriangle, Globe, History, Settings, Download } from 'lucide-react';
import { Cita, FiltrosCalendario as IFiltrosCalendario, FiltrosResumenMensual, moverCita, actualizarCita, programarCitaPendiente, CitaPendiente, obtenerDetalleCita, crearCita, cancelarCita, obtenerCitasCalendario } from '../api/citasApi';
import CalendarioGrid from '../components/CalendarioGrid';
import CalendarioGridVirtualized from '../components/CalendarioGridVirtualized';
import SyncStatusIndicator, { useSyncOperations } from '../components/SyncStatusIndicator';
import CalendarioMensualGrid from '../components/CalendarioMensualGrid';
import FiltrosCalendario from '../components/FiltrosCalendario';
import FiltrosVistaMensual from '../components/FiltrosVistaMensual';
import ModalGestionCita from '../components/ModalGestionCita';
import ModalEditarCita from '../components/ModalEditarCita';
import MiniCalendarPanel from '../components/MiniCalendarPanel';
import DaysRangeSelector from '../components/DaysRangeSelector';
import TimeConfigModal from '../components/TimeConfigModal';
import ModalConfirmacionCambioSede from '../components/ModalConfirmacionCambioSede';
import PendingAppointmentsPanel from '../components/PendingAppointmentsPanel';
import UrgentAppointmentsPanel, { esCitaUrgente } from '../components/UrgentAppointmentsPanel';
import WaitlistPanel from '../components/WaitlistPanel';
import OnlineRequestsPanel from '../components/OnlineRequestsPanel';
import ReminderSettingsModal from '../components/ReminderSettingsModal';
import ToastArea, { Toast } from '../components/ToastArea';
import NotificacionesRecientesPanel, { NotificacionReciente } from '../components/NotificacionesRecientesPanel';
import HistoryTimeline from '../components/HistoryTimeline';
import AgendaHeatmapCard from '../components/AgendaHeatmapCard';
import KpiConfigurator, { KpiConfig, loadKpiConfig } from '../components/KpiConfigurator';
import ExportCitasModal from '../components/ExportCitasModal';
import OfflineBanner from '../components/OfflineBanner';
import { CitasWebSocket, EventoCitaActualizada, EventoNotificacionCita } from '../api/citasWebSocket';
import { useAuth } from '../../../contexts/AuthContext';
import { useOffline } from '../hooks/useOffline';
import { citasCache } from '../utils/citasCache';
import { setupNetworkSimulatorInWindow } from '../utils/networkSimulator';

interface AgendaDeCitasYProgramacionPageProps {
  onNuevaCita?: () => void;
}

export default function AgendaDeCitasYProgramacionPage({ onNuevaCita }: AgendaDeCitasYProgramacionPageProps = {}) {
  const { user } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vista, setVista] = useState<'dia' | 'semana' | 'mes'>('semana');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>();
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | undefined>();
  const [mostrarMiniCalendario, setMostrarMiniCalendario] = useState(false);
  const [diasVisibles, setDiasVisibles] = useState<number>(7);
  const [groupBy, setGroupBy] = useState<'profesional' | 'box'>('profesional');
  const [timeSlotDuration, setTimeSlotDuration] = useState<10 | 15 | 30>(30);
  const [visibleHours, setVisibleHours] = useState<{ start: number; end: number }>({ start: 7, end: 20 });
  const [mostrarConfigTiempo, setMostrarConfigTiempo] = useState(false);
  const [mostrarPanelPendientes, setMostrarPanelPendientes] = useState(false);
  const [mostrarPanelUrgencias, setMostrarPanelUrgencias] = useState(false);
  const [mostrarPanelListaEspera, setMostrarPanelListaEspera] = useState(false);
  const [mostrarPanelSolicitudesOnline, setMostrarPanelSolicitudesOnline] = useState(false);
  const [mostrarModalRecordatorios, setMostrarModalRecordatorios] = useState(false);
  const [citaParaRecordatorios, setCitaParaRecordatorios] = useState<Cita | null>(null);
  const [citaResizeInicial, setCitaResizeInicial] = useState<Cita | null>(null);
  
  // Estado para modal de confirmación de cambio de sede
  const [mostrarModalCambioSede, setMostrarModalCambioSede] = useState(false);
  const [reprogramacionPendiente, setReprogramacionPendiente] = useState<{
    citaId: string;
    nuevaFecha: Date;
    nuevaHora: string;
    profesionalId?: string;
    boxId?: string;
  } | null>(null);
  const [reprogramando, setReprogramando] = useState(false);

  // Estado para WebSocket y notificaciones
  const wsRef = useRef<CitasWebSocket | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notificaciones, setNotificaciones] = useState<NotificacionReciente[]>([]);
  const [mostrarPanelNotificaciones, setMostrarPanelNotificaciones] = useState(false);
  const [citaDestacada, setCitaDestacada] = useState<string | null>(null); // ID de cita destacada
  const [mostrarHistorialTimeline, setMostrarHistorialTimeline] = useState(false);
  const [citaParaHistorial, setCitaParaHistorial] = useState<Cita | null>(null);
  const [mostrarHeatmap, setMostrarHeatmap] = useState(false);
  
  // Estado para configuración de KPIs
  const [kpiConfig, setKpiConfig] = useState<KpiConfig>(() => loadKpiConfig(user?.id));
  const [mostrarKpiConfigurator, setMostrarKpiConfigurator] = useState(false);
  
  // Estado para modal de exportación
  const [mostrarExportModal, setMostrarExportModal] = useState(false);

  // Estado para virtualización (activada por defecto para grandes volúmenes)
  const [usarVirtualizacion, setUsarVirtualizacion] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    fps: number;
    renderTime: number;
    itemCount: number;
  } | null>(null);

  // Hook para operaciones de sincronización
  const {
    operations: syncOperations,
    trackMutation,
    retryOperation,
    removeOperation,
  } = useSyncOperations();

  // Hook para gestión de estado offline/online (definido antes para usar en cargarCitas)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  
  // Referencia para cargarCitas para usar en useOffline
  const cargarCitasRef = useRef<((forceRefresh?: boolean) => Promise<void>) | null>(null);
  
  // Hook para gestión de estado offline/online (sin callbacks iniciales, se actualizarán después)
  const {
    isOnline,
    isOffline,
    wasOffline,
    lastOnlineTime,
    checkConnection,
  } = useOffline({
    checkInterval: 5000, // Verificar cada 5 segundos
  });

  // Estado para vista mensual
  const ahora = new Date();
  const [mesActual, setMesActual] = useState(ahora.getMonth() + 1);
  const [anioActual, setAnioActual] = useState(ahora.getFullYear());
  const [filtrosMensual, setFiltrosMensual] = useState<Omit<FiltrosResumenMensual, 'mes' | 'anio'>>({});

  // Inicializar filtros con la semana actual
  const [filtros, setFiltros] = useState<IFiltrosCalendario>(() => {
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 7);
    fechaFin.setHours(23, 59, 59, 999);

    return {
      fecha_inicio: fechaInicio.toISOString(),
      fecha_fin: fechaFin.toISOString(),
    };
  });

  // Datos mock enriquecidos para profesionales, sedes y pacientes
  const profesionales = [
    { _id: '1', nombre: 'Juan', apellidos: 'Pérez', especialidad: 'Ortodoncia', color: '#3B82F6', telefono: '612345001', email: 'juan.perez@clinicadental.com', activo: true },
    { _id: '2', nombre: 'María', apellidos: 'García', especialidad: 'Endodoncia', color: '#10B981', telefono: '612345002', email: 'maria.garcia@clinicadental.com', activo: true },
    { _id: '3', nombre: 'Carlos', apellidos: 'López', especialidad: 'Implantología', color: '#8B5CF6', telefono: '612345003', email: 'carlos.lopez@clinicadental.com', activo: true },
    { _id: '4', nombre: 'Ana', apellidos: 'Fernández', especialidad: 'Periodoncia', color: '#F59E0B', telefono: '612345004', email: 'ana.fernandez@clinicadental.com', activo: true },
    { _id: '5', nombre: 'Roberto', apellidos: 'Martínez', especialidad: 'Estética Dental', color: '#EF4444', telefono: '612345005', email: 'roberto.martinez@clinicadental.com', activo: true },
    { _id: '6', nombre: 'Carmen', apellidos: 'Sánchez', especialidad: 'Odontopediatría', color: '#06B6D4', telefono: '612345006', email: 'carmen.sanchez@clinicadental.com', activo: true },
    { _id: '7', nombre: 'Luis', apellidos: 'González', especialidad: 'Cirugía Oral', color: '#EC4899', telefono: '612345007', email: 'luis.gonzalez@clinicadental.com', activo: true },
    { _id: '8', nombre: 'Patricia', apellidos: 'Ruiz', especialidad: 'Prótesis Dental', color: '#14B8A6', telefono: '612345008', email: 'patricia.ruiz@clinicadental.com', activo: true },
    { _id: '9', nombre: 'David', apellidos: 'Morales', especialidad: 'Higienista Dental', color: '#6366F1', telefono: '612345009', email: 'david.morales@clinicadental.com', activo: true },
    { _id: '10', nombre: 'Elena', apellidos: 'Vargas', especialidad: 'Radiología', color: '#F97316', telefono: '612345010', email: 'elena.vargas@clinicadental.com', activo: true },
    { _id: '11', nombre: 'Sergio', apellidos: 'Ramírez', especialidad: 'Ortodoncia', color: '#3B82F6', telefono: '612345011', email: 'sergio.ramirez@clinicadental.com', activo: true },
    { _id: '12', nombre: 'Isabel', apellidos: 'Torres', especialidad: 'Endodoncia', color: '#10B981', telefono: '612345012', email: 'isabel.torres@clinicadental.com', activo: true },
    { _id: '13', nombre: 'Fernando', apellidos: 'Jiménez', especialidad: 'Implantología', color: '#8B5CF6', telefono: '612345013', email: 'fernando.jimenez@clinicadental.com', activo: true },
    { _id: '14', nombre: 'Lucía', apellidos: 'Moreno', especialidad: 'Periodoncia', color: '#F59E0B', telefono: '612345014', email: 'lucia.moreno@clinicadental.com', activo: true },
    { _id: '15', nombre: 'Pablo', apellidos: 'Castro', especialidad: 'Estética Dental', color: '#EF4444', telefono: '612345015', email: 'pablo.castro@clinicadental.com', activo: true },
    { _id: '16', nombre: 'Marta', apellidos: 'Navarro', especialidad: 'Ortodoncia', color: '#3B82F6', telefono: '612345016', email: 'marta.navarro@clinicadental.com', activo: true },
    { _id: '17', nombre: 'Alberto', apellidos: 'Vargas', especialidad: 'Cirugía Oral', color: '#EC4899', telefono: '612345017', email: 'alberto.vargas@clinicadental.com', activo: true },
    { _id: '18', nombre: 'Cristina', apellidos: 'Méndez', especialidad: 'Periodoncia', color: '#F59E0B', telefono: '612345018', email: 'cristina.mendez@clinicadental.com', activo: true },
  ];

  const sedes = [
    { _id: '1', nombre: 'Sede Central', direccion: 'Av. Principal 123', telefono: '912345678', email: 'central@clinicadental.com', horario: 'Lun-Vie: 9:00-20:00', activa: true },
    { _id: '2', nombre: 'Sede Norte', direccion: 'Calle Norte 456', telefono: '912345679', email: 'norte@clinicadental.com', horario: 'Lun-Vie: 8:30-19:30', activa: true },
    { _id: '3', nombre: 'Sede Sur', direccion: 'Av. Sur 789', telefono: '912345680', email: 'sur@clinicadental.com', horario: 'Lun-Sab: 9:00-21:00', activa: true },
    { _id: '4', nombre: 'Sede Este', direccion: 'Plaza Este 321', telefono: '912345681', email: 'este@clinicadental.com', horario: 'Lun-Vie: 10:00-20:00', activa: true },
    { _id: '5', nombre: 'Sede Oeste', direccion: 'Boulevard Oeste 654', telefono: '912345682', email: 'oeste@clinicadental.com', horario: 'Lun-Vie: 8:00-18:00', activa: true },
    { _id: '6', nombre: 'Sede Centro Histórico', direccion: 'Plaza Mayor 12', telefono: '912345683', email: 'centro@clinicadental.com', horario: 'Lun-Sab: 9:00-20:00', activa: true },
    { _id: '7', nombre: 'Sede Zona Industrial', direccion: 'Polígono Industrial 45', telefono: '912345684', email: 'industrial@clinicadental.com', horario: 'Lun-Vie: 7:00-15:00', activa: true },
    { _id: '8', nombre: 'Sede Residencial', direccion: 'Av. Residencial 89', telefono: '912345685', email: 'residencial@clinicadental.com', horario: 'Lun-Vie: 9:00-20:00', activa: true },
    { _id: '9', nombre: 'Sede Premium', direccion: 'Av. Exclusiva 100', telefono: '912345686', email: 'premium@clinicadental.com', horario: 'Lun-Dom: 10:00-22:00', activa: true },
    { _id: '10', nombre: 'Sede Express', direccion: 'Calle Rápida 200', telefono: '912345687', email: 'express@clinicadental.com', horario: 'Lun-Sab: 8:00-20:00', activa: true },
  ];

  const pacientes = [
    { _id: '1', nombre: 'Ana', apellidos: 'Martínez', telefono: '612345678', email: 'ana.martinez@email.com', documento: '12345678A', fechaNacimiento: '1985-03-15', genero: 'F' },
    { _id: '2', nombre: 'Pedro', apellidos: 'Sánchez', telefono: '612345679', email: 'pedro.sanchez@email.com', documento: '23456789B', fechaNacimiento: '1990-07-22', genero: 'M' },
    { _id: '3', nombre: 'Laura', apellidos: 'Rodríguez', telefono: '612345680', email: 'laura.rodriguez@email.com', documento: '34567890C', fechaNacimiento: '1988-11-05', genero: 'F' },
    { _id: '4', nombre: 'Miguel', apellidos: 'Torres', telefono: '612345681', email: 'miguel.torres@email.com', documento: '45678901D', fechaNacimiento: '1992-01-18', genero: 'M' },
    { _id: '5', nombre: 'Sofía', apellidos: 'López', telefono: '612345682', email: 'sofia.lopez@email.com', documento: '56789012E', fechaNacimiento: '1987-09-30', genero: 'F' },
    { _id: '6', nombre: 'Diego', apellidos: 'Morales', telefono: '612345683', email: 'diego.morales@email.com', documento: '67890123F', fechaNacimiento: '1995-04-12', genero: 'M' },
    { _id: '7', nombre: 'Elena', apellidos: 'Jiménez', telefono: '612345684', email: 'elena.jimenez@email.com', documento: '78901234G', fechaNacimiento: '1983-06-25', genero: 'F' },
    { _id: '8', nombre: 'Javier', apellidos: 'Hernández', telefono: '612345685', email: 'javier.hernandez@email.com', documento: '89012345H', fechaNacimiento: '1989-12-08', genero: 'M' },
    { _id: '9', nombre: 'Isabel', apellidos: 'Díaz', telefono: '612345686', email: 'isabel.diaz@email.com', documento: '90123456I', fechaNacimiento: '1991-02-14', genero: 'F' },
    { _id: '10', nombre: 'Fernando', apellidos: 'Moreno', telefono: '612345687', email: 'fernando.moreno@email.com', documento: '01234567J', fechaNacimiento: '1986-08-20', genero: 'M' },
    { _id: '11', nombre: 'Lucía', apellidos: 'Álvarez', telefono: '612345688', email: 'lucia.alvarez@email.com', documento: '12345678K', fechaNacimiento: '1993-05-03', genero: 'F' },
    { _id: '12', nombre: 'Pablo', apellidos: 'Romero', telefono: '612345689', email: 'pablo.romero@email.com', documento: '23456789L', fechaNacimiento: '1984-10-17', genero: 'M' },
    { _id: '13', nombre: 'Marta', apellidos: 'Navarro', telefono: '612345690', email: 'marta.navarro@email.com', documento: '34567890M', fechaNacimiento: '1994-01-28', genero: 'F' },
    { _id: '14', nombre: 'Alberto', apellidos: 'Vargas', telefono: '612345691', email: 'alberto.vargas@email.com', documento: '45678901N', fechaNacimiento: '1982-07-11', genero: 'M' },
    { _id: '15', nombre: 'Cristina', apellidos: 'Méndez', telefono: '612345692', email: 'cristina.mendez@email.com', documento: '56789012O', fechaNacimiento: '1996-03-22', genero: 'F' },
    { _id: '16', nombre: 'Raúl', apellidos: 'Castro', telefono: '612345693', email: 'raul.castro@email.com', documento: '67890123P', fechaNacimiento: '1981-09-05', genero: 'M' },
    { _id: '17', nombre: 'Carmen', apellidos: 'Ortega', telefono: '612345694', email: 'carmen.ortega@email.com', documento: '78901234Q', fechaNacimiento: '1987-11-19', genero: 'F' },
    { _id: '18', nombre: 'Jorge', apellidos: 'Delgado', telefono: '612345695', email: 'jorge.delgado@email.com', documento: '89012345R', fechaNacimiento: '1990-04-07', genero: 'M' },
    { _id: '19', nombre: 'Patricia', apellidos: 'Ramírez', telefono: '612345696', email: 'patricia.ramirez@email.com', documento: '90123456S', fechaNacimiento: '1992-12-31', genero: 'F' },
    { _id: '20', nombre: 'Ricardo', apellidos: 'Vega', telefono: '612345697', email: 'ricardo.vega@email.com', documento: '01234567T', fechaNacimiento: '1985-06-14', genero: 'M' },
    { _id: '21', nombre: 'Silvia', apellidos: 'Molina', telefono: '612345698', email: 'silvia.molina@email.com', documento: '12345678U', fechaNacimiento: '1988-02-26', genero: 'F' },
    { _id: '22', nombre: 'Óscar', apellidos: 'Serrano', telefono: '612345699', email: 'oscar.serrano@email.com', documento: '23456789V', fechaNacimiento: '1991-08-09', genero: 'M' },
    { _id: '23', nombre: 'Natalia', apellidos: 'Iglesias', telefono: '612345700', email: 'natalia.iglesias@email.com', documento: '34567890W', fechaNacimiento: '1993-10-23', genero: 'F' },
    { _id: '24', nombre: 'Manuel', apellidos: 'Cortés', telefono: '612345701', email: 'manuel.cortes@email.com', documento: '45678901X', fechaNacimiento: '1986-05-16', genero: 'M' },
    { _id: '25', nombre: 'Beatriz', apellidos: 'Núñez', telefono: '612345702', email: 'beatriz.nunez@email.com', documento: '56789012Y', fechaNacimiento: '1989-01-29', genero: 'F' },
    { _id: '26', nombre: 'Álvaro', apellidos: 'Gutiérrez', telefono: '612345703', email: 'alvaro.gutierrez@email.com', documento: '67890123Z', fechaNacimiento: '1994-07-04', genero: 'M' },
    { _id: '27', nombre: 'Rosa', apellidos: 'Blanco', telefono: '612345704', email: 'rosa.blanco@email.com', documento: '78901234AA', fechaNacimiento: '1987-03-18', genero: 'F' },
    { _id: '28', nombre: 'Andrés', apellidos: 'Suárez', telefono: '612345705', email: 'andres.suarez@email.com', documento: '89012345AB', fechaNacimiento: '1990-11-21', genero: 'M' },
    { _id: '29', nombre: 'Clara', apellidos: 'Gómez', telefono: '612345706', email: 'clara.gomez@email.com', documento: '90123456AC', fechaNacimiento: '1992-09-13', genero: 'F' },
    { _id: '30', nombre: 'Víctor', apellidos: 'Martín', telefono: '612345707', email: 'victor.martin@email.com', documento: '01234567AD', fechaNacimiento: '1984-12-27', genero: 'M' },
  ];

  const tratamientos = [
    { _id: '1', nombre: 'Limpieza dental profesional', duracionEstimadaMinutos: 30, precio: 50, categoria: 'Higiene' },
    { _id: '2', nombre: 'Revisión general y diagnóstico', duracionEstimadaMinutos: 20, precio: 35, categoria: 'Consulta' },
    { _id: '3', nombre: 'Ortodoncia - Ajuste de brackets', duracionEstimadaMinutos: 45, precio: 80, categoria: 'Ortodoncia' },
    { _id: '4', nombre: 'Implante dental - Fase quirúrgica', duracionEstimadaMinutos: 120, precio: 1200, categoria: 'Implantología' },
    { _id: '5', nombre: 'Endodoncia - Tratamiento de conductos', duracionEstimadaMinutos: 90, precio: 300, categoria: 'Endodoncia' },
    { _id: '6', nombre: 'Blanqueamiento dental', duracionEstimadaMinutos: 60, precio: 250, categoria: 'Estética' },
    { _id: '7', nombre: 'Extracción dental simple', duracionEstimadaMinutos: 30, precio: 60, categoria: 'Cirugía' },
    { _id: '8', nombre: 'Empaste/Oburación', duracionEstimadaMinutos: 45, precio: 70, categoria: 'Restauración' },
    { _id: '9', nombre: 'Periodoncia - Limpieza profunda', duracionEstimadaMinutos: 60, precio: 150, categoria: 'Periodoncia' },
    { _id: '10', nombre: 'Prótesis dental - Ajuste', duracionEstimadaMinutos: 90, precio: 200, categoria: 'Prótesis' },
    { _id: '11', nombre: 'Radiografía panorámica', duracionEstimadaMinutos: 15, precio: 40, categoria: 'Diagnóstico' },
    { _id: '12', nombre: 'Consulta inicial y planificación', duracionEstimadaMinutos: 30, precio: 45, categoria: 'Consulta' },
    { _id: '13', nombre: 'Corona dental - Colocación', duracionEstimadaMinutos: 60, precio: 400, categoria: 'Restauración' },
    { _id: '14', nombre: 'Férula de descarga', duracionEstimadaMinutos: 45, precio: 180, categoria: 'Ortodoncia' },
    { _id: '15', nombre: 'Pulido y sellado de fisuras', duracionEstimadaMinutos: 30, precio: 55, categoria: 'Prevención' },
    { _id: '16', nombre: 'Extracción de muela del juicio', duracionEstimadaMinutos: 60, precio: 150, categoria: 'Cirugía' },
    { _id: '17', nombre: 'Injerto de encía', duracionEstimadaMinutos: 90, precio: 500, categoria: 'Periodoncia' },
    { _id: '18', nombre: 'Carilla dental estética', duracionEstimadaMinutos: 120, precio: 600, categoria: 'Estética' },
    { _id: '19', nombre: 'Revisión post-tratamiento', duracionEstimadaMinutos: 20, precio: 30, categoria: 'Consulta' },
    { _id: '20', nombre: 'Aplicación de flúor', duracionEstimadaMinutos: 15, precio: 25, categoria: 'Prevención' },
    { _id: '21', nombre: 'Curetaje dental', duracionEstimadaMinutos: 60, precio: 180, categoria: 'Periodoncia' },
    { _id: '22', nombre: 'Reconstrucción dental', duracionEstimadaMinutos: 75, precio: 320, categoria: 'Restauración' },
    { _id: '23', nombre: 'Consulta de urgencia', duracionEstimadaMinutos: 30, precio: 60, categoria: 'Consulta' },
    { _id: '24', nombre: 'Alineador transparente - Revisión', duracionEstimadaMinutos: 30, precio: 70, categoria: 'Ortodoncia' },
    { _id: '25', nombre: 'Prótesis removible - Ajuste', duracionEstimadaMinutos: 45, precio: 90, categoria: 'Prótesis' },
  ];

  // Inicializar simulador de red en desarrollo
  useEffect(() => {
    setupNetworkSimulatorInWindow();
  }, []);

  // Función para agregar toast (definida antes de cargarCitas para usarla allí)
  const agregarToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const nuevoToast: Toast = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random()}`,
    };
    setToasts(prev => [...prev, nuevoToast]);
  }, []);

  const cargarCitas = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Si estamos offline, intentar cargar desde cache
      if (isOffline && !forceRefresh) {
        const cachedCitas = await citasCache.getCitas(filtros);
        if (cachedCitas) {
          setCitas(cachedCitas);
          const lastUpdated = await citasCache.getLastUpdated(filtros);
          setLastSyncTime(lastUpdated);
          setLoading(false);
          agregarToast({
            tipo: 'info',
            titulo: 'Modo offline',
            mensaje: 'Mostrando datos en caché. Las ediciones están deshabilitadas.',
          });
          return;
        } else {
          // No hay cache disponible
          setError('No hay conexión y no hay datos en caché disponibles.');
          setLoading(false);
          return;
        }
      }

      // Si estamos online, intentar cargar desde el servidor
      let citasData: Cita[] = [];
      
      try {
        // Intentar obtener citas del servidor
        citasData = await obtenerCitasCalendario(filtros);
        
        // Guardar en cache
        await citasCache.saveCitas(citasData, filtros);
        setLastSyncTime(new Date());
      } catch (fetchError) {
        // Si falla la petición, intentar usar cache
        console.warn('Error al obtener citas del servidor, intentando usar cache:', fetchError);
        const cachedCitas = await citasCache.getCitas(filtros);
        
        if (cachedCitas) {
          citasData = cachedCitas;
          const lastUpdated = await citasCache.getLastUpdated(filtros);
          setLastSyncTime(lastUpdated);
          agregarToast({
            tipo: 'warning',
            titulo: 'Usando datos en caché',
            mensaje: 'No se pudo conectar al servidor. Mostrando datos guardados localmente.',
          });
        } else {
          throw fetchError;
        }
      }

      // Generar datos mock más completos y realistas (solo si no hay datos del servidor)
      if (citasData.length === 0) {
        const datosMock: Cita[] = [];
        const ahora = new Date();
        const estados: Array<'programada' | 'confirmada' | 'cancelada' | 'realizada' | 'no-asistio'> = 
          ['programada', 'confirmada', 'cancelada', 'realizada', 'no-asistio'];
        
        // Generar citas para los próximos 120 días (más rango)
        for (let dia = -30; dia < 120; dia++) {
        const fechaBase = new Date(ahora);
        fechaBase.setDate(fechaBase.getDate() + dia);
        const diaSemana = fechaBase.getDay();
        
        // Menos citas los domingos (día 0) y sábados (día 6)
        const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
        const numCitasDia = esFinDeSemana 
          ? Math.floor(Math.random() * 5) + 1 // 1-5 citas en fin de semana
          : Math.floor(Math.random() * 18) + 8; // 8-25 citas en días laborables
        
        fechaBase.setHours(8, 0, 0, 0);
        
        // Horarios preferidos (más citas en horarios comunes)
        const horariosPreferidos = [
          { hora: 9, minuto: 0, peso: 3 },
          { hora: 10, minuto: 0, peso: 3 },
          { hora: 11, minuto: 0, peso: 2 },
          { hora: 12, minuto: 0, peso: 2 },
          { hora: 13, minuto: 0, peso: 1 },
          { hora: 15, minuto: 0, peso: 3 },
          { hora: 16, minuto: 0, peso: 3 },
          { hora: 17, minuto: 0, peso: 2 },
          { hora: 18, minuto: 0, peso: 1 },
        ];
        
        const citasDelDia: Array<{ hora: number; minuto: number }> = [];
        
        for (let i = 0; i < numCitasDia; i++) {
          let horaInicio: number, minutoInicio: number;
          
          // 70% de probabilidad de usar horarios preferidos
          if (Math.random() < 0.7 && horariosPreferidos.length > 0) {
            const horarioPreferido = horariosPreferidos[Math.floor(Math.random() * horariosPreferidos.length)];
            horaInicio = horarioPreferido.hora;
            minutoInicio = horarioPreferido.minuto;
          } else {
            horaInicio = 8 + Math.floor(Math.random() * 11); // Entre 8:00 y 18:00
            minutoInicio = Math.random() < 0.7 ? 0 : (Math.random() < 0.5 ? 30 : 15); // 00, 15 o 30
          }
          
          // Evitar solapamientos básicos
          const existeSolapamiento = citasDelDia.some(c => {
            const diffHora = Math.abs(c.hora - horaInicio);
            const diffMinuto = Math.abs(c.minuto - minutoInicio);
            return diffHora === 0 && diffMinuto < 30;
          });
          
          if (existeSolapamiento && i > 0) {
            horaInicio += 1;
            if (horaInicio >= 19) continue; // Saltar si se pasa del horario
          }
          
          citasDelDia.push({ hora: horaInicio, minuto: minutoInicio });
          
          const fechaInicio = new Date(fechaBase);
          fechaInicio.setHours(horaInicio, minutoInicio, 0, 0);
          
          // Seleccionar tratamiento aleatorio con preferencia por duraciones comunes
          const tratamiento = tratamientos[Math.floor(Math.random() * tratamientos.length)];
          let duracion = tratamiento.duracionEstimadaMinutos;
          
          // Añadir variación de ±5 minutos en algunos casos
          if (Math.random() < 0.3) {
            duracion += Math.random() < 0.5 ? -5 : 5;
            duracion = Math.max(15, Math.min(180, duracion)); // Entre 15 y 180 minutos
          }
          
          const fechaFin = new Date(fechaInicio);
          fechaFin.setMinutes(fechaFin.getMinutes() + duracion);
          
          // Si la cita termina después de las 20:00, ajustarla
          if (fechaFin.getHours() >= 20) {
            const horasDisponibles = 20 - horaInicio;
            if (horasDisponibles > 0) {
              duracion = Math.min(duracion, horasDisponibles * 60 - 15);
              fechaInicio.setMinutes(fechaInicio.getMinutes());
              fechaFin.setTime(fechaInicio.getTime() + duracion * 60 * 1000);
            } else {
              continue; // Saltar esta cita si no cabe
            }
          }
          
          // Seleccionar paciente, profesional y sede aleatorios
          const paciente = pacientes[Math.floor(Math.random() * pacientes.length)];
          const profesional = profesionales[Math.floor(Math.random() * profesionales.length)];
          const sede = sedes[Math.floor(Math.random() * sedes.length)];
          
          // Estado según la fecha (más realista)
          let estado: typeof estados[number];
          const diasDesdeHoy = dia;
          
          if (diasDesdeHoy < 0) {
            // Citas pasadas
            const rand = Math.random();
            if (rand < 0.7) estado = 'realizada';
            else if (rand < 0.85) estado = 'cancelada';
            else estado = 'no-asistio';
          } else if (diasDesdeHoy === 0) {
            // Hoy
            const rand = Math.random();
            if (rand < 0.3) estado = 'realizada';
            else if (rand < 0.6) estado = 'confirmada';
            else estado = 'programada';
          } else if (diasDesdeHoy <= 3) {
            // Próximos 3 días
            const rand = Math.random();
            if (rand < 0.5) estado = 'confirmada';
            else if (rand < 0.85) estado = 'programada';
            else estado = 'cancelada';
          } else {
            // Más adelante
            const rand = Math.random();
            if (rand < 0.4) estado = 'confirmada';
            else if (rand < 0.8) estado = 'programada';
            else estado = 'cancelada';
          }
          
          // Box aleatorio (1-8)
          const box = (Math.floor(Math.random() * 8) + 1).toString();
          
          // Notas aleatorias más variadas y realistas
          const notasPosibles = [
            'Primera visita - Paciente nuevo',
            'Seguimiento de tratamiento',
            'Control post-tratamiento',
            'Urgente - Dolor agudo',
            'Urgente - Infección dental',
            'Urgente - Fractura dental',
            'Paciente con ansiedad dental - Requiere atención especial',
            'Requiere anestesia local',
            'Alérgico a látex - Usar guantes sin látex',
            'Paciente preferido - Horario matutino',
            'Recordar traer radiografías previas',
            'Revisión de ortodoncia - Ajuste de brackets',
            'Consulta de segunda opinión',
            'Paciente VIP - Atención prioritaria',
            'Necesita intérprete',
            'Recordar confirmar cita 24h antes',
            'Paciente con movilidad reducida',
            'Seguimiento de implante',
            'Control de higiene bucal',
            'Consulta estética',
            'Paciente diabético - Control especial',
            'Requiere sedación consciente',
            'Paciente embarazada - Precaución con radiografías',
            'Seguimiento de blanqueamiento',
            'Revisión de prótesis',
            'Control de carillas',
            'Paciente con hipertensión - Monitoreo',
            'Recordar traer consentimiento firmado',
            'Paciente menor de edad - Requiere acompañante',
            'Seguimiento post-cirugía',
            'Consulta de urgencia programada',
            'Paciente con alergia a medicamentos',
            'Requiere tiempo extra - Tratamiento complejo',
            'Paciente con fobia dental',
            'Control de ortodoncia invisible',
            'Revisión de endodoncia',
            'Seguimiento de periodoncia',
            'Paciente con anticoagulantes - Precaución',
            'Requiere radiografía panorámica',
            'Control de sensibilidad dental',
            'Revisión de empastes',
            'Paciente con asma - Precaución',
            'Consulta de ortodoncia - Primera vez',
            'Seguimiento de tratamiento de conductos',
            'Control de gingivitis',
            'Revisión de corona',
            'Paciente con problemas cardíacos',
            'Requiere limpieza profunda',
            'Consulta de prótesis removible',
            'Seguimiento de tratamiento de encías',
            'Control de maloclusión',
            'Revisión de férula de descarga',
            'Paciente con bruxismo',
            'Consulta de estética - Carillas',
            'Seguimiento de tratamiento de sensibilidad',
            'Control de halitosis',
            'Revisión de tratamiento de blanqueamiento',
            'Paciente con reflujo gastroesofágico',
            'Requiere tratamiento de periodoncia',
            'Consulta de cirugía oral',
            'Seguimiento de extracción',
            'Control de cicatrización',
            'Revisión de tratamiento de implantes',
            'Paciente con tratamiento de ortodoncia lingual',
            'Requiere tratamiento de endodoncia',
            'Consulta de prótesis fija',
            'Seguimiento de tratamiento de estética',
            'Control de tratamiento de periodoncia',
            'Revisión de tratamiento de ortodoncia',
            'Paciente con tratamiento de implantes múltiples',
            'Requiere tratamiento de cirugía',
            'Consulta de tratamiento de estética avanzada',
            'Seguimiento de tratamiento de prótesis',
            'Control de tratamiento de endodoncia',
            'Revisión de tratamiento de periodoncia avanzada',
            '',
            '',
            '',
            '', // Más probabilidad de sin notas
          ];
          const notas = notasPosibles[Math.floor(Math.random() * notasPosibles.length)];
          
          // Historial de cambios más completo
          const historialCambios = [];
          const fechaCreacion = new Date(fechaInicio.getTime() - (7 + Math.floor(Math.random() * 14)) * 24 * 60 * 60 * 1000);
          historialCambios.push({
            fecha: fechaCreacion.toISOString(),
            usuario: ['Admin', 'Recepcionista', 'Sistema'][Math.floor(Math.random() * 3)],
            cambio: 'Cita creada',
          });
          
          if (estado === 'confirmada' && Math.random() < 0.6) {
            const fechaConfirmacion = new Date(fechaInicio.getTime() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000);
            historialCambios.push({
              fecha: fechaConfirmacion.toISOString(),
              usuario: 'Recepcionista',
              cambio: 'Cita confirmada por teléfono',
            });
          }
          
          if (estado === 'cancelada' && Math.random() < 0.5) {
            const fechaCancelacion = new Date(fechaInicio.getTime() - Math.floor(Math.random() * 2) * 24 * 60 * 60 * 1000);
            historialCambios.push({
              fecha: fechaCancelacion.toISOString(),
              usuario: ['Paciente', 'Recepcionista'][Math.floor(Math.random() * 2)],
              cambio: 'Cita cancelada',
            });
          }
          
          datosMock.push({
            _id: `cita-${dia}-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            paciente: {
              _id: paciente._id,
              nombre: paciente.nombre,
              apellidos: paciente.apellidos,
              telefono: paciente.telefono,
              email: paciente.email,
            },
            profesional: {
              _id: profesional._id,
              nombre: profesional.nombre,
              apellidos: profesional.apellidos,
            },
            sede: {
              _id: sede._id,
              nombre: sede.nombre,
            },
            fecha_hora_inicio: fechaInicio.toISOString(),
            fecha_hora_fin: fechaFin.toISOString(),
            duracion_minutos: duracion,
            estado: estado,
            tratamiento: {
              _id: tratamiento._id,
              nombre: tratamiento.nombre,
            },
            notas: notas,
            box_asignado: box,
            creadoPor: { _id: '1', nombre: 'Admin' },
            historial_cambios: historialCambios,
          });
        }
      }
      
        // Filtrar citas dentro del rango
        const fechaInicio = new Date(filtros.fecha_inicio);
        const fechaFin = new Date(filtros.fecha_fin);
        let citasFiltradas = datosMock.filter((cita) => {
          const fechaCita = new Date(cita.fecha_hora_inicio);
          return fechaCita >= fechaInicio && fechaCita <= fechaFin;
        });
        
        // Aplicar filtros adicionales
        if (filtros.profesional_id) {
          citasFiltradas = citasFiltradas.filter(
            (cita) => cita.profesional._id === filtros.profesional_id
          );
        }
        if (filtros.sede_id) {
          citasFiltradas = citasFiltradas.filter(
            (cita) => cita.sede._id === filtros.sede_id
          );
        }
        if (filtros.estado) {
          citasFiltradas = citasFiltradas.filter(
            (cita) => cita.estado === filtros.estado
          );
        }
        if (filtros.box_id) {
          citasFiltradas = citasFiltradas.filter(
            (cita) => cita.box_asignado === filtros.box_id
          );
        }
        
        citasData = citasFiltradas;
        
        // Guardar datos mock en cache
        await citasCache.saveCitas(citasData, filtros);
        setLastSyncTime(new Date());
      }
      
      setCitas(citasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  }, [filtros, isOffline, agregarToast]);

  // Guardar referencia de cargarCitas
  cargarCitasRef.current = cargarCitas;

  // Efecto para manejar cambios de estado online/offline
  useEffect(() => {
    if (isOnline && wasOffline) {
      // Se recuperó la conexión
      setIsReconnecting(true);
      setTimeout(() => {
        if (cargarCitasRef.current) {
          cargarCitasRef.current(true).finally(() => {
            setIsReconnecting(false);
          });
        }
      }, 1000);
    } else if (isOffline) {
      // Se perdió la conexión
      agregarToast({
        tipo: 'warning',
        titulo: 'Conexión perdida',
        mensaje: 'Se ha perdido la conexión. La agenda está en modo solo lectura.',
      });
    }
  }, [isOnline, isOffline, wasOffline, agregarToast]);

  useEffect(() => {
    cargarCitas();
  }, [cargarCitas, filtros]);

  // Función para remover toast
  const removerToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Función para agregar notificación
  const agregarNotificacion = useCallback((notificacion: Omit<NotificacionReciente, 'id' | 'leida'>) => {
    const nuevaNotificacion: NotificacionReciente = {
      ...notificacion,
      id: `notif-${Date.now()}-${Math.random()}`,
      leida: false,
    };
    setNotificaciones(prev => {
      const actualizadas = [nuevaNotificacion, ...prev].slice(0, 20); // Mantener solo las últimas 20
      return actualizadas;
    });
  }, []);

  // Cargar configuración de KPIs cuando cambia el usuario
  useEffect(() => {
    if (user?.id) {
      const config = loadKpiConfig(user.id);
      setKpiConfig(config);
    }
  }, [user?.id]);

  // Configurar WebSocket para eventos en tiempo real
  useEffect(() => {
    // Inicializar WebSocket
    const ws = new CitasWebSocket();
    wsRef.current = ws;

    // Conectar
    ws.connect()
      .then(() => {
        console.log('WebSocket de citas conectado');

        // Suscribirse a eventos de cita actualizada (confirmación/cancelación desde enlace externo)
        ws.on('cita-actualizada', async (data: EventoCitaActualizada) => {
          console.log('Cita actualizada desde enlace externo:', data);
          
          // Actualizar la cita específica en el estado local
          if (data.cita) {
            setCitas(prevCitas =>
              prevCitas.map(c =>
                c._id === data.citaId
                  ? { ...c, ...data.cita, canalConfirmacion: data.canalConfirmacion, estado: data.estado }
                  : c
              )
            );
          } else {
            // Si no viene la cita completa, obtenerla del servidor
            try {
              const citaActualizada = await obtenerDetalleCita(data.citaId);
              setCitas(prevCitas =>
                prevCitas.map(c =>
                  c._id === data.citaId
                    ? { ...citaActualizada, canalConfirmacion: data.canalConfirmacion }
                    : c
                )
              );
            } catch (error) {
              console.error('Error al obtener detalle de cita:', error);
              // Recargar todas las citas como fallback
              cargarCitas();
            }
          }

          // Mostrar toast de notificación
          const canalTexto = data.canalConfirmacion 
            ? ` vía ${data.canalConfirmacion.toUpperCase()}` 
            : '';
          const mensaje = data.estado === 'confirmada'
            ? `Cita confirmada${canalTexto}`
            : data.estado === 'cancelada'
            ? `Cita cancelada${canalTexto}`
            : `Cita actualizada${canalTexto}`;

          agregarToast({
            tipo: data.estado === 'confirmada' ? 'success' : data.estado === 'cancelada' ? 'warning' : 'info',
            titulo: 'Cita actualizada',
            mensaje: mensaje,
            citaId: data.citaId,
            accion: {
              etiqueta: 'Ver cita',
              onClick: () => {
                setCitas(prevCitas => {
                  const cita = prevCitas.find(c => c._id === data.citaId);
                  if (cita) {
                    setCitaSeleccionada(cita);
                    setMostrarModal(true);
                  }
                  return prevCitas;
                });
              },
            },
          });

          // Agregar a notificaciones recientes
          agregarNotificacion({
            tipo: data.estado === 'confirmada' ? 'confirmada' : 'cancelada_paciente',
            citaId: data.citaId,
            mensaje: mensaje,
            timestamp: data.timestamp,
            canalConfirmacion: data.canalConfirmacion,
            cita: data.cita,
          });
        });

        // Suscribirse a notificaciones de citas (asignación, reprogramación, cancelación)
        ws.on('notificacion-cita', (data: EventoNotificacionCita) => {
          console.log('Notificación de cita:', data);

          // Solo mostrar notificaciones si el usuario es el profesional asignado
          if (data.profesionalId && user?._id === data.profesionalId) {
            agregarToast({
              tipo: data.tipo === 'cancelada' ? 'warning' : 'info',
              titulo: 'Notificación de cita',
              mensaje: data.mensaje,
              citaId: data.citaId,
              accion: {
                etiqueta: 'Ver cita',
                onClick: () => {
                  setCitas(prevCitas => {
                    const cita = prevCitas.find(c => c._id === data.citaId);
                    if (cita) {
                      setCitaSeleccionada(cita);
                      setMostrarModal(true);
                      // Destacar la cita
                      setCitaDestacada(data.citaId);
                      setTimeout(() => setCitaDestacada(null), 3000);
                    }
                    return prevCitas;
                  });
                },
              },
            });

            // Agregar a notificaciones recientes
            agregarNotificacion({
              tipo: data.tipo,
              citaId: data.citaId,
              mensaje: data.mensaje,
              timestamp: data.timestamp,
              profesionalId: data.profesionalId,
              cita: data.cita,
            });
          }
        });

        // Manejar errores
        ws.on('error', (data: { mensaje: string }) => {
          console.error('Error en WebSocket:', data.mensaje);
          agregarToast({
            tipo: 'error',
            titulo: 'Error de conexión',
            mensaje: data.mensaje,
          });
        });
      })
      .catch((error) => {
        console.error('Error al conectar WebSocket:', error);
      });

    return () => {
      ws.disconnect();
      wsRef.current = null;
    };
  }, [user?._id, agregarToast, agregarNotificacion, cargarCitas]); // Reconectar si cambia el usuario

  // Función para manejar click en toast
  const handleToastClick = useCallback((toast: Toast) => {
    if (toast.citaId) {
      setCitas(prevCitas => {
        const cita = prevCitas.find(c => c._id === toast.citaId);
        if (cita) {
          setCitaSeleccionada(cita);
          setMostrarModal(true);
          // Destacar la cita
          setCitaDestacada(toast.citaId);
          setTimeout(() => setCitaDestacada(null), 3000);
        }
        return prevCitas;
      });
    }
  }, []);

  // Función para manejar click en notificación
  const handleNotificacionClick = useCallback((notificacion: NotificacionReciente) => {
    if (notificacion.citaId) {
      setCitas(prevCitas => {
        const cita = prevCitas.find(c => c._id === notificacion.citaId) || notificacion.cita;
        if (cita) {
          setCitaSeleccionada(cita);
          setMostrarModal(true);
          // Destacar la cita
          setCitaDestacada(notificacion.citaId);
          setTimeout(() => setCitaDestacada(null), 3000);
        }
        return prevCitas;
      });
    }
  }, []);

  // Función para marcar notificación como leída
  const handleMarcarLeida = useCallback((id: string) => {
    setNotificaciones(prev =>
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  }, []);

  // Función para limpiar todas las notificaciones
  const handleLimpiarNotificaciones = useCallback(() => {
    setNotificaciones([]);
  }, []);

  const handleFiltrosChange = (nuevosFiltros: IFiltrosCalendario) => {
    setFiltros(nuevosFiltros);
  };

  const handleCitaClick = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setMostrarModal(true);
  };

  // Handler para abrir modal de recordatorios desde el modal de edición
  const handleAbrirRecordatorios = (cita: Cita) => {
    setCitaParaRecordatorios(cita);
    setMostrarModalRecordatorios(true);
  };

  const handleSlotClick = (fecha: Date, hora: string) => {
    // Bloquear si está offline
    if (isOffline) {
      agregarToast({
        tipo: 'error',
        titulo: 'Modo offline',
        mensaje: 'No se pueden crear nuevas citas sin conexión. Por favor, espera a que se recupere la conexión.',
      });
      return;
    }

    setCitaSeleccionada(null);
    setFechaSeleccionada(fecha);
    setHoraSeleccionada(hora);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setCitaSeleccionada(null);
    setFechaSeleccionada(undefined);
    setHoraSeleccionada(undefined);
  };

  const handleGuardarCita = async () => {
    // Bloquear si está offline
    if (isOffline) {
      agregarToast({
        tipo: 'error',
        titulo: 'Modo offline',
        mensaje: 'No se pueden guardar cambios sin conexión. Por favor, espera a que se recupere la conexión.',
      });
      return;
    }

    await cargarCitas();
  };

  // Handler para reprogramar citas mediante drag & drop
  const handleReprogramarCita = async (
    citaId: string,
    nuevaFecha: Date,
    nuevaHora: string,
    profesionalId?: string,
    boxId?: string
  ) => {
    const cita = citas.find(c => c._id === citaId);
    if (!cita) return;

    // Calcular nueva fecha y hora
    const [horaStr, minutoStr] = nuevaHora.split(':');
    const nuevaFechaHora = new Date(nuevaFecha);
    nuevaFechaHora.setHours(parseInt(horaStr), parseInt(minutoStr), 0, 0);

    // Verificar si hay cambio de sede
    let nuevaSedeId: string | undefined;
    if (profesionalId) {
      const nuevoProfesional = profesionales.find(p => p._id === profesionalId);
      // Aquí se podría obtener la sede del profesional, por ahora usamos la misma
      // En producción, esto debería venir de los datos del profesional
    }

    const hayCambioSede = nuevaSedeId && nuevaSedeId !== cita.sede._id;

    // Si hay cambio de sede, mostrar modal de confirmación
    if (hayCambioSede) {
      setReprogramacionPendiente({
        citaId,
        nuevaFecha,
        nuevaHora,
        profesionalId,
        boxId,
      });
      setMostrarModalCambioSede(true);
      return;
    }

    // Si no hay cambio de sede, proceder directamente
    await ejecutarReprogramacion(citaId, nuevaFechaHora, profesionalId, boxId);
  };

  // Ejecutar la reprogramación
  const ejecutarReprogramacion = async (
    citaId: string,
    nuevaFechaHora: Date,
    profesionalId?: string,
    boxId?: string
  ) => {
    // Bloquear si está offline
    if (isOffline) {
      agregarToast({
        tipo: 'error',
        titulo: 'Modo offline',
        mensaje: 'No se pueden realizar ediciones sin conexión. Por favor, espera a que se recupere la conexión.',
      });
      return;
    }

    setReprogramando(true);
    try {
      const cita = citas.find(c => c._id === citaId);
      const fechaAnterior = cita ? new Date(cita.fecha_hora_inicio) : null;
      
      const citaActualizada = await trackMutation(
        'mover',
        () => moverCita(
          citaId,
          nuevaFechaHora.toISOString(),
          profesionalId,
          boxId
        ),
        () => moverCita(
          citaId,
          nuevaFechaHora.toISOString(),
          profesionalId,
          boxId
        )
      );

      // Agregar entrada de auditoría para drag & drop
      if (citaActualizada.historial_cambios) {
        citaActualizada.historial_cambios.push({
          fecha: new Date().toISOString(),
          usuario: user?.nombre || 'Usuario',
          cambio: `Cita movida mediante drag & drop de ${fechaAnterior?.toLocaleString('es-ES')} a ${nuevaFechaHora.toLocaleString('es-ES')}`,
        });
      }

      // Actualizar la cita en el estado local
      setCitas(prevCitas =>
        prevCitas.map(c =>
          c._id === citaId ? citaActualizada : c
        )
      );

      // Recargar citas para asegurar sincronización
      await cargarCitas();
    } catch (error) {
      console.error('Error al reprogramar la cita:', error);
      alert(error instanceof Error ? error.message : 'Error al reprogramar la cita');
    } finally {
      setReprogramando(false);
      setMostrarModalCambioSede(false);
      setReprogramacionPendiente(null);
    }
  };

  // Confirmar cambio de sede
  const handleConfirmarCambioSede = async () => {
    if (!reprogramacionPendiente) return;

    const [horaStr, minutoStr] = reprogramacionPendiente.nuevaHora.split(':');
    const nuevaFechaHora = new Date(reprogramacionPendiente.nuevaFecha);
    nuevaFechaHora.setHours(parseInt(horaStr), parseInt(minutoStr), 0, 0);

    await ejecutarReprogramacion(
      reprogramacionPendiente.citaId,
      nuevaFechaHora,
      reprogramacionPendiente.profesionalId,
      reprogramacionPendiente.boxId
    );
  };

  // Handler para inicio de resize de cita
  const handleCitaResizeStart = (cita: Cita) => {
    setCitaResizeInicial(cita);
  };

  // Handler para fin de resize de cita
  const handleCitaResizeEnd = async (cita: Cita, nuevaDuracionMinutos: number) => {
    if (!citaResizeInicial || !cita._id) return;

    // Bloquear si está offline
    if (isOffline) {
      agregarToast({
        tipo: 'error',
        titulo: 'Modo offline',
        mensaje: 'No se pueden realizar ediciones sin conexión. Por favor, espera a que se recupere la conexión.',
      });
      return;
    }

    try {
      const fechaInicio = new Date(cita.fecha_hora_inicio);
      const nuevaFechaFin = new Date(fechaInicio);
      nuevaFechaFin.setMinutes(nuevaFechaFin.getMinutes() + nuevaDuracionMinutos);

      // Guardar duración previa para el historial
      const duracionPrevia = citaResizeInicial.duracion_minutos;

      // Actualizar la cita
      const citaActualizada = await trackMutation(
        'resize',
        () => actualizarCita(cita._id, {
          fecha_hora_fin: nuevaFechaFin.toISOString(),
          // Nota: En producción, aquí se debería actualizar el historial con la duración previa
        }),
        () => actualizarCita(cita._id, {
          fecha_hora_fin: nuevaFechaFin.toISOString(),
        })
      );

      // Actualizar en el estado local
      setCitas(prevCitas =>
        prevCitas.map(c =>
          c._id === cita._id ? citaActualizada : c
        )
      );

      // Actualizar historial (simulado - en producción esto debería hacerse en el backend)
      if (citaActualizada.historial_cambios) {
        citaActualizada.historial_cambios.push({
          fecha: new Date().toISOString(),
          usuario: user?.nombre || 'Usuario',
          cambio: `Duración modificada mediante resize de ${duracionPrevia} a ${nuevaDuracionMinutos} minutos`,
        });
      }

      // Recargar citas
      await cargarCitas();
    } catch (error) {
      console.error('Error al redimensionar la cita:', error);
      alert(error instanceof Error ? error.message : 'Error al redimensionar la cita');
    } finally {
      setCitaResizeInicial(null);
    }
  };

  // Handler para cuando se programa una cita pendiente desde el panel
  const handleCitaPendienteProgramada = async (
    citaPendiente: CitaPendiente,
    fecha: Date,
    hora: string,
    profesionalId?: string,
    boxId?: string
  ) => {
    // Bloquear si está offline
    if (isOffline) {
      agregarToast({
        tipo: 'error',
        titulo: 'Modo offline',
        mensaje: 'No se pueden realizar ediciones sin conexión. Por favor, espera a que se recupere la conexión.',
      });
      return;
    }

    try {
      const [horaStr, minutoStr] = hora.split(':');
      const fechaHoraInicio = new Date(fecha);
      fechaHoraInicio.setHours(parseInt(horaStr), parseInt(minutoStr), 0, 0);

      await trackMutation(
        'crear',
        () => programarCitaPendiente(
          citaPendiente._id,
          fechaHoraInicio.toISOString(),
          profesionalId || citaPendiente.profesional?._id,
          boxId
        ),
        () => programarCitaPendiente(
          citaPendiente._id,
          fechaHoraInicio.toISOString(),
          profesionalId || citaPendiente.profesional?._id,
          boxId
        )
      );

      // Recargar citas
      await cargarCitas();
    } catch (error) {
      console.error('Error al programar la cita pendiente:', error);
      alert(error instanceof Error ? error.message : 'Error al programar la cita pendiente');
    }
  };

  const handleDiaClickMensual = (fecha: Date) => {
    // Cambiar a vista diaria o semanal con la fecha seleccionada
    setVista('semana');
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 7);
    fechaFin.setHours(23, 59, 59, 999);
    setFiltros({
      fecha_inicio: fechaInicio.toISOString(),
      fecha_fin: fechaFin.toISOString(),
    });
  };

  const handleMesChange = (mes: number, anio: number) => {
    setMesActual(mes);
    setAnioActual(anio);
  };

  const handleFiltrosMensualChange = (nuevosFiltros: FiltrosResumenMensual) => {
    setFiltrosMensual({
      profesionalId: nuevosFiltros.profesionalId,
      sedeId: nuevosFiltros.sedeId,
      estado: nuevosFiltros.estado,
    });
  };

  // Handler para cuando se selecciona una fecha en el mini calendario
  const handleDatePicked = (fecha: Date) => {
    // Ajustar filtros para enfocar la semana elegida
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    
    // Calcular la fecha fin basada en los días visibles
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + diasVisibles - 1);
    fechaFin.setHours(23, 59, 59, 999);
    
    setFiltros({
      ...filtros,
      fecha_inicio: fechaInicio.toISOString(),
      fecha_fin: fechaFin.toISOString(),
    });
    
    // Cerrar el panel del mini calendario
    setMostrarMiniCalendario(false);
    
    // Cambiar a vista semana si está en otra vista
    if (vista === 'mes') {
      setVista('semana');
    }
  };

  // Handler para cambiar el número de días visibles
  const handleDiasVisiblesChange = (dias: number) => {
    setDiasVisibles(dias);
    
    // Ajustar el rango de fechas basado en los días visibles
    const fechaInicio = new Date(filtros.fecha_inicio);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + dias - 1);
    fechaFin.setHours(23, 59, 59, 999);
    
    setFiltros({
      ...filtros,
      fecha_inicio: fechaInicio.toISOString(),
      fecha_fin: fechaFin.toISOString(),
    });
  };

  const fechaInicio = new Date(filtros.fecha_inicio);
  const fechaFin = new Date(filtros.fecha_fin);

  // Calcular estadísticas de las citas
  const estadisticas = useMemo(() => {
    const total = citas.length;
    const porEstado = citas.reduce((acc, cita) => {
      acc[cita.estado] = (acc[cita.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const confirmadas = porEstado['confirmada'] || 0;
    const programadas = porEstado['programada'] || 0;
    const realizadas = porEstado['realizada'] || 0;
    const canceladas = porEstado['cancelada'] || 0;
    const noAsistio = porEstado['no-asistio'] || 0;
    
    const porProfesional = citas.reduce((acc, cita) => {
      const key = `${cita.profesional.nombre} ${cita.profesional.apellidos}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const porSede = citas.reduce((acc, cita) => {
      acc[cita.sede.nombre] = (acc[cita.sede.nombre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const duracionTotal = citas.reduce((sum, cita) => sum + cita.duracion_minutos, 0);
    const duracionPromedio = total > 0 ? Math.round(duracionTotal / total) : 0;
    
    // Calcular horas totales
    const horasTotales = Math.round(duracionTotal / 60 * 10) / 10;
    
    // Calcular tasa de confirmación
    const tasaConfirmacion = total > 0 ? Math.round((confirmadas / total) * 100) : 0;
    
    // Calcular tasa de asistencia (realizadas / (realizadas + no-asistio))
    const totalConAsistencia = realizadas + noAsistio;
    const tasaAsistencia = totalConAsistencia > 0 ? Math.round((realizadas / totalConAsistencia) * 100) : 0;
    
    // Calcular citas urgentes usando la función del componente
    const citasUrgentes = citas.filter(c => esCitaUrgente(c)).length;
    
    // Calcular citas hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    const citasHoy = citas.filter(c => {
      const fechaCita = new Date(c.fecha_hora_inicio);
      return fechaCita >= hoy && fechaCita < manana;
    }).length;
    
    // Calcular citas esta semana
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1); // Lunes
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 7);
    const citasEstaSemana = citas.filter(c => {
      const fechaCita = new Date(c.fecha_hora_inicio);
      return fechaCita >= inicioSemana && fechaCita < finSemana;
    }).length;
    
    // Calcular citas mañana
    const mananaInicio = new Date(hoy);
    mananaInicio.setDate(mananaInicio.getDate() + 1);
    const mananaFin = new Date(mananaInicio);
    mananaFin.setDate(mananaFin.getDate() + 1);
    const citasManana = citas.filter(c => {
      const fechaCita = new Date(c.fecha_hora_inicio);
      return fechaCita >= mananaInicio && fechaCita < mananaFin;
    }).length;
    
    // Calcular citas próximas 3 días
    const proximos3Dias = new Date(hoy);
    proximos3Dias.setDate(proximos3Dias.getDate() + 3);
    const citasProximos3Dias = citas.filter(c => {
      const fechaCita = new Date(c.fecha_hora_inicio);
      return fechaCita >= hoy && fechaCita <= proximos3Dias;
    }).length;
    
    // Calcular pacientes únicos
    const pacientesUnicos = new Set(citas.map(c => c.paciente._id)).size;
    
    // Calcular profesionales únicos
    const profesionalesUnicos = new Set(citas.map(c => c.profesional._id)).size;
    
    // Calcular sedes únicas
    const sedesUnicas = new Set(citas.map(c => c.sede._id)).size;
    
    // Calcular citas con notas
    const citasConNotas = citas.filter(c => c.notas && c.notas.trim().length > 0).length;
    
    // Calcular citas próximas (próximas 2 horas)
    const ahora = new Date();
    const proximas2Horas = new Date(ahora.getTime() + 2 * 60 * 60 * 1000);
    const citasProximas = citas.filter(c => {
      const fechaCita = new Date(c.fecha_hora_inicio);
      return fechaCita >= ahora && fechaCita <= proximas2Horas && c.estado !== 'cancelada';
    }).length;
    
    // Calcular ocupación por hora del día
    const ocupacionPorHora: Record<number, number> = {};
    citas.forEach(c => {
      const fechaCita = new Date(c.fecha_hora_inicio);
      const hora = fechaCita.getHours();
      ocupacionPorHora[hora] = (ocupacionPorHora[hora] || 0) + 1;
    });
    const horaMasOcupada = Object.entries(ocupacionPorHora).reduce((max, [hora, cantidad]) => 
      cantidad > max.cantidad ? { hora: parseInt(hora), cantidad } : max, 
      { hora: 0, cantidad: 0 }
    );
    
    // Profesional más ocupado
    const profesionalMasOcupado = Object.entries(porProfesional).reduce((max, [key, value]) => 
      value > max.value ? { key, value } : max, { key: '', value: 0 }
    );
    
    // Sede más ocupada
    const sedeMasOcupada = Object.entries(porSede).reduce((max, [key, value]) => 
      value > max.value ? { key, value } : max, { key: '', value: 0 }
    );
    
    // Calcular distribución de duraciones
    const duraciones = citas.map(c => c.duracion_minutos);
    const duracionMinima = duraciones.length > 0 ? Math.min(...duraciones) : 0;
    const duracionMaxima = duraciones.length > 0 ? Math.max(...duraciones) : 0;
    
    // Calcular tasa de cancelación
    const tasaCancelacion = total > 0 ? Math.round((canceladas / total) * 100) : 0;
    
    // Calcular tasa de no asistencia
    const tasaNoAsistencia = total > 0 ? Math.round((noAsistio / total) * 100) : 0;
    
    // Calcular ingresos por hora (simulado - en producción vendría de facturación)
    // Asumimos un precio promedio por tratamiento
    const precioPromedio = 150; // Euros
    const citasRealizadas = realizadas;
    const ingresosTotales = citasRealizadas * precioPromedio;
    const horasTrabajadas = horasTotales;
    const ingresosPorHora = horasTrabajadas > 0 ? Math.round((ingresosTotales / horasTrabajadas) * 100) / 100 : 0;
    
    return {
      total,
      confirmadas,
      programadas,
      realizadas,
      canceladas,
      noAsistio,
      porProfesional,
      porSede,
      duracionTotal,
      duracionPromedio,
      horasTotales,
      tasaConfirmacion,
      tasaAsistencia,
      citasUrgentes,
      citasHoy,
      citasEstaSemana,
      citasManana,
      citasProximos3Dias,
      citasProximas,
      pacientesUnicos,
      profesionalesUnicos,
      sedesUnicas,
      citasConNotas,
      horaMasOcupada: horaMasOcupada.hora,
      profesionalMasOcupado: profesionalMasOcupado.key,
      sedeMasOcupada: sedeMasOcupada.key,
      duracionMinima,
      duracionMaxima,
      tasaCancelacion,
      tasaNoAsistencia,
      ingresosPorHora,
    };
  }, [citas]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Banner de modo offline */}
      <OfflineBanner
        isOffline={isOffline}
        isReconnecting={isReconnecting}
        lastSyncTime={lastSyncTime}
        onRetry={async () => {
          const isConnected = await checkConnection();
          if (isConnected) {
            await cargarCitas(true);
          } else {
            agregarToast({
              tipo: 'error',
              titulo: 'Sin conexión',
              mensaje: 'Aún no hay conexión disponible. Por favor, verifica tu conexión a internet.',
            });
          }
        }}
      />
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className={`mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 ${isOffline ? 'pt-20' : 'pt-4'}`}>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Calendar size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Agenda de Citas y Programación
                  </h1>
                  <p className="text-gray-600">
                    Gestiona y visualiza todas las citas programadas de la clínica
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  // Bloquear si está offline
                  if (isOffline) {
                    agregarToast({
                      tipo: 'error',
                      titulo: 'Modo offline',
                      mensaje: 'No se pueden crear nuevas citas sin conexión. Por favor, espera a que se recupere la conexión.',
                    });
                    return;
                  }

                  if (onNuevaCita) {
                    onNuevaCita();
                  } else {
                    // Fallback: mostrar modal si no hay callback
                    setCitaSeleccionada(null);
                    setFechaSeleccionada(new Date());
                    setHoraSeleccionada('09:00');
                    setMostrarModal(true);
                  }
                }}
                disabled={isOffline}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
              >
                <Plus size={20} className="mr-2" />
                Nueva Cita
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Panel de estadísticas mejorado - Solo en vista día/semana */}
          {vista !== 'mes' && !loading && citas.length > 0 && (
            <div className="space-y-6">
              {/* Header con botones de configuración y exportación */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Métricas y Estadísticas</h2>
                <div className="flex items-center space-x-2">
                  {/* Botón de configuración de KPIs - Solo para administradores */}
                  {(user?.role === 'propietario' || user?.role === 'director') && (
                    <button
                      onClick={() => setMostrarKpiConfigurator(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all border border-gray-300 shadow-sm"
                      title="Configurar KPIs visibles"
                    >
                      <Settings size={18} />
                      <span className="text-sm">Configurar KPIs</span>
                    </button>
                  )}
                  {/* Botón de exportación - Para coordinadores y administradores */}
                  {(user?.role === 'propietario' || user?.role === 'director' || user?.role === 'recepcionista') && (
                    <button
                      onClick={() => setMostrarExportModal(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm"
                      title="Exportar citas visibles"
                    >
                      <Download size={18} />
                      <span className="text-sm">Exportar</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Estadísticas principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {kpiConfig.total && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Total de Citas</p>
                        <p className="text-2xl font-bold text-blue-700">{estadisticas.total}</p>
                        <p className="text-xs text-gray-500 mt-1">En el rango seleccionado</p>
                      </div>
                      <div className="bg-blue-200 rounded-full p-3">
                        <Calendar className="w-6 h-6 text-blue-700" />
                      </div>
                    </div>
                  </div>
                )}
                
                {kpiConfig.confirmadas && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Confirmadas</p>
                        <p className="text-2xl font-bold text-green-700">{estadisticas.confirmadas}</p>
                        <p className="text-xs text-gray-500 mt-1">{estadisticas.tasaConfirmacion}% del total</p>
                      </div>
                      <div className="bg-green-200 rounded-full p-3">
                        <CheckCircle className="w-6 h-6 text-green-700" />
                      </div>
                    </div>
                  </div>
                )}
                
                {kpiConfig.programadas && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Programadas</p>
                        <p className="text-2xl font-bold text-indigo-700">{estadisticas.programadas}</p>
                        <p className="text-xs text-gray-500 mt-1">Pendientes de confirmar</p>
                      </div>
                      <div className="bg-indigo-200 rounded-full p-3">
                        <Clock className="w-6 h-6 text-indigo-700" />
                      </div>
                    </div>
                  </div>
                )}
                
                {kpiConfig.duracionPromedio && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Duración Promedio</p>
                        <p className="text-2xl font-bold text-purple-700">{estadisticas.duracionPromedio} min</p>
                        <p className="text-xs text-gray-500 mt-1">{estadisticas.horasTotales}h totales</p>
                      </div>
                      <div className="bg-purple-200 rounded-full p-3">
                        <TrendingUp className="w-6 h-6 text-purple-700" />
                      </div>
                    </div>
                  </div>
                )}
                
                {kpiConfig.citasHoy && estadisticas.citasHoy > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Citas Hoy</p>
                        <p className="text-2xl font-bold text-orange-700">{estadisticas.citasHoy}</p>
                        <p className="text-xs text-gray-500 mt-1">Día actual</p>
                      </div>
                      <div className="bg-orange-200 rounded-full p-3">
                        <Calendar className="w-6 h-6 text-orange-700" />
                      </div>
                    </div>
                  </div>
                )}
                
                {kpiConfig.citasUrgentes && estadisticas.citasUrgentes > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Urgentes</p>
                        <p className="text-2xl font-bold text-red-700">{estadisticas.citasUrgentes}</p>
                        <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
                      </div>
                      <div className="bg-red-200 rounded-full p-3">
                        <X className="w-6 h-6 text-red-700" />
                      </div>
                    </div>
                  </div>
                )}
                
                {kpiConfig.realizadas && estadisticas.realizadas > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Realizadas</p>
                        <p className="text-2xl font-bold text-emerald-700">{estadisticas.realizadas}</p>
                        <p className="text-xs text-gray-500 mt-1">{estadisticas.tasaAsistencia}% asistencia</p>
                      </div>
                      <div className="bg-emerald-200 rounded-full p-3">
                        <CheckCircle className="w-6 h-6 text-emerald-700" />
                      </div>
                    </div>
                  </div>
                )}
                
                {kpiConfig.canceladas && estadisticas.canceladas > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Canceladas</p>
                        <p className="text-2xl font-bold text-gray-700">{estadisticas.canceladas}</p>
                        <p className="text-xs text-gray-500 mt-1">{estadisticas.tasaCancelacion}% del total</p>
                      </div>
                      <div className="bg-gray-200 rounded-full p-3">
                        <X className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* KPIs Avanzados */}
                {kpiConfig.tasaNoShow && (
                  <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Tasa No-Show</p>
                        <p className="text-2xl font-bold text-purple-700">{estadisticas.tasaNoAsistencia}%</p>
                        <p className="text-xs text-gray-500 mt-1">No asistieron</p>
                      </div>
                      <div className="bg-purple-200 rounded-full p-3">
                        <TrendingUp className="w-6 h-6 text-purple-700" />
                      </div>
                    </div>
                  </div>
                )}
                
                {kpiConfig.ingresosPorHora && estadisticas.ingresosPorHora > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Ingresos/Hora</p>
                        <p className="text-2xl font-bold text-green-700">€{estadisticas.ingresosPorHora}</p>
                        <p className="text-xs text-gray-500 mt-1">Promedio</p>
                      </div>
                      <div className="bg-green-200 rounded-full p-3">
                        <BarChart3 className="w-6 h-6 text-green-700" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Estadísticas secundarias y métricas avanzadas */}
              {(kpiConfig.pacientesUnicos || kpiConfig.profesionalesUnicos || kpiConfig.sedesUnicas || kpiConfig.citasConNotas) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {kpiConfig.pacientesUnicos && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Pacientes Únicos</p>
                          <p className="text-2xl font-bold text-indigo-700">{estadisticas.pacientesUnicos}</p>
                          <p className="text-xs text-gray-500 mt-1">En el rango</p>
                        </div>
                        <div className="bg-indigo-200 rounded-full p-3">
                          <Users className="w-6 h-6 text-indigo-700" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {kpiConfig.profesionalesUnicos && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Profesionales</p>
                          <p className="text-2xl font-bold text-violet-700">{estadisticas.profesionalesUnicos}</p>
                          <p className="text-xs text-gray-500 mt-1">Activos en período</p>
                        </div>
                        <div className="bg-violet-200 rounded-full p-3">
                          <Users className="w-6 h-6 text-violet-700" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {kpiConfig.sedesUnicas && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Sedes</p>
                          <p className="text-2xl font-bold text-cyan-700">{estadisticas.sedesUnicas}</p>
                          <p className="text-xs text-gray-500 mt-1">Con actividad</p>
                        </div>
                        <div className="bg-cyan-200 rounded-full p-3">
                          <MapPin className="w-6 h-6 text-cyan-700" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {kpiConfig.citasConNotas && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Con Notas</p>
                          <p className="text-2xl font-bold text-amber-700">{estadisticas.citasConNotas}</p>
                          <p className="text-xs text-gray-500 mt-1">{Math.round((estadisticas.citasConNotas / estadisticas.total) * 100)}% del total</p>
                        </div>
                        <div className="bg-amber-200 rounded-full p-3">
                          <Bell className="w-6 h-6 text-amber-700" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Métricas de tiempo y distribución */}
              {(kpiConfig.citasManana || kpiConfig.citasProximos3Dias || kpiConfig.citasProximas || kpiConfig.horaMasOcupada || kpiConfig.duracionMinMax) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {kpiConfig.citasManana && estadisticas.citasManana > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Mañana</p>
                          <p className="text-2xl font-bold text-teal-700">{estadisticas.citasManana}</p>
                          <p className="text-xs text-gray-500 mt-1">Citas programadas</p>
                        </div>
                        <div className="bg-teal-200 rounded-full p-3">
                          <Calendar className="w-5 h-5 text-teal-700" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {kpiConfig.citasProximos3Dias && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Próximos 3 Días</p>
                          <p className="text-2xl font-bold text-sky-700">{estadisticas.citasProximos3Dias}</p>
                          <p className="text-xs text-gray-500 mt-1">Citas próximas</p>
                        </div>
                        <div className="bg-sky-200 rounded-full p-3">
                          <Activity className="w-5 h-5 text-sky-700" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {kpiConfig.citasProximas && estadisticas.citasProximas > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4 ring-2 ring-yellow-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Próximas 2h</p>
                          <p className="text-2xl font-bold text-yellow-700">{estadisticas.citasProximas}</p>
                          <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
                        </div>
                        <div className="bg-yellow-200 rounded-full p-3">
                          <Zap className="w-5 h-5 text-yellow-700" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {kpiConfig.horaMasOcupada && estadisticas.horaMasOcupada > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Hora Pico</p>
                          <p className="text-2xl font-bold text-rose-700">{estadisticas.horaMasOcupada}:00</p>
                          <p className="text-xs text-gray-500 mt-1">Mayor ocupación</p>
                        </div>
                        <div className="bg-rose-200 rounded-full p-3">
                          <BarChart3 className="w-5 h-5 text-rose-700" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {kpiConfig.duracionMinMax && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Duración</p>
                          <p className="text-lg font-bold text-pink-700">
                            {estadisticas.duracionMinima}-{estadisticas.duracionMaxima} min
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Rango de duraciones</p>
                        </div>
                        <div className="bg-pink-200 rounded-full p-3">
                          <Clock className="w-5 h-5 text-pink-700" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Resumen de profesionales y sedes */}
              {(kpiConfig.profesionalMasOcupado || kpiConfig.sedeMasOcupada) && (estadisticas.profesionalMasOcupado || estadisticas.sedeMasOcupada) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {kpiConfig.profesionalMasOcupado && estadisticas.profesionalMasOcupado && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Profesional Más Ocupado</h3>
                      </div>
                      <p className="text-lg font-bold text-blue-700">{estadisticas.profesionalMasOcupado}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {estadisticas.porProfesional[estadisticas.profesionalMasOcupado] || 0} citas en el período
                      </p>
                    </div>
                  )}
                  
                  {kpiConfig.sedeMasOcupada && estadisticas.sedeMasOcupada && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-800">Sede Más Ocupada</h3>
                      </div>
                      <p className="text-lg font-bold text-green-700">{estadisticas.sedeMasOcupada}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {estadisticas.porSede[estadisticas.sedeMasOcupada] || 0} citas en el período
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Selector de Vista (Tabs) */}
          <div className="bg-white shadow-sm rounded-lg p-0">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Vista del calendario"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                <button
                  onClick={() => setVista('dia')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    vista === 'dia'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Calendar size={18} className={vista === 'dia' ? 'opacity-100' : 'opacity-70'} />
                  <span>Día</span>
                </button>
                <button
                  onClick={() => setVista('semana')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    vista === 'semana'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Calendar size={18} className={vista === 'semana' ? 'opacity-100' : 'opacity-70'} />
                  <span>Semana</span>
                </button>
                <button
                  onClick={() => setVista('mes')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    vista === 'mes'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Calendar size={18} className={vista === 'mes' ? 'opacity-100' : 'opacity-70'} />
                  <span>Mes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filtros - según la vista seleccionada */}
          {vista === 'mes' ? (
            <FiltrosVistaMensual
              filtros={{
                mes: mesActual,
                anio: anioActual,
                ...filtrosMensual,
              }}
              onFiltrosChange={handleFiltrosMensualChange}
              profesionales={profesionales}
              sedes={sedes}
            />
          ) : (
            <FiltrosCalendario
              filtros={filtros}
              onFiltrosChange={handleFiltrosChange}
              profesionales={profesionales}
              sedes={sedes}
            />
          )}

          {/* Toolbar - Selector de días visibles y botón de actualizar */}
          {vista !== 'mes' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Selector de días visibles */}
                <DaysRangeSelector
                  valorInicial={diasVisibles}
                  onChange={handleDiasVisiblesChange}
                />
                
                {/* Toggle de agrupación (Profesionales/Boxes) */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-300 shadow-sm">
                  <span className="text-sm text-gray-700 font-medium">Agrupar por:</span>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setGroupBy('profesional')}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                        groupBy === 'profesional'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Profesionales
                    </button>
                    <button
                      onClick={() => setGroupBy('box')}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                        groupBy === 'box'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Boxes
                    </button>
                  </div>
                </div>
                
                {/* Botón para abrir mini calendario */}
                <button
                  onClick={() => setMostrarMiniCalendario(!mostrarMiniCalendario)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border border-gray-300 shadow-sm"
                  title="Abrir mini calendario para saltar a cualquier día"
                >
                  <Calendar size={20} />
                  <span>Calendario</span>
                </button>
                
                {/* Botón para configurar tiempo */}
                <button
                  onClick={() => setMostrarConfigTiempo(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border border-gray-300 shadow-sm"
                  title="Configurar escala temporal y rango horario"
                >
                  <Clock size={20} />
                  <span>Config. Tiempo</span>
                </button>
                
                {/* Botón para panel de citas pendientes */}
                <button
                  onClick={() => setMostrarPanelPendientes(!mostrarPanelPendientes)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border shadow-sm ${
                    mostrarPanelPendientes
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Mostrar/ocultar panel de citas pendientes"
                >
                  <List size={20} />
                  <span>Citas Pendientes</span>
                </button>
                
                {/* Botón para panel de urgencias */}
                <button
                  onClick={() => setMostrarPanelUrgencias(!mostrarPanelUrgencias)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border shadow-sm relative ${
                    mostrarPanelUrgencias
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Mostrar/ocultar bandeja de urgencias"
                >
                  <AlertTriangle size={20} />
                  <span>Urgencias</span>
                  {estadisticas.citasUrgentes > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {estadisticas.citasUrgentes}
                    </span>
                  )}
                </button>
                
                {/* Botón para panel de lista de espera */}
                <button
                  onClick={() => setMostrarPanelListaEspera(!mostrarPanelListaEspera)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border shadow-sm ${
                    mostrarPanelListaEspera
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Mostrar/ocultar lista de espera"
                >
                  <Clock size={20} />
                  <span>Lista de Espera</span>
                </button>
                
                {/* Botón para panel de solicitudes online */}
                <button
                  onClick={() => setMostrarPanelSolicitudesOnline(!mostrarPanelSolicitudesOnline)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border shadow-sm ${
                    mostrarPanelSolicitudesOnline
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Mostrar/ocultar solicitudes online pendientes"
                >
                  <Globe size={20} />
                  <span>Solicitudes Online</span>
                </button>
                
                {/* Botón para panel de notificaciones */}
                <button
                  onClick={() => setMostrarPanelNotificaciones(!mostrarPanelNotificaciones)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border shadow-sm relative ${
                    mostrarPanelNotificaciones
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Mostrar/ocultar notificaciones recientes"
                >
                  <Bell size={20} />
                  <span>Notificaciones</span>
                  {notificaciones.filter(n => !n.leida).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {notificaciones.filter(n => !n.leida).length}
                    </span>
                  )}
                </button>
                
                {/* Botón para historial de cambios */}
                {citaSeleccionada && (
                  <button
                    onClick={() => {
                      setCitaParaHistorial(citaSeleccionada);
                      setMostrarHistorialTimeline(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border border-gray-300 shadow-sm"
                    title="Ver historial de cambios de la cita seleccionada"
                  >
                    <History size={20} />
                    <span>Historial</span>
                  </button>
                )}
                
                {/* Botón para heatmap */}
                <button
                  onClick={() => setMostrarHeatmap(!mostrarHeatmap)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border shadow-sm ${
                    mostrarHeatmap
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Mostrar/ocultar heatmap de ocupación"
                >
                  <BarChart3 size={20} />
                  <span>Heatmap</span>
                </button>
              </div>
              
              <button
                onClick={cargarCitas}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border border-gray-300 shadow-sm disabled:opacity-50"
              >
                <RefreshCw size={20} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          )}

          {/* Calendario - según la vista seleccionada */}
          {vista === 'mes' ? (
            <CalendarioMensualGrid
              mes={mesActual}
              anio={anioActual}
              filtros={filtrosMensual}
              onDiaClick={handleDiaClickMensual}
              onMesChange={handleMesChange}
            />
          ) : loading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <RefreshCw size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando citas...</p>
            </div>
          ) : usarVirtualizacion ? (
            <CalendarioGridVirtualized
              citas={citas}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              vista={vista}
              onCitaClick={handleCitaClick}
              onSlotClick={handleSlotClick}
              onCitaReprogramada={handleReprogramarCita}
              onCitaResizeStart={handleCitaResizeStart}
              onCitaResizeEnd={handleCitaResizeEnd}
              visibleDays={diasVisibles}
              groupBy={groupBy}
              timeSlotDuration={timeSlotDuration}
              visibleHours={visibleHours}
              profesionales={profesionales}
              userRole={user?.role}
              tratamientos={tratamientos}
              citaDestacada={citaDestacada}
              onPerformanceMetrics={setPerformanceMetrics}
            />
          ) : (
            <CalendarioGrid
              citas={citas}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              vista={vista}
              onCitaClick={handleCitaClick}
              onSlotClick={handleSlotClick}
              onCitaReprogramada={handleReprogramarCita}
              onCitaResizeStart={handleCitaResizeStart}
              onCitaResizeEnd={handleCitaResizeEnd}
              visibleDays={diasVisibles}
              groupBy={groupBy}
              timeSlotDuration={timeSlotDuration}
              visibleHours={visibleHours}
              profesionales={profesionales}
              userRole={user?.role}
              tratamientos={tratamientos}
              citaDestacada={citaDestacada}
            />
          )}

          {/* Mini Calendar Panel */}
          {mostrarMiniCalendario && (
            <MiniCalendarPanel
              fechaActual={fechaInicio}
              onDatePicked={handleDatePicked}
              onClose={() => setMostrarMiniCalendario(false)}
            />
          )}

          {/* Modal de Edición de Cita (si hay una cita seleccionada) */}
          {mostrarModal && citaSeleccionada && citaSeleccionada._id && (
            <ModalEditarCita
              citaId={citaSeleccionada._id}
              onClose={handleCerrarModal}
              onSave={handleGuardarCita}
              onAbrirRecordatorios={handleAbrirRecordatorios}
              onAbrirHistorial={(cita) => {
                setCitaParaHistorial(cita);
                setMostrarHistorialTimeline(true);
              }}
            />
          )}

          {/* Modal de Gestión de Cita (para nueva cita o cuando no hay ID) */}
          {mostrarModal && (!citaSeleccionada || !citaSeleccionada._id) && (
            <ModalGestionCita
              cita={citaSeleccionada}
              fechaSeleccionada={fechaSeleccionada}
              horaSeleccionada={horaSeleccionada}
              onClose={handleCerrarModal}
              onSave={handleGuardarCita}
              pacientes={pacientes}
              profesionales={profesionales}
              tratamientos={tratamientos}
            />
          )}

          {/* Modal de Configuración de Tiempo */}
          <TimeConfigModal
            isOpen={mostrarConfigTiempo}
            onClose={() => setMostrarConfigTiempo(false)}
            timeSlotDuration={timeSlotDuration}
            visibleHours={visibleHours}
            onSave={(duration, hours) => {
              setTimeSlotDuration(duration);
              setVisibleHours(hours);
            }}
            sedeId={filtros.sede_id}
            sedes={sedes}
          />

          {/* Modal de Confirmación de Cambio de Sede */}
          {reprogramacionPendiente && (
            <ModalConfirmacionCambioSede
              isOpen={mostrarModalCambioSede}
              onClose={() => {
                setMostrarModalCambioSede(false);
                setReprogramacionPendiente(null);
              }}
              onConfirm={handleConfirmarCambioSede}
              sedeOrigen={
                citas.find(c => c._id === reprogramacionPendiente.citaId)?.sede.nombre || 'Sede actual'
              }
              sedeDestino={
                reprogramacionPendiente.profesionalId
                  ? profesionales.find(p => p._id === reprogramacionPendiente.profesionalId)?.nombre || 'Nueva sede'
                  : 'Nueva sede'
              }
              pacienteNombre={
                citas.find(c => c._id === reprogramacionPendiente.citaId)?.paciente.nombre + ' ' +
                citas.find(c => c._id === reprogramacionPendiente.citaId)?.paciente.apellidos || 'Paciente'
              }
              loading={reprogramando}
            />
          )}

          {/* Panel de Citas Pendientes */}
          <PendingAppointmentsPanel
            isOpen={mostrarPanelPendientes}
            onClose={() => setMostrarPanelPendientes(false)}
            onCitaProgramada={cargarCitas}
            especialidades={Array.from(new Set(profesionales.map(p => p.especialidad).filter(Boolean)))}
          />

          {/* Panel de Urgencias */}
          <UrgentAppointmentsPanel
            isOpen={mostrarPanelUrgencias}
            onClose={() => setMostrarPanelUrgencias(false)}
            citas={citas}
            onCitaActualizada={cargarCitas}
          />

          {/* Panel de Lista de Espera */}
          <WaitlistPanel
            isOpen={mostrarPanelListaEspera}
            onClose={() => setMostrarPanelListaEspera(false)}
            onCitaCreada={cargarCitas}
            especialidades={Array.from(new Set(profesionales.map(p => p.especialidad).filter(Boolean)))}
            citas={citas}
          />

          {/* Panel de Solicitudes Online */}
          <OnlineRequestsPanel
            isOpen={mostrarPanelSolicitudesOnline}
            onClose={() => setMostrarPanelSolicitudesOnline(false)}
            onCitaCreada={cargarCitas}
            profesionales={profesionales}
            tratamientos={tratamientos}
          />

          {/* Modal de Configuración de Recordatorios */}
          {citaParaRecordatorios && (
            <ReminderSettingsModal
              isOpen={mostrarModalRecordatorios}
              onClose={() => {
                setMostrarModalRecordatorios(false);
                setCitaParaRecordatorios(null);
              }}
              citaId={citaParaRecordatorios._id || ''}
              pacienteNombre={`${citaParaRecordatorios.paciente.nombre} ${citaParaRecordatorios.paciente.apellidos}`}
              fechaCita={citaParaRecordatorios.fecha_hora_inicio}
            />
          )}

          {/* ToastArea para notificaciones en tiempo real */}
          <ToastArea
            toasts={toasts}
            onRemove={removerToast}
            onToastClick={handleToastClick}
          />

          {/* Panel de Notificaciones Recientes */}
          <NotificacionesRecientesPanel
            isOpen={mostrarPanelNotificaciones}
            onClose={() => setMostrarPanelNotificaciones(false)}
            notificaciones={notificaciones}
            onNotificacionClick={handleNotificacionClick}
            onMarcarLeida={handleMarcarLeida}
            onLimpiarTodas={handleLimpiarNotificaciones}
          />

          {/* Panel de Historial de Cambios */}
          <HistoryTimeline
            isOpen={mostrarHistorialTimeline}
            onClose={() => {
              setMostrarHistorialTimeline(false);
              setCitaParaHistorial(null);
            }}
            cita={citaParaHistorial}
          />

          {/* Card de Heatmap de Ocupación */}
          {mostrarHeatmap && vista !== 'mes' && (
            <AgendaHeatmapCard
              citas={citas}
              filtros={filtros}
              onFiltrosChange={handleFiltrosChange}
            />
          )}

          {/* Modal de Configuración de KPIs */}
          <KpiConfigurator
            isOpen={mostrarKpiConfigurator}
            onClose={() => setMostrarKpiConfigurator(false)}
            config={kpiConfig}
            onConfigChange={(newConfig) => {
              setKpiConfig(newConfig);
              // Los cambios se reflejan inmediatamente sin recargar
            }}
          />

          {/* Modal de Exportación de Citas */}
          <ExportCitasModal
            isOpen={mostrarExportModal}
            onClose={() => setMostrarExportModal(false)}
            citas={citas}
            filtros={filtros}
            profesionales={profesionales}
            sedes={sedes}
          />

          {/* Indicador de Estado de Sincronización */}
          <SyncStatusIndicator
            operations={syncOperations}
            onRetry={retryOperation}
            onDismiss={removeOperation}
            maxVisible={3}
            autoHideDelay={3000}
          />
        </div>
      </div>
    </div>
  );
}


