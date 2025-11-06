import { useState, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { obtenerCitasProximas, CitaPortal } from '../api/citasApi';
import CitaCard from './CitaCard';

interface CitasProximasListProps {
  onCancelarCita: (citaId: string) => void;
}

export default function CitasProximasList({ onCancelarCita }: CitasProximasListProps) {
  const [citas, setCitas] = useState<CitaPortal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerCitasProximas();
      setCitas(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las citas');
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = (citaId: string) => {
    onCancelarCita(citaId);
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Cargando citas próximas...</p>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes citas próximas</h3>
        <p className="text-gray-600">No hay citas programadas en este momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {citas.map((cita) => (
        <CitaCard
          key={cita._id}
          cita={cita}
          esProxima={true}
          onCancelar={handleCancelar}
        />
      ))}
    </div>
  );
}


