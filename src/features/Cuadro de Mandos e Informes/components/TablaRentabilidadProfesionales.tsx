import { Users } from 'lucide-react';
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
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Rentabilidad por Profesional</h3>
            <p className="text-sm text-gray-500">Facturación y productividad</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-4">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Rentabilidad por Profesional</h3>
            <p className="text-sm text-gray-500">Facturación y productividad</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const datosOrdenados = [...datos].sort((a, b) => b.facturacionTotal - a.facturacionTotal);

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Rentabilidad por Profesional</h3>
          <p className="text-sm text-gray-500">Facturación y productividad</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Profesional</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Facturación Total</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Horas Trabajadas</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Facturación/Hora</th>
            </tr>
          </thead>
          <tbody>
            {datosOrdenados.map((profesional, index) => (
              <tr
                key={profesional.profesionalId}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-800">{profesional.profesionalNombre}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-semibold text-green-600">
                    {formatearMoneda(profesional.facturacionTotal)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-gray-700">{profesional.horasTrabajadas} h</span>
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


