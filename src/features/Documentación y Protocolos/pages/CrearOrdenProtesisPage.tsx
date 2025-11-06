import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { crearOrdenProtesis, CrearOrdenProtesisData } from '../api/protesisApi';
import FormularioOrdenProtesis from '../components/FormularioOrdenProtesis';

interface CrearOrdenProtesisPageProps {
  onVolver: () => void;
  onOrdenCreada: (ordenId: string) => void;
}

export default function CrearOrdenProtesisPage({
  onVolver,
  onOrdenCreada,
}: CrearOrdenProtesisPageProps) {
  const [loading, setLoading] = useState(false);

  const handleGuardar = async (data: CrearOrdenProtesisData) => {
    setLoading(true);
    try {
      const nuevaOrden = await crearOrdenProtesis(data);
      if (nuevaOrden._id) {
        onOrdenCreada(nuevaOrden._id);
      }
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error; // Re-lanzar para que el formulario lo maneje
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onVolver}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al listado</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Orden de Prótesis</h1>
          <p className="text-gray-600 mt-1">
            Complete el formulario para crear una nueva orden de prótesis
          </p>
        </div>

        {/* Formulario */}
        <FormularioOrdenProtesis
          onGuardar={handleGuardar}
          onCancelar={onVolver}
          loading={loading}
        />
      </div>
    </div>
  );
}


