import { Calendar, Plus, Eye, GitCompare } from 'lucide-react';
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
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Historial de Periodontogramas</h3>
        <button
          onClick={onCrearNuevo}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          <p>Cargando historial...</p>
        </div>
      ) : historial.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No hay periodontogramas registrados</p>
          <p className="text-xs text-gray-400 mt-1">Cree uno nuevo para comenzar</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {historial.map((periodontograma) => {
            const esActual = periodontograma._id === periodontogramaActualId;
            return (
              <div
                key={periodontograma._id}
                className={`
                  p-3 rounded-lg border-2 transition-all
                  ${esActual
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-800">
                        {formatearFecha(periodontograma.fecha)}
                      </span>
                      {esActual && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                          Actual
                        </span>
                      )}
                    </div>
                    {periodontograma.porcentajeSangrado !== undefined && (
                      <div className="text-xs text-gray-600 space-y-0.5 mt-1">
                        <p>
                          Sangrado: <span className="font-semibold">{periodontograma.porcentajeSangrado.toFixed(1)}%</span>
                        </p>
                        {periodontograma.porcentajePlaca !== undefined && (
                          <p>
                            Placa: <span className="font-semibold">{periodontograma.porcentajePlaca.toFixed(1)}%</span>
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
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Ver periodontograma"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => onComparar(periodontograma._id)}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Comparar con actual"
                        >
                          <GitCompare className="w-4 h-4 text-gray-600" />
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


