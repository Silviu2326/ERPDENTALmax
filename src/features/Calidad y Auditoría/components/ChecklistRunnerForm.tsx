import { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuditTemplate, AuditAnswer, AuditInstance } from '../api/auditTemplatesApi';
import ChecklistItem from './ChecklistItem';

interface ChecklistRunnerFormProps {
  template: AuditTemplate;
  auditInstance?: AuditInstance;
  onSave: (answers: AuditAnswer[], status: 'in-progress' | 'completed') => Promise<void>;
  disabled?: boolean;
}

export default function ChecklistRunnerForm({
  template,
  auditInstance,
  onSave,
  disabled = false,
}: ChecklistRunnerFormProps) {
  const [answers, setAnswers] = useState<Map<string, AuditAnswer>>(new Map());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar respuestas desde la instancia existente
  useEffect(() => {
    if (auditInstance?.answers) {
      const answersMap = new Map<string, AuditAnswer>();
      auditInstance.answers.forEach((answer) => {
        answersMap.set(answer.itemId, answer);
      });
      setAnswers(answersMap);
    }
  }, [auditInstance]);

  const handleAnswerChange = (answer: AuditAnswer) => {
    setAnswers(new Map(answers.set(answer.itemId, answer)));
    setError(null);
  };

  const validateAnswers = (): boolean => {
    for (const item of template.items) {
      if (item.isRequired) {
        const answer = answers.get(item.id);
        if (!answer || answer.value === '' || answer.value === false) {
          setError(`El campo "${item.label}" es obligatorio`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async (status: 'in-progress' | 'completed') => {
    if (status === 'completed' && !validateAnswers()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const answersArray = Array.from(answers.values());
      await onSave(answersArray, status);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la auditoría');
    } finally {
      setSaving(false);
    }
  };

  const sortedItems = [...template.items].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {sortedItems.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            answer={answers.get(item.id)}
            onChange={handleAnswerChange}
            disabled={disabled || saving}
          />
        ))}
      </div>

      {sortedItems.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-xl ring-1 ring-slate-200">
          <p className="text-gray-600 text-sm">Esta plantilla no tiene ítems definidos</p>
        </div>
      )}

      {!disabled && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-slate-600">
            {sortedItems.filter((item) => item.isRequired).length} campos obligatorios
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave('in-progress')}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-xl ring-1 ring-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              Guardar Borrador
            </button>
            <button
              onClick={() => handleSave('completed')}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={20} />
              Completar Auditoría
            </button>
          </div>
        </div>
      )}

      {disabled && auditInstance?.status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-600" />
          <span className="text-green-700 font-medium text-sm">
            Esta auditoría ha sido completada y está bloqueada para edición
          </span>
        </div>
      )}
    </div>
  );
}



