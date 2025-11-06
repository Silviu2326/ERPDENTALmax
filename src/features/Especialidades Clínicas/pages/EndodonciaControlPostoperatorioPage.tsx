import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
            Tratamiento no especificado
          </h2>
          <p className="text-gray-600 text-center mb-6">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {onVolver && (
              <button
                onClick={onVolver}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Control Postoperatorio - Endodoncia
              </h1>
              <p className="text-sm text-gray-600">
                Seguimiento y evaluación de tratamientos de conducto radicular
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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


