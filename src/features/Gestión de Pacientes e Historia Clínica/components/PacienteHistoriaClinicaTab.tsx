import { PerfilCompletoPaciente } from '../api/pacienteApi';
import LayoutHistoriaClinica from './historia-clinica/LayoutHistoriaClinica';

interface PacienteHistoriaClinicaTabProps {
  paciente: PerfilCompletoPaciente;
}

export default function PacienteHistoriaClinicaTab({ paciente }: PacienteHistoriaClinicaTabProps) {
  if (!paciente._id) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        ID de paciente no válido
      </div>
    );
  }

  return <LayoutHistoriaClinica pacienteId={paciente._id} />;
}

