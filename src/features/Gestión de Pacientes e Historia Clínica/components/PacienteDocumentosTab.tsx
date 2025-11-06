import { PerfilCompletoPaciente } from '../api/pacienteApi';
import DocumentosGrid from './DocumentosGrid';

interface PacienteDocumentosTabProps {
  paciente: PerfilCompletoPaciente;
}

export default function PacienteDocumentosTab({ paciente }: PacienteDocumentosTabProps) {
  if (!paciente._id) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>Error: ID de paciente no disponible</p>
      </div>
    );
  }

  return <DocumentosGrid pacienteId={paciente._id} />;
}

