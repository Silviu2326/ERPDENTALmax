import { FileText, Calendar, User, Building2, DollarSign, Shield, Percent } from 'lucide-react';
import { PrefacturaMutua } from '../../api/facturacionMutuaApi';

interface VisorPrefacturaMutuaProps {
  prefactura: PrefacturaMutua;
}

export default function VisorPrefacturaMutua({ prefactura }: VisorPrefacturaMutuaProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8" />
          <div>
            <h3 className="text-2xl font-bold">Prefactura de Mutua</h3>
            {prefactura._id && (
              <p className="text-blue-100 text-sm mt-1">ID: {prefactura._id}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-blue-100">Fecha de Emisión</div>
            <div className="font-semibold">
              {new Date(prefactura.fechaEmision).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
          <div>
            <div className="text-blue-100">Estado</div>
            <div className="font-semibold capitalize">{prefactura.estado}</div>
          </div>
        </div>
      </div>

      {/* Información del paciente y mutua */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <User className="w-5 h-5" />
              <span className="font-semibold">Paciente</span>
            </div>
            <div className="text-gray-900">
              <div className="font-semibold text-lg">
                {prefactura.paciente.nombre} {prefactura.paciente.apellidos}
              </div>
              {prefactura.paciente.DNI && (
                <div className="text-sm text-gray-600 mt-1">DNI: {prefactura.paciente.DNI}</div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">Mutua/Seguro</span>
            </div>
            <div className="text-gray-900">
              <div className="font-semibold text-lg">{prefactura.mutua.nombreComercial}</div>
              <div className="text-sm text-gray-600 mt-1">{prefactura.mutua.razonSocial}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de tratamientos */}
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Tratamientos Facturados</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Código</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Descripción</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Cantidad</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Precio Unit.</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Cubierto</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Copago</th>
              </tr>
            </thead>
            <tbody>
              {prefactura.tratamientos.map((tratamiento, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{tratamiento.codigoMutua}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{tratamiento.descripcion}</td>
                  <td className="py-3 px-4 text-sm text-center text-gray-900">{tratamiento.cantidad}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900">
                    {tratamiento.precio.toFixed(2)} €
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-green-600 font-medium">
                    {tratamiento.importeCubierto.toFixed(2)} €
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-orange-600 font-medium">
                    {tratamiento.copago.toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totales */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-end">
          <div className="w-full max-w-md space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total Factura:</span>
              <span className="text-gray-900 font-bold text-lg">{prefactura.total.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
              <div className="flex items-center gap-2 text-green-700">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Cubierto por Mutua:</span>
              </div>
              <span className="text-green-700 font-bold text-lg">
                {prefactura.totalCubierto.toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
              <div className="flex items-center gap-2 text-orange-700">
                <Percent className="w-4 h-4" />
                <span className="font-medium">Copago del Paciente:</span>
              </div>
              <span className="text-orange-700 font-bold text-lg">
                {prefactura.totalCopago.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notas */}
      {prefactura.notas && (
        <div className="p-6 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-start gap-2">
            <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-yellow-900 mb-1">Notas</div>
              <div className="text-sm text-yellow-800">{prefactura.notas}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


