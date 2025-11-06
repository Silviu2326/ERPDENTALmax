import { Calendar } from 'lucide-react';
import DateRangePicker from './DateRangePicker';

interface FiltroPeriodoTiempoProps {
  fechaInicio: Date;
  fechaFin: Date;
  onCambio: (inicio: Date, fin: Date) => void;
}

export default function FiltroPeriodoTiempo({
  fechaInicio,
  fechaFin,
  onCambio,
}: FiltroPeriodoTiempoProps) {
  return (
    <div className="flex items-center space-x-2">
      <Calendar className="w-5 h-5 text-blue-600" />
      <DateRangePicker
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onCambio={onCambio}
      />
    </div>
  );
}


