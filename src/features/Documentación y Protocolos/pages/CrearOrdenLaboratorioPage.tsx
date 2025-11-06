import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { crearOrden, NuevaOrdenLaboratorio } from '../api/ordenesLaboratorioApi';
import FormularioOrdenLaboratorio from '../components/FormularioOrdenLaboratorio';

interface CrearOrdenLaboratorioPageProps {
  onVolver: () => void;
  onOrdenCreada?: (ordenId: string) => void;
}

export default function CrearOrdenLaboratorioPage({
  onVolver,
  onOrdenCreada,
}: CrearOrdenLaboratorioPageProps) {
  const [loading, setLoading] = useState(false);

  const handleGuardar = async (orden: NuevaOrdenLaboratorio) => {
    setLoading(true);
    try {
      const ordenCreada = await crearOrden(orden);
      if (onOrdenCreada && ordenCreada._id) {
        onOrdenCreada(ordenCreada._id);
      } else {
        alert('Orden creada correctamente');
        onVolver();
      }
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onVolver}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Órdenes</span>
          </button>
        </div>

        <FormularioOrdenLaboratorio
          onGuardar={handleGuardar}
          onCancelar={onVolver}
          loading={loading}
        />
      </div>
    </div>
  );
}


