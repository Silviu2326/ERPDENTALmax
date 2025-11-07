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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Package size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Esterilización y Trazabilidad
                </h1>
                <p className="text-gray-600">
                  Gestión de lotes de esterilización y control de trazabilidad del instrumental
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <div className="bg-white shadow-sm rounded-lg p-0">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              <button
                onClick={() => setTabActiva('lotes')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === 'lotes'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Package size={18} className={tabActiva === 'lotes' ? 'opacity-100' : 'opacity-70'} />
                <span>Lotes de Esterilización</span>
              </button>
              <button
                onClick={() => setTabActiva('protocolos')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === 'protocolos'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <FileText size={18} className={tabActiva === 'protocolos' ? 'opacity-100' : 'opacity-70'} />
                <span>Protocolos de Limpieza</span>
              </button>
              <button
                onClick={() => setTabActiva('control')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === 'control'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <TestTube size={18} className={tabActiva === 'control' ? 'opacity-100' : 'opacity-70'} />
                <span>Control Biológico y Químico</span>
              </button>
              <button
                onClick={() => setTabActiva('asignacion')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === 'asignacion'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <QrCode size={18} className={tabActiva === 'asignacion' ? 'opacity-100' : 'opacity-70'} />
                <span>Asignación de Bandejas</span>
              </button>
              <button
                onClick={() => setTabActiva('mantenimiento')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === 'mantenimiento'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Wrench size={18} className={tabActiva === 'mantenimiento' ? 'opacity-100' : 'opacity-70'} />
                <span>Mantenimiento de Autoclaves</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="mt-6 space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={cargarLotes}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                <span>Actualizar</span>
              </button>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
              >
                <Plus size={20} />
                <span>Nuevo Lote</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
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
        </div>

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

