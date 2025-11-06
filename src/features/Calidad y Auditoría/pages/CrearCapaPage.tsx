import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
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
  const { user } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          {onVolver && (
            <button
              onClick={onVolver}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">Nueva CAPA</h1>
          <p className="text-gray-600 mt-2">
            Crea un nuevo registro de Acción Correctiva y Preventiva
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
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

