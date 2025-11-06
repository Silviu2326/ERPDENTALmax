import { useState, useEffect } from 'react';
import { FileText, Save } from 'lucide-react';

interface IntraopNoteTakerProps {
  notas: string;
  onNotasChange: (notas: string) => void;
  onAutoSave?: () => void;
}

export default function IntraopNoteTaker({ notas, onNotasChange, onAutoSave }: IntraopNoteTakerProps) {
  const [localNotas, setLocalNotas] = useState(notas);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalNotas(notas);
  }, [notas]);

  // Autoguardado cada 30 segundos
  useEffect(() => {
    if (!onAutoSave) return;

    const interval = setInterval(() => {
      if (localNotas !== notas) {
        setIsSaving(true);
        onAutoSave();
        setLastSaved(new Date());
        setTimeout(() => setIsSaving(false), 1000);
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [localNotas, notas, onAutoSave]);

  const handleChange = (value: string) => {
    setLocalNotas(value);
    onNotasChange(value);
  };

  const handleManualSave = () => {
    if (onAutoSave) {
      setIsSaving(true);
      onAutoSave();
      setLastSaved(new Date());
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Notas Intraoperatorias</h3>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Save className="w-3 h-3" />
              Guardando...
            </span>
          )}
          {lastSaved && !isSaving && (
            <span className="text-xs text-gray-500">
              Guardado: {lastSaved.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={handleManualSave}
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>

      <textarea
        value={localNotas}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Registre aquí todas las observaciones, hallazgos y procedimientos realizados durante la cirugía..."
        className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
        style={{ minHeight: '300px' }}
      />

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>Consejo:</strong> Las notas se guardan automáticamente cada 30 segundos. También puede guardar manualmente usando el botón Guardar.
        </p>
      </div>
    </div>
  );
}


