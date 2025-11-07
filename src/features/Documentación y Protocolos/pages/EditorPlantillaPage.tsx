import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import FormularioDetallePlantilla from '../components/FormularioDetallePlantilla';
import {
  DocumentoPlantilla,
  crearPlantilla,
  actualizarPlantilla,
  obtenerPlantillaPorId,
} from '../api/plantillasApi';

interface EditorPlantillaPageProps {
  plantillaId?: string;
  onVolver: () => void;
  onGuardado?: (plantilla: DocumentoPlantilla) => void;
}

export default function EditorPlantillaPage({
  plantillaId,
  onVolver,
  onGuardado,
}: EditorPlantillaPageProps) {
  const { user } = useAuth();
  const [plantilla, setPlantilla] = useState<DocumentoPlantilla | null>(null);
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'director';

  useEffect(() => {
    if (plantillaId) {
      cargarPlantilla();
    }
  }, [plantillaId]);

  const cargarPlantilla = async () => {
    if (!plantillaId) return;

    setCargando(true);
    setError(null);
    try {
      const data = await obtenerPlantillaPorId(plantillaId);
      setPlantilla(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la plantilla');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (
    datosPlantilla: Omit<DocumentoPlantilla, '_id' | 'version' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!isAdmin) {
      setError('No tienes permisos para crear o editar plantillas');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let plantillaGuardada: DocumentoPlantilla;

      if (plantillaId) {
        // Actualizar plantilla existente
        plantillaGuardada = await actualizarPlantilla(plantillaId, datosPlantilla);
      } else {
        // Crear nueva plantilla
        plantillaGuardada = await crearPlantilla(datosPlantilla);
      }

      if (onGuardado) {
        onGuardado(plantillaGuardada);
      } else {
        onVolver();
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar la plantilla');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando plantilla...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error de permisos</h3>
            <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página</p>
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </button>
          </div>
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
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {plantillaId ? 'Editar Plantilla' : 'Nueva Plantilla'}
                </h1>
                <p className="text-gray-600">
                  {plantillaId
                    ? 'Modifica los detalles de la plantilla'
                    : 'Crea una nueva plantilla de documento'}
                </p>
              </div>

              {/* Botón volver */}
              <button
                onClick={onVolver}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/70 rounded-xl transition-all"
              >
                <ArrowLeft size={18} />
                <span>Volver</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Formulario */}
        <FormularioDetallePlantilla
          plantilla={plantilla}
          onGuardar={handleGuardar}
          onCancelar={onVolver}
          loading={loading}
        />
      </div>
    </div>
  );
}



