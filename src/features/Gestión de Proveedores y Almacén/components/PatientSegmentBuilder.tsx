import { useState } from 'react';
import { Users, Calendar, DollarSign, Filter, X } from 'lucide-react';
import { SegmentCriteria, obtenerConteoPacientesSegmento } from '../api/campaignsApi';

interface PatientSegmentBuilderProps {
  segmentCriteria: SegmentCriteria;
  onChange: (criteria: SegmentCriteria) => void;
}

export default function PatientSegmentBuilder({
  segmentCriteria,
  onChange,
}: PatientSegmentBuilderProps) {
  const [pacienteCount, setPacienteCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);

  const handleUpdateCriteria = (newCriteria: SegmentCriteria) => {
    onChange(newCriteria);
    actualizarConteo(newCriteria);
  };

  const actualizarConteo = async (criteria: SegmentCriteria) => {
    try {
      setLoadingCount(true);
      const count = await obtenerConteoPacientesSegmento(criteria);
      setPacienteCount(count);
    } catch (error) {
      console.error('Error al obtener conteo:', error);
      setPacienteCount(null);
    } finally {
      setLoadingCount(false);
    }
  };

  const removeFilter = (filterType: keyof SegmentCriteria) => {
    const newCriteria = { ...segmentCriteria };
    delete newCriteria[filterType];
    handleUpdateCriteria(newCriteria);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-slate-600" />
          <h3 className="text-lg font-semibold text-gray-900">Criterios de Segmentación</h3>
        </div>
        {pacienteCount !== null && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Users size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {loadingCount ? 'Calculando...' : `${pacienteCount} pacientes`}
            </span>
          </div>
        )}
      </div>

      {/* Filtro por última visita */}
      <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-slate-600" />
            <label className="block text-sm font-medium text-slate-700">Última Visita</label>
          </div>
          {segmentCriteria.lastVisitDate && (
            <button
              onClick={() => removeFilter('lastVisitDate')}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {segmentCriteria.lastVisitDate ? (
          <div className="pl-6 text-sm text-slate-600">
            <p>
              {segmentCriteria.lastVisitDate.operator === 'before' && 'Antes de'}
              {segmentCriteria.lastVisitDate.operator === 'after' && 'Después de'}
              {segmentCriteria.lastVisitDate.operator === 'between' && 'Entre'}
              {segmentCriteria.lastVisitDate.value && ` ${new Date(segmentCriteria.lastVisitDate.value).toLocaleDateString()}`}
              {segmentCriteria.lastVisitDate.value2 && ` y ${new Date(segmentCriteria.lastVisitDate.value2).toLocaleDateString()}`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <select
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5 text-sm"
              value={segmentCriteria.lastVisitDate?.operator || ''}
              onChange={(e) => {
                const operator = e.target.value as 'before' | 'after' | 'between';
                if (operator) {
                  handleUpdateCriteria({
                    ...segmentCriteria,
                    lastVisitDate: { operator, value: new Date().toISOString() },
                  });
                }
              }}
            >
              <option value="">Seleccionar criterio...</option>
              <option value="before">Antes de</option>
              <option value="after">Después de</option>
              <option value="between">Entre fechas</option>
            </select>
            {segmentCriteria.lastVisitDate && (
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5 text-sm"
                  value={
                    segmentCriteria.lastVisitDate.value
                      ? new Date(segmentCriteria.lastVisitDate.value).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    handleUpdateCriteria({
                      ...segmentCriteria,
                      lastVisitDate: {
                        ...segmentCriteria.lastVisitDate!,
                        value: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                      },
                    })
                  }
                />
                {segmentCriteria.lastVisitDate.operator === 'between' && (
                  <input
                    type="date"
                    className="flex-1 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5 text-sm"
                    value={
                      segmentCriteria.lastVisitDate.value2
                        ? new Date(segmentCriteria.lastVisitDate.value2).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      handleUpdateCriteria({
                        ...segmentCriteria,
                        lastVisitDate: {
                          ...segmentCriteria.lastVisitDate!,
                          value2: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                        },
                      })
                    }
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filtro por saldo pendiente */}
      <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-slate-600" />
            <label className="block text-sm font-medium text-slate-700">Saldo Pendiente</label>
          </div>
          {segmentCriteria.accountBalance && (
            <button
              onClick={() => removeFilter('accountBalance')}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {segmentCriteria.accountBalance ? (
          <div className="pl-6 text-sm text-slate-600">
            <p>
              {segmentCriteria.accountBalance.operator === 'greater' && 'Mayor que'}
              {segmentCriteria.accountBalance.operator === 'less' && 'Menor que'}
              {segmentCriteria.accountBalance.operator === 'equal' && 'Igual a'}{' '}
              €{segmentCriteria.accountBalance.value}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <select
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5 text-sm"
              value={segmentCriteria.accountBalance?.operator || ''}
              onChange={(e) => {
                const operator = e.target.value as 'greater' | 'less' | 'equal';
                if (operator) {
                  handleUpdateCriteria({
                    ...segmentCriteria,
                    accountBalance: { operator, value: 0 },
                  });
                }
              }}
            >
              <option value="">Seleccionar criterio...</option>
              <option value="greater">Mayor que</option>
              <option value="less">Menor que</option>
              <option value="equal">Igual a</option>
            </select>
            {segmentCriteria.accountBalance && (
              <input
                type="number"
                step="0.01"
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5 text-sm"
                placeholder="Monto"
                value={segmentCriteria.accountBalance.value || ''}
                onChange={(e) =>
                  handleUpdateCriteria({
                    ...segmentCriteria,
                    accountBalance: {
                      ...segmentCriteria.accountBalance!,
                      value: parseFloat(e.target.value) || 0,
                    },
                  })
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}



