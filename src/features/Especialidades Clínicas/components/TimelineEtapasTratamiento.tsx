import { Calendar, FileImage, X } from 'lucide-react';
import { OrtodonciaDiagnostico } from '../api/ortodonciaDiagnosticoApi';

interface TimelineEtapasTratamientoProps {
  diagnosticos: OrtodonciaDiagnostico[];
  diagnosticoSeleccionado?: string;
  onSeleccionarDiagnostico: (diagnosticoId: string) => void;
  onEliminarDiagnostico?: (diagnosticoId: string) => void;
}

export default function TimelineEtapasTratamiento({
  diagnosticos,
  diagnosticoSeleccionado,
  onSeleccionarDiagnostico,
  onEliminarDiagnostico,
}: TimelineEtapasTratamientoProps) {
  const etapas = ['Inicial', 'Progreso', 'Final', 'Retención'] as const;
  
  const diagnosticosPorEtapa = etapas.map(etapa => ({
    etapa,
    diagnosticos: diagnosticos.filter(d => d.etapa === etapa).sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    ),
  }));

  const getColorEtapa = (etapa: string) => {
    switch (etapa) {
      case 'Inicial':
        return 'bg-blue-500';
      case 'Progreso':
        return 'bg-yellow-500';
      case 'Final':
        return 'bg-green-500';
      case 'Retención':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLabelEtapa = (etapa: string) => {
    switch (etapa) {
      case 'Inicial':
        return 'Inicial';
      case 'Progreso':
        return 'Progreso';
      case 'Final':
        return 'Final';
      case 'Retención':
        return 'Retención';
      default:
        return etapa;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Línea de Tiempo de Etapas</h3>
      
      <div className="space-y-6">
        {diagnosticosPorEtapa.map(({ etapa, diagnosticos: diags }) => (
          <div key={etapa} className="relative">
            {/* Etiqueta de etapa */}
            <div className="flex items-center mb-3">
              <div className={`w-3 h-3 rounded-full ${getColorEtapa(etapa)} mr-3`} />
              <h4 className="text-sm font-medium text-slate-700">{getLabelEtapa(etapa)}</h4>
              <span className="ml-2 text-sm text-slate-500">({diags.length})</span>
            </div>

            {/* Lista de diagnósticos en esta etapa */}
            {diags.length > 0 ? (
              <div className="ml-6 space-y-2">
                {diags.map((diagnostico) => (
                  <div
                    key={diagnostico._id}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ring-1 ${
                      diagnosticoSeleccionado === diagnostico._id
                        ? 'ring-blue-400 bg-blue-50 shadow-sm'
                        : 'ring-slate-200 hover:ring-slate-300 hover:bg-slate-50'
                    }`}
                    onClick={() => diagnostico._id && onSeleccionarDiagnostico(diagnostico._id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileImage size={18} className="text-slate-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(diagnostico.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-xs text-slate-500">
                          {diagnostico.archivos.length} archivo(s)
                        </div>
                      </div>
                    </div>
                    {onEliminarDiagnostico && diagnostico._id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEliminarDiagnostico(diagnostico._id!);
                        }}
                        className="p-1 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                        title="Eliminar diagnóstico"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="ml-6 text-sm text-slate-400 italic">
                No hay registros en esta etapa
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



