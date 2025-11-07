import { useState } from 'react';
import { CheckCircle2, Circle, Upload, FileText } from 'lucide-react';
import { ChecklistItem as ChecklistItemType, AuditAnswer } from '../api/auditTemplatesApi';

interface ChecklistItemProps {
  item: ChecklistItemType;
  answer?: AuditAnswer;
  onChange: (answer: AuditAnswer) => void;
  disabled?: boolean;
}

export default function ChecklistItem({
  item,
  answer,
  onChange,
  disabled = false,
}: ChecklistItemProps) {
  const [fileUploading, setFileUploading] = useState(false);

  const handleValueChange = (value: any) => {
    onChange({
      itemId: item.id,
      value,
      notes: answer?.notes || '',
      fileUrl: answer?.fileUrl,
    });
  };

  const handleNotesChange = (notes: string) => {
    onChange({
      itemId: item.id,
      value: answer?.value || '',
      notes,
      fileUrl: answer?.fileUrl,
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileUploading(true);
    try {
      // TODO: Implementar subida de archivo a S3 o similar
      // Por ahora, simulamos la subida
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const fileUrl = URL.createObjectURL(file); // Simulación

      onChange({
        itemId: item.id,
        value: answer?.value || '',
        notes: answer?.notes || '',
        fileUrl,
      });
    } catch (error) {
      console.error('Error al subir archivo:', error);
    } finally {
      setFileUploading(false);
    }
  };

  const renderInput = () => {
    switch (item.type) {
      case 'checkbox':
        const isChecked = answer?.value === true;
        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => !disabled && handleValueChange(!isChecked)}
              disabled={disabled}
              className={`flex items-center gap-2 transition-all ${
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-80'
              }`}
            >
              {isChecked ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400" />
              )}
              <span className="text-slate-700 font-medium">{item.label}</span>
              {item.isRequired && <span className="text-red-500">*</span>}
            </button>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {item.label}
              {item.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={answer?.value || ''}
              onChange={(e) => !disabled && handleValueChange(e.target.value)}
              disabled={disabled}
              rows={3}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed"
              placeholder="Ingrese su respuesta..."
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {item.label}
              {item.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={answer?.value || ''}
              onChange={(e) => !disabled && handleValueChange(e.target.value)}
              disabled={disabled}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="">Seleccione una opción</option>
              {item.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {item.label}
              {item.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center gap-4">
              <label
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl cursor-pointer hover:bg-blue-700 transition-all ${
                  disabled || fileUploading
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <Upload size={20} />
                {fileUploading ? 'Subiendo...' : 'Subir archivo'}
                <input
                  type="file"
                  onChange={handleFileChange}
                  disabled={disabled || fileUploading}
                  className="hidden"
                />
              </label>
              {answer?.fileUrl && (
                <a
                  href={answer.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <FileText size={20} />
                  Ver archivo
                </a>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200 shadow-sm p-4 space-y-4">
      {renderInput()}
      
      {/* Campo de notas adicionales (opcional para todos los tipos) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Notas adicionales (opcional)
        </label>
        <textarea
          value={answer?.notes || ''}
          onChange={(e) => !disabled && handleNotesChange(e.target.value)}
          disabled={disabled}
          rows={2}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed text-sm"
          placeholder="Agregar notas o comentarios..."
        />
      </div>
    </div>
  );
}



