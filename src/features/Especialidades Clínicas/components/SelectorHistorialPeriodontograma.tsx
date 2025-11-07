import { Calendar, Plus, Eye, GitCompare, Loader2 } from 'lucide-react';
import { PeriodontogramaResumen } from '../api/periodontogramaApi';

interface SelectorHistorialPeriodontogramaProps {
  historial: PeriodontogramaResumen[];
  periodontogramaActualId?: string;
  onSeleccionar: (id: string) => void;
  onComparar: (id: string) => void;
  onCrearNuevo: () => void;
  loading?: boolean;
}

export default function SelectorHistorialPeriodontograma({
  historial,
  periodontogramaActualId,
  onSeleccionar,
  onComparar,
  onCrearNuevo,
  loading,
}: SelectorHistorialPeriodontogramaProps) {
  const formatearFecha = (fecha: Date | string) => {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Historial de Periodontogramas</h3>
        <button
          onClick={onCrearNuevo}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus size={18} />
          Nuevo
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      ) : historial.length === 0 ? (
        <div className="p-8 text-center bg-white shadow-sm">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay periodontogramas registrados</h3>
          <p className="text-gray-600 mb-4">Cree uno nuevo para comenzar</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {historial.map((periodontograma) => {
            const esActual = periodontograma._id === periodontogramaActualId;
            return (
              <div
                key={periodontograma._id}
                className={`
                  p-4 rounded-xl border transition-all
                  ${esActual
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-slate-500" />
                      <span className="font-semibold text-gray-900">
                        {formatearFecha(periodontograma.fecha)}
                      </span>
                      {esActual && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                          Actual
                        </span>
                      )}
                    </div>
                    {periodontograma.porcentajeSangrado !== undefined && (
                      <div className="text-sm text-slate-600 space-y-1 mt-2">
                        <p>
                          Sangrado: <span className="font-semibold text-gray-900">{periodontograma.porcentajeSangrado.toFixed(1)}%</span>
                        </p>
                        {periodontograma.porcentajePlaca !== undefined && (
                          <p>
                            Placa: <span className="font-semibold text-gray-900">{periodontograma.porcentajePlaca.toFixed(1)}%</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {!esActual && (
                      <>
                        <button
                          onClick={() => onSeleccionar(periodontograma._id)}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="Ver periodontograma"
                        >
                          <Eye size={18} className="text-slate-600" />
                        </button>
                        <button
                          onClick={() => onComparar(periodontograma._id)}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="Comparar con actual"
                        >
                          <GitCompare size={18} className="text-slate-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



