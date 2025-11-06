import { useState } from 'react';
import { Eye, Trash2, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Anticipo } from '../api/anticiposApi';
import DetalleAnticipoPanel from './DetalleAnticipoPanel';

interface TablaAnticiposProps {
  anticipos: Anticipo[];
  loading?: boolean;
  onVerDetalle?: (anticipo: Anticipo) => void;
  onAnular?: (anticipoId: string) => void;
}

export default function TablaAnticipos({
  anticipos,
  loading = false,
  onVerDetalle,
  onAnular,
}: TablaAnticiposProps) {
  const [anticipoSeleccionado, setAnticipoSeleccionado] = useState<Anticipo | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const getEstadoBadge = (estado: string) => {
    const badges = {
      disponible: (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          Disponible
        </span>
      ),
      aplicado: (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          Aplicado
        </span>
      ),
      devuelto: (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
          Devuelto
        </span>
      ),
    };
    return badges[estado as keyof typeof badges] || badges.disponible;
  };

  const getMetodoPagoBadge = (metodo: string) => {
    const colores = {
      Efectivo: 'bg-gray-100 text-gray-800',
      Tarjeta: 'bg-purple-100 text-purple-800',
      Transferencia: 'bg-indigo-100 text-indigo-800',
    };
    return colores[metodo as keyof typeof colores] || colores.Efectivo;
  };

  const handleVerDetalle = (anticipo: Anticipo) => {
    setAnticipoSeleccionado(anticipo);
    setMostrarDetalle(true);
    if (onVerDetalle) {
      onVerDetalle(anticipo);
    }
  };

  const handleAnular = (anticipoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Está seguro de que desea anular este anticipo? Esta acción no se puede deshacer.')) {
      if (onAnular) {
        onAnular(anticipoId);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando anticipos...</span>
        </div>
      </div>
    );
  }

  if (anticipos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No se encontraron anticipos</p>
          <p className="text-sm mt-2">Intente ajustar los filtros de búsqueda</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Factura Aplicada
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {anticipos.map((anticipo) => (
                <tr
                  key={anticipo._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleVerDetalle(anticipo)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(anticipo.fecha).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {anticipo.paciente.nombre} {anticipo.paciente.apellidos}
                    </div>
                    {anticipo.paciente.documentoIdentidad && (
                      <div className="text-sm text-gray-500">
                        DNI: {anticipo.paciente.documentoIdentidad}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(anticipo.monto)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMetodoPagoBadge(anticipo.metodoPago)}`}>
                      {anticipo.metodoPago}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(anticipo.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {anticipo.facturaAplicada ? (
                      <span className="text-blue-600 font-medium">
                        #{anticipo.facturaAplicada.numeroFactura}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerDetalle(anticipo);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {anticipo.estado === 'disponible' && onAnular && (
                        <button
                          onClick={(e) => handleAnular(anticipo._id!, e)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Anular anticipo"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle */}
      {mostrarDetalle && anticipoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DetalleAnticipoPanel
              anticipo={anticipoSeleccionado}
              onCerrar={() => {
                setMostrarDetalle(false);
                setAnticipoSeleccionado(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}


