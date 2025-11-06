import { useState, useEffect } from 'react';
import { Plus, RefreshCw, AlertCircle, FileText, Package, TestTube, QrCode, Wrench } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  LoteEsterilizacion,
  NuevoLoteEsterilizacion,
  FiltrosLotes,
  obtenerLotesEsterilizacion,
  crearLoteEsterilizacion,
  actualizarLoteEsterilizacion,
  obtenerLotePorId,
  ActualizarLoteEsterilizacion,
} from '../api/esterilizacionApi';
import FormularioLoteEsterilizacion from '../components/FormularioLoteEsterilizacion';
import TablaLotesEsterilizacion from '../components/TablaLotesEsterilizacion';
import ModalDetalleLote from '../components/ModalDetalleLote';
import ProtocolosLimpiezaPage from './ProtocolosLimpiezaPage';
import ControlBiologicoQuimicoPage from './ControlBiologicoQuimicoPage';
import AsignacionBandejaPacientePage from './AsignacionBandejaPacientePage';
import MantenimientoAutoclavesPage from './MantenimientoAutoclavesPage';

type TabActiva = 'lotes' | 'protocolos' | 'control' | 'asignacion' | 'mantenimiento';

export default function EsterilizacionYTrazabilidadPage() {
  const [tabActiva, setTabActiva] = useState<TabActiva>('lotes');
  const { user } = useAuth();
  const [lotes, setLotes] = useState<LoteEsterilizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteEsterilizacion | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [loteEditando, setLoteEditando] = useState<LoteEsterilizacion | null>(null);
  const [filtros, setFiltros] = useState<FiltrosLotes>({
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    cargarLotes();
  }, [filtros]);

  const cargarLotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const respuesta = await obtenerLotesEsterilizacion(filtros);
      setLotes(respuesta.lotes);
    } catch (err) {
      console.error('Error al cargar lotes:', err);
      setError('Error al cargar los lotes de esterilización. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearLote = async (lote: NuevoLoteEsterilizacion) => {
    try {
      setError(null);
      await crearLoteEsterilizacion(lote);
      setMostrarFormulario(false);
      await cargarLotes();
    } catch (err: any) {
      console.error('Error al crear lote:', err);
      setError(err.message || 'Error al crear el lote de esterilización');
    }
  };

  const handleVerDetalle = async (lote: LoteEsterilizacion) => {
    try {
      // Cargar detalles completos del lote
      const loteCompleto = await obtenerLotePorId(lote._id!);
      setLoteSeleccionado(loteCompleto);
      setMostrarModalDetalle(true);
    } catch (err) {
      console.error('Error al cargar detalle del lote:', err);
      setError('Error al cargar los detalles del lote');
    }
  };

  const handleEditarLote = (lote: LoteEsterilizacion) => {
    setLoteEditando(lote);
    setMostrarFormulario(true);
  };

  const handleActualizarLote = async (datos: ActualizarLoteEsterilizacion) => {
    if (!loteEditando?._id) return;

    try {
      setError(null);
      await actualizarLoteEsterilizacion(loteEditando._id, datos);
      setMostrarFormulario(false);
      setLoteEditando(null);
      await cargarLotes();
    } catch (err: any) {
      console.error('Error al actualizar lote:', err);
      setError(err.message || 'Error al actualizar el lote de esterilización');
    }
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setLoteEditando(null);
  };

  const handleGuardarFormulario = async (lote: NuevoLoteEsterilizacion | ActualizarLoteEsterilizacion) => {
    if (loteEditando) {
      // En modo edición, convertir a ActualizarLoteEsterilizacion
      const datosActualizacion: ActualizarLoteEsterilizacion = {
        estado: 'en_proceso', // Mantener el estado actual por defecto
        ...lote as NuevoLoteEsterilizacion,
      };
      await handleActualizarLote(datosActualizacion);
    } else {
      // En modo creación
      await handleCrearLote(lote as NuevoLoteEsterilizacion);
    }
  };

  if (mostrarFormulario) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <FormularioLoteEsterilizacion
          onGuardar={handleGuardarFormulario as (lote: NuevoLoteEsterilizacion) => void}
          onCancelar={handleCancelarFormulario}
          sedeId={user?.sedeId}
          operadorId={user?._id}
          modoEdicion={!!loteEditando}
          loteInicial={loteEditando ? {
            autoclaveId: loteEditando.autoclave._id,
            paquetes: loteEditando.paquetes.map(p => ({ contenido: p.contenido })),
            notas: loteEditando.notas,
          } : undefined}
        />
      </div>
    );
  }

  // Si estamos en la pestaña de protocolos, mostrar esa página
  if (tabActiva === 'protocolos') {
    return <ProtocolosLimpiezaPage onTabChange={setTabActiva} tabActiva={tabActiva} />;
  }

  // Si estamos en la pestaña de control biológico y químico, mostrar esa página
  if (tabActiva === 'control') {
    return <ControlBiologicoQuimicoPage />;
  }

  // Si estamos en la pestaña de asignación de bandejas, mostrar esa página
  if (tabActiva === 'asignacion') {
    return <AsignacionBandejaPacientePage onVolver={() => setTabActiva('lotes')} />;
  }

  // Si estamos en la pestaña de mantenimiento de autoclaves, mostrar esa página
  if (tabActiva === 'mantenimiento') {
    return <MantenimientoAutoclavesPage />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Tabs de Navegación */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setTabActiva('lotes')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                tabActiva === 'lotes'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Lotes de Esterilización</span>
            </button>
            <button
              onClick={() => setTabActiva('protocolos')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                tabActiva === 'protocolos'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Protocolos de Limpieza</span>
            </button>
            <button
              onClick={() => setTabActiva('control')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                tabActiva === 'control'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <TestTube className="w-5 h-5" />
              <span>Control Biológico y Químico</span>
            </button>
            <button
              onClick={() => setTabActiva('asignacion')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                tabActiva === 'asignacion'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span>Asignación de Bandejas</span>
            </button>
            <button
              onClick={() => setTabActiva('mantenimiento')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                tabActiva === 'mantenimiento'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Wrench className="w-5 h-5" />
              <span>Mantenimiento de Autoclaves</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Lotes de Esterilización</h2>
              <p className="text-gray-600 mt-1">
                Gestión de lotes de esterilización y control de trazabilidad del instrumental
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={cargarLotes}
                disabled={loading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Nuevo Lote</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Tabla de Lotes */}
        <TablaLotesEsterilizacion
          lotes={lotes}
          loading={loading}
          onVerDetalle={handleVerDetalle}
          onEditar={handleEditarLote}
          filtros={filtros}
          onFiltrosChange={setFiltros}
        />

        {/* Modal de Detalle */}
        {mostrarModalDetalle && (
          <ModalDetalleLote
            lote={loteSeleccionado}
            onCerrar={() => {
              setMostrarModalDetalle(false);
              setLoteSeleccionado(null);
            }}
            onEditar={handleEditarLote}
          />
        )}
      </div>
    </div>
  );
}

