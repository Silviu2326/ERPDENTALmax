import { Building2, ChevronDown } from 'lucide-react';

interface Clinica {
  _id: string;
  nombre: string;
}

interface ClinicSelectorProps {
  clinicas: Clinica[];
  clinicaSeleccionada: string | null; // null = todas las clínicas
  onCambio: (clinicaId: string | null) => void;
  mostrarTodas?: boolean;
}

export default function ClinicSelector({
  clinicas,
  clinicaSeleccionada,
  onCambio,
  mostrarTodas = true,
}: ClinicSelectorProps) {
  const clinicaActual = clinicaSeleccionada
    ? clinicas.find((c) => c._id === clinicaSeleccionada)
    : null;

  return (
    <div className="relative">
      <select
        value={clinicaSeleccionada || 'todas'}
        onChange={(e) => {
          const valor = e.target.value;
          onCambio(valor === 'todas' ? null : valor);
        }}
        className="appearance-none bg-white border-2 border-blue-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm hover:shadow-md cursor-pointer"
      >
        {mostrarTodas && (
          <option value="todas">Todas las clínicas</option>
        )}
        {clinicas.map((clinica) => (
          <option key={clinica._id} value={clinica._id}>
            {clinica.nombre}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className="w-5 h-5 text-gray-500" />
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Building2 className="w-4 h-4 text-blue-600" />
      </div>
    </div>
  );
}


