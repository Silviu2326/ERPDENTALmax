import { useState, useEffect } from 'react';
import { Receipt, RefreshCw, Plus, TrendingUp, DollarSign, CheckCircle, Clock, Calculator, FileText, ClipboardList, BarChart3, PieChart, TrendingDown, Users, Calendar, Percent } from 'lucide-react';
import {
  Presupuesto,
  FiltrosPresupuestos as FiltrosPresupuestosType,
  obtenerPresupuestos,
  actualizarEstadoPresupuesto,
  eliminarPresupuesto,
  RespuestaPresupuestos,
} from '../api/presupuestosApi';
import { PlanTratamiento } from '../api/planesTratamientoApi';
import TablaPresupuestos from '../components/TablaPresupuestos';
import FiltrosPresupuestos from '../components/FiltrosPresupuestos';
import BarraBusquedaPresupuestos from '../components/BarraBusquedaPresupuestos';
import ModalDetallePresupuesto from '../components/ModalDetallePresupuesto';
import SimuladorCostosPage from './SimuladorCostosPage';
import ListaPlanesPacientePage from './ListaPlanesPacientePage';

type TabType = 'presupuestos' | 'planes-tratamiento' | 'simulador-costos';

interface PresupuestosYPlanesDeTratamientoPageProps {
  onNuevoPresupuesto?: () => void;
  onEditarPresupuesto?: (presupuestoId: string) => void;
  onAprobarPresupuesto?: (presupuestoId: string) => void;
}

