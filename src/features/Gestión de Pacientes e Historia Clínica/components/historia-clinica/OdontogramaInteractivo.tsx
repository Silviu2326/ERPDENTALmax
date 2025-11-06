import { useState, useEffect } from 'react';
import { Tooth, RefreshCw } from 'lucide-react';
import {
  obtenerOdontograma,
  agregarHallazgo,
  actualizarHallazgo,
  eliminarHallazgo,
  Hallazgo,
  NuevoHallazgo,
  ActualizarHallazgo,
} from '../../api/odontogramaApi';
import DienteComponent from '../Odontograma/DienteComponent';
import ModalAgregarTratamiento from '../Odontograma/ModalAgregarTratamiento';
import PanelLeyenda from '../Odontograma/PanelLeyenda';
import BotoneraEstadoTratamiento from '../Odontograma/BotoneraEstadoTratamiento';
import ModalHistorialDiente from '../Odontograma/ModalHistorialDiente';

interface OdontogramaInteractivoProps {
  pacienteId: string;
}

// Configuración de dientes permanentes (32 dientes)
const DIENTES_PERMANENTES = [
  // Superior derecho
  { numero: 18, nombre: 'M3 Superior Derecho' },
  { numero: 17, nombre: 'M2 Superior Derecho' },
  { numero: 16, nombre: 'M1 Superior Derecho' },
  { numero: 15, nombre: 'PM2 Superior Derecho' },
  { numero: 14, nombre: 'PM1 Superior Derecho' },
  { numero: 13, nombre: 'C Superior Derecho' },
  { numero: 12, nombre: 'I2 Superior Derecho' },
  { numero: 11, nombre: 'I1 Superior Derecho' },
  // Superior izquierdo
  { numero: 21, nombre: 'I1 Superior Izquierdo' },
  { numero: 22, nombre: 'I2 Superior Izquierdo' },
  { numero: 23, nombre: 'C Superior Izquierdo' },
  { numero: 24, nombre: 'PM1 Superior Izquierdo' },
  { numero: 25, nombre: 'PM2 Superior Izquierdo' },
  { numero: 26, nombre: 'M1 Superior Izquierdo' },
  { numero: 27, nombre: 'M2 Superior Izquierdo' },
  { numero: 28, nombre: 'M3 Superior Izquierdo' },
  // Inferior izquierdo
  { numero: 38, nombre: 'M3 Inferior Izquierdo' },
  { numero: 37, nombre: 'M2 Inferior Izquierdo' },
  { numero: 36, nombre: 'M1 Inferior Izquierdo' },
  { numero: 35, nombre: 'PM2 Inferior Izquierdo' },
  { numero: 34, nombre: 'PM1 Inferior Izquierdo' },
  { numero: 33, nombre: 'C Inferior Izquierdo' },
  { numero: 32, nombre: 'I2 Inferior Izquierdo' },
  { numero: 31, nombre: 'I1 Inferior Izquierdo' },
  // Inferior derecho
  { numero: 41, nombre: 'I1 Inferior Derecho' },
  { numero: 42, nombre: 'I2 Inferior Derecho' },
  { numero: 43, nombre: 'C Inferior Derecho' },
  { numero: 44, nombre: 'PM1 Inferior Derecho' },
  { numero: 45, nombre: 'PM2 Inferior Derecho' },
  { numero: 46, nombre: 'M1 Inferior Derecho' },
  { numero: 47, nombre: 'M2 Inferior Derecho' },
  { numero: 48, nombre: 'M3 Inferior Derecho' },
];

