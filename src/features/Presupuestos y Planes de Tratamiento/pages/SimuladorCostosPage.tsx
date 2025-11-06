import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Calculator, Save, RefreshCw, FileText } from 'lucide-react';
import { useSimuladorState } from '../hooks/useSimuladorState';
import {
  obtenerTratamientos,
  obtenerPlanesAseguradoras,
  obtenerOpcionesFinancieras,
  simularCostos,
} from '../api/simuladorApi';
import PanelSeleccionTratamientos from '../components/PanelSeleccionTratamientos';
import TratamientoSimuladoItem from '../components/TratamientoSimuladoItem';
import ResumenCostosDinamico from '../components/ResumenCostosDinamico';
import ConfiguradorFinanciero from '../components/ConfiguradorFinanciero';

interface SimuladorCostosPageProps {
  pacienteId?: string;
  onVolver?: () => void;
  onGenerarPresupuesto?: (simulacion: any) => void;
}

export default function SimuladorCostosPage({
  pacienteId,
  onVolver,
  onGenerarPresupuesto,
}: SimuladorCostosPageProps) {
  const {
    estado,
    agregarTratamiento,
    eliminarTratamiento,
    actualizarCantidadTratamiento,
    establecerPlanAseguradora,
    establecerOpcionFinanciera,
    establecerPlazoMeses,
    establecerDescuentoPorcentaje,
    establecerDescuentoFijo,
    establecerSedeId,
    establecerPacienteId,
    establecerResultadoSimulacion,
    limpiarSimulacion,
  } = useSimuladorState();

  const [tratamientos, setTratamientos] = useState<any[]>([]);
  const [planesAseguradoras, setPlanesAseguradoras] = useState<any[]>([]);
  const [opcionesFinancieras, setOpcionesFinancieras] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDatos, setLoadingDatos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      setLoadingDatos(true);
      setError(null);
      try {
        const [trats, planes, opciones] = await Promise.all([
          obtenerTratamientos(estado.sedeId || undefined),
          obtenerPlanesAseguradoras(estado.sedeId || undefined),
          obtenerOpcionesFinancieras(estado.sedeId || undefined),
        ]);
        setTratamientos(trats);
        setPlanesAseguradoras(planes);
        setOpcionesFinancieras(opciones);
      } catch (err) {
        // Usar datos falsos cuando falla la API
        const tratamientosFalsos = [
          { _id: '1', nombre: 'Limpieza dental profesional con ultrasonidos y pulido', codigo: 'LIM-001', descripcion: 'Limpieza completa con ultrasonidos, pulido y fluorización', precio_base: 60, categoria: 'Prevención' },
          { _id: '2', nombre: 'Revisión general y diagnóstico completo', codigo: 'REV-001', descripcion: 'Exploración completa, diagnóstico y plan de tratamiento', precio_base: 50, categoria: 'Diagnóstico' },
          { _id: '3', nombre: 'Radiografía panorámica digital de alta resolución', codigo: 'RAD-001', descripcion: 'Radiografía panorámica completa de la boca', precio_base: 45, categoria: 'Diagnóstico' },
          { _id: '4', nombre: 'Ortodoncia invisible (Invisalign) - Tratamiento completo', codigo: 'ORT-001', descripcion: 'Tratamiento de ortodoncia con alineadores transparentes Invisalign', precio_base: 3000, categoria: 'Ortodoncia' },
          { _id: '5', nombre: 'Estudio ortodóncico completo con análisis 3D', codigo: 'ORT-002', descripcion: 'Análisis completo para ortodoncia con planificación digital', precio_base: 150, categoria: 'Ortodoncia' },
          { _id: '6', nombre: 'Implante dental titanio grado 4 - Sistema Straumann', codigo: 'IMP-001', descripcion: 'Implante de titanio de alta calidad con superficie SLA', precio_base: 1500, categoria: 'Implantología' },
          { _id: '7', nombre: 'Corona cerámica sobre implante - Zirconio', codigo: 'COR-001', descripcion: 'Corona estética de cerámica sobre implante', precio_base: 650, categoria: 'Prostodoncia' },
          { _id: '8', nombre: 'Endodoncia molar - Tratamiento de conductos completo', codigo: 'END-001', descripcion: 'Tratamiento de conductos en muela con técnica rotatoria', precio_base: 280, categoria: 'Endodoncia' },
          { _id: '9', nombre: 'Blanqueamiento dental profesional con láser LED', codigo: 'BLA-001', descripcion: 'Blanqueamiento con láser LED de última generación (2 sesiones)', precio_base: 350, categoria: 'Estética' },
          { _id: '10', nombre: 'Carillas de porcelana de alta estética - Zirconio', codigo: 'CAR-001', descripcion: 'Carillas estéticas de porcelana de alta calidad', precio_base: 400, categoria: 'Estética' },
          { _id: '11', nombre: 'Periodoncia básica - Raspado y alisado radicular', codigo: 'PER-001', descripcion: 'Tratamiento periodontal preventivo (4 sesiones)', precio_base: 320, categoria: 'Periodoncia' },
          { _id: '12', nombre: 'Brackets metálicos autoligables - 2 arcadas', codigo: 'ORT-003', descripcion: 'Ortodoncia con brackets metálicos autoligables', precio_base: 1800, categoria: 'Ortodoncia' },
          { _id: '13', nombre: 'Prótesis parcial removible acrílica (6 piezas)', codigo: 'PRO-001', descripcion: 'Prótesis removible de 6 piezas con estructura metálica', precio_base: 850, categoria: 'Prostodoncia' },
          { _id: '14', nombre: 'Extracción quirúrgica de muela del juicio', codigo: 'EXT-001', descripcion: 'Extracción quirúrgica de cordal incluida o no incluida', precio_base: 120, categoria: 'Cirugía' },
          { _id: '15', nombre: 'Radiografía 3D (CBCT) para planificación', codigo: 'RAD-002', descripcion: 'Tomografía computarizada 3D de alta resolución', precio_base: 90, categoria: 'Diagnóstico' },
          { _id: '16', nombre: 'Brackets estéticos cerámicos - 2 arcadas', codigo: 'ORT-004', descripcion: 'Ortodoncia con brackets cerámicos discretos', precio_base: 2200, categoria: 'Ortodoncia' },
          { _id: '17', nombre: 'Carillas de composite directo (6 unidades)', codigo: 'CAR-002', descripcion: 'Carillas estéticas de composite realizadas en consulta', precio_base: 300, categoria: 'Estética' },
          { _id: '18', nombre: 'Gingivectomía estética (6 piezas)', codigo: 'PER-002', descripcion: 'Corrección estética de encías con láser', precio_base: 90, categoria: 'Periodoncia' },
          { _id: '19', nombre: 'Injerto óseo con biomaterial sintético', codigo: 'IMP-002', descripcion: 'Regeneración ósea para implantes con biomaterial', precio_base: 450, categoria: 'Implantología' },
          { _id: '20', nombre: 'Prótesis completa acrílica superior e inferior', codigo: 'PRO-002', descripcion: 'Prótesis completa removible acrílica', precio_base: 1200, categoria: 'Prostodoncia' },
          { _id: '21', nombre: 'Endodoncia premolar - Tratamiento de conductos', codigo: 'END-002', descripcion: 'Tratamiento de conductos en premolar', precio_base: 250, categoria: 'Endodoncia' },
          { _id: '22', nombre: 'Sellado de fisuras (2 piezas) - Prevención', codigo: 'PREV-001', descripcion: 'Prevención de caries con selladores de fisuras', precio_base: 40, categoria: 'Prevención' },
          { _id: '23', nombre: 'Obturación composite estética (1 pieza)', codigo: 'RES-001', descripcion: 'Empaste estético de composite de alta calidad', precio_base: 95, categoria: 'Restauración' },
          { _id: '24', nombre: 'Cirugía periodontal (4 cuadrantes)', codigo: 'PER-003', descripcion: 'Cirugía para tratar periodontitis avanzada', precio_base: 300, categoria: 'Periodoncia' },
          { _id: '25', nombre: 'Retenedores fijos y removibles post-ortodoncia', codigo: 'ORT-005', descripcion: 'Mantenimiento post-ortodoncia con retenedores', precio_base: 350, categoria: 'Ortodoncia' },
          { _id: '26', nombre: 'Fluorización tópica con barniz de flúor', codigo: 'PREV-002', descripcion: 'Aplicación de flúor tópico para prevención', precio_base: 25, categoria: 'Prevención' },
          { _id: '27', nombre: 'Reconstrucción con composite de alta resistencia', codigo: 'RES-002', descripcion: 'Reconstrucción dental con composite', precio_base: 95, categoria: 'Restauración' },
          { _id: '28', nombre: 'Radiografía periapical digital', codigo: 'RAD-003', descripcion: 'Radiografía periapical de alta resolución', precio_base: 25, categoria: 'Diagnóstico' },
          { _id: '29', nombre: 'Injerto de encía (2 zonas)', codigo: 'PER-004', descripcion: 'Injerto de encía para corrección estética', precio_base: 400, categoria: 'Periodoncia' },
          { _id: '30', nombre: 'Prótesis provisional acrílica', codigo: 'PRO-003', descripcion: 'Prótesis provisional durante tratamiento', precio_base: 120, categoria: 'Prostodoncia' },
        ];
        
        const planesFalsos = [
          {
            _id: '1',
            nombre_aseguradora: 'Sanitas Dental',
            nombre_plan: 'Plan Premium',
            coberturas: [
              { tratamientoId: '1', porcentaje_cobertura: 80, monto_maximo: 50 },
              { tratamientoId: '2', porcentaje_cobertura: 70, monto_maximo: 35 },
              { tratamientoId: '3', porcentaje_cobertura: 90, monto_maximo: 40 },
              { tratamientoId: '8', porcentaje_cobertura: 60, monto_maximo: 168 },
              { tratamientoId: '23', porcentaje_cobertura: 50, monto_maximo: 47 },
              { tratamientoId: '11', porcentaje_cobertura: 55, monto_maximo: 176 },
              { tratamientoId: '22', porcentaje_cobertura: 100, monto_maximo: 40 },
            ],
            deducible: 50,
          },
          {
            _id: '2',
            nombre_aseguradora: 'Adeslas Dental',
            nombre_plan: 'Plan Completo',
            coberturas: [
              { tratamientoId: '4', porcentaje_cobertura: 50, monto_maximo: 1500 },
              { tratamientoId: '6', porcentaje_cobertura: 40, monto_maximo: 600 },
              { tratamientoId: '7', porcentaje_cobertura: 35, monto_maximo: 227 },
              { tratamientoId: '12', porcentaje_cobertura: 30, monto_maximo: 540 },
              { tratamientoId: '16', porcentaje_cobertura: 35, monto_maximo: 770 },
              { tratamientoId: '19', porcentaje_cobertura: 30, monto_maximo: 135 },
            ],
            deducible: 100,
          },
          {
            _id: '3',
            nombre_aseguradora: 'DKV Seguros',
            nombre_plan: 'Plan Básico',
            coberturas: [
              { tratamientoId: '1', porcentaje_cobertura: 60, monto_maximo: 36 },
              { tratamientoId: '8', porcentaje_cobertura: 50, monto_maximo: 140 },
              { tratamientoId: '11', porcentaje_cobertura: 40, monto_maximo: 128 },
              { tratamientoId: '21', porcentaje_cobertura: 45, monto_maximo: 112 },
              { tratamientoId: '23', porcentaje_cobertura: 40, monto_maximo: 38 },
            ],
            deducible: 30,
          },
          {
            _id: '4',
            nombre_aseguradora: 'Mapfre Salud',
            nombre_plan: 'Plan Estándar',
            coberturas: [
              { tratamientoId: '1', porcentaje_cobertura: 70, monto_maximo: 42 },
              { tratamientoId: '2', porcentaje_cobertura: 60, monto_maximo: 30 },
              { tratamientoId: '9', porcentaje_cobertura: 40, monto_maximo: 140 },
              { tratamientoId: '23', porcentaje_cobertura: 45, monto_maximo: 42 },
              { tratamientoId: '17', porcentaje_cobertura: 35, monto_maximo: 105 },
              { tratamientoId: '26', porcentaje_cobertura: 100, monto_maximo: 25 },
            ],
            deducible: 40,
          },
          {
            _id: '5',
            nombre_aseguradora: 'Asisa Dental',
            nombre_plan: 'Plan Avanzado',
            coberturas: [
              { tratamientoId: '4', porcentaje_cobertura: 45, monto_maximo: 1350 },
              { tratamientoId: '6', porcentaje_cobertura: 35, monto_maximo: 525 },
              { tratamientoId: '12', porcentaje_cobertura: 25, monto_maximo: 450 },
              { tratamientoId: '16', porcentaje_cobertura: 30, monto_maximo: 660 },
              { tratamientoId: '7', porcentaje_cobertura: 30, monto_maximo: 195 },
              { tratamientoId: '25', porcentaje_cobertura: 25, monto_maximo: 87 },
            ],
            deducible: 80,
          },
          {
            _id: '6',
            nombre_aseguradora: 'AXA Dental',
            nombre_plan: 'Plan Premium Plus',
            coberturas: [
              { tratamientoId: '4', porcentaje_cobertura: 55, monto_maximo: 1650 },
              { tratamientoId: '6', porcentaje_cobertura: 45, monto_maximo: 675 },
              { tratamientoId: '9', porcentaje_cobertura: 50, monto_maximo: 175 },
              { tratamientoId: '10', porcentaje_cobertura: 40, monto_maximo: 160 },
              { tratamientoId: '12', porcentaje_cobertura: 35, monto_maximo: 630 },
            ],
            deducible: 75,
          },
        ];
        
        const opcionesFalsas = [
          {
            _id: '1',
            nombre: 'Financiación 12 meses',
            entidad: 'Santander Consumer',
            plazos_meses: [6, 12, 18, 24],
            tasa_interes: 0,
            comision_apertura: 0,
          },
          {
            _id: '2',
            nombre: 'Financiación 24 meses',
            entidad: 'BBVA Financiación',
            plazos_meses: [12, 18, 24, 36],
            tasa_interes: 5.9,
            comision_apertura: 50,
          },
          {
            _id: '3',
            nombre: 'Financiación 36 meses',
            entidad: 'CaixaBank',
            plazos_meses: [24, 36, 48],
            tasa_interes: 7.5,
            comision_apertura: 100,
          },
          {
            _id: '4',
            nombre: 'Financiación 6 meses',
            entidad: 'Medicina Financiera',
            plazos_meses: [3, 6, 9],
            tasa_interes: 0,
            comision_apertura: 0,
          },
          {
            _id: '5',
            nombre: 'Financiación 48 meses',
            entidad: 'Cofidis',
            plazos_meses: [36, 48, 60],
            tasa_interes: 8.9,
            comision_apertura: 150,
          },
          {
            _id: '6',
            nombre: 'Pago diferido sin intereses',
            entidad: 'Clínica Dental',
            plazos_meses: [3, 6, 9, 12],
            tasa_interes: 0,
            comision_apertura: 0,
          },
        ];
        
        setTratamientos(tratamientosFalsos);
        setPlanesAseguradoras(planesFalsos);
        setOpcionesFinancieras(opcionesFalsas);
      } finally {
        setLoadingDatos(false);
      }
    };

    cargarDatos();
  }, [estado.sedeId]);

  // Establecer pacienteId si se proporciona
  useEffect(() => {
    if (pacienteId) {
      establecerPacienteId(pacienteId);
    }
  }, [pacienteId, establecerPacienteId]);

  // Simular costos cuando cambia el estado
  const realizarSimulacion = useCallback(async () => {
    if (estado.tratamientosSeleccionados.length === 0) {
      establecerResultadoSimulacion(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request = {
        tratamientos: estado.tratamientosSeleccionados.map((t) => ({
          tratamientoId: t.tratamiento._id,
          cantidad: t.cantidad,
        })),
        aseguradoraPlanId: estado.planAseguradoraSeleccionado?._id,
        descuentoPorcentaje: estado.descuentoPorcentaje,
        descuentoFijo: estado.descuentoFijo,
        sedeId: estado.sedeId || undefined,
      };

      const resultado = await simularCostos(request);
      establecerResultadoSimulacion(resultado);
    } catch (err) {
      // Simular resultado cuando falla la API
      const subtotal = estado.tratamientosSeleccionados.reduce((sum, t) => sum + (t.tratamiento.precio_base * t.cantidad), 0);
      const descuentoPorcentaje = (subtotal * estado.descuentoPorcentaje) / 100;
      const descuentoTotal = descuentoPorcentaje + estado.descuentoFijo;
      const totalAntesCobertura = subtotal - descuentoTotal;
      
      let montoCubierto = 0;
      const detalleCoberturas: any[] = [];
      
      if (estado.planAseguradoraSeleccionado) {
        estado.tratamientosSeleccionados.forEach((t) => {
          const cobertura = estado.planAseguradoraSeleccionado?.coberturas.find(
            c => c.tratamientoId === t.tratamiento._id
          );
          if (cobertura) {
            const precioTratamiento = t.tratamiento.precio_base * t.cantidad;
            const montoCubiertoTratamiento = Math.min(
              (precioTratamiento * cobertura.porcentaje_cobertura) / 100,
              cobertura.monto_maximo || precioTratamiento
            );
            montoCubierto += montoCubiertoTratamiento;
            detalleCoberturas.push({
              tratamientoId: t.tratamiento._id,
              tratamientoNombre: t.tratamiento.nombre,
              precioBase: precioTratamiento,
              porcentajeCobertura: cobertura.porcentaje_cobertura,
              montoCubierto: montoCubiertoTratamiento,
              montoPaciente: precioTratamiento - montoCubiertoTratamiento,
            });
          }
        });
      }
      
      const totalPaciente = Math.max(0, totalAntesCobertura - montoCubierto);
      
      const resultadoSimulado = {
        subtotal,
        totalDescuentos: descuentoTotal,
        montoCubiertoAseguradora: montoCubierto,
        totalPaciente,
        detalleCoberturas,
      };
      
      establecerResultadoSimulacion(resultadoSimulado);
    } finally {
      setLoading(false);
    }
  }, [
    estado.tratamientosSeleccionados,
    estado.planAseguradoraSeleccionado,
    estado.descuentoPorcentaje,
    estado.descuentoFijo,
    estado.sedeId,
    establecerResultadoSimulacion,
  ]);

  // Efecto para simular cuando cambia el estado
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      realizarSimulacion();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [
    estado.tratamientosSeleccionados,
    estado.planAseguradoraSeleccionado,
    estado.descuentoPorcentaje,
    estado.descuentoFijo,
    realizarSimulacion,
  ]);

  const handleGenerarPresupuesto = () => {
    if (!estado.resultadoSimulacion) {
      alert('No hay simulación para generar presupuesto');
      return;
    }

    if (onGenerarPresupuesto) {
      onGenerarPresupuesto({
        tratamientos: estado.tratamientosSeleccionados,
        planAseguradora: estado.planAseguradoraSeleccionado,
        opcionFinanciera: estado.opcionFinancieraSeleccionada,
        plazoMeses: estado.plazoMesesSeleccionado,
        descuentoPorcentaje: estado.descuentoPorcentaje,
        descuentoFijo: estado.descuentoFijo,
        resultado: estado.resultadoSimulacion,
        pacienteId: estado.pacienteId,
      });
    } else {
      alert('Funcionalidad de generar presupuesto no implementada');
    }
  };

  const handleLimpiar = () => {
    if (window.confirm('¿Está seguro de que desea limpiar la simulación? Se perderán todos los datos.')) {
      limpiarSimulacion();
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onVolver && (
              <button
                onClick={onVolver}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                <Calculator className="w-8 h-8 text-blue-600" />
                <span>Simulador de Costos</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Crea y compara diferentes escenarios financieros para planes de tratamiento
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLimpiar}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Limpiar</span>
            </button>
            <button
              onClick={handleGenerarPresupuesto}
              disabled={!estado.resultadoSimulacion || loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-5 h-5" />
              <span>Generar Presupuesto</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: Panel de selección de tratamientos */}
          <div className="lg:col-span-1">
            <PanelSeleccionTratamientos
              tratamientos={tratamientos}
              tratamientosSeleccionados={estado.tratamientosSeleccionados}
              onAgregarTratamiento={agregarTratamiento}
              loading={loadingDatos}
            />
          </div>

          {/* Columna central: Tratamientos seleccionados */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Tratamientos Seleccionados ({estado.tratamientosSeleccionados.length})
              </h3>
              {estado.tratamientosSeleccionados.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay tratamientos seleccionados</p>
                  <p className="text-sm mt-2">Selecciona tratamientos del panel izquierdo</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {estado.tratamientosSeleccionados.map((tratamientoSimulado) => (
                    <TratamientoSimuladoItem
                      key={tratamientoSimulado.tratamiento._id}
                      tratamientoSimulado={tratamientoSimulado}
                      onEliminar={eliminarTratamiento}
                      onActualizarCantidad={actualizarCantidadTratamiento}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Configurador Financiero */}
            <ConfiguradorFinanciero
              planesAseguradoras={planesAseguradoras}
              opcionesFinancieras={opcionesFinancieras}
              planSeleccionado={estado.planAseguradoraSeleccionado}
              opcionFinancieraSeleccionada={estado.opcionFinancieraSeleccionada}
              plazoMesesSeleccionado={estado.plazoMesesSeleccionado}
              descuentoPorcentaje={estado.descuentoPorcentaje}
              descuentoFijo={estado.descuentoFijo}
              totalPaciente={estado.resultadoSimulacion?.totalPaciente || 0}
              onPlanAseguradoraChange={establecerPlanAseguradora}
              onOpcionFinancieraChange={establecerOpcionFinanciera}
              onPlazoMesesChange={establecerPlazoMeses}
              onDescuentoPorcentajeChange={establecerDescuentoPorcentaje}
              onDescuentoFijoChange={establecerDescuentoFijo}
              loading={loading}
            />
          </div>

          {/* Columna derecha: Resumen de costos */}
          <div className="lg:col-span-1">
            <ResumenCostosDinamico
              resultado={estado.resultadoSimulacion}
              totalTratamientos={estado.tratamientosSeleccionados.length}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


