import { useState } from 'react';
import { ArrowLeft, FlaskConical } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FlaskConical size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Nueva Orden de Laboratorio
                  </h1>
                  <p className="text-gray-600">
                    Crea una nueva orden de trabajo para el laboratorio
                  </p>
                </div>
              </div>
              
              {/* Botón volver */}
              <button
                onClick={onVolver}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Volver</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <FormularioOrdenLaboratorio
          onGuardar={handleGuardar}
          onCancelar={onVolver}
          loading={loading}
        />
      </div>
    </div>
  );
}