export default function OdontogramaInteractivo({ pacienteId }: OdontogramaInteractivoProps) {
  const [hallazgos, setHallazgos] = useState<Hallazgo[]>([]);
  const [dienteSeleccionado, setDienteSeleccionado] = useState<number | null>(null);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalHistorial, setShowModalHistorial] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(
    null
  );

  const cargarOdontograma = async () => {
    setLoading(true);
    setError(null);
    try {
      const odontograma = await obtenerOdontograma(pacienteId);
      setHallazgos(odontograma.hallazgos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el odontograma');
      setHallazgos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOdontograma();
  }, [pacienteId]);

  const getHallazgosPorDiente = (dienteId: number): Hallazgo[] => {
    return hallazgos.filter((h) => h.dienteId === dienteId);
  };

  const handleDienteClick = (numero: number) => {
    setDienteSeleccionado(numero);
    setShowModalAgregar(true);
  };

  const handleAgregarHallazgo = async (nuevoHallazgo: NuevoHallazgo) => {
    try {
      const hallazgoCreado = await agregarHallazgo(pacienteId, nuevoHallazgo);
      setHallazgos((prev) => [...prev, hallazgoCreado]);
      setMensaje({ tipo: 'success', texto: 'Hallazgo registrado correctamente' });
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err instanceof Error ? err.message : 'Error al registrar el hallazgo',
      });
      setTimeout(() => setMensaje(null), 5000);
    }
  };

  const handleActualizarHallazgo = async (hallazgoId: string, datos: ActualizarHallazgo) => {
    try {
      const hallazgoActualizado = await actualizarHallazgo(pacienteId, hallazgoId, datos);
      setHallazgos((prev) =>
        prev.map((h) => (h._id === hallazgoId ? hallazgoActualizado : h))
      );
      setMensaje({ tipo: 'success', texto: 'Hallazgo actualizado correctamente' });
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err instanceof Error ? err.message : 'Error al actualizar el hallazgo',
      });
      setTimeout(() => setMensaje(null), 5000);
    }
  };

  const handleEliminarHallazgo = async (hallazgoId: string) => {
    if (!confirm('¿Estás seguro de eliminar este hallazgo?')) return;

    try {
      await eliminarHallazgo(pacienteId, hallazgoId);
      setHallazgos((prev) => prev.filter((h) => h._id !== hallazgoId));
      setMensaje({ tipo: 'success', texto: 'Hallazgo eliminado correctamente' });
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err instanceof Error ? err.message : 'Error al eliminar el hallazgo',
      });
      setTimeout(() => setMensaje(null), 5000);
    }
  };

  const handleVerHistorial = (dienteId: number) => {
    setDienteSeleccionado(dienteId);
    setShowModalHistorial(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-3 text-gray-600">Cargando odontograma...</span>
      </div>
    );
  }

  // Calcular estadísticas del odontograma
  const totalHallazgos = hallazgos.length;
  const hallazgosRealizados = hallazgos.filter(h => h.estado === 'realizado').length;
  const hallazgosPlanificados = hallazgos.filter(h => h.estado === 'planificado').length;
  const hallazgosDiagnostico = hallazgos.filter(h => h.estado === 'diagnostico').length;
  const hallazgosEnProgreso = hallazgos.filter(h => h.estado === 'en_progreso').length;
  const dientesAfectados = new Set(hallazgos.map(h => h.dienteId)).size;
  const porcentajeCompletado = totalHallazgos > 0 ? Math.round((hallazgosRealizados / totalHallazgos) * 100) : 0;
  
  // Estadísticas por tipo de tratamiento
  const tratamientosPorTipo = hallazgos.reduce((acc, h) => {
    const tipo = h.codigoTratamiento.substring(0, 1);
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Tooth className="w-5 h-5 text-blue-600" />
          Odontograma Interactivo
        </h3>
        <button
          onClick={cargarOdontograma}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Estadísticas del odontograma */}
      {totalHallazgos > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Hallazgos</p>
                <p className="text-2xl font-bold text-blue-600">{totalHallazgos}</p>
              </div>
              <Tooth className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-green-600">{hallazgosRealizados}</p>
                <p className="text-xs text-gray-500 mt-1">{porcentajeCompletado}%</p>
              </div>
              <Tooth className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Planificados</p>
                <p className="text-2xl font-bold text-yellow-600">{hallazgosPlanificados}</p>
              </div>
              <Tooth className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-purple-600">{hallazgosEnProgreso}</p>
              </div>
              <Tooth className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Diagnóstico</p>
                <p className="text-2xl font-bold text-orange-600">{hallazgosDiagnostico}</p>
              </div>
              <Tooth className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dientes Afectados</p>
                <p className="text-2xl font-bold text-indigo-600">{dientesAfectados}</p>
              </div>
              <Tooth className="w-8 h-8 text-indigo-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Barra de progreso general */}
      {totalHallazgos > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso General del Tratamiento</span>
            <span className="text-sm text-gray-600">{porcentajeCompletado}% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${porcentajeCompletado}%` }}
            ></div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {mensaje && (
        <div
          className={`px-4 py-3 rounded-lg ${
            mensaje.tipo === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Grid del Odontograma */}
      <div className="space-y-8">
        {/* Arco Superior */}
        <div>
          <div className="text-center mb-4 font-semibold text-gray-700 text-lg">Arco Superior</div>
          <div className="grid grid-cols-16 gap-3 max-w-5xl mx-auto justify-items-center">
            {/* Superior derecho (18-11) */}
            {DIENTES_PERMANENTES.slice(0, 8)
              .reverse()
              .map((diente) => (
                <DienteComponent
                  key={diente.numero}
                  numero={diente.numero}
                  nombre={diente.nombre}
                  hallazgos={getHallazgosPorDiente(diente.numero)}
                  onClick={() => handleDienteClick(diente.numero)}
                  isSelected={dienteSeleccionado === diente.numero}
                  onVerHistorial={() => handleVerHistorial(diente.numero)}
                />
              ))}
            {/* Superior izquierdo (21-28) */}
            {DIENTES_PERMANENTES.slice(8, 16).map((diente) => (
              <DienteComponent
                key={diente.numero}
                numero={diente.numero}
                nombre={diente.nombre}
                hallazgos={getHallazgosPorDiente(diente.numero)}
                onClick={() => handleDienteClick(diente.numero)}
                isSelected={dienteSeleccionado === diente.numero}
                onVerHistorial={() => handleVerHistorial(diente.numero)}
              />
            ))}
          </div>
        </div>

        {/* Arco Inferior */}
        <div>
          <div className="text-center mb-4 font-semibold text-gray-700 text-lg">Arco Inferior</div>
          <div className="grid grid-cols-16 gap-3 max-w-5xl mx-auto justify-items-center">
            {/* Inferior izquierdo (38-31) */}
            {DIENTES_PERMANENTES.slice(16, 24)
              .reverse()
              .map((diente) => (
                <DienteComponent
                  key={diente.numero}
                  numero={diente.numero}
                  nombre={diente.nombre}
                  hallazgos={getHallazgosPorDiente(diente.numero)}
                  onClick={() => handleDienteClick(diente.numero)}
                  isSelected={dienteSeleccionado === diente.numero}
                  onVerHistorial={() => handleVerHistorial(diente.numero)}
                />
              ))}
            {/* Inferior derecho (41-48) */}
            {DIENTES_PERMANENTES.slice(24, 32).map((diente) => (
              <DienteComponent
                key={diente.numero}
                numero={diente.numero}
                nombre={diente.nombre}
                hallazgos={getHallazgosPorDiente(diente.numero)}
                onClick={() => handleDienteClick(diente.numero)}
                isSelected={dienteSeleccionado === diente.numero}
                onVerHistorial={() => handleVerHistorial(diente.numero)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Panel de hallazgos del diente seleccionado */}
      {dienteSeleccionado && getHallazgosPorDiente(dienteSeleccionado).length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">
            Hallazgos - Diente {dienteSeleccionado}
          </h4>
          <div className="space-y-3">
            {getHallazgosPorDiente(dienteSeleccionado).map((hallazgo) => (
              <div
                key={hallazgo._id}
                className="bg-white rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {hallazgo.codigoTratamiento} - {hallazgo.nombreTratamiento || 'Tratamiento'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Superficies: {hallazgo.superficies.join(', ').toUpperCase()}
                    </p>
                    {hallazgo.nota && (
                      <p className="text-sm text-gray-500 mt-1 italic">"{hallazgo.nota}"</p>
                    )}
                  </div>
                </div>
                <BotoneraEstadoTratamiento
                  hallazgo={hallazgo}
                  onUpdate={(datos) => hallazgo._id && handleActualizarHallazgo(hallazgo._id, datos)}
                  onDelete={
                    hallazgo._id ? () => handleEliminarHallazgo(hallazgo._id!) : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leyenda */}
      <PanelLeyenda />

      {/* Modal para agregar tratamiento */}
      {dienteSeleccionado && showModalAgregar && (
        <ModalAgregarTratamiento
          isOpen={showModalAgregar}
          onClose={() => {
            setShowModalAgregar(false);
            setDienteSeleccionado(null);
          }}
          onSave={handleAgregarHallazgo}
          dienteId={dienteSeleccionado}
          dienteNombre={DIENTES_PERMANENTES.find((d) => d.numero === dienteSeleccionado)?.nombre || ''}
        />
      )}

      {/* Modal de historial */}
      {dienteSeleccionado && showModalHistorial && (
        <ModalHistorialDiente
          isOpen={showModalHistorial}
          onClose={() => {
            setShowModalHistorial(false);
            setDienteSeleccionado(null);
          }}
          dienteId={dienteSeleccionado}
          dienteNombre={DIENTES_PERMANENTES.find((d) => d.numero === dienteSeleccionado)?.nombre || ''}
          hallazgos={getHallazgosPorDiente(dienteSeleccionado)}
        />
      )}
    </div>
  );
}
