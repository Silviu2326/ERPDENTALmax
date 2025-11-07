import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { obtenerPlanesFinanciacion, PlanFinanciacion, FiltrosPlanesFinanciacion } from '../api/financiacionApi';

interface SelectorDePlanProps {
  value?: string;
  onChange: (planId: string) => void;
  filtros?: FiltrosPlanesFinanciacion;
  disabled?: boolean;
  className?: string;
}

export default function SelectorDePlan({ value, onChange, filtros, disabled, className }: SelectorDePlanProps) {
  const [planes, setPlanes] = useState<PlanFinanciacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarPlanes();
  }, [filtros]);

  const cargarPlanes = async () => {
    setLoading(true);
    setError(null);
    try {
      const planesData = await obtenerPlanesFinanciacion(filtros || { estado: 'activo' });
      setPlanes(planesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los planes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Cargando planes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-sm text-red-600 ${className}`}>
        {error}
      </div>
    );
  }

  if (planes.length === 0) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No hay planes de financiación disponibles
      </div>
    );
  }

  return (
    <div className={className}>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Selecciona un plan de financiación</option>
        {planes.map((plan) => (
          <option key={plan._id} value={plan._id}>
            {plan.nombre} - {plan.numeroCuotasMin}-{plan.numeroCuotasMax} cuotas - TAE: {plan.tasaInteresAnual}%
          </option>
        ))}
      </select>
      {value && (
        <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          <span>Plan seleccionado</span>
        </div>
      )}
    </div>
  );
}



