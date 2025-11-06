import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface SelectorSemanaProps {
  fechaInicio: Date;
  fechaFin: Date;
  onSemanaAnterior: () => void;
  onSemanaSiguiente: () => void;
  onHoy: () => void;
}

export default function SelectorSemana({
  fechaInicio,
  fechaFin,
  onSemanaAnterior,
  onSemanaSiguiente,
  onHoy,
}: SelectorSemanaProps) {
  const nombreMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const formatearRangoSemana = () => {
    const mesInicio = nombreMeses[fechaInicio.getMonth()];
    const mesFin = nombreMeses[fechaFin.getMonth()];
    
    if (fechaInicio.getMonth() === fechaFin.getMonth()) {
      return `${fechaInicio.getDate()} - ${fechaFin.getDate()} de ${mesInicio} ${fechaInicio.getFullYear()}`;
    } else {
      return `${fechaInicio.getDate()} de ${mesInicio} - ${fechaFin.getDate()} de ${mesFin} ${fechaInicio.getFullYear()}`;
    }
  };

  const esSemanaActual = () => {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - (hoy.getDay() === 0 ? 6 : hoy.getDay() - 1));
    inicioSemana.setHours(0, 0, 0, 0);
    
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);

    return (
      fechaInicio.getTime() === inicioSemana.getTime() &&
      fechaFin.getTime() === finSemana.getTime()
    );
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={onSemanaAnterior}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Semana anterior"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            {formatearRangoSemana()}
          </h2>
        </div>
        
        <button
          onClick={onSemanaSiguiente}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Semana siguiente"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <button
        onClick={onHoy}
        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
          esSemanaActual()
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Hoy
      </button>
    </div>
  );
}


