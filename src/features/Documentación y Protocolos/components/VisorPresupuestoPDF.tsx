import { useState, useEffect } from 'react';
import { FileText, Download, Printer, Loader2, AlertCircle } from 'lucide-react';
import { PresupuestoParaFirma } from '../api/presupuestosApi';

interface VisorPresupuestoPDFProps {
  presupuesto: PresupuestoParaFirma | null;
  loading?: boolean;
  onDescargarPDF?: () => void;
  onImprimir?: () => void;
}

export default function VisorPresupuestoPDF({
  presupuesto,
  loading = false,
  onDescargarPDF,
  onImprimir,
}: VisorPresupuestoPDFProps) {
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Cargando presupuesto...</p>
        </div>
      </div>
    );
  }

  if (!presupuesto) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No hay presupuesto seleccionado</p>
        </div>
      </div>
    );
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cantidad);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header con acciones */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-white" />
          <div>
            <h3 className="text-white font-semibold text-lg">Presupuesto #{presupuesto.numeroPresupuesto}</h3>
            <p className="text-blue-100 text-sm">Fecha: {formatearFecha(presupuesto.fechaCreacion)}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {onDescargarPDF && (
            <button
              onClick={onDescargarPDF}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>
          )}
          {onImprimir && (
            <button
              onClick={onImprimir}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
          )}
        </div>
      </div>

      {/* Contenido del presupuesto */}
      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Información del paciente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Paciente</h4>
            <p className="text-gray-900 font-medium">
              {presupuesto.paciente.nombre} {presupuesto.paciente.apellidos}
            </p>
            {presupuesto.paciente.dni && (
              <p className="text-gray-600 text-sm">DNI: {presupuesto.paciente.dni}</p>
            )}
            {presupuesto.paciente.telefono && (
              <p className="text-gray-600 text-sm">Teléfono: {presupuesto.paciente.telefono}</p>
            )}
            {presupuesto.paciente.email && (
              <p className="text-gray-600 text-sm">Email: {presupuesto.paciente.email}</p>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Profesional</h4>
            <p className="text-gray-900 font-medium">
              {presupuesto.profesional.nombre} {presupuesto.profesional.apellidos}
            </p>
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2 mt-4">Sede</h4>
            <p className="text-gray-900 font-medium">{presupuesto.sede.nombre}</p>
            {presupuesto.sede.direccion && (
              <p className="text-gray-600 text-sm">{presupuesto.sede.direccion}</p>
            )}
          </div>
        </div>

        {/* Tratamientos */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Tratamientos</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Descripción
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Cantidad
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Precio Unit.
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Descuento
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {presupuesto.tratamientos.map((tratamiento, index) => {
                  const cantidad = tratamiento.cantidad || 1;
                  const descuento = tratamiento.descuento || 0;
                  const subtotal = tratamiento.precio * cantidad;
                  const totalConDescuento = subtotal - descuento;

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 text-gray-900">
                        {tratamiento.descripcion}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-right text-gray-700">
                        {cantidad}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-right text-gray-700">
                        {formatearMoneda(tratamiento.precio)}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-right text-gray-700">
                        {descuento > 0 ? formatearMoneda(descuento) : '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-right font-semibold text-gray-900">
                        {formatearMoneda(totalConDescuento)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen financiero */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>{formatearMoneda(presupuesto.subtotal)}</span>
            </div>
            {presupuesto.descuentoTotal > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Descuento:</span>
                <span>-{formatearMoneda(presupuesto.descuentoTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>{formatearMoneda(presupuesto.total)}</span>
            </div>
          </div>
        </div>

        {/* Notas y términos */}
        {presupuesto.notas && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Notas</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{presupuesto.notas}</p>
          </div>
        )}

        {presupuesto.terminosYCondiciones && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Términos y Condiciones
            </h4>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{presupuesto.terminosYCondiciones}</p>
          </div>
        )}

        {/* Validez */}
        {presupuesto.fechaValidez && (
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              <strong>Válido hasta:</strong> {formatearFecha(presupuesto.fechaValidez)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


