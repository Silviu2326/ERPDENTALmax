import { useState } from 'react';
import { Calendar, RefreshCw, ArrowLeft } from 'lucide-react';
import {
  Cita,
  FiltrosReprogramacion,
  filtrarCitas,
  reprogramarCitasMasivo,
  DatosReprogramacion,
  ResultadoReprogramacion,
} from '../api/citasApi';
import FiltroCitasReprogramar from '../components/FiltroCitasReprogramar';
import TablaResultadosCitas from '../components/TablaResultadosCitas';
import ModalConfirmacionReprogramacion from '../components/ModalConfirmacionReprogramacion';
import ResumenCambiosReprogramacion from '../components/ResumenCambiosReprogramacion';

export default function ReprogramacionMasivaPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [citasSeleccionadas, setCitasSeleccionadas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoReprogramacion | null>(null);

  // Inicializar filtros con rango por defecto (próximos 7 días)
  const ahora = new Date();
  const fechaInicioDefault = new Date(ahora);
  fechaInicioDefault.setHours(0, 0, 0, 0);
  const fechaFinDefault = new Date(ahora);
  fechaFinDefault.setDate(fechaFinDefault.getDate() + 7);
  fechaFinDefault.setHours(23, 59, 59, 999);

  const [filtros, setFiltros] = useState<FiltrosReprogramacion>({
    fechaInicio: fechaInicioDefault.toISOString(),
    fechaFin: fechaFinDefault.toISOString(),
  });

  const [datosReprogramacion, setDatosReprogramacion] = useState<DatosReprogramacion>({
    citasIds: [],
    modoReprogramacion: 'mover_dias',
    valor: 7,
    notificarPacientes: true,
    motivo: '',
  });

  const handleBuscar = async () => {
    setLoading(true);
    setError(null);
    setCitasSeleccionadas([]);
    setResultado(null);

    try {
      // Simular delay de búsqueda
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Generar datos mock de citas para reprogramación
      const resultadosMock: Cita[] = [];
      const ahora = new Date();
      const fechaInicioFiltro = new Date(filtros.fechaInicio);
      const fechaFinFiltro = new Date(filtros.fechaFin);
      
      // Generar citas en el rango de fechas (más citas)
      for (let i = 0; i < 45; i++) {
        const fechaBase = new Date(fechaInicioFiltro);
        fechaBase.setDate(fechaBase.getDate() + Math.floor(i / 5));
        const horaInicio = 8 + (i % 11); // Entre 8:00 y 18:00
        const minutoInicio = (i % 3) * 15; // 00, 15, 30
        fechaBase.setHours(horaInicio, minutoInicio, 0, 0);
        
        if (fechaBase > fechaFinFiltro) break;
        
        const fechaFin = new Date(fechaBase);
        const duracion = [30, 45, 60, 90, 120][i % 5];
        fechaFin.setMinutes(fechaFin.getMinutes() + duracion);
        
        const pacientesMock = [
          { _id: '1', nombre: 'Ana', apellidos: 'Martínez' },
          { _id: '2', nombre: 'Pedro', apellidos: 'Sánchez' },
          { _id: '3', nombre: 'Laura', apellidos: 'Rodríguez' },
          { _id: '4', nombre: 'Miguel', apellidos: 'Torres' },
          { _id: '5', nombre: 'Sofía', apellidos: 'López' },
          { _id: '6', nombre: 'Diego', apellidos: 'Morales' },
          { _id: '7', nombre: 'Elena', apellidos: 'Jiménez' },
          { _id: '8', nombre: 'Javier', apellidos: 'Hernández' },
          { _id: '9', nombre: 'Isabel', apellidos: 'Díaz' },
          { _id: '10', nombre: 'Fernando', apellidos: 'Moreno' },
          { _id: '11', nombre: 'Lucía', apellidos: 'Álvarez' },
          { _id: '12', nombre: 'Pablo', apellidos: 'Romero' },
        ];
        
        const profesionalesMock = [
          { _id: '1', nombre: 'Juan', apellidos: 'Pérez' },
          { _id: '2', nombre: 'María', apellidos: 'García' },
          { _id: '3', nombre: 'Carlos', apellidos: 'López' },
          { _id: '4', nombre: 'Ana', apellidos: 'Fernández' },
          { _id: '5', nombre: 'Roberto', apellidos: 'Martínez' },
          { _id: '6', nombre: 'Carmen', apellidos: 'Sánchez' },
        ];
        
        const sedesMock = [
          { _id: '1', nombre: 'Sede Central' },
          { _id: '2', nombre: 'Sede Norte' },
          { _id: '3', nombre: 'Sede Sur' },
          { _id: '4', nombre: 'Sede Este' },
        ];
        
        const tratamientosMock = [
          { _id: '1', nombre: 'Limpieza dental' },
          { _id: '2', nombre: 'Revisión general' },
          { _id: '3', nombre: 'Ortodoncia' },
          { _id: '4', nombre: 'Endodoncia' },
          { _id: '5', nombre: 'Implante dental' },
          { _id: '6', nombre: 'Blanqueamiento' },
          { _id: '7', nombre: 'Periodoncia' },
          { _id: '8', nombre: 'Prótesis' },
        ];
        
        const paciente = pacientesMock[i % pacientesMock.length];
        const profesional = profesionalesMock[i % profesionalesMock.length];
        const sede = sedesMock[i % sedesMock.length];
        const tratamiento = tratamientosMock[i % tratamientosMock.length];
        
        // Aplicar filtros
        if (filtros.profesionalId && profesional._id !== filtros.profesionalId) continue;
        if (filtros.sedeId && sede._id !== filtros.sedeId) continue;
        if (filtros.estado) {
          const estados = ['programada', 'confirmada', 'cancelada', 'realizada', 'no-asistio'];
          if (estados[i % estados.length] !== filtros.estado) continue;
        }
        
        resultadosMock.push({
          _id: `cita-reprog-${i}`,
          paciente,
          profesional,
          sede,
          fecha_hora_inicio: fechaBase.toISOString(),
          fecha_hora_fin: fechaFin.toISOString(),
          duracion_minutos: duracion,
          estado: (['programada', 'confirmada', 'cancelada', 'realizada', 'no-asistio'] as const)[i % 5],
          tratamiento,
          notas: i % 3 === 0 ? ['Requiere reprogramación', 'Paciente solicitó cambio', 'Conflicto de horario', 'Reagendar por urgencia', ''][i % 5] : '',
          box_asignado: ((i % 8) + 1).toString(),
          creadoPor: { _id: '1', nombre: 'Admin' },
          historial_cambios: [
            {
              fecha: new Date(fechaBase.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              usuario: 'Recepcionista',
              cambio: 'Cita creada',
            },
          ],
        });
      }
      
      setCitas(resultadosMock);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar las citas');
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarCita = (citaId: string) => {
    setCitasSeleccionadas((prev) => {
      if (prev.includes(citaId)) {
        return prev.filter((id) => id !== citaId);
      } else {
        return [...prev, citaId];
      }
    });
  };

  const handleSeleccionarTodas = () => {
    if (citasSeleccionadas.length === citas.length) {
      setCitasSeleccionadas([]);
    } else {
      setCitasSeleccionadas(citas.map((cita) => cita._id || '').filter(Boolean));
    }
  };

  const handleAbrirModal = () => {
    setDatosReprogramacion({
      ...datosReprogramacion,
      citasIds: citasSeleccionadas,
    });
    setMostrarModal(true);
    setResultado(null);
  };

  const handleConfirmarReprogramacion = async () => {
    if (!datosReprogramacion.motivo.trim()) {
      setError('El motivo es obligatorio');
      return;
    }

    setProcesando(true);
    setError(null);

    try {
      // Simular delay de reprogramación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular resultado de reprogramación
      const resultadoMock: ResultadoReprogramacion = {
        success: true,
        actualizadas: datosReprogramacion.citasIds.length - 1, // Simular que una falló
        errores: 1,
        detallesErrores: [
          {
            citaId: datosReprogramacion.citasIds[0] || 'unknown',
            motivo: 'Conflicto de horario con otra cita',
          },
        ],
      };
      
      setResultado(resultadoMock);

      // Si la reprogramación fue exitosa, actualizar la lista de citas
      if (resultadoMock.success) {
        // Recargar las citas después de un breve delay
        setTimeout(() => {
          handleBuscar();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reprogramar las citas');
      setResultado({
        success: false,
        actualizadas: 0,
        errores: citasSeleccionadas.length,
        detallesErrores: [
          {
            citaId: 'unknown',
            motivo: err instanceof Error ? err.message : 'Error desconocido',
          },
        ],
      });
    } finally {
      setProcesando(false);
    }
  };

  const handleCerrarModal = () => {
    if (!procesando) {
      setMostrarModal(false);
      setResultado(null);
      if (resultado?.success) {
        setCitasSeleccionadas([]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-4"
              >
                <ArrowLeft size={20} />
              </button>
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Calendar size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Reprogramación Masiva de Citas
                </h1>
                <p className="text-gray-600">
                  Selecciona y reprograma múltiples citas en bloque
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Filtros */}
          <FiltroCitasReprogramar
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onBuscar={handleBuscar}
            loading={loading}
          />

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Resultados */}
          {citas.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Citas encontradas ({citas.length})
                </h2>
                {citasSeleccionadas.length > 0 && (
                  <button
                    onClick={handleAbrirModal}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium"
                  >
                    <RefreshCw size={20} />
                    <span>Reprogramar {citasSeleccionadas.length} citas</span>
                  </button>
                )}
              </div>
              <TablaResultadosCitas
                citas={citas}
                citasSeleccionadas={citasSeleccionadas}
                onSeleccionarCita={handleSeleccionarCita}
                onSeleccionarTodas={handleSeleccionarTodas}
                loading={loading}
              />
            </div>
          )}

          {/* Resumen de resultado */}
          {resultado && !mostrarModal && (
            <ResumenCambiosReprogramacion resultado={resultado} />
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacionReprogramacion
        mostrar={mostrarModal}
        onCerrar={handleCerrarModal}
        onConfirmar={handleConfirmarReprogramacion}
        datos={datosReprogramacion}
        onDatosChange={setDatosReprogramacion}
        cantidadCitas={citasSeleccionadas.length}
        loading={procesando}
        resultado={resultado}
      />
    </div>
  );
}

