import { Calendar, FileText, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { MedicionOsteointegracion } from '../api/implantesApi';

interface TimelineOsteointegracionProps {
  mediciones: MedicionOsteointegracion[];
}

export default function TimelineOsteointegracion({ mediciones }: TimelineOsteointegracionProps) {
  const formatearFecha = (fecha: Date | string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIconoPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'ISQ':
        return CheckCircle2;
      case 'Periotest':
        return AlertCircle;
      case 'Clinica':
        return FileText;
      default:
        return Clock;
    }
  };

  const getColorPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'ISQ':
        return 'text-blue-600 bg-blue-100';
      case 'Periotest':
        return 'text-purple-600 bg-purple-100';
      case 'Clinica':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const medicionesOrdenadas = [...mediciones].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  if (medicionesOrdenadas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Mediciones</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <p className="text-gray-600">No hay mediciones registradas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Historial de Mediciones</h3>
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {medicionesOrdenadas.map((medicion, index) => {
            const Icono = getIconoPorTipo(medicion.tipoMedicion);
            const colorClass = getColorPorTipo(medicion.tipoMedicion);

            return (
              <div key={medicion._id || index} className="relative flex gap-4">
                {/* Icono */}
                <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
                  <Icono className="w-4 h-4" />
                </div>

                {/* Contenido */}
                <div className="flex-1 pb-6">
                  <div className="bg-gray-50 rounded-xl ring-1 ring-gray-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${colorClass}`}>
                            {medicion.tipoMedicion}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            Valor: {medicion.valor}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Calendar size={16} className="inline mr-1" />
                          {formatearFecha(medicion.fecha)}
                        </div>
                      </div>
                    </div>
                    {medicion.observaciones && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">{medicion.observaciones}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



