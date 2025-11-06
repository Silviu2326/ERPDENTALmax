import { X, Download, CheckCircle2 } from 'lucide-react';
import { Nomina, actualizarEstadoNomina } from '../../api/nominasApi';
import { useState } from 'react';

interface ModalDetalleNominaProps {
  nomina: Nomina | null;
  onClose: () => void;
  onActualizar?: () => void;
}

export default function ModalDetalleNomina({
  nomina,
  onClose,
  onActualizar,
}: ModalDetalleNominaProps) {
  const [actualizando, setActualizando] = useState(false);

  if (!nomina) return null;

  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(monto);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleActualizarEstado = async (nuevoEstado: 'Aprobada' | 'Pagada') => {
    if (!nomina._id) return;

    setActualizando(true);
    try {
      await actualizarEstadoNomina(nomina._id, nuevoEstado);
      if (onActualizar) {
        onActualizar();
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado de la nómina');
    } finally {
      setActualizando(false);
    }
  };

  const handleDescargarPDF = () => {
    // TODO: Implementar descarga de PDF
    alert('Funcionalidad de descarga de PDF en desarrollo');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Detalle de Nómina</h2>
            <p className="text-blue-100 mt-1">
              {nomina.empleadoNombre || `Empleado ${nomina.empleadoId}`} -{' '}
              {meses[nomina.periodo.mes - 1]} {nomina.periodo.anio}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDescargarPDF}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Descargar PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Fecha de Cálculo</p>
              <p className="text-lg font-semibold text-gray-900">{formatearFecha(nomina.fechaCalculo)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Estado</p>
              <p className="text-lg font-semibold text-gray-900">{nomina.estado}</p>
            </div>
          </div>

          {/* Resumen Financiero */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen Financiero</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Salario Base</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatearMoneda(nomina.salarioBase)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Comisiones</span>
                <span className="text-lg font-semibold text-green-600">
                  +{formatearMoneda(nomina.totalComisiones)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Percepciones</span>
                <span className="text-lg font-semibold text-blue-600">
                  {formatearMoneda(nomina.totalPercepciones)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-blue-200 pt-3">
                <span className="text-gray-700">Total Deducciones</span>
                <span className="text-lg font-semibold text-red-600">
                  -{formatearMoneda(nomina.totalDeducciones)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-blue-300 pt-3">
                <span className="text-xl font-bold text-gray-900">Neto a Pagar</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatearMoneda(nomina.netoAPagar)}
                </span>
              </div>
            </div>
          </div>

          {/* Desglose de Comisiones */}
          {nomina.desgloseComisiones && nomina.desgloseComisiones.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Desglose de Comisiones</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Paciente
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Monto Tratamiento
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        % Comisión
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Monto Comisión
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {nomina.desgloseComisiones.map((comision, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{comision.paciente}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {formatearMoneda(comision.montoTratamiento)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {comision.porcentajeComision}%
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600 text-right">
                          {formatearMoneda(comision.montoComision)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Desglose de Deducciones */}
          {nomina.desgloseDeducciones && nomina.desgloseDeducciones.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Desglose de Deducciones</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Concepto
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {nomina.desgloseDeducciones.map((deduccion, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{deduccion.concepto}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-red-600 text-right">
                          -{formatearMoneda(deduccion.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            {nomina.estado === 'Calculada' && (
              <button
                onClick={() => handleActualizarEstado('Aprobada')}
                disabled={actualizando}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                {actualizando ? 'Aprobando...' : 'Aprobar Nómina'}
              </button>
            )}
            {nomina.estado === 'Aprobada' && (
              <button
                onClick={() => handleActualizarEstado('Pagada')}
                disabled={actualizando}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                {actualizando ? 'Marcando como pagada...' : 'Marcar como Pagada'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


