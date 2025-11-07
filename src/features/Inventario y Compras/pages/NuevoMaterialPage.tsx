import { ArrowLeft, Package } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            {onVolver && (
              <button
                onClick={handleVolver}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors text-sm font-medium"
              >
                <ArrowLeft size={18} className="opacity-70" />
                <span>Volver al Inventario</span>
              </button>
            )}
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Package size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Nuevo Material
                </h1>
                <p className="text-gray-600">
                  Registra un nuevo material en el inventario con todos sus detalles. Esta información
                  será utilizada para generar órdenes de compra, controlar niveles de stock y calcular
                  costos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Formulario */}
        <FormularioMaterial
          onMaterialCreado={handleMaterialCreado}
          onCancelar={onVolver}
        />
      </div>
    </div>
  );
}

