import { AlertTriangle } from 'lucide-react';
import { Alergia, AntecedenteMedico } from '../api/historiaClinicaApi';

interface BannerAlertaMedicaProps {
  alergias: Alergia[];
  antecedentes: AntecedenteMedico[];
}

export default function BannerAlertaMedica({ alergias, antecedentes }: BannerAlertaMedicaProps) {
  const alergiasCriticas = alergias.filter((a) => a.critica);
  const antecedentesCriticos = antecedentes.filter((a) => a.critica);

  const hayAlertas = alergiasCriticas.length > 0 || antecedentesCriticos.length > 0;

  if (!hayAlertas) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 ring-2 ring-red-300 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <AlertTriangle size={24} className="text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Alertas Médicas Críticas</h3>
          
          {alergiasCriticas.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-red-800 mb-1">Alergias Críticas:</h4>
              <ul className="list-disc list-inside space-y-1">
                {alergiasCriticas.map((alergia, index) => (
                  <li key={index} className="text-sm text-red-700">
                    <span className="font-medium">{alergia.nombre}</span>
                    {alergia.tipo && (
                      <span className="text-xs text-red-600 ml-2">({alergia.tipo})</span>
                    )}
                    {alergia.reaccion && (
                      <span className="text-xs text-red-600 ml-2">- {alergia.reaccion}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {antecedentesCriticos.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-1">Condiciones Médicas Críticas:</h4>
              <ul className="list-disc list-inside space-y-1">
                {antecedentesCriticos.map((antecedente, index) => (
                  <li key={index} className="text-sm text-red-700">
                    <span className="font-medium">{antecedente.nombre}</span>
                    {antecedente.diagnostico && (
                      <span className="text-xs text-red-600 ml-2">- {antecedente.diagnostico}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



