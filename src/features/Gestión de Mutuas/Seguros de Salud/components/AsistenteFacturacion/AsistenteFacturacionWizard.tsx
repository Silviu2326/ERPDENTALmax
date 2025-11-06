import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { PacienteConSeguro, TratamientoFacturable, DetalleCobertura, PrefacturaMutua, FacturaMutuaConfirmada } from '../../api/facturacionMutuaApi';
import PasoSeleccionPaciente from './PasoSeleccionPaciente';
import ListaTratamientosFacturables from './ListaTratamientosFacturables';
import PasoVerificacionCobertura from './PasoVerificacionCobertura';
import PasoGeneracionPrefactura from './PasoGeneracionPrefactura';
import PasoResumenYEnvio from './PasoResumenYEnvio';
import { obtenerTratamientosPendientes } from '../../api/facturacionMutuaApi';
import { useEffect } from 'react';

interface AsistenteFacturacionWizardProps {
  onCompletado?: (factura: FacturaMutuaConfirmada) => void;
  onCancelar?: () => void;
}

type Paso = 'seleccion-paciente' | 'seleccion-tratamientos' | 'verificacion-cobertura' | 'generacion-prefactura' | 'resumen-envio';

const PASOS: { id: Paso; titulo: string; descripcion: string }[] = [
  { id: 'seleccion-paciente', titulo: 'Seleccionar Paciente', descripcion: 'Busca y selecciona al paciente' },
  { id: 'seleccion-tratamientos', titulo: 'Seleccionar Tratamientos', descripcion: 'Elige los tratamientos a facturar' },
  { id: 'verificacion-cobertura', titulo: 'Verificar Cobertura', descripcion: 'Revisa la cobertura de la mutua' },
  { id: 'generacion-prefactura', titulo: 'Generar Prefactura', descripcion: 'Revisa el borrador de la factura' },
  { id: 'resumen-envio', titulo: 'Confirmar y Enviar', descripcion: 'Confirma y envía la factura' },
];

