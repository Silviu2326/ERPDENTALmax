import { ArrowLeft } from 'lucide-react';
import FormularioNuevoEmpleado from '../components/FormularioNuevoEmpleado';

interface NuevoEmpleadoPageProps {
  onVolver?: () => void;
  onEmpleadoCreado?: (empleado: any) => void;
}

export default function NuevoEmpleadoPage({
  onVolver,
  onEmpleadoCreado,
}: NuevoEmpleadoPageProps) {
  const handleEmpleadoCreado = (empleado: any) => {
    if (onEmpleadoCreado) {
      onEmpleadoCreado(empleado);
    } else if (onVolver) {
      // Mostrar mensaje de éxito y volver
      alert('Empleado creado exitosamente');
      onVolver();
    }
  };

  const handleCancelar = () => {
    if (onVolver) {
      onVolver();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {onVolver && (
            <button
              onClick={handleCancelar}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
          )}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900">Nuevo Empleado</h1>
            <p className="text-gray-600 mt-2">
              Registra un nuevo empleado en el sistema. Completa toda la información
              personal, contractual y de acceso para crear un perfil completo.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <FormularioNuevoEmpleado
          onEmpleadoCreado={handleEmpleadoCreado}
          onCancelar={onVolver ? handleCancelar : undefined}
        />
      </div>
    </div>
  );
}

