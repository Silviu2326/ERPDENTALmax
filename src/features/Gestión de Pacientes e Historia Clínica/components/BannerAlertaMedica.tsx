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
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-4 mb-6 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-red-900 mb-2">⚠️ Alertas Médicas Críticas</h3>
          
          {alergiasCriticas.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-red-800 mb-1">Alergias Críticas:</h4>
              <ul className="list-disc list-inside space-y-1">
                {alergiasCriticas.map((alergia, index) => (
                  <li key={index} className="text-red-700">
                    <span className="font-medium">{alergia.nombre}</span>
                    {alergia.tipo && (
                      <span className="text-sm text-red-600 ml-2">({alergia.tipo})</span>
                    )}
                    {alergia.reaccion && (
                      <span className="text-sm text-red-600 ml-2">- {alergia.reaccion}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {antecedentesCriticos.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-800 mb-1">Condiciones Médicas Críticas:</h4>
              <ul className="list-disc list-inside space-y-1">
                {antecedentesCriticos.map((antecedente, index) => (
                  <li key={index} className="text-red-700">
                    <span className="font-medium">{antecedente.nombre}</span>
                    {antecedente.diagnostico && (
                      <span className="text-sm text-red-600 ml-2">- {antecedente.diagnostico}</span>
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


