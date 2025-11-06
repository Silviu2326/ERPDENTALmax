import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando plantilla...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-8">
              <p className="text-red-600 font-semibold">
                No tienes permisos para acceder a esta página
              </p>
              <button
                onClick={onVolver}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onVolver}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Volver a Gestión de Plantillas</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {plantillaId ? 'Editar Plantilla' : 'Nueva Plantilla'}
          </h1>
          <p className="text-gray-600 mt-1">
            {plantillaId
              ? 'Modifica los detalles de la plantilla'
              : 'Crea una nueva plantilla de documento'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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


