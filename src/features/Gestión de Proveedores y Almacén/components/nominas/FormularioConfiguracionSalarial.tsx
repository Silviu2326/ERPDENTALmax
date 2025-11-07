import { useState, useEffect } from 'react';
import { Save, User } from 'lucide-react';
import {
  ConfiguracionSalarial,
  obtenerConfiguracionSalarial,
  actualizarConfiguracionSalarial,
} from '../../api/nominasApi';

interface FormularioConfiguracionSalarialProps {
  empleadoId: string;
  empleadoNombre?: string;
  onGuardado?: () => void;
}

export default function FormularioConfiguracionSalarial({
  empleadoId,
  empleadoNombre,
  onGuardado,
}: FormularioConfiguracionSalarialProps) {
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configuracion, setConfiguracion] = useState<ConfiguracionSalarial>({
    tipoContrato: 'Mixto',
    salarioBase: 0,
    porcentajeComision: 0,
    cuentaBancaria: '',
    rfc: '',
    configuracionFiscal: {
      retenciones: 0,
      seguroSocial: 0,
    },
  });

  useEffect(() => {
    cargarConfiguracion();
  }, [empleadoId]);

  const cargarConfiguracion = async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerConfiguracionSalarial(empleadoId);
      setConfiguracion(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    try {
      await actualizarConfiguracionSalarial(empleadoId, configuracion);
      if (onGuardado) {
        onGuardado();
      }
      alert('Configuración salarial guardada exitosamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la configuración');
    } finally {
      setGuardando(false);
    }
  };

  const handleChange = (field: keyof ConfiguracionSalarial, value: any) => {
    setConfiguracion((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeFiscal = (field: string, value: number) => {
    setConfiguracion((prev) => ({
      ...prev,
      configuracionFiscal: {
        ...prev.configuracionFiscal,
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Configuración Salarial</h2>
          {empleadoNombre && (
            <p className="text-sm text-gray-600 mt-1">{empleadoNombre}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de Contrato y Salario Base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Contrato *
            </label>
            <select
              value={configuracion.tipoContrato}
              onChange={(e) =>
                handleChange('tipoContrato', e.target.value as 'Fijo' | 'Comision' | 'Mixto')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Fijo">Fijo</option>
              <option value="Comision">Comisión</option>
              <option value="Mixto">Mixto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salario Base *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={configuracion.salarioBase}
              onChange={(e) => handleChange('salarioBase', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Porcentaje de Comisión (si aplica) */}
        {(configuracion.tipoContrato === 'Comision' || configuracion.tipoContrato === 'Mixto') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Porcentaje de Comisión (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={configuracion.porcentajeComision || 0}
              onChange={(e) => handleChange('porcentajeComision', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Porcentaje de comisión sobre tratamientos facturados
            </p>
          </div>
        )}

        {/* Datos Bancarios */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos Bancarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuenta Bancaria (IBAN)
              </label>
              <input
                type="text"
                value={configuracion.cuentaBancaria || ''}
                onChange={(e) => handleChange('cuentaBancaria', e.target.value)}
                placeholder="ES12 3456 7890 1234 5678 9012"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RFC / NIF</label>
              <input
                type="text"
                value={configuracion.rfc || ''}
                onChange={(e) => handleChange('rfc', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Configuración Fiscal */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración Fiscal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retenciones (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={configuracion.configuracionFiscal?.retenciones || 0}
                onChange={(e) =>
                  handleChangeFiscal('retenciones', parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seguridad Social (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={configuracion.configuracionFiscal?.seguroSocial || 0}
                onChange={(e) =>
                  handleChangeFiscal('seguroSocial', parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={guardando}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Save className="w-5 h-5" />
            {guardando ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </div>
  );
}