export default function PresupuestosYPlanesDeTratamientoPage({ onNuevoPresupuesto, onEditarPresupuesto, onAprobarPresupuesto }: PresupuestosYPlanesDeTratamientoPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('presupuestos');
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [planesTratamiento, setPlanesTratamiento] = useState<PlanTratamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlanes, setLoadingPlanes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosPresupuestosType>({
    page: 1,
    limit: 10,
    sortBy: 'fechaCreacion',
    order: 'desc',
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState<Presupuesto | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);

  // Datos mock enriquecidos para profesionales y sedes (en producción vendrían de APIs)
  const profesionales = [
    { _id: '1', nombre: 'Dr. Juan', apellidos: 'Pérez López', especialidad: 'Odontología General' },
    { _id: '2', nombre: 'Dra. María', apellidos: 'García Fernández', especialidad: 'Ortodoncia' },
    { _id: '3', nombre: 'Dr. Carlos', apellidos: 'López Sánchez', especialidad: 'Endodoncia' },
    { _id: '4', nombre: 'Dra. Ana', apellidos: 'Martínez Ruiz', especialidad: 'Periodoncia' },
    { _id: '5', nombre: 'Dr. Luis', apellidos: 'González Torres', especialidad: 'Implantología' },
  ];

  const sedes = [
    { _id: '1', nombre: 'Sede Central', direccion: 'Calle Mayor 123, Madrid' },
    { _id: '2', nombre: 'Sede Norte', direccion: 'Avenida del Norte 45, Madrid' },
    { _id: '3', nombre: 'Sede Sur', direccion: 'Plaza del Sur 78, Madrid' },
  ];

  const cargarPresupuestos = async () => {
    setLoading(true);
    setError(null);
    try {
      // En producción, esto llamaría a la API real
      // const respuesta: RespuestaPresupuestos = await obtenerPresupuestos(filtros);
      // setPresupuestos(respuesta.presupuestos);
      // setPaginacion({
      //   total: respuesta.total,
      //   totalPages: respuesta.totalPages,
      //   currentPage: respuesta.currentPage,
      // });

      // Datos mock enriquecidos para desarrollo
      const ahora = new Date();
      const datosMock: Presupuesto[] = [
        {
          _id: '1',
          paciente: { _id: '1', nombre: 'Ana', apellidos: 'Martínez García', dni: '12345678A' },
          profesional: { _id: '1', nombre: 'Dr. Juan', apellidos: 'Pérez López', rol: 'Odontólogo General' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-001',
          estado: 'Pendiente',
          fechaCreacion: new Date(ahora.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '1', descripcion: 'Limpieza dental profesional con ultrasonidos y pulido', precio: 60, descuento: 0 },
            { tratamientoId: '2', descripcion: 'Revisión general y diagnóstico completo con exploración periodontal', precio: 50, descuento: 10 },
            { tratamientoId: '3', descripcion: 'Radiografía panorámica digital de alta resolución', precio: 45, descuento: 0 },
            { tratamientoId: '4', descripcion: 'Fluorización tópica con barniz de flúor', precio: 25, descuento: 0 },
            { tratamientoId: '5', descripcion: 'Sellado de fisuras (2 piezas) - molares permanentes', precio: 80, descuento: 0 },
            { tratamientoId: '6', descripcion: 'Aplicación de gel remineralizante', precio: 30, descuento: 0 },
          ],
          subtotal: 290,
          descuentoTotal: 10,
          total: 280,
          notas: 'Paciente requiere cita preferencial en horario de mañana. Tiene seguro dental Sanitas Premium que cubre el 50% de limpieza y el 30% de sellados. Paciente con excelente higiene bucal, requiere mantenimiento preventivo cada 6 meses. Paciente muy colaborador y comprometido con su salud dental. Seguir protocolo de prevención establecido. Coordinar próxima cita en 6 meses para control y mantenimiento.',
        },
        {
          _id: '2',
          paciente: { _id: '2', nombre: 'Pedro', apellidos: 'Sánchez Ruiz', dni: '87654321B' },
          profesional: { _id: '2', nombre: 'Dra. María', apellidos: 'García Fernández', rol: 'Ortodoncista' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-002',
          estado: 'Aceptado',
          fechaCreacion: new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 23 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '3', descripcion: 'Ortodoncia invisible (Invisalign) - Tratamiento completo 18 meses', precio: 3000, descuento: 0 },
            { tratamientoId: '4', descripcion: 'Estudio ortodóncico completo con análisis 3D y planificación digital', precio: 150, descuento: 0 },
            { tratamientoId: '5', descripcion: 'Radiografías cefalométricas laterales y frontales', precio: 80, descuento: 0 },
            { tratamientoId: '6', descripcion: 'Fotografías clínicas intra y extraorales (serie completa)', precio: 50, descuento: 0 },
            { tratamientoId: '7', descripcion: 'Retenedores fijos y removibles post-tratamiento', precio: 350, descuento: 0 },
          ],
          subtotal: 3630,
          descuentoTotal: 0,
          total: 3630,
          notas: 'Tratamiento de ortodoncia invisible Invisalign de 18 meses de duración estimada. Paciente adulto de 28 años con apiñamiento moderado y mordida cruzada. Plan de pago aprobado en 12 cuotas mensuales de 302.50€. Primera cuota pagada. Inicio del tratamiento programado para la próxima semana. Paciente muy motivado y comprometido. Seguimiento mensual establecido. Incluye todos los alineadores necesarios, controles y ajustes durante el tratamiento completo.',
        },
        {
          _id: '3',
          paciente: { _id: '3', nombre: 'Laura', apellidos: 'Rodríguez Torres', dni: '11223344C' },
          profesional: { _id: '1', nombre: 'Dr. Juan', apellidos: 'Pérez López', rol: 'Odontólogo General' },
          sede: { _id: '2', nombre: 'Sede Norte' },
          numeroPresupuesto: 'PRES-2024-003',
          estado: 'Completado',
          fechaCreacion: new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '4', descripcion: 'Implante dental titanio grado 4 (pieza 16) - Sistema Straumann', precio: 1500, descuento: 150 },
            { tratamientoId: '5', descripcion: 'Corona cerámica sobre implante - Zirconio de alta estética', precio: 650, descuento: 65 },
            { tratamientoId: '6', descripcion: 'Prótesis provisional acrílica durante osteointegración', precio: 120, descuento: 0 },
            { tratamientoId: '7', descripcion: 'CBCT 3D para planificación quirúrgica', precio: 90, descuento: 0 },
            { tratamientoId: '8', descripcion: 'Guía quirúrgica digital para colocación precisa', precio: 200, descuento: 20 },
          ],
          subtotal: 2560,
          descuentoTotal: 235,
          total: 2325,
          notas: 'Tratamiento completado exitosamente en 3 fases: 1) Colocación del implante (hace 4 meses), 2) Colocación del pilar de cicatrización (hace 2 meses), 3) Colocación de la corona definitiva (hace 1 semana). Paciente muy satisfecha con el resultado estético y funcional. Osteointegración perfecta confirmada. Control post-operatorio en 1 mes. Garantía de 5 años en el implante. Paciente ha recibido instrucciones de mantenimiento y cuidado. Excelente pronóstico a largo plazo.',
        },
        {
          _id: '4',
          paciente: { _id: '4', nombre: 'Carlos', apellidos: 'López Martín', dni: '55667788D' },
          profesional: { _id: '3', nombre: 'Dr. Carlos', apellidos: 'López Sánchez', rol: 'Endodoncista' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-004',
          estado: 'Aprobado',
          fechaCreacion: new Date(ahora.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '7', descripcion: 'Endodoncia molar (pieza 36) - Tratamiento de conductos completo', precio: 280, descuento: 0 },
            { tratamientoId: '8', descripcion: 'Reconstrucción con composite de alta resistencia', precio: 95, descuento: 0 },
            { tratamientoId: '9', descripcion: 'Radiografía periapical de control post-tratamiento', precio: 25, descuento: 0 },
            { tratamientoId: '10', descripcion: 'Anestesia local y material de obturación', precio: 30, descuento: 0 },
            { tratamientoId: '11', descripcion: 'Control post-endodoncia en 1 semana', precio: 40, descuento: 0 },
          ],
          subtotal: 470,
          descuentoTotal: 0,
          total: 470,
          notas: 'Endodoncia de urgencia realizada con éxito. Paciente presentaba dolor agudo y pulpitis irreversible en pieza 36. Tratamiento completado en una sesión con técnica rotatoria moderna. Conductos limpiados, desinfectados y obturados con gutapercha caliente. Reconstrucción con composite realizada inmediatamente. Control post-operatorio programado en 1 semana para verificar la evolución. Paciente informado sobre la necesidad de corona definitiva en el futuro para proteger la pieza tratada. Pronóstico favorable.',
        },
        {
          _id: '5',
          paciente: { _id: '5', nombre: 'Sofía', apellidos: 'González Pérez', dni: '99887766E' },
          profesional: { _id: '2', nombre: 'Dra. María', apellidos: 'García Fernández', rol: 'Ortodoncista' },
          sede: { _id: '2', nombre: 'Sede Norte' },
          numeroPresupuesto: 'PRES-2024-005',
          estado: 'Presentado',
          fechaCreacion: new Date(ahora.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 29 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '10', descripcion: 'Blanqueamiento dental profesional con láser LED (2 sesiones)', precio: 350, descuento: 35 },
            { tratamientoId: '11', descripcion: 'Limpieza dental profesional previa con profilaxis completa', precio: 60, descuento: 0 },
            { tratamientoId: '12', descripcion: 'Kit de mantenimiento en casa (férulas + gel blanqueador)', precio: 45, descuento: 0 },
            { tratamientoId: '13', descripcion: 'Fotografías antes y después del tratamiento', precio: 30, descuento: 0 },
            { tratamientoId: '14', descripcion: 'Seguimiento y control post-blanqueamiento', precio: 25, descuento: 0 },
          ],
          subtotal: 510,
          descuentoTotal: 35,
          total: 475,
          notas: 'Blanqueamiento dental para evento importante (boda) en 2 meses. Paciente muy motivada y comprometida. Tratamiento programado en 2 sesiones con intervalo de 1 semana. Incluye limpieza previa, blanqueamiento con láser LED de última generación, kit de mantenimiento domiciliario y seguimiento. Paciente ha recibido instrucciones de dieta blanca y cuidados post-tratamiento. Resultado esperado: 4-6 tonos más claros. Garantía de satisfacción incluida.',
        },
        {
          _id: '6',
          paciente: { _id: '6', nombre: 'Miguel', apellidos: 'Fernández Castro', dni: '44332211F' },
          profesional: { _id: '1', nombre: 'Dr. Juan', apellidos: 'Pérez López', rol: 'Odontólogo General' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-006',
          estado: 'Rechazado',
          fechaCreacion: new Date(ahora.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '13', descripcion: 'Carillas de porcelana de alta estética (6 unidades) - Zirconio', precio: 2400, descuento: 0 },
            { tratamientoId: '14', descripcion: 'Preparación dental y carillas temporales estéticas', precio: 300, descuento: 0 },
            { tratamientoId: '15', descripcion: 'Fotografías y diseño digital de sonrisa (DSD)', precio: 150, descuento: 0 },
            { tratamientoId: '16', descripcion: 'Mock-up en boca para aprobación estética', precio: 200, descuento: 0 },
            { tratamientoId: '17', descripcion: 'Ajustes y cementado definitivo con adhesivo', precio: 250, descuento: 0 },
          ],
          subtotal: 3300,
          descuentoTotal: 0,
          total: 3300,
          notas: 'Paciente rechazó presupuesto inicial por precio. Solicita opciones de financiación alternativa más flexibles. Tratamiento estético completo para mejorar sonrisa. Paciente interesado pero necesita más tiempo para decidir. Se ha ofrecido plan de pago a 18 meses con intereses. Seguimiento programado en 2 semanas para nueva consulta. Alternativa de carillas de composite directo también presentada (precio más económico).',
        },
        {
          _id: '7',
          paciente: { _id: '7', nombre: 'Elena', apellidos: 'Martínez Ruiz', dni: '22334455G' },
          profesional: { _id: '3', nombre: 'Dr. Carlos', apellidos: 'López Sánchez', rol: 'Endodoncista' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-007',
          estado: 'Aceptado',
          fechaCreacion: new Date(ahora.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '15', descripcion: 'Periodoncia básica (4 sesiones)', precio: 320, descuento: 32 },
            { tratamientoId: '16', descripcion: 'Raspado y alisado radicular', precio: 180, descuento: 0 },
            { tratamientoId: '17', descripcion: 'Enjuague bucal profesional', precio: 25, descuento: 0 },
          ],
          subtotal: 525,
          descuentoTotal: 32,
          total: 493,
          notas: 'Tratamiento periodontal preventivo. Paciente con gingivitis moderada.',
        },
        {
          _id: '8',
          paciente: { _id: '8', nombre: 'David', apellidos: 'Sánchez Moreno', dni: '33445566H' },
          profesional: { _id: '2', nombre: 'Dra. María', apellidos: 'García Fernández', rol: 'Ortodoncista' },
          sede: { _id: '2', nombre: 'Sede Norte' },
          numeroPresupuesto: 'PRES-2024-008',
          estado: 'Pendiente',
          fechaCreacion: new Date(ahora.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 27 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '18', descripcion: 'Brackets metálicos (arcada superior)', precio: 1800, descuento: 180 },
            { tratamientoId: '19', descripcion: 'Brackets metálicos (arcada inferior)', precio: 1800, descuento: 180 },
            { tratamientoId: '20', descripcion: 'Controles mensuales (24 meses)', precio: 1200, descuento: 0 },
          ],
          subtotal: 4800,
          descuentoTotal: 360,
          total: 4440,
          notas: 'Ortodoncia para adolescente. Padres interesados en plan de pago.',
        },
        {
          _id: '9',
          paciente: { _id: '9', nombre: 'Isabel', apellidos: 'Torres Jiménez', dni: '44556677I' },
          profesional: { _id: '1', nombre: 'Dr. Juan', apellidos: 'Pérez López', rol: 'Odontólogo General' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-009',
          estado: 'Anulado',
          fechaCreacion: new Date(ahora.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '21', descripcion: 'Extracción de muela del juicio', precio: 120, descuento: 0 },
            { tratamientoId: '22', descripcion: 'Radiografía 3D (CBCT)', precio: 90, descuento: 0 },
          ],
          subtotal: 210,
          descuentoTotal: 0,
          total: 210,
          notas: 'Presupuesto anulado. Paciente decidió operarse en otro centro.',
        },
        {
          _id: '10',
          paciente: { _id: '10', nombre: 'Roberto', apellidos: 'García Morales', dni: '55667788J' },
          profesional: { _id: '3', nombre: 'Dr. Carlos', apellidos: 'López Sánchez', rol: 'Endodoncista' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-010',
          estado: 'Aceptado',
          fechaCreacion: new Date(ahora.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '23', descripcion: 'Prótesis parcial removible acrílica (6 piezas)', precio: 850, descuento: 85 },
            { tratamientoId: '24', descripcion: 'Ajustes y controles post-entrega (3 sesiones)', precio: 150, descuento: 0 },
            { tratamientoId: '25', descripcion: 'Radiografía de control', precio: 30, descuento: 0 },
          ],
          subtotal: 1030,
          descuentoTotal: 85,
          total: 945,
          notas: 'Prótesis para paciente mayor de 72 años. Requiere seguimiento especial y ajustes frecuentes. Paciente con movilidad reducida, coordinar citas con familiar.',
        },
        {
          _id: '11',
          paciente: { _id: '11', nombre: 'Carmen', apellidos: 'Vázquez Díaz', dni: '66778899K' },
          profesional: { _id: '1', nombre: 'Dr. Juan', apellidos: 'Pérez López', rol: 'Odontólogo General' },
          sede: { _id: '3', nombre: 'Sede Sur' },
          numeroPresupuesto: 'PRES-2024-011',
          estado: 'Presentado',
          fechaCreacion: new Date(ahora.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 29 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '26', descripcion: 'Carillas de porcelana (8 unidades)', precio: 3200, descuento: 320 },
            { tratamientoId: '27', descripcion: 'Preparación y temporales', precio: 400, descuento: 0 },
            { tratamientoId: '28', descripcion: 'Blanqueamiento previo', precio: 350, descuento: 0 },
          ],
          subtotal: 3950,
          descuentoTotal: 320,
          total: 3630,
          notas: 'Tratamiento estético completo. Paciente muy motivada para evento importante en 3 meses. Solicita financiación a 12 meses.',
        },
        {
          _id: '12',
          paciente: { _id: '12', nombre: 'Javier', apellidos: 'Morales Serrano', dni: '77889900L' },
          profesional: { _id: '4', nombre: 'Dra. Ana', apellidos: 'Martínez Ruiz', rol: 'Periodoncista' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-012',
          estado: 'Aceptado',
          fechaCreacion: new Date(ahora.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '29', descripcion: 'Cirugía periodontal (4 cuadrantes)', precio: 1200, descuento: 120 },
            { tratamientoId: '30', descripcion: 'Raspado y alisado radicular completo', precio: 360, descuento: 0 },
            { tratamientoId: '31', descripcion: 'Injerto de encía (2 zonas)', precio: 800, descuento: 80 },
            { tratamientoId: '32', descripcion: 'Medicación post-operatoria', precio: 45, descuento: 0 },
          ],
          subtotal: 2405,
          descuentoTotal: 200,
          total: 2205,
          notas: 'Tratamiento periodontal avanzado. Paciente con periodontitis severa. Requiere cirugía en 2 sesiones. Seguimiento cada 3 meses.',
        },
        {
          _id: '13',
          paciente: { _id: '13', nombre: 'Patricia', apellidos: 'Jiménez Castro', dni: '88990011M' },
          profesional: { _id: '2', nombre: 'Dra. María', apellidos: 'García Fernández', rol: 'Ortodoncista' },
          sede: { _id: '2', nombre: 'Sede Norte' },
          numeroPresupuesto: 'PRES-2024-013',
          estado: 'Pendiente',
          fechaCreacion: new Date(ahora.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 26 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '33', descripcion: 'Invisalign completo (18 meses)', precio: 3500, descuento: 350 },
            { tratamientoId: '34', descripcion: 'Estudio ortodóncico 3D completo', precio: 200, descuento: 0 },
            { tratamientoId: '35', descripcion: 'Radiografías cefalométricas y panorámica', precio: 120, descuento: 0 },
            { tratamientoId: '36', descripcion: 'Controles y alineadores', precio: 0, descuento: 0 },
          ],
          subtotal: 3820,
          descuentoTotal: 350,
          total: 3470,
          notas: 'Ortodoncia invisible para paciente adulto. Muy comprometida con el tratamiento. Prefiere Invisalign por estética. Plan de pago solicitado.',
        },
        {
          _id: '14',
          paciente: { _id: '14', nombre: 'Fernando', apellidos: 'Ruiz Navarro', dni: '99001122N' },
          profesional: { _id: '5', nombre: 'Dr. Luis', apellidos: 'González Torres', rol: 'Implantólogo' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-014',
          estado: 'Aprobado',
          fechaCreacion: new Date(ahora.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 24 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '37', descripcion: 'Implante dental titanio (pieza 11)', precio: 1500, descuento: 150 },
            { tratamientoId: '38', descripcion: 'Corona cerámica sobre implante', precio: 650, descuento: 65 },
            { tratamientoId: '39', descripcion: 'CBCT 3D para planificación', precio: 90, descuento: 0 },
            { tratamientoId: '40', descripcion: 'Prótesis provisional', precio: 120, descuento: 0 },
          ],
          subtotal: 2360,
          descuentoTotal: 215,
          total: 2145,
          notas: 'Implante en incisivo central superior. Paciente joven, buen candidato. Tratamiento en 2 fases: implante y posterior corona. CBCT realizado.',
        },
        {
          _id: '15',
          paciente: { _id: '15', nombre: 'Lucía', apellidos: 'Sánchez Méndez', dni: '00112233O' },
          profesional: { _id: '1', nombre: 'Dr. Juan', apellidos: 'Pérez López', rol: 'Odontólogo General' },
          sede: { _id: '3', nombre: 'Sede Sur' },
          numeroPresupuesto: 'PRES-2024-015',
          estado: 'Completado',
          fechaCreacion: new Date(ahora.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '41', descripcion: 'Obturación composite (3 piezas)', precio: 285, descuento: 28 },
            { tratamientoId: '42', descripcion: 'Limpieza dental profesional', precio: 60, descuento: 0 },
            { tratamientoId: '43', descripcion: 'Fluorización', precio: 25, descuento: 0 },
          ],
          subtotal: 370,
          descuentoTotal: 28,
          total: 342,
          notas: 'Tratamiento completado exitosamente. Paciente satisfecha. Todas las obturaciones en buen estado. Próxima revisión en 6 meses.',
        },
        {
          _id: '16',
          paciente: { _id: '16', nombre: 'Marta', apellidos: 'Hernández Vega', dni: '11223344P' },
          profesional: { _id: '2', nombre: 'Dra. María', apellidos: 'García Fernández', rol: 'Ortodoncista' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-016',
          estado: 'Aceptado',
          fechaCreacion: new Date(ahora.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '44', descripcion: 'Brackets estéticos cerámicos (arcada superior)', precio: 2200, descuento: 220 },
            { tratamientoId: '45', descripcion: 'Brackets estéticos cerámicos (arcada inferior)', precio: 2200, descuento: 220 },
            { tratamientoId: '46', descripcion: 'Controles y ajustes (24 meses)', precio: 1400, descuento: 0 },
            { tratamientoId: '47', descripcion: 'Retenedores fijos y removibles', precio: 350, descuento: 0 },
          ],
          subtotal: 6150,
          descuentoTotal: 440,
          total: 5710,
          notas: 'Ortodoncia estética para paciente adulto. Muy comprometida con el tratamiento. Prefiere brackets cerámicos por discreción. Plan de pago en 18 cuotas aprobado.',
        },
        {
          _id: '17',
          paciente: { _id: '17', nombre: 'Ricardo', apellidos: 'Moreno Castillo', dni: '22334455Q' },
          profesional: { _id: '5', nombre: 'Dr. Luis', apellidos: 'González Torres', rol: 'Implantólogo' },
          sede: { _id: '2', nombre: 'Sede Norte' },
          numeroPresupuesto: 'PRES-2024-017',
          estado: 'Presentado',
          fechaCreacion: new Date(ahora.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 29 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '48', descripcion: 'Implante dental titanio (pieza 26)', precio: 1500, descuento: 150 },
            { tratamientoId: '49', descripcion: 'Implante dental titanio (pieza 27)', precio: 1500, descuento: 150 },
            { tratamientoId: '50', descripcion: 'Corona cerámica sobre implante (2 unidades)', precio: 1300, descuento: 130 },
            { tratamientoId: '51', descripcion: 'CBCT 3D para planificación', precio: 90, descuento: 0 },
            { tratamientoId: '52', descripcion: 'Prótesis provisionales (2 unidades)', precio: 240, descuento: 0 },
          ],
          subtotal: 5630,
          descuentoTotal: 430,
          total: 5200,
          notas: 'Rehabilitación completa de dos molares inferiores. Paciente con buena salud ósea. CBCT realizado, candidato ideal. Tratamiento en 2 fases: implantes y posterior coronas. Solicita financiación.',
        },
        {
          _id: '18',
          paciente: { _id: '18', nombre: 'Cristina', apellidos: 'Díaz Navarro', dni: '33445566R' },
          profesional: { _id: '4', nombre: 'Dra. Ana', apellidos: 'Martínez Ruiz', rol: 'Periodoncista' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-018',
          estado: 'Aprobado',
          fechaCreacion: new Date(ahora.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 26 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '53', descripcion: 'Raspado y alisado radicular completo (4 cuadrantes)', precio: 480, descuento: 48 },
            { tratamientoId: '54', descripcion: 'Curetaje periodontal profundo', precio: 320, descuento: 32 },
            { tratamientoId: '55', descripcion: 'Aplicación de antibiótico local', precio: 120, descuento: 0 },
            { tratamientoId: '56', descripcion: 'Control post-tratamiento (3 sesiones)', precio: 150, descuento: 0 },
          ],
          subtotal: 1070,
          descuentoTotal: 80,
          total: 990,
          notas: 'Tratamiento periodontal completo. Paciente con periodontitis moderada. Muy colaborador con higiene. Seguimiento cada 3 meses. Plan de mantenimiento establecido.',
        },
        {
          _id: '19',
          paciente: { _id: '19', nombre: 'Alberto', apellidos: 'Serrano Jiménez', dni: '44556677S' },
          profesional: { _id: '1', nombre: 'Dr. Juan', apellidos: 'Pérez López', rol: 'Odontólogo General' },
          sede: { _id: '3', nombre: 'Sede Sur' },
          numeroPresupuesto: 'PRES-2024-019',
          estado: 'Pendiente',
          fechaCreacion: new Date(ahora.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '57', descripcion: 'Carillas de composite directo (6 unidades)', precio: 1800, descuento: 180 },
            { tratamientoId: '58', descripcion: 'Blanqueamiento dental previo', precio: 350, descuento: 0 },
            { tratamientoId: '59', descripcion: 'Limpieza dental profesional', precio: 60, descuento: 0 },
          ],
          subtotal: 2210,
          descuentoTotal: 180,
          total: 2030,
          notas: 'Tratamiento estético conservador. Paciente joven, muy motivado. Carillas de composite para mejorar estética de sonrisa. Evento importante en 2 meses.',
        },
        {
          _id: '20',
          paciente: { _id: '20', nombre: 'Natalia', apellidos: 'Ortega Campos', dni: '55667788T' },
          profesional: { _id: '3', nombre: 'Dr. Carlos', apellidos: 'López Sánchez', rol: 'Endodoncista' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-020',
          estado: 'Aceptado',
          fechaCreacion: new Date(ahora.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 19 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '60', descripcion: 'Endodoncia premolar (pieza 24)', precio: 250, descuento: 0 },
            { tratamientoId: '61', descripcion: 'Endodoncia molar (pieza 36)', precio: 280, descuento: 0 },
            { tratamientoId: '62', descripcion: 'Reconstrucción con composite (2 piezas)', precio: 190, descuento: 19 },
            { tratamientoId: '63', descripcion: 'Radiografías periapicales (2 unidades)', precio: 50, descuento: 0 },
          ],
          subtotal: 770,
          descuentoTotal: 19,
          total: 751,
          notas: 'Endodoncias de urgencia. Paciente con dolor agudo. Tratamientos realizados con éxito. Reconstrucciones en buen estado. Control en 1 semana.',
        },
        {
          _id: '21',
          paciente: { _id: '21', nombre: 'Óscar', apellidos: 'Vega Morales', dni: '66778899U' },
          profesional: { _id: '2', nombre: 'Dra. María', apellidos: 'García Fernández', rol: 'Ortodoncista' },
          sede: { _id: '2', nombre: 'Sede Norte' },
          numeroPresupuesto: 'PRES-2024-021',
          estado: 'Rechazado',
          fechaCreacion: new Date(ahora.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '64', descripcion: 'Invisalign completo (24 meses)', precio: 4200, descuento: 0 },
            { tratamientoId: '65', descripcion: 'Estudio ortodóncico 3D completo', precio: 200, descuento: 0 },
            { tratamientoId: '66', descripcion: 'Radiografías cefalométricas y panorámica', precio: 120, descuento: 0 },
          ],
          subtotal: 4520,
          descuentoTotal: 0,
          total: 4520,
          notas: 'Paciente rechazó por precio. Solicita opciones de financiación más flexibles. Interesado en tratamiento pero necesita más tiempo para decidir.',
        },
        {
          _id: '22',
          paciente: { _id: '22', nombre: 'Silvia', apellidos: 'Castro Ruiz', dni: '77889900V' },
          profesional: { _id: '1', nombre: 'Dr. Juan', apellidos: 'Pérez López', rol: 'Odontólogo General' },
          sede: { _id: '1', nombre: 'Sede Central' },
          numeroPresupuesto: 'PRES-2024-022',
          estado: 'Completado',
          fechaCreacion: new Date(ahora.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '67', descripcion: 'Prótesis completa superior acrílica', precio: 1200, descuento: 120 },
            { tratamientoId: '68', descripcion: 'Prótesis completa inferior acrílica', precio: 1200, descuento: 120 },
            { tratamientoId: '69', descripcion: 'Ajustes y controles (4 sesiones)', precio: 200, descuento: 0 },
            { tratamientoId: '70', descripcion: 'Radiografías de control', precio: 60, descuento: 0 },
          ],
          subtotal: 2660,
          descuentoTotal: 240,
          total: 2420,
          notas: 'Rehabilitación completa. Paciente mayor de 75 años, muy satisfecha. Prótesis bien adaptadas. Seguimiento cada 6 meses. Excelente resultado funcional y estético.',
        },
        {
          _id: '23',
          paciente: { _id: '23', nombre: 'Héctor', apellidos: 'Méndez Torres', dni: '88990011W' },
          profesional: { _id: '5', nombre: 'Dr. Luis', apellidos: 'González Torres', rol: 'Implantólogo' },
          sede: { _id: '3', nombre: 'Sede Sur' },
          numeroPresupuesto: 'PRES-2024-023',
          estado: 'Aprobado',
          fechaCreacion: new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 23 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '71', descripcion: 'Implante dental titanio (pieza 11)', precio: 1500, descuento: 150 },
            { tratamientoId: '72', descripcion: 'Corona cerámica sobre implante', precio: 650, descuento: 65 },
            { tratamientoId: '73', descripcion: 'Injerto óseo con biomaterial', precio: 450, descuento: 45 },
            { tratamientoId: '74', descripcion: 'CBCT 3D para planificación', precio: 90, descuento: 0 },
            { tratamientoId: '75', descripcion: 'Prótesis provisional', precio: 120, descuento: 0 },
          ],
          subtotal: 2810,
          descuentoTotal: 260,
          total: 2550,
          notas: 'Implante en incisivo central superior con injerto óseo. Paciente joven, buen candidato. CBCT realizado, planificación 3D completa. Tratamiento en 3 fases: injerto, implante y corona.',
        },
        {
          _id: '24',
          paciente: { _id: '24', nombre: 'Elena', apellidos: 'Ramos Gutiérrez', dni: '99001122X' },
          profesional: { _id: '4', nombre: 'Dra. Ana', apellidos: 'Martínez Ruiz', rol: 'Periodoncista' },
          sede: { _id: '2', nombre: 'Sede Norte' },
          numeroPresupuesto: 'PRES-2024-024',
          estado: 'Pendiente',
          fechaCreacion: new Date(ahora.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          fechaValidez: new Date(ahora.getTime() + 27 * 24 * 60 * 60 * 1000).toISOString(),
          tratamientos: [
            { tratamientoId: '76', descripcion: 'Gingivectomía estética (6 piezas)', precio: 540, descuento: 54 },
            { tratamientoId: '77', descripcion: 'Contorneado estético de encías', precio: 280, descuento: 28 },
            { tratamientoId: '78', descripcion: 'Limpieza dental profesional previa', precio: 60, descuento: 0 },
          ],
          subtotal: 880,
          descuentoTotal: 82,
          total: 798,
          notas: 'Tratamiento estético periodontal. Paciente con sonrisa gingival. Muy motivada para mejorar estética. Procedimiento mínimamente invasivo. Recuperación rápida esperada.',
        },
      ];

      // Aplicar filtros básicos (simulado)
      let presupuestosFiltrados = datosMock;
      
      if (filtros.estado) {
        presupuestosFiltrados = presupuestosFiltrados.filter((p) => p.estado === filtros.estado);
      }
      if (filtros.profesionalId) {
        presupuestosFiltrados = presupuestosFiltrados.filter(
          (p) => p.profesional._id === filtros.profesionalId
        );
      }
      if (filtros.sedeId) {
        presupuestosFiltrados = presupuestosFiltrados.filter((p) => p.sede._id === filtros.sedeId);
      }
      if (filtros.q) {
        const termino = filtros.q.toLowerCase();
        presupuestosFiltrados = presupuestosFiltrados.filter(
          (p) =>
            p.paciente.nombre.toLowerCase().includes(termino) ||
            p.paciente.apellidos.toLowerCase().includes(termino) ||
            p.paciente.dni?.toLowerCase().includes(termino) ||
            p.numeroPresupuesto.toLowerCase().includes(termino)
        );
      }

      setPresupuestos(presupuestosFiltrados);
      setPaginacion({
        total: presupuestosFiltrados.length,
        totalPages: Math.ceil(presupuestosFiltrados.length / (filtros.limit || 10)),
        currentPage: filtros.page || 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los presupuestos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'presupuestos') {
      cargarPresupuestos();
    } else if (activeTab === 'planes-tratamiento') {
      cargarPlanesTratamiento();
    }
  }, [filtros, activeTab]);

  const cargarPlanesTratamiento = async () => {
    setLoadingPlanes(true);
    setError(null);
    try {
      // Datos mock enriquecidos para planes de tratamiento
      const ahora = new Date();
      const planesMock: PlanTratamiento[] = [
        {
          _id: '1',
          paciente: { _id: '1', nombre: 'Ana', apellidos: 'Martínez García' },
          odontologo: { _id: '1', nombre: 'Dr. Juan', apellidos: 'Pérez López' },
          fechaCreacion: new Date(ahora.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'En Curso',
          totalBruto: 4850,
          descuento: 8,
          totalNeto: 4462,
          notas: 'Plan de tratamiento integral para rehabilitación completa. Paciente con múltiples necesidades odontológicas que requieren abordaje sistemático. Tratamiento estructurado en 4 fases: saneamiento y prevención, restauración estética, ortodoncia, y mantenimiento a largo plazo. Paciente muy colaborador y comprometido con excelente higiene bucal. Se ha establecido protocolo de seguimiento cada 3 meses durante el tratamiento activo. Paciente ha mostrado gran interés en mantener su salud dental. Todas las fases programadas y explicadas detalladamente. Pronóstico muy favorable. Incluye seguimiento post-tratamiento durante 2 años.',
          fases: [
            {
              nombre: 'Fase 1: Saneamiento y Prevención',
              descripcion: 'Eliminación de caries, limpieza profunda, tratamiento periodontal y prevención completa',
              procedimientos: [
                {
                  tratamiento: { _id: '1', nombre: 'Limpieza Dental Profesional con Ultrasonidos y Pulido', precioBase: 60 },
                  precio: 60,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: { _id: '2', nombre: 'Eliminación de Caries (5 piezas) con Composite', precioBase: 475 },
                  precio: 475,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: { _id: '3', nombre: 'Raspado y Alisado Radicular Completo (4 cuadrantes)', precioBase: 480 },
                  precio: 480,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: { _id: '4', nombre: 'Fluorización Tópica con Barniz de Flúor', precioBase: 25 },
                  precio: 25,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: { _id: '5', nombre: 'Sellado de Fisuras (4 piezas) - Prevención', precioBase: 160 },
                  precio: 160,
                  estadoProcedimiento: 'Completado',
                },
              ],
            },
            {
              nombre: 'Fase 2: Restauración Estética',
              descripcion: 'Restauraciones estéticas con composite de alta calidad y carillas',
              procedimientos: [
                {
                  tratamiento: { _id: '6', nombre: 'Obturación Composite Estética (6 piezas)', precioBase: 570 },
                  precio: 570,
                  estadoProcedimiento: 'En Curso',
                },
                {
                  tratamiento: { _id: '7', nombre: 'Carillas de Composite Directo (4 unidades)', precioBase: 1200 },
                  precio: 1200,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '8', nombre: 'Blanqueamiento Dental Profesional con Láser LED', precioBase: 350 },
                  precio: 350,
                  estadoProcedimiento: 'Pendiente',
                },
              ],
            },
            {
              nombre: 'Fase 3: Ortodoncia',
              descripcion: 'Tratamiento ortodóncico con brackets estéticos cerámicos',
              procedimientos: [
                {
                  tratamiento: { _id: '9', nombre: 'Estudio Ortodóncico Completo 3D con Análisis Digital', precioBase: 200 },
                  precio: 200,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '10', nombre: 'Brackets Estéticos Cerámicos (2 arcadas)', precioBase: 2200 },
                  precio: 2200,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '11', nombre: 'Controles y Ajustes Mensuales (18 meses)', precioBase: 1350 },
                  precio: 1350,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '12', nombre: 'Retenedores Fijos y Removibles Post-Ortodoncia', precioBase: 350 },
                  precio: 350,
                  estadoProcedimiento: 'Pendiente',
                },
              ],
            },
            {
              nombre: 'Fase 4: Mantenimiento',
              descripcion: 'Seguimiento y controles periódicos a largo plazo',
              procedimientos: [
                {
                  tratamiento: { _id: '13', nombre: 'Control y Revisión Semestral (4 sesiones)', precioBase: 200 },
                  precio: 200,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '14', nombre: 'Limpieza Dental Profesional de Mantenimiento (4 sesiones)', precioBase: 240 },
                  precio: 240,
                  estadoProcedimiento: 'Pendiente',
                },
              ],
            },
          ],
        },
        {
          _id: '2',
          paciente: { _id: '2', nombre: 'Pedro', apellidos: 'Sánchez Ruiz' },
          odontologo: { _id: '2', nombre: 'Dra. María', apellidos: 'García Fernández' },
          fechaCreacion: new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'En Curso',
          totalBruto: 3800,
          descuento: 5,
          totalNeto: 3610,
          notas: 'Plan de ortodoncia invisible Invisalign en curso con excelente progreso. Paciente adulto de 28 años con apiñamiento moderado y mordida cruzada. Tratamiento de 18 meses de duración estimada. Paciente muy motivado y comprometido. Seguimiento mensual establecido. Incluye todos los alineadores necesarios, controles y ajustes durante el tratamiento completo. Progreso excelente con movimientos dentales según lo esperado. Próximo control programado en 4 semanas para continuar con los ajustes. Paciente sigue todas las recomendaciones de higiene y uso de aparatos. Pronóstico muy favorable para completar el tratamiento en el tiempo estimado.',
          fases: [
            {
              nombre: 'Fase 1: Estudio y Preparación',
              descripcion: 'Estudio completo y preparación para ortodoncia invisible. Análisis 3D y planificación digital',
              procedimientos: [
                {
                  tratamiento: { _id: '15', nombre: 'Estudio Ortodóncico Completo 3D con Simulación Digital', precioBase: 200 },
                  precio: 200,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: { _id: '16', nombre: 'Radiografías Cefalométricas Laterales y Frontales', precioBase: 80 },
                  precio: 80,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: { _id: '17', nombre: 'Fotografías Clínicas Intra y Extraorales (Serie Completa)', precioBase: 50 },
                  precio: 50,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: { _id: '18', nombre: 'Impresión Digital 3D con Escáner Intraoral', precioBase: 120 },
                  precio: 120,
                  estadoProcedimiento: 'Completado',
                },
              ],
            },
            {
              nombre: 'Fase 2: Tratamiento con Invisalign',
              descripcion: 'Tratamiento activo con alineadores transparentes Invisalign',
              procedimientos: [
                {
                  tratamiento: { _id: '19', nombre: 'Ortodoncia Invisible Invisalign - Tratamiento Completo 18 Meses', precioBase: 3000 },
                  precio: 3000,
                  estadoProcedimiento: 'En Curso',
                },
                {
                  tratamiento: { _id: '20', nombre: 'Controles Mensuales y Ajustes (18 meses)', precioBase: 900 },
                  precio: 900,
                  estadoProcedimiento: 'En Curso',
                },
                {
                  tratamiento: { _id: '21', nombre: 'Alineadores de Refinamiento (si necesario)', precioBase: 0 },
                  precio: 0,
                  estadoProcedimiento: 'Pendiente',
                },
              ],
            },
            {
              nombre: 'Fase 3: Finalización y Retención',
              descripcion: 'Finalización del tratamiento y colocación de retenedores',
              procedimientos: [
                {
                  tratamiento: { _id: '22', nombre: 'Retenedores Fijos y Removibles Post-Tratamiento', precioBase: 350 },
                  precio: 350,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '23', nombre: 'Control Post-Tratamiento (3 sesiones)', precioBase: 150 },
                  precio: 150,
                  estadoProcedimiento: 'Pendiente',
                },
              ],
            },
          ],
        },
        {
          _id: '3',
          paciente: { _id: '3', nombre: 'Laura', apellidos: 'Rodríguez Torres' },
          odontologo: { _id: '5', nombre: 'Dr. Luis', apellidos: 'González Torres' },
          fechaCreacion: new Date(ahora.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'Finalizado',
          totalBruto: 2150,
          descuento: 0,
          totalNeto: 2150,
          notas: 'Plan de tratamiento de implante dental completado exitosamente en todas sus fases. Implante dental colocado con éxito y osteointegración perfecta confirmada mediante radiografías de control. Corona cerámica instalada con excelente resultado estético y funcional. Paciente muy satisfecha con el resultado final. Todas las fases del tratamiento se completaron según lo planificado. Próxima revisión programada en 6 meses para control y mantenimiento. Paciente ha recibido instrucciones completas de cuidado y mantenimiento. Garantía de 5 años en el implante activa. Excelente pronóstico a largo plazo. Paciente ha referido a otros pacientes debido a su satisfacción.',
          fases: [
            {
              nombre: 'Fase 1: Planificación y Preparación',
              descripcion: 'Estudio previo y planificación del implante con tecnología 3D',
              procedimientos: [
                {
                  tratamiento: { _id: '24', nombre: 'CBCT 3D para Planificación Quirúrgica', precioBase: 90 },
                  precio: 90,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: { _id: '25', nombre: 'Guía Quirúrgica Digital para Colocación Precisa', precioBase: 200 },
                  precio: 200,
                  estadoProcedimiento: 'Completado',
                },
              ],
            },
            {
              nombre: 'Fase 2: Colocación del Implante',
              descripcion: 'Cirugía de colocación del implante dental con técnica mínimamente invasiva',
              procedimientos: [
                {
                  tratamiento: { _id: '26', nombre: 'Implante Dental Titanio Grado 4 - Sistema Straumann (pieza 16)', precioBase: 1500 },
                  precio: 1500,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: { _id: '27', nombre: 'Prótesis Provisional Acrílica durante Osteointegración', precioBase: 120 },
                  precio: 120,
                  estadoProcedimiento: 'Completado',
                },
              ],
            },
            {
              nombre: 'Fase 3: Corona Final',
              descripcion: 'Instalación de la corona cerámica definitiva de alta estética',
              procedimientos: [
                {
                  tratamiento: { _id: '28', nombre: 'Corona Cerámica sobre Implante - Zirconio de Alta Estética', precioBase: 650 },
                  precio: 650,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: { _id: '29', nombre: 'Control Post-Instalación y Ajustes', precioBase: 90 },
                  precio: 90,
                  estadoProcedimiento: 'Completado',
                },
              ],
            },
          ],
        },
        {
          _id: '4',
          paciente: { _id: '4', nombre: 'Carlos', apellidos: 'López Martín' },
          odontologo: { _id: '3', nombre: 'Dr. Carlos', apellidos: 'López Sánchez' },
          fechaCreacion: new Date(ahora.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'Aceptado',
          totalBruto: 1250,
          descuento: 10,
          totalNeto: 1125,
          notas: 'Plan de tratamiento de endodoncia y restauración. Paciente con pulpitis irreversible en múltiples piezas. Tratamiento estructurado en 2 fases: endodoncias y restauraciones definitivas. Paciente informado sobre la necesidad de coronas definitivas en el futuro para proteger las piezas tratadas. Pronóstico favorable. Control post-operatorio programado.',
          fases: [
            {
              nombre: 'Fase 1: Endodoncias',
              descripcion: 'Tratamiento de conductos en las piezas afectadas',
              procedimientos: [
                {
                  tratamiento: { _id: '30', nombre: 'Endodoncia Molar (pieza 36) - Tratamiento de Conductos Completo', precioBase: 280 },
                  precio: 280,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: { _id: '31', nombre: 'Endodoncia Premolar (pieza 24) - Tratamiento de Conductos', precioBase: 250 },
                  precio: 250,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: { _id: '32', nombre: 'Radiografías Periapicales de Control (3 unidades)', precioBase: 75 },
                  precio: 75,
                  estadoProcedimiento: 'Completado',
                },
              ],
            },
            {
              nombre: 'Fase 2: Restauraciones',
              descripcion: 'Reconstrucciones con composite de alta resistencia',
              procedimientos: [
                {
                  tratamiento: { _id: '33', nombre: 'Reconstrucción con Composite de Alta Resistencia (2 piezas)', precioBase: 190 },
                  precio: 190,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '34', nombre: 'Control Post-Endodoncia en 1 Semana', precioBase: 40 },
                  precio: 40,
                  estadoProcedimiento: 'Pendiente',
                },
              ],
            },
          ],
        },
        {
          _id: '5',
          paciente: { _id: '5', nombre: 'Sofía', apellidos: 'González Pérez' },
          odontologo: { _id: '4', nombre: 'Dra. Ana', apellidos: 'Martínez Ruiz' },
          fechaCreacion: new Date(ahora.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'Propuesto',
          totalBruto: 3200,
          descuento: 12,
          totalNeto: 2816,
          notas: 'Plan de tratamiento estético completo. Paciente muy motivada para evento importante (boda) en 3 meses. Tratamiento programado en 3 fases: blanqueamiento, carillas y mantenimiento. Paciente ha recibido instrucciones de dieta blanca y cuidados post-tratamiento. Resultado esperado: mejora estética significativa. Garantía de satisfacción incluida.',
          fases: [
            {
              nombre: 'Fase 1: Preparación y Blanqueamiento',
              descripcion: 'Limpieza previa y blanqueamiento dental profesional',
              procedimientos: [
                {
                  tratamiento: { _id: '35', nombre: 'Limpieza Dental Profesional Previa con Profilaxis Completa', precioBase: 60 },
                  precio: 60,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '36', nombre: 'Blanqueamiento Dental Profesional con Láser LED (2 sesiones)', precioBase: 350 },
                  precio: 350,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '37', nombre: 'Kit de Mantenimiento en Casa (Férulas + Gel Blanqueador)', precioBase: 45 },
                  precio: 45,
                  estadoProcedimiento: 'Pendiente',
                },
              ],
            },
            {
              nombre: 'Fase 2: Carillas Estéticas',
              descripcion: 'Instalación de carillas de porcelana de alta estética',
              procedimientos: [
                {
                  tratamiento: { _id: '38', nombre: 'Carillas de Porcelana de Alta Estética - Zirconio (8 unidades)', precioBase: 3200 },
                  precio: 3200,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '39', nombre: 'Preparación Dental y Carillas Temporales Estéticas', precioBase: 400 },
                  precio: 400,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '40', nombre: 'Fotografías y Diseño Digital de Sonrisa (DSD)', precioBase: 150 },
                  precio: 150,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '41', nombre: 'Mock-up en Boca para Aprobación Estética', precioBase: 200 },
                  precio: 200,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '42', nombre: 'Ajustes y Cementado Definitivo con Adhesivo', precioBase: 250 },
                  precio: 250,
                  estadoProcedimiento: 'Pendiente',
                },
              ],
            },
            {
              nombre: 'Fase 3: Seguimiento',
              descripcion: 'Control post-tratamiento y mantenimiento',
              procedimientos: [
                {
                  tratamiento: { _id: '43', nombre: 'Fotografías Antes y Después del Tratamiento', precioBase: 30 },
                  precio: 30,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: { _id: '44', nombre: 'Seguimiento y Control Post-Blanqueamiento', precioBase: 25 },
                  precio: 25,
                  estadoProcedimiento: 'Pendiente',
                },
              ],
            },
          ],
        },
      ];
      setPlanesTratamiento(planesMock);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los planes de tratamiento');
    } finally {
      setLoadingPlanes(false);
    }
  };

  const handleFiltrosChange = (nuevosFiltros: FiltrosPresupuestosType) => {
    setFiltros(nuevosFiltros);
  };

  const handleBuscar = (termino: string) => {
    setFiltros({
      ...filtros,
      q: termino || undefined,
      page: 1,
    });
  };

  const handleVerDetalle = (presupuesto: Presupuesto) => {
    setPresupuestoSeleccionado(presupuesto);
    setMostrarModalDetalle(true);
  };

  const handleCerrarModal = () => {
    setMostrarModalDetalle(false);
    setPresupuestoSeleccionado(null);
  };

  const handleCambiarEstado = async (
    id: string,
    nuevoEstado: 'Pendiente' | 'Aceptado' | 'Rechazado' | 'Completado' | 'Anulado'
  ) => {
    try {
      await actualizarEstadoPresupuesto(id, nuevoEstado);
      // Actualizar el estado local
      setPresupuestos((prev) =>
        prev.map((p) => (p._id === id ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado');
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await eliminarPresupuesto(id);
      // Remover del estado local
      setPresupuestos((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el presupuesto');
    }
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setFiltros({
      ...filtros,
      page: nuevaPagina,
    });
  };

  const tabs = [
    { id: 'presupuestos' as TabType, label: 'Presupuestos', icon: Receipt },
    { id: 'planes-tratamiento' as TabType, label: 'Planes de Tratamiento', icon: ClipboardList },
    { id: 'simulador-costos' as TabType, label: 'Simulador de Costos', icon: Calculator },
  ];

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'Propuesto':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aceptado':
        return 'bg-green-100 text-green-800';
      case 'En Curso':
        return 'bg-blue-100 text-blue-800';
      case 'Finalizado':
        return 'bg-gray-100 text-gray-800';
      case 'Rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                <Receipt className="w-8 h-8 text-blue-600" />
                <span>Presupuestos y Planes de Tratamiento</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona y visualiza todos los presupuestos y planes de tratamiento de la clínica
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido de las pestañas */}
        <div className="p-0">
          {activeTab === 'presupuestos' && (
            <>
              {/* Estadísticas rápidas para Presupuestos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-5 hover:shadow-md transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Total Presupuestos</p>
                      <p className="text-3xl font-bold text-blue-900">{presupuestos.length}</p>
                      <p className="text-xs text-blue-600 mt-2 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {presupuestos.filter(p => {
                          const fecha = new Date(p.fechaCreacion);
                          const hoy = new Date();
                          const diffDias = Math.floor((hoy.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
                          return diffDias <= 30;
                        }).length} este mes
                      </p>
                    </div>
                    <div className="bg-blue-200 rounded-full p-4">
                      <Receipt className="w-7 h-7 text-blue-700" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-sm border border-yellow-200 p-5 hover:shadow-md transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-700 mb-1">Pendientes</p>
                      <p className="text-3xl font-bold text-yellow-800">
                        {presupuestos.filter(p => p.estado === 'Pendiente' || p.estado === 'Presentado').length}
                      </p>
                      <p className="text-xs text-yellow-600 mt-2 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Requieren atención
                      </p>
                    </div>
                    <div className="bg-yellow-200 rounded-full p-4">
                      <Clock className="w-7 h-7 text-yellow-700" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-5 hover:shadow-md transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">Aceptados/Aprobados</p>
                      <p className="text-3xl font-bold text-green-800">
                        {presupuestos.filter(p => p.estado === 'Aceptado' || p.estado === 'Aprobado').length}
                      </p>
                      <p className="text-xs text-green-600 mt-2 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {presupuestos.length > 0 ? ((presupuestos.filter(p => p.estado === 'Aceptado' || p.estado === 'Aprobado').length / presupuestos.length) * 100).toFixed(1) : 0}% tasa aceptación
                      </p>
                    </div>
                    <div className="bg-green-200 rounded-full p-4">
                      <CheckCircle className="w-7 h-7 text-green-700" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-sm border border-indigo-200 p-5 hover:shadow-md transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-700 mb-1">Valor Total</p>
                      <p className="text-3xl font-bold text-indigo-900">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(presupuestos.reduce((sum, p) => sum + p.total, 0))}
                      </p>
                      <p className="text-xs text-indigo-600 mt-2 flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Promedio: {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(presupuestos.length > 0 ? presupuestos.reduce((sum, p) => sum + p.total, 0) / presupuestos.length : 0)}
                      </p>
                    </div>
                    <div className="bg-indigo-200 rounded-full p-4">
                      <DollarSign className="w-7 h-7 text-indigo-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos y análisis adicionales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Gráfico de distribución por estado */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                      Distribución por Estado
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {['Pendiente', 'Aceptado', 'Aprobado', 'Completado', 'Rechazado', 'Anulado'].map((estado) => {
                      const count = presupuestos.filter(p => p.estado === estado).length;
                      const porcentaje = presupuestos.length > 0 ? (count / presupuestos.length) * 100 : 0;
                      const colores = {
                        'Pendiente': 'bg-yellow-500',
                        'Aceptado': 'bg-green-500',
                        'Aprobado': 'bg-blue-500',
                        'Completado': 'bg-indigo-500',
                        'Rechazado': 'bg-red-500',
                        'Anulado': 'bg-gray-500',
                      };
                      return (
                        <div key={estado} className="flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{estado}</span>
                              <span className="text-sm text-gray-600">{count} ({porcentaje.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${colores[estado as keyof typeof colores] || 'bg-gray-500'}`}
                                style={{ width: `${porcentaje}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Análisis de tendencias */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      Análisis de Tendencias
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Pacientes únicos</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {new Set(presupuestos.map(p => p.paciente._id)).size}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Valor promedio</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(presupuestos.length > 0 ? presupuestos.reduce((sum, p) => sum + p.total, 0) / presupuestos.length : 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingDown className="w-5 h-5 text-yellow-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Descuento promedio</span>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">
                        {presupuestos.length > 0 
                          ? `${((presupuestos.reduce((sum, p) => sum + p.descuentoTotal, 0) / presupuestos.reduce((sum, p) => sum + p.subtotal, 0)) * 100).toFixed(1)}%`
                          : '0%'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Tratamientos promedio</span>
                      </div>
                      <span className="text-lg font-bold text-purple-600">
                        {(presupuestos.length > 0 
                          ? presupuestos.reduce((sum, p) => sum + p.tratamientos.length, 0) / presupuestos.length 
                          : 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6 flex items-center justify-end">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={cargarPresupuestos}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Actualizar</span>
                  </button>
                  <button
                    onClick={onNuevoPresupuesto}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo Presupuesto</span>
                  </button>
                </div>
              </div>

              {/* Barra de búsqueda */}
              <div className="mb-4">
                <BarraBusquedaPresupuestos onBuscar={handleBuscar} />
              </div>

              {/* Filtros */}
              <FiltrosPresupuestos
                filtros={filtros}
                onFiltrosChange={handleFiltrosChange}
                profesionales={profesionales}
                sedes={sedes}
              />

              {/* Error */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Tabla de presupuestos */}
              <TablaPresupuestos
                presupuestos={presupuestos}
                loading={loading}
                onVerDetalle={handleVerDetalle}
                onCambiarEstado={handleCambiarEstado}
                onEliminar={handleEliminar}
                onEditar={onEditarPresupuesto}
                onAprobar={onAprobarPresupuesto}
              />

              {/* Paginación */}
              {paginacion.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-700">
                    Mostrando {((paginacion.currentPage - 1) * (filtros.limit || 10)) + 1} a{' '}
                    {Math.min(paginacion.currentPage * (filtros.limit || 10), paginacion.total)} de{' '}
                    {paginacion.total} resultados
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCambiarPagina(paginacion.currentPage - 1)}
                      disabled={paginacion.currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-gray-700">
                      Página {paginacion.currentPage} de {paginacion.totalPages}
                    </span>
                    <button
                      onClick={() => handleCambiarPagina(paginacion.currentPage + 1)}
                      disabled={paginacion.currentPage === paginacion.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {/* Modal de detalle */}
              {mostrarModalDetalle && presupuestoSeleccionado && presupuestoSeleccionado._id && (
                <ModalDetallePresupuesto
                  presupuestoId={presupuestoSeleccionado._id}
                  onClose={handleCerrarModal}
                />
              )}
            </>
          )}

          {activeTab === 'planes-tratamiento' && (
            <div className="space-y-6">
              {/* Estadísticas para Planes de Tratamiento */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-5 hover:shadow-md transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Total Planes</p>
                      <p className="text-3xl font-bold text-blue-900">{planesTratamiento.length}</p>
                      <p className="text-xs text-blue-600 mt-2">
                        {planesTratamiento.filter(p => {
                          const fecha = new Date(p.fechaCreacion);
                          const hoy = new Date();
                          const diffDias = Math.floor((hoy.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
                          return diffDias <= 30;
                        }).length} creados este mes
                      </p>
                    </div>
                    <div className="bg-blue-200 rounded-full p-4">
                      <ClipboardList className="w-7 h-7 text-blue-700" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg shadow-sm border border-cyan-200 p-5 hover:shadow-md transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-cyan-700 mb-1">En Curso</p>
                      <p className="text-3xl font-bold text-cyan-800">
                        {planesTratamiento.filter(p => p.estado === 'En Curso').length}
                      </p>
                      <p className="text-xs text-cyan-600 mt-2 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Tratamientos activos
                      </p>
                    </div>
                    <div className="bg-cyan-200 rounded-full p-4">
                      <Clock className="w-7 h-7 text-cyan-700" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-5 hover:shadow-md transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">Finalizados</p>
                      <p className="text-3xl font-bold text-green-800">
                        {planesTratamiento.filter(p => p.estado === 'Finalizado').length}
                      </p>
                      <p className="text-xs text-green-600 mt-2 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completados exitosamente
                      </p>
                    </div>
                    <div className="bg-green-200 rounded-full p-4">
                      <CheckCircle className="w-7 h-7 text-green-700" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm border border-purple-200 p-5 hover:shadow-md transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700 mb-1">Valor Total</p>
                      <p className="text-3xl font-bold text-purple-900">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(planesTratamiento.reduce((sum, p) => sum + p.totalNeto, 0))}
                      </p>
                      <p className="text-xs text-purple-600 mt-2 flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Promedio: {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(planesTratamiento.length > 0 ? planesTratamiento.reduce((sum, p) => sum + p.totalNeto, 0) / planesTratamiento.length : 0)}
                      </p>
                    </div>
                    <div className="bg-purple-200 rounded-full p-4">
                      <DollarSign className="w-7 h-7 text-purple-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Análisis de planes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                    <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                    Distribución por Estado
                  </h3>
                  <div className="space-y-3">
                    {['Propuesto', 'Aceptado', 'En Curso', 'Finalizado', 'Rechazado'].map((estado) => {
                      const count = planesTratamiento.filter(p => p.estado === estado).length;
                      const porcentaje = planesTratamiento.length > 0 ? (count / planesTratamiento.length) * 100 : 0;
                      const colores = {
                        'Propuesto': 'bg-yellow-500',
                        'Aceptado': 'bg-green-500',
                        'En Curso': 'bg-blue-500',
                        'Finalizado': 'bg-indigo-500',
                        'Rechazado': 'bg-red-500',
                      };
                      return (
                        <div key={estado} className="flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{estado}</span>
                              <span className="text-sm text-gray-600">{count} ({porcentaje.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${colores[estado as keyof typeof colores] || 'bg-gray-500'}`}
                                style={{ width: `${porcentaje}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Estadísticas de Progreso
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Pacientes únicos</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {new Set(planesTratamiento.map(p => p.paciente._id)).size}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Fases promedio</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {(planesTratamiento.length > 0 
                          ? planesTratamiento.reduce((sum, p) => sum + p.fases.length, 0) / planesTratamiento.length 
                          : 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-yellow-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Procedimientos promedio</span>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">
                        {(planesTratamiento.length > 0 
                          ? planesTratamiento.reduce((sum, p) => sum + p.fases.reduce((s, f) => s + f.procedimientos.length, 0), 0) / planesTratamiento.length 
                          : 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Percent className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Descuento promedio</span>
                      </div>
                      <span className="text-lg font-bold text-purple-600">
                        {planesTratamiento.length > 0 
                          ? `${(planesTratamiento.reduce((sum, p) => sum + p.descuento, 0) / planesTratamiento.length).toFixed(1)}%`
                          : '0%'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Planes de Tratamiento */}
              {loadingPlanes ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando planes de tratamiento...</p>
                </div>
              ) : planesTratamiento.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No se encontraron planes de tratamiento</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {planesTratamiento.map((plan) => {
                    const totalProcedimientos = plan.fases.reduce((sum, fase) => sum + fase.procedimientos.length, 0);
                    const completados = plan.fases.reduce((sum, fase) => 
                      sum + fase.procedimientos.filter(p => p.estadoProcedimiento === 'Completado').length, 0
                    );
                    const enCurso = plan.fases.reduce((sum, fase) => 
                      sum + fase.procedimientos.filter(p => p.estadoProcedimiento === 'En Curso').length, 0
                    );
                    const pendientes = plan.fases.reduce((sum, fase) => 
                      sum + fase.procedimientos.filter(p => p.estadoProcedimiento === 'Pendiente').length, 0
                    );
                    const progreso = totalProcedimientos > 0 ? (completados / totalProcedimientos) * 100 : 0;
                    
                    return (
                    <div key={plan._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all transform hover:scale-[1.01]">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-800">
                              Plan de Tratamiento - {plan.paciente.nombre} {plan.paciente.apellidos}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoBadgeColor(plan.estado)}`}>
                              {plan.estado}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2 text-blue-500" />
                              <span className="font-medium">Odontólogo:</span>
                              <span className="ml-2">{plan.odontologo.nombre} {plan.odontologo.apellidos}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                              <span className="font-medium">Creado:</span>
                              <span className="ml-2">
                                {new Date(plan.fechaCreacion).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-2 text-green-500" />
                              <span className="font-medium">Fases:</span>
                              <span className="ml-2">{plan.fases.length}</span>
                            </div>
                            <div className="flex items-center">
                              <ClipboardList className="w-4 h-4 mr-2 text-purple-500" />
                              <span className="font-medium">Procedimientos:</span>
                              <span className="ml-2">{totalProcedimientos}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {new Intl.NumberFormat('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                              maximumFractionDigits: 0,
                            }).format(plan.totalNeto)}
                          </div>
                          {plan.descuento > 0 && (
                            <div className="text-sm text-gray-600 mb-1">
                              <span className="line-through text-gray-400">
                                {new Intl.NumberFormat('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR',
                                  maximumFractionDigits: 0,
                                }).format(plan.totalBruto)}
                              </span>
                              <span className="ml-2 text-green-600 font-semibold">-{plan.descuento}%</span>
                            </div>
                          )}
                          {plan.descuento === 0 && (
                            <div className="text-xs text-gray-500">
                              Sin descuento
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progreso general */}
                      <div className="mb-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700">Progreso General del Plan</h4>
                          <span className="text-sm font-bold text-blue-600">{progreso.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progreso}%` }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                            <div className="text-2xl font-bold text-green-600">{completados}</div>
                            <div className="text-xs text-green-700 font-medium">Completados</div>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600">{enCurso}</div>
                            <div className="text-xs text-blue-700 font-medium">En Curso</div>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                            <div className="text-2xl font-bold text-yellow-600">{pendientes}</div>
                            <div className="text-xs text-yellow-700 font-medium">Pendientes</div>
                          </div>
                        </div>
                      </div>

                      {/* Resumen de fases */}
                      <div className="mb-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-blue-600" />
                          Fases del Tratamiento
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {plan.fases.map((fase, index) => {
                            const completadosFase = fase.procedimientos.filter(p => p.estadoProcedimiento === 'Completado').length;
                            const enCursoFase = fase.procedimientos.filter(p => p.estadoProcedimiento === 'En Curso').length;
                            const pendientesFase = fase.procedimientos.filter(p => p.estadoProcedimiento === 'Pendiente').length;
                            const progresoFase = fase.procedimientos.length > 0 
                              ? (completadosFase / fase.procedimientos.length) * 100 
                              : 0;
                            const totalFase = fase.procedimientos.reduce((sum, p) => sum + p.precio, 0);
                            
                            return (
                              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <span className="font-bold text-gray-800 text-base">
                                      Fase {index + 1}: {fase.nombre}
                                    </span>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {fase.procedimientos.length} procedimientos
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-bold text-blue-600">
                                      {new Intl.NumberFormat('es-ES', {
                                        style: 'currency',
                                        currency: 'EUR',
                                        maximumFractionDigits: 0,
                                      }).format(totalFase)}
                                    </div>
                                    <div className="text-xs text-gray-500">{progresoFase.toFixed(0)}%</div>
                                  </div>
                                </div>
                                {fase.descripcion && (
                                  <p className="text-xs text-gray-600 mb-3 italic">{fase.descripcion}</p>
                                )}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                  <div
                                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                                    style={{ width: `${progresoFase}%` }}
                                  ></div>
                                </div>
                                <div className="flex items-center gap-2 text-xs flex-wrap">
                                  {completadosFase > 0 && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                                      ✓ {completadosFase} completados
                                    </span>
                                  )}
                                  {enCursoFase > 0 && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                      ⟳ {enCursoFase} en curso
                                    </span>
                                  )}
                                  {pendientesFase > 0 && (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                                      ⏳ {pendientesFase} pendientes
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Notas */}
                      {plan.notas && (
                        <div className="mb-4 pt-4 border-t border-gray-200">
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                            <div className="flex items-start">
                              <FileText className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <h5 className="font-semibold text-yellow-800 mb-1">Notas y Observaciones</h5>
                                <p className="text-sm text-yellow-900 whitespace-pre-wrap">{plan.notas}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Resumen financiero */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                          <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-indigo-600" />
                            Resumen Financiero
                          </h5>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Total Bruto:</span>
                              <span className="ml-2 font-semibold text-gray-800">
                                {new Intl.NumberFormat('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR',
                                  maximumFractionDigits: 0,
                                }).format(plan.totalBruto)}
                              </span>
                            </div>
                            {plan.descuento > 0 && (
                              <div>
                                <span className="text-gray-600">Descuento ({plan.descuento}%):</span>
                                <span className="ml-2 font-semibold text-green-600">
                                  -{new Intl.NumberFormat('es-ES', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    maximumFractionDigits: 0,
                                  }).format(plan.totalBruto - plan.totalNeto)}
                                </span>
                              </div>
                            )}
                            <div className="col-span-2 pt-2 border-t border-indigo-200">
                              <span className="text-base font-bold text-indigo-700">Total Neto:</span>
                              <span className="ml-2 text-xl font-bold text-indigo-900">
                                {new Intl.NumberFormat('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR',
                                  maximumFractionDigits: 0,
                                }).format(plan.totalNeto)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'simulador-costos' && (
            <SimuladorCostosPage
              onVolver={undefined}
              onGenerarPresupuesto={(simulacion) => {
                if (onNuevoPresupuesto) {
                  onNuevoPresupuesto();
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