export default function AsistenteFacturacionWizard({
  onCompletado,
  onCancelar,
}: AsistenteFacturacionWizardProps) {
  const [pasoActual, setPasoActual] = useState<Paso>('seleccion-paciente');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteConSeguro | null>(null);
  const [tratamientosPendientes, setTratamientosPendientes] = useState<TratamientoFacturable[]>([]);
  const [tratamientosSeleccionados, setTratamientosSeleccionados] = useState<string[]>([]);
  const [detallesCobertura, setDetallesCobertura] = useState<DetalleCobertura[]>([]);
  const [prefactura, setPrefactura] = useState<PrefacturaMutua | null>(null);
  const [loadingTratamientos, setLoadingTratamientos] = useState(false);

  // Cargar tratamientos cuando se selecciona un paciente
  useEffect(() => {
    const cargarTratamientos = async () => {
      if (!pacienteSeleccionado) {
        setTratamientosPendientes([]);
        setTratamientosSeleccionados([]);
        return;
      }

      setLoadingTratamientos(true);
      try {
        const tratamientos = await obtenerTratamientosPendientes(pacienteSeleccionado._id);
        setTratamientosPendientes(tratamientos);
        // Auto-seleccionar todos los tratamientos
        setTratamientosSeleccionados(tratamientos.map((t) => t._id));
      } catch (error) {
        console.error('Error al cargar tratamientos:', error);
        setTratamientosPendientes([]);
      } finally {
        setLoadingTratamientos(false);
      }
    };

    cargarTratamientos();
  }, [pacienteSeleccionado]);

  const getPasoIndex = (paso: Paso) => PASOS.findIndex((p) => p.id === paso);
  const pasoActualIndex = getPasoIndex(pasoActual);

  const puedeAvanzar = () => {
    switch (pasoActual) {
      case 'seleccion-paciente':
        return pacienteSeleccionado !== null;
      case 'seleccion-tratamientos':
        return tratamientosSeleccionados.length > 0;
      case 'verificacion-cobertura':
        return detallesCobertura.length > 0;
      case 'generacion-prefactura':
        return prefactura !== null;
      case 'resumen-envio':
        return false; // No se puede avanzar desde aquí
      default:
        return false;
    }
  };

  const puedeRetroceder = () => {
    return pasoActualIndex > 0;
  };

  const handleSiguiente = () => {
    if (!puedeAvanzar()) return;

    const siguientePaso = PASOS[pasoActualIndex + 1];
    if (siguientePaso) {
      setPasoActual(siguientePaso.id);
    }
  };

  const handleAnterior = () => {
    if (!puedeRetroceder()) return;

    const anteriorPaso = PASOS[pasoActualIndex - 1];
    if (anteriorPaso) {
      setPasoActual(anteriorPaso.id);
    }
  };

  const handlePacienteSeleccionado = (paciente: PacienteConSeguro) => {
    setPacienteSeleccionado(paciente);
    // Avanzar automáticamente al siguiente paso
    setTimeout(() => {
      setPasoActual('seleccion-tratamientos');
    }, 500);
  };

  const handleTratamientoToggle = (tratamientoId: string) => {
    setTratamientosSeleccionados((prev) =>
      prev.includes(tratamientoId)
        ? prev.filter((id) => id !== tratamientoId)
        : [...prev, tratamientoId]
    );
  };

  const handleSeleccionarTodos = () => {
    setTratamientosSeleccionados(tratamientosPendientes.map((t) => t._id));
  };

  const handleDeseleccionarTodos = () => {
    setTratamientosSeleccionados([]);
  };

  const handleCoberturaVerificada = (detalles: DetalleCobertura[]) => {
    setDetallesCobertura(detalles);
  };

  const handlePrefacturaGenerada = (pref: PrefacturaMutua) => {
    setPrefactura(pref);
  };

  const handleFacturaConfirmada = (factura: FacturaMutuaConfirmada) => {
    if (onCompletado) {
      onCompletado(factura);
    }
  };

  const tratamientosSeleccionadosData = tratamientosPendientes.filter((t) =>
    tratamientosSeleccionados.includes(t._id)
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Barra de progreso */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          {PASOS.map((paso, index) => {
            const estaCompletado = index < pasoActualIndex;
            const esActual = index === pasoActualIndex;
            const puedeAcceder = index <= pasoActualIndex;

            return (
              <div key={paso.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => puedeAcceder && setPasoActual(paso.id)}
                    disabled={!puedeAcceder}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      estaCompletado
                        ? 'bg-green-500 border-green-500 text-white'
                        : esActual
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    } ${puedeAcceder && !esActual ? 'hover:border-blue-400 cursor-pointer' : ''}`}
                  >
                    {estaCompletado ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </button>
                  <div className="mt-2 text-center max-w-[120px]">
                    <div
                      className={`text-xs font-medium ${
                        esActual ? 'text-blue-600' : estaCompletado ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {paso.titulo}
                    </div>
                  </div>
                </div>
                {index < PASOS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < pasoActualIndex ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="p-6">
        {pasoActual === 'seleccion-paciente' && (
          <PasoSeleccionPaciente
            pacienteSeleccionado={pacienteSeleccionado}
            onPacienteSeleccionado={handlePacienteSeleccionado}
          />
        )}

        {pasoActual === 'seleccion-tratamientos' && pacienteSeleccionado && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Paso 2: Seleccionar Tratamientos</h3>
              <p className="text-gray-600 text-sm">
                Selecciona los tratamientos realizados que deseas incluir en esta factura.
              </p>
            </div>
            <ListaTratamientosFacturables
              tratamientos={tratamientosPendientes}
              tratamientosSeleccionados={tratamientosSeleccionados}
              onTratamientoToggle={handleTratamientoToggle}
              onSeleccionarTodos={handleSeleccionarTodos}
              onDeseleccionarTodos={handleDeseleccionarTodos}
              loading={loadingTratamientos}
            />
          </div>
        )}

        {pasoActual === 'verificacion-cobertura' && pacienteSeleccionado && (
          <PasoVerificacionCobertura
            pacienteId={pacienteSeleccionado._id}
            mutuaId={pacienteSeleccionado.poliza.mutuaId}
            tratamientosSeleccionados={tratamientosSeleccionadosData}
            onCoberturaVerificada={handleCoberturaVerificada}
          />
        )}

        {pasoActual === 'generacion-prefactura' && pacienteSeleccionado && (
          <PasoGeneracionPrefactura
            pacienteId={pacienteSeleccionado._id}
            mutuaId={pacienteSeleccionado.poliza.mutuaId}
            tratamientosSeleccionados={tratamientosSeleccionadosData}
            detallesCobertura={detallesCobertura}
            onPrefacturaGenerada={handlePrefacturaGenerada}
          />
        )}

        {pasoActual === 'resumen-envio' && prefactura && (
          <PasoResumenYEnvio
            prefactura={prefactura}
            onFacturaConfirmada={handleFacturaConfirmada}
            onCancelar={onCancelar}
          />
        )}
      </div>

      {/* Botones de navegación */}
      {pasoActual !== 'resumen-envio' && (
        <div className="border-t border-gray-200 p-6 flex items-center justify-between">
          <div>
            {onCancelar && (
              <button
                onClick={onCancelar}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {puedeRetroceder() && (
              <button
                onClick={handleAnterior}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
            )}
            {puedeAvanzar() && (
              <button
                onClick={handleSiguiente}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


