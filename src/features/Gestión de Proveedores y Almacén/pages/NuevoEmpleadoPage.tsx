import { ArrowLeft, User } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            {onVolver && (
              <button
                onClick={handleCancelar}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Volver</span>
              </button>
            )}
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <User size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Nuevo Empleado
                </h1>
                <p className="text-gray-600">
                  Registra un nuevo empleado en el sistema. Completa toda la información
                  personal, contractual y de acceso para crear un perfil completo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <FormularioNuevoEmpleado
          onEmpleadoCreado={handleEmpleadoCreado}
          onCancelar={onVolver ? handleCancelar : undefined}
        />
      </div>
    </div>
  );
}

