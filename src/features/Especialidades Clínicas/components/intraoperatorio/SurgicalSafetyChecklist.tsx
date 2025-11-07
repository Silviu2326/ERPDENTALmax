import { useState } from 'react';
import { CheckSquare, AlertTriangle } from 'lucide-react';

interface SurgicalSafetyChecklistProps {
  checklistCompletado: boolean;
  onChecklistChange: (completado: boolean) => void;
}

export default function SurgicalSafetyChecklist({ checklistCompletado, onChecklistChange }: SurgicalSafetyChecklistProps) {
  const [items, setItems] = useState({
    identificacionPaciente: false,
    sitioQuirurgico: false,
    procedimiento: false,
    alergias: false,
    consentimiento: false,
    equipoDisponible: false,
    materialEstéril: false,
    anestesiaVerificada: false,
  });

  const handleItemChange = (key: keyof typeof items) => {
    const nuevosItems = { ...items, [key]: !items[key] };
    setItems(nuevosItems);
    
    const todosCompletados = Object.values(nuevosItems).every(v => v === true);
    onChecklistChange(todosCompletados);
  };

  const checklistItems = [
    { key: 'identificacionPaciente' as const, label: 'Identificación del paciente verificada' },
    { key: 'sitioQuirurgico' as const, label: 'Sitio quirúrgico marcado y confirmado' },
    { key: 'procedimiento' as const, label: 'Procedimiento confirmado con el paciente' },
    { key: 'alergias' as const, label: 'Alergias y contraindicaciones revisadas' },
    { key: 'consentimiento' as const, label: 'Consentimiento informado firmado' },
    { key: 'equipoDisponible' as const, label: 'Equipo necesario disponible y funcionando' },
    { key: 'materialEstéril' as const, label: 'Material estéril verificado' },
    { key: 'anestesiaVerificada' as const, label: 'Anestesia verificada y lista' },
  ];

  const itemsCompletados = Object.values(items).filter(v => v).length;
  const totalItems = checklistItems.length;

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
          <CheckSquare size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Checklist de Seguridad Quirúrgica</h3>
      </div>

      {/* Progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Progreso: {itemsCompletados} / {totalItems}
          </span>
          {checklistCompletado && (
            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
              <CheckSquare size={16} />
              Completado
            </span>
          )}
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(itemsCompletados / totalItems) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Items del checklist */}
      <div className="space-y-3">
        {checklistItems.map((item) => (
          <label
            key={item.key}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ring-1 ${
              items[item.key]
                ? 'bg-green-50 ring-green-200'
                : 'bg-slate-50 ring-slate-200 hover:ring-blue-300'
            }`}
          >
            <input
              type="checkbox"
              checked={items[item.key]}
              onChange={() => handleItemChange(item.key)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            />
            <span className={`flex-1 text-sm ${items[item.key] ? 'text-green-800 font-medium' : 'text-slate-700'}`}>
              {item.label}
            </span>
            {items[item.key] && (
              <CheckSquare size={18} className="text-green-600" />
            )}
          </label>
        ))}
      </div>

      {/* Advertencia si no está completo */}
      {!checklistCompletado && itemsCompletados > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 ring-1 ring-yellow-200 rounded-xl">
          <div className="flex items-start gap-2">
            <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Checklist incompleto</p>
              <p className="text-xs text-yellow-700 mt-1">
                Complete todos los items antes de iniciar el procedimiento quirúrgico.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



