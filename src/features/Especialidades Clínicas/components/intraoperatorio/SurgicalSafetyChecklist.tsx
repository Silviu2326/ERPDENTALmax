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
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-2 rounded-lg">
          <CheckSquare className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Checklist de Seguridad Quirúrgica</h3>
      </div>

      {/* Progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progreso: {itemsCompletados} / {totalItems}
          </span>
          {checklistCompletado && (
            <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
              <CheckSquare className="w-4 h-4" />
              Completado
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(itemsCompletados / totalItems) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Items del checklist */}
      <div className="space-y-3">
        {checklistItems.map((item) => (
          <label
            key={item.key}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
              items[item.key]
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-gray-50 border-2 border-gray-200 hover:border-amber-300'
            }`}
          >
            <input
              type="checkbox"
              checked={items[item.key]}
              onChange={() => handleItemChange(item.key)}
              className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 cursor-pointer"
            />
            <span className={`flex-1 text-sm ${items[item.key] ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
              {item.label}
            </span>
            {items[item.key] && (
              <CheckSquare className="w-5 h-5 text-green-600" />
            )}
          </label>
        ))}
      </div>

      {/* Advertencia si no está completo */}
      {!checklistCompletado && itemsCompletados > 0 && (
        <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Checklist incompleto</p>
              <p className="text-xs text-amber-700 mt-1">
                Complete todos los items antes de iniciar el procedimiento quirúrgico.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


