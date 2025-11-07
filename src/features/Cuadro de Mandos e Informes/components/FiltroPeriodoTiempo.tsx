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
    <div className="flex items-center gap-2">
      <Calendar size={18} className="text-slate-600" />
      <DateRangePicker
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onCambio={onCambio}
      />
    </div>
  );
}



