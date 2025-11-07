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
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">Cargando presupuesto...</p>
      </div>
    );
  }

  if (!presupuesto) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay presupuesto seleccionado</h3>
        <p className="text-gray-600">Por favor, selecciona un presupuesto para visualizarlo</p>
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
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Header con acciones */}
      <div className="bg-white border-b border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Presupuesto #{presupuesto.numeroPresupuesto}</h3>
            <p className="text-sm text-gray-600">Fecha: {formatearFecha(presupuesto.fechaCreacion)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {onDescargarPDF && (
            <button
              onClick={onDescargarPDF}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all ring-1 ring-slate-200"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>
          )}
          {onImprimir && (
            <button
              onClick={onImprimir}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all ring-1 ring-slate-200"
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
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Información del paciente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Paciente</h4>
            <p className="text-gray-900 font-medium">
              {presupuesto.paciente.nombre} {presupuesto.paciente.apellidos}
            </p>
            {presupuesto.paciente.dni && (
              <p className="text-sm text-gray-600 mt-1">DNI: {presupuesto.paciente.dni}</p>
            )}
            {presupuesto.paciente.telefono && (
              <p className="text-sm text-gray-600 mt-1">Teléfono: {presupuesto.paciente.telefono}</p>
            )}
            {presupuesto.paciente.email && (
              <p className="text-sm text-gray-600 mt-1">Email: {presupuesto.paciente.email}</p>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Profesional</h4>
            <p className="text-gray-900 font-medium">
              {presupuesto.profesional.nombre} {presupuesto.profesional.apellidos}
            </p>
            <h4 className="text-sm font-medium text-slate-700 mb-2 mt-4">Sede</h4>
            <p className="text-gray-900 font-medium">{presupuesto.sede.nombre}</p>
            {presupuesto.sede.direccion && (
              <p className="text-sm text-gray-600 mt-1">{presupuesto.sede.direccion}</p>
            )}
          </div>
        </div>

        {/* Tratamientos */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">Tratamientos</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="ring-1 ring-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700">
                    Descripción
                  </th>
                  <th className="ring-1 ring-slate-200 px-4 py-3 text-right text-sm font-medium text-slate-700">
                    Cantidad
                  </th>
                  <th className="ring-1 ring-slate-200 px-4 py-3 text-right text-sm font-medium text-slate-700">
                    Precio Unit.
                  </th>
                  <th className="ring-1 ring-slate-200 px-4 py-3 text-right text-sm font-medium text-slate-700">
                    Descuento
                  </th>
                  <th className="ring-1 ring-slate-200 px-4 py-3 text-right text-sm font-medium text-slate-700">
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
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="ring-1 ring-slate-200 px-4 py-3 text-gray-900">
                        {tratamiento.descripcion}
                      </td>
                      <td className="ring-1 ring-slate-200 px-4 py-3 text-right text-gray-700">
                        {cantidad}
                      </td>
                      <td className="ring-1 ring-slate-200 px-4 py-3 text-right text-gray-700">
                        {formatearMoneda(tratamiento.precio)}
                      </td>
                      <td className="ring-1 ring-slate-200 px-4 py-3 text-right text-gray-700">
                        {descuento > 0 ? formatearMoneda(descuento) : '-'}
                      </td>
                      <td className="ring-1 ring-slate-200 px-4 py-3 text-right font-semibold text-gray-900">
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
            <h4 className="text-sm font-medium text-slate-700 mb-2">Notas</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{presupuesto.notas}</p>
          </div>
        )}

        {presupuesto.terminosYCondiciones && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">
              Términos y Condiciones
            </h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{presupuesto.terminosYCondiciones}</p>
          </div>
        )}

        {/* Validez */}
        {presupuesto.fechaValidez && (
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              <strong className="font-medium text-slate-700">Válido hasta:</strong> {formatearFecha(presupuesto.fechaValidez)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



