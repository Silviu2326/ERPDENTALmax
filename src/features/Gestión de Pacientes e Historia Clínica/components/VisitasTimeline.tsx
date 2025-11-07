import { Calendar, Clock, Loader2, Package } from 'lucide-react';
import { Visita } from '../api/historialVisitasApi';
import DetalleVisitaCard from './DetalleVisitaCard';

interface VisitasTimelineProps {
  visitas: Visita[];
  loading?: boolean;
  onVerDetalleCompleto?: (visita: any) => void;
  onVerOdontograma?: (odontogramaId: string, fecha: string) => void;
  onAdjuntarDocumento?: (visitaId: string) => void;
}

export default function VisitasTimeline({
  visitas,
  loading = false,
  onVerDetalleCompleto,
  onVerOdontograma,
  onAdjuntarDocumento,
}: VisitasTimelineProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (visitas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay visitas registradas</h3>
        <p className="text-gray-600">
          El historial de visitas aparecerá aquí cuando se completen citas
        </p>
      </div>
    );
  }

  // Agrupar visitas por año
  const visitasPorAnio = visitas.reduce((acc, visita) => {
    const anio = new Date(visita.fechaHoraInicio).getFullYear();
    if (!acc[anio]) {
      acc[anio] = [];
    }
    acc[anio].push(visita);
    return acc;
  }, {} as Record<number, Visita[]>);

  const anios = Object.keys(visitasPorAnio)
    .map(Number)
    .sort((a, b) => b - a); // Ordenar de más reciente a más antiguo

  return (
    <div className="space-y-4">
      {anios.map((anio) => (
        <div key={anio} className="space-y-4">
          {/* Encabezado del año */}
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-base ring-4 ring-white shadow-sm">
              {anio}
            </div>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Visitas del año */}
          <div className="space-y-4">
            {visitasPorAnio[anio].map((visita) => (
              <DetalleVisitaCard
                key={visita._id}
                visita={visita}
                onVerDetalleCompleto={onVerDetalleCompleto}
                onVerOdontograma={onVerOdontograma}
                onAdjuntarDocumento={onAdjuntarDocumento}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

