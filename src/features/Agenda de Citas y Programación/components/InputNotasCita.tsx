import { FileText } from 'lucide-react';

interface InputNotasCitaProps {
  notas: string;
  onNotasChange: (notas: string) => void;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
}

export default function InputNotasCita({
  notas,
  onNotasChange,
  disabled = false,
  placeholder = 'Notas adicionales sobre la cita...',
  rows = 4,
}: InputNotasCitaProps) {
  return (
    <div>
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
        <FileText className="w-4 h-4" />
        <span>Notas</span>
      </label>
      <textarea
        value={notas}
        onChange={(e) => onNotasChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y"
      />
    </div>
  );
}


