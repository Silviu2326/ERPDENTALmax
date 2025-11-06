import OdontogramaInteractivo from './historia-clinica/OdontogramaInteractivo';
import { PerfilCompletoPaciente } from '../api/pacienteApi';

interface PacienteOdontogramaTabProps {
  paciente: PerfilCompletoPaciente;
}

export default function PacienteOdontogramaTab({ paciente }: PacienteOdontogramaTabProps) {
  if (!paciente._id) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se puede cargar el odontograma sin un ID de paciente válido</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OdontogramaInteractivo pacienteId={paciente._id} />
    </div>
  );
}
