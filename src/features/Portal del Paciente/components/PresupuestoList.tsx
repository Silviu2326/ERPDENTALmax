import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { obtenerMisPresupuestos, PresupuestoResumen } from '../api/presupuestosApi';
import PresupuestoListItem from './PresupuestoListItem';

interface PresupuestoListProps {
  onVerDetalle: (id: string) => void;
}

export default function PresupuestoList({ onVerDetalle }: PresupuestoListProps) {
  const [presupuestos, setPresupuestos] = useState<PresupuestoResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarPresupuestos();
  }, []);

  const cargarPresupuestos = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerMisPresupuestos();
      setPresupuestos(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los presupuestos');
      console.error('Error al cargar presupuestos:', err);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Cargando presupuestos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800">{error}</p>
        <button
          onClick={cargarPresupuestos}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (presupuestos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600 mb-2">No tienes presupuestos disponibles</p>
        <p className="text-sm text-gray-500">Los presupuestos que la clínica te envíe aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {presupuestos.map((presupuesto) => (
        <PresupuestoListItem
          key={presupuesto._id}
          presupuesto={presupuesto}
          onVerDetalle={onVerDetalle}
        />
      ))}
    </div>
  );
}



