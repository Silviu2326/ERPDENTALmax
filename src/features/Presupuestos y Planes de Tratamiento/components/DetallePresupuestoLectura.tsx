import { PresupuestoCompleto } from '../api/presupuestosApi';
import { Receipt, Calendar, User, Building } from 'lucide-react';

interface DetallePresupuestoLecturaProps {
  presupuesto: PresupuestoCompleto;
}

export default function DetallePresupuestoLectura({ presupuesto }: DetallePresupuestoLecturaProps) {
  const formatFecha = (fecha: string | undefined) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cantidad);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Presupuesto #{presupuesto.numeroPresupuesto}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Creado el {formatFecha(presupuesto.fechaCreacion)}
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
            {presupuesto.estado}
          </div>
        </div>
      </div>

      {/* Información del Paciente y Profesional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-700">Paciente</h3>
          </div>
          <p className="text-gray-800 font-medium">
            {presupuesto.paciente.nombre} {presupuesto.paciente.apellidos}
          </p>
          {presupuesto.paciente.dni && (
            <p className="text-sm text-gray-600 mt-1">DNI: {presupuesto.paciente.dni}</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-700">Profesional</h3>
          </div>
          <p className="text-gray-800 font-medium">
            {presupuesto.profesional.nombre} {presupuesto.profesional.apellidos}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Building className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-700">Sede</h3>
          </div>
          <p className="text-gray-800 font-medium">{presupuesto.sede.nombre}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-700">Validez</h3>
          </div>
          <p className="text-gray-800 font-medium">
            {presupuesto.fechaValidez ? formatFecha(presupuesto.fechaValidez) : 'Sin fecha de vencimiento'}
          </p>
        </div>
      </div>

      {/* Tabla de Tratamientos */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tratamientos Incluidos</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Tratamiento
                </th>
                {presupuesto.tratamientos?.some((t) => t.pieza) && (
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Pieza
                  </th>
                )}
                {presupuesto.tratamientos?.some((t) => t.cara) && (
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Cara
                  </th>
                )}
                <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Precio Unitario
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Descuento
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {presupuesto.tratamientos?.map((tratamiento, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 text-sm text-gray-800">
                    {typeof tratamiento.tratamiento === 'object'
                      ? tratamiento.tratamiento.nombre
                      : tratamiento.descripcion || 'Tratamiento'}
                    {typeof tratamiento.tratamiento === 'object' && tratamiento.tratamiento.codigo && (
                      <span className="text-gray-500 ml-2">({tratamiento.tratamiento.codigo})</span>
                    )}
                  </td>
                  {presupuesto.tratamientos?.some((t) => t.pieza) && (
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">
                      {tratamiento.pieza || '-'}
                    </td>
                  )}
                  {presupuesto.tratamientos?.some((t) => t.cara) && (
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">
                      {tratamiento.cara || '-'}
                    </td>
                  )}
                  <td className="border border-gray-300 px-4 py-3 text-sm text-right text-gray-800">
                    {formatMoneda(tratamiento.precio)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm text-right text-gray-600">
                    {tratamiento.descuento > 0 ? formatMoneda(tratamiento.descuento) : '-'}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm text-right font-semibold text-gray-800">
                    {formatMoneda(tratamiento.precio - (tratamiento.descuento || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen Financiero */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen Financiero</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-800 font-medium">{formatMoneda(presupuesto.subtotal)}</span>
          </div>
          {presupuesto.descuentoTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Descuento Total:</span>
              <span className="text-red-600 font-medium">-{formatMoneda(presupuesto.descuentoTotal)}</span>
            </div>
          )}
          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatMoneda(presupuesto.totalFinal || presupuesto.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notas */}
      {presupuesto.notas && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Notas</h4>
          <p className="text-sm text-gray-700">{presupuesto.notas}</p>
        </div>
      )}
    </div>
  );
}


