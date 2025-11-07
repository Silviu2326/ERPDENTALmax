import { useState } from 'react';
import { ArrowLeft, Tooth } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <button
              onClick={onVolver}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver al listado</span>
            </button>
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Tooth size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Nueva Orden de Prótesis
                </h1>
                <p className="text-gray-600">
                  Complete el formulario para crear una nueva orden de prótesis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <FormularioOrdenProtesis
          onGuardar={handleGuardar}
          onCancelar={onVolver}
          loading={loading}
        />
      </div>
    </div>
  );
}



