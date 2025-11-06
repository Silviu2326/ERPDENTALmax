import { useState, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { obtenerMisCitas, CitaPaciente } from '../api/citasPacienteApi';
import TarjetaCitaPaciente from './TarjetaCitaPaciente';

interface ListaCitasPacienteProps {
  estado?: string;
  esProxima?: boolean;
  onCancelarCita?: (citaId: string) => void;
  onModificarCita?: (cita: CitaPaciente) => void;
}

export default function ListaCitasPaciente({ 
  estado, 
  esProxima = false,
  onCancelarCita,
  onModificarCita
}: ListaCitasPacienteProps) {
  const [citas, setCitas] = useState<CitaPaciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarCitas();
  }, [estado]);

  const cargarCitas = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerMisCitas(estado);
      setCitas(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las citas');
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = (citaId: string) => {
    if (onCancelarCita) {
      onCancelarCita(citaId);
    }
  };

  const handleModificar = (cita: CitaPaciente) => {
    if (onModificarCita) {
      onModificarCita(cita);
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Cargando citas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={cargarCitas}
          className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (citas.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {esProxima ? 'No tienes citas próximas' : 'No hay citas registradas'}
        </h3>
        <p className="text-gray-600">
          {esProxima 
            ? 'No hay citas programadas en este momento.' 
            : 'No se encontraron citas con los filtros seleccionados.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {citas.map((cita) => (
        <TarjetaCitaPaciente
          key={cita._id}
          cita={cita}
          esProxima={esProxima}
          onCancelar={onCancelarCita ? handleCancelar : undefined}
          onModificar={onModificarCita ? handleModificar : undefined}
        />
      ))}
    </div>
  );
}


