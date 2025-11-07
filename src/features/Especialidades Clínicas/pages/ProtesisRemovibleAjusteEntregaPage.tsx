import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Plus, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  DetallesProtesis,
  obtenerDetallesProtesis,
  crearRegistroAjuste,
  NuevoAjuste,
} from '../api/protesisRemovibleApi';
import FormularioRegistroAjuste from '../components/FormularioRegistroAjuste';
import HistorialAjustesProtesis from '../components/HistorialAjustesProtesis';
import PanelControlEntrega from '../components/PanelControlEntrega';
import VisorDetallesOrdenLaboratorio from '../components/VisorDetallesOrdenLaboratorio';

interface ProtesisRemovibleAjusteEntregaPageProps {
  tratamientoId?: string;
  pacienteId?: string;
  onVolver?: () => void;
}

export default function ProtesisRemovibleAjusteEntregaPage({
  tratamientoId: tratamientoIdProp,
  pacienteId: pacienteIdProp,
  onVolver,
}: ProtesisRemovibleAjusteEntregaPageProps) {
  const { user } = useAuth();
  const [tratamientoId, setTratamientoId] = useState<string>(tratamientoIdProp || '');
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [detallesProtesis, setDetallesProtesis] = useState<DetallesProtesis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    if (tratamientoId) {
      cargarDetallesProtesis();
    }
  }, [tratamientoId]);

  const cargarDetallesProtesis = async () => {
    if (!tratamientoId) return;

    setLoading(true);
    setError(null);
    try {
      const detalles = await obtenerDetallesProtesis(tratamientoId);
      setDetallesProtesis(detalles);
      if (detalles.pacienteId) {
        setPacienteId(detalles.pacienteId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los detalles de la prótesis');
      setDetallesProtesis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarAjuste = async (ajuste: NuevoAjuste) => {
    if (!user) {
      alert('No se ha identificado al usuario');
      return;
    }

    try {
      await crearRegistroAjuste(ajuste);
      await cargarDetallesProtesis();
      setMostrarFormulario(false);
      setError(null);
    } catch (err) {
      throw err;
    }
  };

  const handleEntregaConfirmada = () => {
    cargarDetallesProtesis();
  };

  // Si no hay tratamientoId, mostrar selector
  if (!tratamientoId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          {onVolver && (
            <button
              onClick={onVolver}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
          )}

          <div className="bg-white shadow-sm rounded-xl p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Prótesis Removible: Ajustes y Entrega
              </h2>
              <p className="text-gray-600 mb-6">
                Para acceder a la gestión de ajustes y entrega, necesita un ID de tratamiento.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID del Tratamiento
                  </label>
                  <input
                    type="text"
                    value={tratamientoId}
                    onChange={(e) => setTratamientoId(e.target.value)}
                    placeholder="Ingrese el ID del tratamiento"
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                  />
                </div>
                {pacienteIdProp && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ID del Paciente (opcional)
                    </label>
                    <input
                      type="text"
                      value={pacienteId}
                      onChange={(e) => setPacienteId(e.target.value)}
                      placeholder="Ingrese el ID del paciente"
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de carga
  if (loading && !detallesProtesis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando detalles de la prótesis...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error && !detallesProtesis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          {onVolver && (
            <button
              onClick={onVolver}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
          )}
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar los datos</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={cargarDetallesProtesis}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <RefreshCw size={20} />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!detallesProtesis) {
    return null;
  }

  // Determinar si el usuario es solo lectura (Protésico/Laboratorio)
  const esModoLectura = user?.role === 'protesico' || user?.role === 'laboratorio';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="mr-4 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Package size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Prótesis Removible: Ajustes y Entrega
                  </h1>
                  {detallesProtesis.paciente && (
                    <p className="text-gray-600 mt-1">
                      Paciente: {detallesProtesis.paciente.nombre} {detallesProtesis.paciente.apellidos}
                    </p>
                  )}
                </div>
              </div>
              {!esModoLectura && !mostrarFormulario && (
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus size={20} />
                  Nuevo Ajuste
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda - Formulario o Historial */}
            <div className="lg:col-span-2">
              {mostrarFormulario && !esModoLectura ? (
                <FormularioRegistroAjuste
                  tratamientoId={tratamientoId}
                  odontologoId={user?._id || ''}
                  onGuardar={handleGuardarAjuste}
                  onCancelar={() => setMostrarFormulario(false)}
                />
              ) : (
                <HistorialAjustesProtesis
                  tratamientoId={tratamientoId}
                  modoLectura={esModoLectura}
                />
              )}
            </div>

            {/* Columna derecha - Panel de control y detalles */}
            <div className="space-y-6">
              {!esModoLectura && (
                <PanelControlEntrega
                  detallesProtesis={detallesProtesis}
                  onEntregaConfirmada={handleEntregaConfirmada}
                />
              )}
              
              {detallesProtesis.ordenLaboratorioId && (
                <VisorDetallesOrdenLaboratorio
                  ordenLaboratorioId={detallesProtesis.ordenLaboratorioId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



