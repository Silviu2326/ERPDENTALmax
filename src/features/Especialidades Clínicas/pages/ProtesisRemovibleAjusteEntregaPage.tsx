import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Plus, AlertCircle, RefreshCw } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto">
          {onVolver && (
            <button
              onClick={onVolver}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          )}

          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-lg">
            <div className="text-center">
              <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Prótesis Removible: Ajustes y Entrega
              </h2>
              <p className="text-gray-600 mb-6">
                Para acceder a la gestión de ajustes y entrega, necesita un ID de tratamiento.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID del Tratamiento
                  </label>
                  <input
                    type="text"
                    value={tratamientoId}
                    onChange={(e) => setTratamientoId(e.target.value)}
                    placeholder="Ingrese el ID del tratamiento"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {pacienteIdProp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID del Paciente (opcional)
                    </label>
                    <input
                      type="text"
                      value={pacienteId}
                      onChange={(e) => setPacienteId(e.target.value)}
                      placeholder="Ingrese el ID del paciente"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando detalles de la prótesis...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error && !detallesProtesis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {onVolver && (
            <button
              onClick={onVolver}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          )}
          <div className="bg-white rounded-lg border-2 border-red-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-xl font-bold">Error al cargar los datos</h3>
            </div>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={cargarDetallesProtesis}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {onVolver && (
            <button
              onClick={onVolver}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          )}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-xl shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
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
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Ajuste
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Formulario o Historial */}
          <div className="lg:col-span-2 space-y-6">
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
  );
}


