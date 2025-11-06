import { ArrowLeft } from 'lucide-react';
import FormularioMaterial from '../components/FormularioMaterial';

interface NuevoMaterialPageProps {
  onVolver?: () => void;
  onMaterialCreado?: (material: any) => void;
}

export default function NuevoMaterialPage({
  onVolver,
  onMaterialCreado,
}: NuevoMaterialPageProps) {
  const handleMaterialCreado = (material: any) => {
    if (onMaterialCreado) {
      onMaterialCreado(material);
    }
  };

  const handleVolver = () => {
    if (onVolver) {
      onVolver();
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header con botón de volver */}
        <div className="mb-6">
          {onVolver && (
            <button
              onClick={handleVolver}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Inventario</span>
            </button>
          )}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900">Nuevo Material</h1>
            <p className="text-gray-600 mt-2">
              Registra un nuevo material en el inventario con todos sus detalles. Esta información
              será utilizada para generar órdenes de compra, controlar niveles de stock y calcular
              costos.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <FormularioMaterial
          onMaterialCreado={handleMaterialCreado}
          onCancelar={onVolver}
        />
      </div>
    </div>
  );
}

