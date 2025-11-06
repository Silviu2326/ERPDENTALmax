import { useState, useEffect } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import { PlanFinanciacion, NuevoPlanFinanciacion, PlanFinanciacionActualizado } from '../api/financiacionApi';

interface FormularioPlanFinanciacionProps {
  plan?: PlanFinanciacion;
  onSubmit: (plan: NuevoPlanFinanciacion | PlanFinanciacionActualizado) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function FormularioPlanFinanciacion({
  plan,
  onSubmit,
  onCancel,
  loading,
}: FormularioPlanFinanciacionProps) {
  const [formData, setFormData] = useState({
    nombre: plan?.nombre || '',
    descripcion: plan?.descripcion || '',
    tasaInteresAnual: plan?.tasaInteresAnual || 0,
    numeroCuotasMin: plan?.numeroCuotasMin || 1,
    numeroCuotasMax: plan?.numeroCuotasMax || 12,
    montoMinimo: plan?.montoMinimo || 0,
    montoMaximo: plan?.montoMaximo || 10000,
    requiereEntrada: plan?.requiereEntrada || false,
    porcentajeEntrada: plan?.porcentajeEntrada || 0,
    estado: plan?.estado || ('activo' as 'activo' | 'inactivo'),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (plan) {
      setFormData({
        nombre: plan.nombre || '',
        descripcion: plan.descripcion || '',
        tasaInteresAnual: plan.tasaInteresAnual || 0,
        numeroCuotasMin: plan.numeroCuotasMin || 1,
        numeroCuotasMax: plan.numeroCuotasMax || 12,
        montoMinimo: plan.montoMinimo || 0,
        montoMaximo: plan.montoMaximo || 10000,
        requiereEntrada: plan.requiereEntrada || false,
        porcentajeEntrada: plan.porcentajeEntrada || 0,
        estado: plan.estado || 'activo',
      });
    }
  }, [plan]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (formData.tasaInteresAnual < 0 || formData.tasaInteresAnual > 100) {
      newErrors.tasaInteresAnual = 'La tasa de interés debe estar entre 0 y 100%';
    }

    if (formData.numeroCuotasMin < 1) {
      newErrors.numeroCuotasMin = 'El número mínimo de cuotas debe ser al menos 1';
    }

    if (formData.numeroCuotasMax < formData.numeroCuotasMin) {
      newErrors.numeroCuotasMax = 'El número máximo de cuotas debe ser mayor o igual al mínimo';
    }

    if (formData.montoMinimo < 0) {
      newErrors.montoMinimo = 'El monto mínimo debe ser mayor o igual a 0';
    }

    if (formData.montoMaximo < formData.montoMinimo) {
      newErrors.montoMaximo = 'El monto máximo debe ser mayor o igual al mínimo';
    }

    if (formData.requiereEntrada && (formData.porcentajeEntrada < 0 || formData.porcentajeEntrada > 100)) {
      newErrors.porcentajeEntrada = 'El porcentaje de entrada debe estar entre 0 y 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al guardar el plan:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-bold text-gray-900">
          {plan ? 'Editar Plan de Financiación' : 'Nuevo Plan de Financiación'}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Plan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Plan Flexible 12 meses"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.nombre}</span>
            </p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <input
            type="text"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descripción opcional del plan"
          />
        </div>

        {/* Tasa de Interés Anual */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tasa de Interés Anual (TAE) % <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.tasaInteresAnual}
            onChange={(e) => setFormData({ ...formData, tasaInteresAnual: parseFloat(e.target.value) || 0 })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.tasaInteresAnual ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.tasaInteresAnual && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.tasaInteresAnual}</span>
            </p>
          )}
        </div>

        {/* Número de Cuotas Mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Cuotas Mínimo <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.numeroCuotasMin}
            onChange={(e) => setFormData({ ...formData, numeroCuotasMin: parseInt(e.target.value) || 1 })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.numeroCuotasMin ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.numeroCuotasMin && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.numeroCuotasMin}</span>
            </p>
          )}
        </div>

        {/* Número de Cuotas Máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Cuotas Máximo <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.numeroCuotasMax}
            onChange={(e) => setFormData({ ...formData, numeroCuotasMax: parseInt(e.target.value) || 12 })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.numeroCuotasMax ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.numeroCuotasMax && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.numeroCuotasMax}</span>
            </p>
          )}
        </div>

        {/* Monto Mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto Mínimo (€) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.montoMinimo}
            onChange={(e) => setFormData({ ...formData, montoMinimo: parseFloat(e.target.value) || 0 })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.montoMinimo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.montoMinimo && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.montoMinimo}</span>
            </p>
          )}
        </div>

        {/* Monto Máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto Máximo (€) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.montoMaximo}
            onChange={(e) => setFormData({ ...formData, montoMaximo: parseFloat(e.target.value) || 10000 })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.montoMaximo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.montoMaximo && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.montoMaximo}</span>
            </p>
          )}
        </div>

        {/* Requiere Entrada */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="requiereEntrada"
            checked={formData.requiereEntrada}
            onChange={(e) => setFormData({ ...formData, requiereEntrada: e.target.checked })}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="requiereEntrada" className="text-sm font-medium text-gray-700">
            Requiere Pago Inicial (Entrada)
          </label>
        </div>

        {/* Porcentaje de Entrada */}
        {formData.requiereEntrada && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Porcentaje de Entrada (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.porcentajeEntrada}
              onChange={(e) => setFormData({ ...formData, porcentajeEntrada: parseFloat(e.target.value) || 0 })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.porcentajeEntrada ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.porcentajeEntrada && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.porcentajeEntrada}</span>
              </p>
            )}
          </div>
        )}

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'activo' | 'inactivo' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <X className="w-5 h-5" />
          <span>Cancelar</span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>{loading ? 'Guardando...' : plan ? 'Actualizar' : 'Crear'} Plan</span>
        </button>
      </div>
    </form>
  );
}


