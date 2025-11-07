import { useState, useEffect } from 'react';
import { X, Printer, Download, Loader2 } from 'lucide-react';
import { obtenerDatosRecibo, DatosRecibo } from '../api/pagosApi';

interface VisorReciboProps {
  pagoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VisorRecibo({ pagoId, isOpen, onClose }: VisorReciboProps) {
  const [datos, setDatos] = useState<DatosRecibo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && pagoId) {
      cargarDatos();
    } else {
      setDatos(null);
      setError(null);
    }
  }, [isOpen, pagoId]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);

    try {
      const datosRecibo = await obtenerDatosRecibo(pagoId);
      setDatos(datosRecibo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos del recibo');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleDescargar = () => {
    // TODO: Implementar descarga de PDF cuando esté disponible en el backend
    alert('La funcionalidad de descarga de PDF estará disponible próximamente');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Recibo de Pago</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleImprimir}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
              title="Imprimir"
            >
              <Printer size={18} />
              <span>Imprimir</span>
            </button>
            <button
              onClick={handleDescargar}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md"
              title="Descargar PDF"
            >
              <Download size={18} />
              <span>Descargar</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 transition-colors p-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : datos ? (
            <div className="space-y-6 print:space-y-4">
              {/* Encabezado - Datos de la Clínica */}
              <div className="border-b-2 border-gray-300 pb-4">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {datos.datosClinica.nombre}
                  </h1>
                  {datos.datosClinica.direccion && (
                    <p className="text-gray-600">{datos.datosClinica.direccion}</p>
                  )}
                  <div className="flex justify-center space-x-4 mt-2 text-sm text-gray-600">
                    {datos.datosClinica.telefono && <span>Tel: {datos.datosClinica.telefono}</span>}
                    {datos.datosClinica.email && <span>Email: {datos.datosClinica.email}</span>}
                  </div>
                  {datos.datosClinica.cif && (
                    <p className="text-sm text-gray-600 mt-1">CIF: {datos.datosClinica.cif}</p>
                  )}
                </div>
              </div>

              {/* Título del Recibo */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">RECIBO DE PAGO</h2>
                <p className="text-gray-600 mt-1">Nº {datos.numeroRecibo}</p>
              </div>

              {/* Información del Recibo */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha de Emisión</p>
                  <p className="font-semibold text-gray-900">{formatearFecha(datos.fechaEmision)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Factura Relacionada</p>
                  <p className="font-semibold text-gray-900">
                    #{datos.factura.numeroFactura}
                  </p>
                  <p className="text-xs text-gray-500">
                    Fecha: {formatearFecha(datos.factura.fechaEmision)}
                  </p>
                </div>
              </div>

              {/* Información del Paciente */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Datos del Paciente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombre Completo</p>
                    <p className="font-medium text-gray-900">
                      {datos.paciente.nombre} {datos.paciente.apellidos}
                    </p>
                  </div>
                  {datos.paciente.documentoIdentidad && (
                    <div>
                      <p className="text-sm text-gray-600">Documento de Identidad</p>
                      <p className="font-medium text-gray-900">
                        {datos.paciente.documentoIdentidad}
                      </p>
                    </div>
                  )}
                  {datos.paciente.direccion && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Dirección</p>
                      <p className="font-medium text-gray-900">{datos.paciente.direccion}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Detalles del Pago */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Concepto
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">Pago de Factura</p>
                          <p className="text-sm text-gray-600">Método: {datos.pago.metodoPago}</p>
                          <p className="text-xs text-gray-500">
                            Fecha de pago: {formatearFecha(datos.pago.fechaPago)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="font-semibold text-gray-900 text-lg">
                          {formatearMoneda(datos.pago.monto)}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-4 py-3 text-right font-bold text-gray-900" colSpan={2}>
                        Total Recibido: {formatearMoneda(datos.pago.monto)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Notas */}
              {datos.notas && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-1">Notas</p>
                  <p className="text-gray-900">{datos.notas}</p>
                </div>
              )}

              {/* Pie de Página */}
              <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
                <p>Este documento es válido como comprobante de pago.</p>
                <p className="mt-1">Gracias por su confianza.</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}



