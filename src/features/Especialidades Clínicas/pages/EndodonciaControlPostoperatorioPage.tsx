import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  ControlEndodontico,
  obtenerControlesPorTratamiento,
  crearControlEndodontico,
  actualizarControlEndodontico,
  eliminarControlEndodontico,
  NuevoControlEndodontico,
} from '../api/controlesEndodonciaApi';
import TimelineControlesEndo from '../components/TimelineControlesEndo';
import FormularioNuevoControlEndo from '../components/FormularioNuevoControlEndo';
import VisorRadiografiasComparativo from '../components/VisorRadiografiasComparativo';

interface EndodonciaControlPostoperatorioPageProps {
  tratamientoId?: string;
  pacienteId?: string;
  onVolver?: () => void;
}

export default function EndodonciaControlPostoperatorioPage({
  tratamientoId: tratamientoIdProp,
  pacienteId: pacienteIdProp,
  onVolver,
}: EndodonciaControlPostoperatorioPageProps) {
  const { user } = useAuth();
  const [tratamientoId, setTratamientoId] = useState<string>(tratamientoIdProp || '');
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [controles, setControles] = useState<ControlEndodontico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [controlEditando, setControlEditando] = useState<ControlEndodontico | null>(null);
  const [controlVisualizando, setControlVisualizando] = useState<ControlEndodontico | null>(null);
  const [mostrarVisorRadiografias, setMostrarVisorRadiografias] = useState(false);

  // Cargar controles al montar o cambiar tratamientoId
  useEffect(() => {
    if (tratamientoId) {
      cargarControles();
    }
  }, [tratamientoId]);

  const cargarControles = async () => {
    if (!tratamientoId) return;

    setLoading(true);
    setError(null);

    try {
      const controlesData = await obtenerControlesPorTratamiento(tratamientoId);
      setControles(controlesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los controles postoperatorios');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarControl = async (control: NuevoControlEndodontico) => {
    if (!user?._id) {
      throw new Error('Usuario no autenticado');
    }

    try {
      if (controlEditando) {
        // Actualizar control existente
        await actualizarControlEndodontico(controlEditando._id!, {
          fechaControl: control.fechaControl,
          sintomatologia: control.sintomatologia,
          signosClinicos: control.signosClinicos,
          hallazgosRadiograficos: control.hallazgosRadiograficos,
          diagnosticoEvolutivo: control.diagnosticoEvolutivo,
          observaciones: control.observaciones,
          adjuntos: control.adjuntos,
        });
      } else {
        // Crear nuevo control
        await crearControlEndodontico(control);
      }

      // Recargar controles
      await cargarControles();
      setMostrarFormulario(false);
      setControlEditando(null);
    } catch (err: any) {
      throw new Error(err.message || 'Error al guardar el control');
    }
  };

  const handleEditar = (control: ControlEndodontico) => {
    setControlEditando(control);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (control: ControlEndodontico) => {
    if (!confirm('¿Está seguro de que desea eliminar este control postoperatorio?')) {
      return;
    }

    if (!control._id) return;

    try {
      await eliminarControlEndodontico(control._id);
      await cargarControles();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el control');
    }
  };

  const handleVerDetalle = (control: ControlEndodontico) => {
    setControlVisualizando(control);
    setMostrarVisorRadiografias(true);
  };

  const handleNuevoControl = () => {
    setControlEditando(null);
    setMostrarFormulario(true);
  };

  if (!tratamientoId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md">
          <AlertCircle size={48} className="mx-auto text-yellow-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
            Tratamiento no especificado
          </h3>
          <p className="text-gray-600 mb-4 text-center">
            Para acceder al control postoperatorio, necesita especificar un tratamiento de endodoncia.
          </p>
          {onVolver && (
            <button
              onClick={onVolver}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Control Postoperatorio - Endodoncia
                </h1>
                <p className="text-gray-600">
                  Seguimiento y evaluación de tratamientos de conducto radicular
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {error && (
          <div className="mb-6 bg-white shadow-sm p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white shadow-sm p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </div>
        ) : mostrarFormulario ? (
          <FormularioNuevoControlEndo
            tratamientoId={tratamientoId}
            pacienteId={pacienteId}
            onGuardar={handleGuardarControl}
            onCancelar={() => {
              setMostrarFormulario(false);
              setControlEditando(null);
            }}
            controlEditar={controlEditando ? {
              _id: controlEditando._id!,
              fechaControl: controlEditando.fechaControl,
              sintomatologia: controlEditando.sintomatologia,
              signosClinicos: controlEditando.signosClinicos,
              hallazgosRadiograficos: controlEditando.hallazgosRadiograficos,
              diagnosticoEvolutivo: controlEditando.diagnosticoEvolutivo,
              observaciones: controlEditando.observaciones,
            } : undefined}
          />
        ) : (
          <TimelineControlesEndo
            controles={controles}
            onNuevoControl={handleNuevoControl}
            onVerDetalle={handleVerDetalle}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
        )}
      </div>

      {/* Visor de radiografías */}
      <VisorRadiografiasComparativo
        controles={controles}
        isOpen={mostrarVisorRadiografias}
        onClose={() => {
          setMostrarVisorRadiografias(false);
          setControlVisualizando(null);
        }}
        controlInicial={controlVisualizando || undefined}
      />
    </div>
  );
}



