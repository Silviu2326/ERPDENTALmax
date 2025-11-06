import { Building2 } from 'lucide-react';
import ClinicSelector from './ClinicSelector';

interface Sede {
  _id: string;
  nombre: string;
}

interface SelectorSedeProps {
  sedes: Sede[];
  sedeSeleccionada: string | null;
  onCambio: (sedeId: string | null) => void;
}

export default function SelectorSede({
  sedes,
  sedeSeleccionada,
  onCambio,
}: SelectorSedeProps) {
  // Convertir sedes al formato que espera ClinicSelector
  const clinicas = sedes.map((sede) => ({
    _id: sede._id,
    nombre: sede.nombre,
  }));

  return (
    <div className="flex items-center space-x-2">
      <Building2 className="w-5 h-5 text-blue-600" />
      <ClinicSelector
        clinicas={clinicas}
        clinicaSeleccionada={sedeSeleccionada}
        onCambio={onCambio}
        mostrarTodas={true}
      />
    </div>
  );
}


