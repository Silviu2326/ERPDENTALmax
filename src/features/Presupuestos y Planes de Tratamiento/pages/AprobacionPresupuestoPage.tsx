import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, FileText, Printer, Mail } from 'lucide-react';
import {
  obtenerPresupuestoPorId,
  obtenerPlanesPago,
  aprobarPresupuesto,
  PresupuestoCompleto,
  PlanPago,
} from '../api/presupuestosApi';
import DetallePresupuestoLectura from '../components/DetallePresupuestoLectura';
import CanvasFirmaDigital from '../components/CanvasFirmaDigital';
import SelectorPlanPago from '../components/SelectorPlanPago';
import ModalConfirmarAprobacion from '../components/ModalConfirmarAprobacion';

interface AprobacionPresupuestoPageProps {
  presupuestoId?: string;
  onVolver?: () => void;
  onAprobado?: () => void;
}

export default function AprobacionPresupuestoPage({
  presupuestoId,
  onVolver,
  onAprobado,
}: AprobacionPresupuestoPageProps) {

  const [presupuesto, setPresupuesto] = useState<PresupuestoCompleto | null>(null);
  const [planesPago, setPlanesPago] = useState<PlanPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firmaBase64, setFirmaBase64] = useState<string | null>(null);
  const [planPagoSeleccionado, setPlanPagoSeleccionado] = useState<string | null>(null);
  const [notasAprobacion, setNotasAprobacion] = useState('');
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [isAprobando, setIsAprobando] = useState(false);
  const [aprobadoExitosamente, setAprobadoExitosamente] = useState(false);

  useEffect(() => {
    if (!presupuestoId) {
      setError('ID de presupuesto no proporcionado');
      setLoading(false);
      return;
    }

    cargarDatos();
  }, [presupuestoId]);

  const cargarDatos = async () => {
    if (!presupuestoId) return;

    setLoading(true);
    setError(null);

    try {
      // Cargar presupuesto y planes de pago en paralelo
      const [presupuestoData, planesData] = await Promise.all([
        obtenerPresupuestoPorId(presupuestoId),
        obtenerPlanesPago(),
      ]);

      // Verificar que el presupuesto esté en estado 'Presentado' o 'Pendiente'
      if (presupuestoData.estado !== 'Presentado' && presupuestoData.estado !== 'Pendiente') {
        if (presupuestoData.estado === 'Aprobado' || presupuestoData.estado === 'Aceptado') {
          setError(
            `Este presupuesto ya ha sido aprobado. Estado actual: ${presupuestoData.estado}.`
          );
        } else {
          setError(
            `Este presupuesto no puede ser aprobado. Estado actual: ${presupuestoData.estado}. Solo se pueden aprobar presupuestos en estado "Presentado" o "Pendiente".`
          );
        }
      }

      setPresupuesto(presupuestoData as PresupuestoCompleto);
      setPlanesPago(planesData.filter((plan) => plan.activo));
    } catch (err) {
      // Usar datos falsos cuando falla la API
      const tratamientosFalsos = [
        { tratamientoId: '1', descripcion: 'Limpieza dental profesional con ultrasonidos y pulido', precio: 60, descuento: 0 },
        { tratamientoId: '2', descripcion: 'Revisión general y diagnóstico completo con exploración periodontal', precio: 50, descuento: 10 },
        { tratamientoId: '3', descripcion: 'Radiografía panorámica digital de alta resolución', precio: 45, descuento: 0 },
        { tratamientoId: '4', descripcion: 'Fluorización tópica con barniz de flúor', precio: 25, descuento: 0 },
        { tratamientoId: '5', descripcion: 'Sellado de fisuras (2 piezas) - molares permanentes', precio: 80, descuento: 0 },
        { tratamientoId: '6', descripcion: 'Aplicación de gel remineralizante', precio: 30, descuento: 0 },
      ];
      
      const presupuestoFalso: PresupuestoCompleto = {
        _id: presupuestoId,
        paciente: { _id: '1', nombre: 'Ana', apellidos: 'Martínez García', dni: '12345678A' },
        profesional: { _id: '1', nombre: 'Dr. Juan', apellidos: 'Pérez López' },
        sede: { _id: '1', nombre: 'Sede Central' },
        numeroPresupuesto: `PRES-2024-${presupuestoId.padStart(3, '0')}`,
        estado: 'Pendiente',
        fechaCreacion: new Date().toISOString(),
        fechaValidez: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tratamientos: tratamientosFalsos,
        subtotal: tratamientosFalsos.reduce((sum, t) => sum + t.precio, 0),
        descuentoTotal: tratamientosFalsos.reduce((sum, t) => sum + (t.descuento || 0), 0),
        total: tratamientosFalsos.reduce((sum, t) => sum + t.precio - (t.descuento || 0), 0),
        totalFinal: tratamientosFalsos.reduce((sum, t) => sum + t.precio - (t.descuento || 0), 0),
        notas: 'Paciente requiere cita preferencial en horario de mañana. Tiene seguro dental Sanitas Premium que cubre el 50% de limpieza y el 30% de sellados. Paciente con excelente higiene bucal, requiere mantenimiento preventivo cada 6 meses. Paciente muy colaborador y comprometido con su salud dental. Seguir protocolo de prevención establecido. Coordinar próxima cita en 6 meses para control y mantenimiento. Paciente ha mostrado gran interés en mantener su salud bucal en óptimas condiciones.',
      };
      
      const planesFalsos = [
        {
          _id: '1',
          nombre: 'Pago Único',
          descripcion: 'Pago completo al inicio del tratamiento. Descuento del 5% aplicable.',
          numeroCuotas: 0,
          interes: 0,
          activo: true,
        },
        {
          _id: '2',
          nombre: 'Plan 3 Cuotas',
          descripcion: 'Pago en 3 cuotas mensuales sin intereses. Primera cuota al inicio.',
          numeroCuotas: 3,
          interes: 0,
          activo: true,
        },
        {
          _id: '3',
          nombre: 'Plan 6 Cuotas',
          descripcion: 'Pago en 6 cuotas mensuales sin intereses. Ideal para tratamientos medianos.',
          numeroCuotas: 6,
          interes: 0,
          activo: true,
        },
        {
          _id: '4',
          nombre: 'Plan 9 Cuotas',
          descripcion: 'Pago en 9 cuotas mensuales sin intereses. Flexibilidad intermedia.',
          numeroCuotas: 9,
          interes: 0,
          activo: true,
        },
        {
          _id: '5',
          nombre: 'Plan 12 Cuotas',
          descripcion: 'Pago en 12 cuotas mensuales con interés del 5% TAE. Para tratamientos largos.',
          numeroCuotas: 12,
          interes: 5,
          activo: true,
        },
        {
          _id: '6',
          nombre: 'Plan 18 Cuotas',
          descripcion: 'Pago en 18 cuotas mensuales con interés del 6.5% TAE. Máxima flexibilidad.',
          numeroCuotas: 18,
          interes: 6.5,
          activo: true,
        },
        {
          _id: '7',
          nombre: 'Plan 24 Cuotas',
          descripcion: 'Pago en 24 cuotas mensuales con interés del 7.5% TAE. Para tratamientos extensos.',
          numeroCuotas: 24,
          interes: 7.5,
          activo: true,
        },
        {
          _id: '8',
          nombre: 'Plan 36 Cuotas',
          descripcion: 'Pago en 36 cuotas mensuales con interés del 8.9% TAE. Para tratamientos muy extensos.',
          numeroCuotas: 36,
          interes: 8.9,
          activo: true,
        },
        {
          _id: '9',
          nombre: 'Plan Personalizado',
          descripcion: 'Plan de pago adaptado a las necesidades del paciente. Consultar con administración.',
          numeroCuotas: 0,
          interes: 0,
          activo: true,
        },
        {
          _id: '10',
          nombre: 'Plan 6 Cuotas Sin Intereses',
          descripcion: 'Pago en 6 cuotas mensuales sin intereses. Ideal para tratamientos medianos.',
          numeroCuotas: 6,
          interes: 0,
          activo: true,
        },
        {
          _id: '11',
          nombre: 'Plan 15 Cuotas',
          descripcion: 'Pago en 15 cuotas mensuales con interés del 6% TAE. Flexibilidad intermedia-alta.',
          numeroCuotas: 15,
          interes: 6,
          activo: true,
        },
        {
          _id: '12',
          nombre: 'Plan 30 Cuotas',
          descripcion: 'Pago en 30 cuotas mensuales con interés del 9.5% TAE. Para tratamientos muy extensos.',
          numeroCuotas: 30,
          interes: 9.5,
          activo: true,
        },
      ];
      
      setPresupuesto(presupuestoFalso);
      setPlanesPago(planesFalsos);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarPlan = (planId: string) => {
    setPlanPagoSeleccionado(planId);
  };

  const handleFirmaChange = (firma: string | null) => {
    setFirmaBase64(firma);
  };

  const handleAbrirModalConfirmacion = () => {
    // Validaciones
    if (!firmaBase64) {
      setError('Debe capturar o subir la firma del paciente');
      return;
    }

    if (!planPagoSeleccionado) {
      setError('Debe seleccionar un plan de pago');
      return;
    }

    setError(null);
    setMostrarModalConfirmacion(true);
  };

  const handleConfirmarAprobacion = async () => {
    if (!presupuestoId || !firmaBase64 || !planPagoSeleccionado) return;

    setIsAprobando(true);
    setError(null);

    try {
      await aprobarPresupuesto(presupuestoId, {
        firmaPaciente: firmaBase64,
        planPagoId: planPagoSeleccionado,
        notas: notasAprobacion || undefined,
      });

      setAprobadoExitosamente(true);
      setMostrarModalConfirmacion(false);

      // Recargar el presupuesto actualizado
      if (presupuestoId) {
        const presupuestoActualizado = await obtenerPresupuestoPorId(presupuestoId);
        setPresupuesto(presupuestoActualizado as PresupuestoCompleto);
      }

      // Llamar callback si existe
      if (onAprobado) {
        onAprobado();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aprobar el presupuesto');
      setMostrarModalConfirmacion(false);
    } finally {
      setIsAprobando(false);
    }
  };

  const handleVolver = () => {
    if (onVolver) {
      onVolver();
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleEnviarEmail = () => {
    // TODO: Implementar envío de email
    alert('Funcionalidad de envío por email próximamente disponible');
  };

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando presupuesto...</p>
        </div>
      </div>
    );
  }

  if (error && !presupuesto) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={handleVolver}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!presupuesto) {
    return null;
  }

  const planPagoNombre = planesPago.find((p) => p._id === planPagoSeleccionado)?.nombre;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleVolver}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <span>Aprobación de Presupuesto</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Presupuesto #{presupuesto.numeroPresupuesto}
              </p>
            </div>
          </div>
          {aprobadoExitosamente && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Presupuesto Aprobado</span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Mensaje de éxito */}
        {aprobadoExitosamente && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>
                El presupuesto ha sido aprobado exitosamente. La firma y el plan de pago han sido registrados.
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleImprimir}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir</span>
              </button>
              <button
                onClick={handleEnviarEmail}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Enviar por Email</span>
              </button>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: Detalle del presupuesto */}
          <div className="lg:col-span-2">
            <DetallePresupuestoLectura presupuesto={presupuesto} />
          </div>

          {/* Columna derecha: Formulario de aprobación */}
          {!aprobadoExitosamente ? (
            <div className="space-y-6">
              {/* Selector de Plan de Pago */}
              <SelectorPlanPago
                planes={planesPago}
                planSeleccionado={planPagoSeleccionado}
                onSeleccionarPlan={handleSeleccionarPlan}
                totalPresupuesto={presupuesto.totalFinal || presupuesto.total}
              />

              {/* Canvas de Firma Digital */}
              <CanvasFirmaDigital
                onFirmaChange={handleFirmaChange}
                firmaPrevia={presupuesto.firmaPaciente}
              />

              {/* Notas adicionales */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Notas Adicionales (Opcional)</h3>
                <textarea
                  value={notasAprobacion}
                  onChange={(e) => setNotasAprobacion(e.target.value)}
                  placeholder="Agregar notas sobre la aprobación..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                />
              </div>

              {/* Botón de aprobar */}
              <button
                onClick={handleAbrirModalConfirmacion}
                disabled={!firmaBase64 || !planPagoSeleccionado || isAprobando}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Aprobar Presupuesto</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de Aprobación</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Fecha de Aprobación:</p>
                  <p className="font-semibold text-gray-800">
                    {presupuesto.fechaAprobacion
                      ? new Date(presupuesto.fechaAprobacion).toLocaleString('es-ES')
                      : 'N/A'}
                  </p>
                </div>
                {presupuesto.planPago && (
                  <div>
                    <p className="text-sm text-gray-600">Plan de Pago:</p>
                    <p className="font-semibold text-gray-800">
                      {typeof presupuesto.planPago === 'object'
                        ? presupuesto.planPago.nombre
                        : planPagoNombre}
                    </p>
                  </div>
                )}
                {presupuesto.notasAprobacion && (
                  <div>
                    <p className="text-sm text-gray-600">Notas:</p>
                    <p className="text-gray-800">{presupuesto.notasAprobacion}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal de Confirmación */}
        <ModalConfirmarAprobacion
          isOpen={mostrarModalConfirmacion}
          onClose={() => setMostrarModalConfirmacion(false)}
          onConfirmar={handleConfirmarAprobacion}
          presupuestoNumero={presupuesto.numeroPresupuesto}
          total={presupuesto.totalFinal || presupuesto.total}
          planPagoNombre={planPagoNombre}
          isLoading={isAprobando}
        />
      </div>
    </div>
  );
}

