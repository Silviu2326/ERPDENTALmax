import { Calendar, Clock } from 'lucide-react';
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando visitas...</p>
        </div>
      </div>
    );
  }

  if (visitas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay visitas registradas</p>
        <p className="text-gray-400 text-sm mt-2">
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
    <div className="relative">
      {/* Línea vertical de la timeline */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200 hidden md:block"></div>

      <div className="space-y-8">
        {anios.map((anio) => (
          <div key={anio} className="relative">
            {/* Encabezado del año */}
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg z-10 relative">
                {anio}
              </div>
              <div className="h-0.5 bg-gray-300 flex-1"></div>
            </div>

            {/* Visitas del año */}
            <div className="space-y-6 ml-0 md:ml-20">
              {visitasPorAnio[anio].map((visita) => (
                <div key={visita._id} className="relative">
                  {/* Punto de la timeline */}
                  <div className="absolute -left-12 top-6 hidden md:block">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  <DetalleVisitaCard
                    visita={visita}
                    onVerDetalleCompleto={onVerDetalleCompleto}
                    onVerOdontograma={onVerOdontograma}
                    onAdjuntarDocumento={onAdjuntarDocumento}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

