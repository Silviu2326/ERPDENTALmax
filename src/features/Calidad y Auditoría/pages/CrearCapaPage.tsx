import { useState, useEffect } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { crearCapa, NuevaCapa } from '../api/capasApi';
import FormularioCapa from '../components/FormularioCapa';

interface CrearCapaPageProps {
  onCapaCreada?: (capaId: string) => void;
  onVolver?: () => void;
}

export default function CrearCapaPage({
  onCapaCreada,
  onVolver,
}: CrearCapaPageProps) {
  const [loading, setLoading] = useState(false);
  const [clinicas, setClinicas] = useState<Array<{ _id: string; nombre: string }>>([]);
  const [responsables, setResponsables] = useState<
    Array<{ _id: string; nombre: string; apellidos?: string }>
  >([]);

  // TODO: Cargar clínicas y responsables desde la API
  useEffect(() => {
    setClinicas([
      { _id: '1', nombre: 'Clínica Principal' },
      { _id: '2', nombre: 'Clínica Sede 2' },
    ]);
    setResponsables([
      { _id: '1', nombre: 'Juan', apellidos: 'Pérez' },
      { _id: '2', nombre: 'María', apellidos: 'García' },
    ]);
  }, []);

  const handleGuardar = async (datos: NuevaCapa) => {
    try {
      setLoading(true);
      const capaCreada = await crearCapa(datos);
      if (onCapaCreada && capaCreada._id) {
        onCapaCreada(capaCreada._id);
      } else if (onVolver) {
        onVolver();
      }
    } catch (error) {
      console.error('Error al crear CAPA:', error);
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
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Nueva CAPA
                </h1>
                <p className="text-gray-600">
                  Crea un nuevo registro de Acción Correctiva y Preventiva
                </p>
              </div>

              {/* Botón Volver */}
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <ArrowLeft size={20} />
                  <span>Volver</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="bg-white shadow-sm rounded-2xl p-6">
          <FormularioCapa
            onGuardar={handleGuardar}
            onCancelar={onVolver || (() => {})}
            loading={loading}
            clinicas={clinicas}
            responsables={responsables}
          />
        </div>
      </div>
    </div>
  );
}

