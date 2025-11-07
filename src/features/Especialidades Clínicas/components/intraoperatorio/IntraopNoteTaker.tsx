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
    <div className="bg-white shadow-sm rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <FileText size={20} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Notas Intraoperatorias</h3>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Save size={14} />
              Guardando...
            </span>
          )}
          {lastSaved && !isSaving && (
            <span className="text-xs text-gray-600">
              Guardado: {lastSaved.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={handleManualSave}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium shadow-sm"
          >
            <Save size={16} />
            Guardar
          </button>
        </div>
      </div>

      <textarea
        value={localNotas}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Registre aquí todas las observaciones, hallazgos y procedimientos realizados durante la cirugía..."
        className="flex-1 w-full px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        style={{ minHeight: '300px' }}
      />

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          <strong>Consejo:</strong> Las notas se guardan automáticamente cada 30 segundos. También puede guardar manualmente usando el botón Guardar.
        </p>
      </div>
    </div>
  );
}



