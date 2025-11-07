import { useState, useEffect } from 'react';
import { Users, Calendar, Filter, CheckCircle } from 'lucide-react';
import { TargetSegment, obtenerVistaPreviaSegmento } from '../api/campanasSmsApi';

interface SelectorSegmentoPacientesProps {
  segmento: TargetSegment;
  onChange: (segmento: TargetSegment) => void;
}

export default function SelectorSegmentoPacientes({
  segmento,
  onChange,
}: SelectorSegmentoPacientesProps) {
  const [vistaPrevia, setVistaPrevia] = useState<number | null>(null);
  const [cargandoVistaPrevia, setCargandoVistaPrevia] = useState(false);
  const [errorVistaPrevia, setErrorVistaPrevia] = useState<string | null>(null);

  const actualizarSegmento = (updates: Partial<TargetSegment>) => {
    const nuevoSegmento = { ...segmento, ...updates };
    onChange(nuevoSegmento);
  };

  useEffect(() => {
    const obtenerVistaPrevia = async () => {
      const segmentoActual = { ...segmento };
      // Asegurar que marketingConsent sea true por defecto para cumplir con GDPR
      if (segmentoActual.marketingConsent === undefined) {
        segmentoActual.marketingConsent = true;
      }

      setCargandoVistaPrevia(true);
      setErrorVistaPrevia(null);
      try {
        const response = await obtenerVistaPreviaSegmento(segmentoActual);
        setVistaPrevia(response.count);
      } catch (err) {
        setErrorVistaPrevia('Error al calcular la vista previa');
        setVistaPrevia(null);
      } finally {
        setCargandoVistaPrevia(false);
      }
    };

    // Debounce para evitar demasiadas llamadas
    const timeoutId = setTimeout(() => {
      obtenerVistaPrevia();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [segmento]);

  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={16} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Segmentación de Pacientes</h3>
      </div>

      <div className="space-y-4">
        {/* Última visita */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Calendar size={16} className="inline mr-1" />
            Última Visita
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                No visitó desde (antes de)
              </label>
              <input
                type="date"
                value={segmento.lastVisitBefore || ''}
                onChange={(e) =>
                  actualizarSegmento({ lastVisitBefore: e.target.value || undefined })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Visitó después de
              </label>
              <input
                type="date"
                value={segmento.lastVisitAfter || ''}
                onChange={(e) =>
                  actualizarSegmento({ lastVisitAfter: e.target.value || undefined })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Rango de edad */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Users size={16} className="inline mr-1" />
            Rango de Edad
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Edad Mínima</label>
              <input
                type="number"
                min="0"
                max="120"
                value={segmento.ageRange?.min || ''}
                onChange={(e) =>
                  actualizarSegmento({
                    ageRange: {
                      ...segmento.ageRange,
                      min: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                placeholder="Ej: 25"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Edad Máxima</label>
              <input
                type="number"
                min="0"
                max="120"
                value={segmento.ageRange?.max || ''}
                onChange={(e) =>
                  actualizarSegmento({
                    ageRange: {
                      ...segmento.ageRange,
                      max: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                placeholder="Ej: 45"
              />
            </div>
          </div>
        </div>

        {/* Consentimiento de marketing */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={segmento.marketingConsent !== false}
              onChange={(e) =>
                actualizarSegmento({ marketingConsent: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <CheckCircle size={16} />
            <span>Incluir solo pacientes con consentimiento de marketing</span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            Requerido por normativas GDPR/LOPD
          </p>
        </div>
      </div>

      {/* Vista previa del conteo */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl ring-1 ring-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            <span className="font-medium text-gray-900">Pacientes que recibirán el SMS:</span>
          </div>
          {cargandoVistaPrevia ? (
            <span className="text-gray-500 text-sm">Calculando...</span>
          ) : errorVistaPrevia ? (
            <span className="text-red-600 text-sm">{errorVistaPrevia}</span>
          ) : (
            <span className="text-2xl font-bold text-blue-600">
              {vistaPrevia !== null ? vistaPrevia.toLocaleString() : '0'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}



