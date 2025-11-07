import { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle } from 'lucide-react';
import SelectorPacienteFactura from './SelectorPacienteFactura';
import TablaConceptosFactura from './TablaConceptosFactura';
import ResumenTotalesFactura from './ResumenTotalesFactura';
import ModalConfirmacionEmision from './ModalConfirmacionEmision';
import {
  PacienteSimplificado,
  TratamientoPendiente,
  ConceptoFactura,
  ConfiguracionFiscal,
  obtenerTratamientosPendientes,
  obtenerConfiguracionFiscal,
  crearFactura,
  Factura,
} from '../api/facturacionApi';

interface FormularioNuevaFacturaProps {
  onFacturaCreada?: (factura: Factura) => void;
  onCancelar?: () => void;
}

export default function FormularioNuevaFactura({
  onFacturaCreada,
  onCancelar,
}: FormularioNuevaFacturaProps) {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteSimplificado | null>(null);
  const [tratamientosPendientes, setTratamientosPendientes] = useState<TratamientoPendiente[]>([]);
  const [tratamientosSeleccionados, setTratamientosSeleccionados] = useState<string[]>([]);
  const [configuracionFiscal, setConfiguracionFiscal] = useState<ConfiguracionFiscal | null>(null);
  const [conceptos, setConceptos] = useState<ConceptoFactura[]>([]);
  const [fechaEmision, setFechaEmision] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [fechaVencimiento, setFechaVencimiento] = useState<string>('');
  const [notas, setNotas] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facturaCreada, setFacturaCreada] = useState<Factura | null>(null);

  // Cargar configuración fiscal al montar
  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const config = await obtenerConfiguracionFiscal();
        setConfiguracionFiscal(config);
      } catch (err) {
        // Datos mock para desarrollo
        setConfiguracionFiscal({
          tiposIva: [
            { tipo: 'general', porcentaje: 21, descripcion: 'IVA General' },
            { tipo: 'reducido', porcentaje: 10, descripcion: 'IVA Reducido' },
            { tipo: 'superreducido', porcentaje: 4, descripcion: 'IVA Superreducido' },
            { tipo: 'exento', porcentaje: 0, descripcion: 'Exento' },
          ],
          datosClinica: {
            nombre: 'Clínica Dental',
            cif: 'B12345678',
          },
        });
      }
    };

    cargarConfiguracion();
  }, []);

  // Cargar tratamientos pendientes cuando se selecciona un paciente
  useEffect(() => {
    if (pacienteSeleccionado) {
      const cargarTratamientos = async () => {
        try {
          const tratamientos = await obtenerTratamientosPendientes(pacienteSeleccionado._id);
          setTratamientosPendientes(tratamientos);
        } catch (err) {
          console.error('Error al cargar tratamientos:', err);
          setTratamientosPendientes([]);
        }
      };

      cargarTratamientos();
    } else {
      setTratamientosPendientes([]);
      setTratamientosSeleccionados([]);
    }
  }, [pacienteSeleccionado]);

  // Agregar tratamientos seleccionados como conceptos
  const handleAgregarTratamientos = () => {
    if (tratamientosSeleccionados.length === 0) return;

    const nuevosConceptos: ConceptoFactura[] = tratamientosPendientes
      .filter((t) => tratamientosSeleccionados.includes(t._id))
      .map((tratamiento) => {
        const tipoIva = configuracionFiscal?.tiposIva[0] || { tipo: 'general', porcentaje: 21, descripcion: 'IVA General' };
        const subtotal = tratamiento.precio;
        const impuesto = (subtotal * tipoIva.porcentaje) / 100;
        const total = subtotal + impuesto;

        return {
          id: `tratamiento-${tratamiento._id}`,
          descripcion: tratamiento.descripcion,
          cantidad: 1,
          precioUnitario: tratamiento.precio,
          tipoImpuesto: tipoIva.tipo,
          porcentajeImpuesto: tipoIva.porcentaje,
          total,
          tratamientoId: tratamiento._id,
        };
      });

    setConceptos([...conceptos, ...nuevosConceptos]);
    setTratamientosSeleccionados([]);
  };

  const calcularTotales = () => {
    let subtotal = 0;
    let totalImpuestos = 0;

    conceptos.forEach((concepto) => {
      const cantidad = concepto.cantidad || 0;
      const precioUnitario = concepto.precioUnitario || 0;
      const descuento = concepto.descuento || 0;
      const subtotalConcepto = cantidad * precioUnitario;
      const subtotalConDescuento = subtotalConcepto - (subtotalConcepto * descuento) / 100;
      const impuestoConcepto = (subtotalConDescuento * (concepto.porcentajeImpuesto || 0)) / 100;

      subtotal += subtotalConDescuento;
      totalImpuestos += impuestoConcepto;
    });

    return {
      subtotal,
      impuestos: totalImpuestos,
      total: subtotal + totalImpuestos,
    };
  };

  const handleEmitirFactura = async () => {
    if (!pacienteSeleccionado) {
      setError('Debe seleccionar un paciente');
      return;
    }

    if (conceptos.length === 0) {
      setError('Debe agregar al menos un concepto a la factura');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { subtotal, impuestos, total } = calcularTotales();

      const datosFactura = {
        pacienteId: pacienteSeleccionado._id,
        fechaEmision: new Date(fechaEmision).toISOString(),
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento).toISOString() : undefined,
        conceptos,
        subtotal,
        impuestos,
        total,
        notas: notas || undefined,
      };

      const factura = await crearFactura(datosFactura);
      setFacturaCreada(factura);

      if (onFacturaCreada) {
        onFacturaCreada(factura);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la factura');
      console.error('Error al crear factura:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImprimir = () => {
    // TODO: Implementar generación de PDF
    console.log('Imprimir factura:', facturaCreada);
    window.alert('Función de impresión en desarrollo');
  };

  const handleEnviarEmail = () => {
    // TODO: Implementar envío por email
    console.log('Enviar factura por email:', facturaCreada);
    window.alert('Función de envío por email en desarrollo');
  };

  const handleRegistrarPago = () => {
    // TODO: Implementar registro de pago
    console.log('Registrar pago para factura:', facturaCreada);
    window.alert('Función de registro de pago en desarrollo');
  };

  const tiposImpuesto = configuracionFiscal?.tiposIva || [];

  return (
    <div className="space-y-6">
      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selección de paciente */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <SelectorPacienteFactura
              pacienteSeleccionado={pacienteSeleccionado}
              onPacienteSeleccionado={setPacienteSeleccionado}
            />
          </div>

          {/* Tratamientos pendientes */}
          {pacienteSeleccionado && tratamientosPendientes.length > 0 && (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tratamientos Pendientes de Facturación
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tratamientosPendientes.map((tratamiento) => (
                  <label
                    key={tratamiento._id}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={tratamientosSeleccionados.includes(tratamiento._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTratamientosSeleccionados([...tratamientosSeleccionados, tratamiento._id]);
                        } else {
                          setTratamientosSeleccionados(
                            tratamientosSeleccionados.filter((id) => id !== tratamiento._id)
                          );
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{tratamiento.descripcion}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tratamiento.fechaRealizacion).toLocaleDateString('es-ES')} -{' '}
                        {tratamiento.precio.toFixed(2)} €
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {tratamientosSeleccionados.length > 0 && (
                <button
                  onClick={handleAgregarTratamientos}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  <Plus size={18} />
                  <span>Agregar {tratamientosSeleccionados.length} tratamiento(s) seleccionado(s)</span>
                </button>
              )}
            </div>
          )}

          {/* Tabla de conceptos */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <TablaConceptosFactura
              conceptos={conceptos}
              onConceptosChange={setConceptos}
              tiposImpuesto={tiposImpuesto}
            />
          </div>

          {/* Fechas y notas */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha de Emisión *
                </label>
                <input
                  type="date"
                  value={fechaEmision}
                  onChange={(e) => setFechaEmision(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha de Vencimiento (Opcional)
                </label>
                <input
                  type="date"
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notas (Opcional)</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Notas adicionales para la factura..."
              />
            </div>
          </div>
        </div>

        {/* Columna lateral - Resumen */}
        <div className="space-y-6">
          <ResumenTotalesFactura conceptos={conceptos} />

          {/* Botón de emitir */}
          <button
            onClick={handleEmitirFactura}
            disabled={loading || !pacienteSeleccionado || conceptos.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all bg-green-600 text-white hover:bg-green-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Emitiendo...</span>
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                <span>Emitir Factura</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {facturaCreada && (
        <ModalConfirmacionEmision
          factura={facturaCreada}
          onClose={() => {
            setFacturaCreada(null);
            // Limpiar formulario
            setPacienteSeleccionado(null);
            setConceptos([]);
            setNotas('');
            setFechaVencimiento('');
          }}
          onImprimir={handleImprimir}
          onEnviarEmail={handleEnviarEmail}
          onRegistrarPago={handleRegistrarPago}
        />
      )}
    </div>
  );
}



