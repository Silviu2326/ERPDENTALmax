import { Users, Loader2 } from 'lucide-react';
import { RentabilidadPorProfesional } from '../api/rentabilidadApi';

interface TablaRentabilidadProfesionalesProps {
  datos: RentabilidadPorProfesional[];
  loading?: boolean;
}

export default function TablaRentabilidadProfesionales({
  datos,
  loading = false,
}: TablaRentabilidadProfesionalesProps) {
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rentabilidad por Profesional</h3>
            <p className="text-sm text-gray-600">Facturación y productividad</p>
          </div>
        </div>
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rentabilidad por Profesional</h3>
            <p className="text-sm text-gray-600">Facturación y productividad</p>
          </div>
        </div>
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600 mb-4">No se encontraron datos de rentabilidad por profesional para el período seleccionado</p>
      </div>
    );
  }

  const datosOrdenados = [...datos].sort((a, b) => b.facturacionTotal - a.facturacionTotal);

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
          <Users size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Rentabilidad por Profesional</h3>
          <p className="text-sm text-gray-600">Facturación y productividad</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Profesional</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-700">Facturación Total</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-700">Horas Trabajadas</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-700">Facturación/Hora</th>
            </tr>
          </thead>
          <tbody>
            {datosOrdenados.map((profesional, index) => (
              <tr
                key={profesional.profesionalId}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{profesional.profesionalNombre}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-semibold text-green-600">
                    {formatearMoneda(profesional.facturacionTotal)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-slate-700">{profesional.horasTrabajadas} h</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-medium text-blue-600">
                    {formatearMoneda(profesional.facturacionPorHora)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



