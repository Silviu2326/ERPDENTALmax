import { FileText, Eye, Download, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { ConsentimientoPaciente } from '../api/consentimientosApi';

interface TablaConsentimientosProps {
  consentimientos: ConsentimientoPaciente[];
  onVerConsentimiento: (id: string) => void;
  onDescargarPDF?: (id: string) => void;
  loading?: boolean;
}

export default function TablaConsentimientos({
  consentimientos,
  onVerConsentimiento,
  onDescargarPDF,
  loading = false,
}: TablaConsentimientosProps) {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'firmado':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Firmado
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </span>
        );
      case 'revocado':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Revocado
          </span>
        );
      default:
        return null;
    }
  };

  const formatearFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return fecha;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (consentimientos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No hay consentimientos registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plantilla
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tratamiento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Generación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Firma
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {consentimientos.map((consentimiento) => (
            <tr key={consentimiento._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {consentimiento.plantilla_origen?.nombre || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {consentimiento.tratamiento?.nombre || 'Sin tratamiento'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{getEstadoBadge(consentimiento.estado)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatearFecha(consentimiento.fecha_generacion)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {consentimiento.fecha_firma ? formatearFecha(consentimiento.fecha_firma) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onVerConsentimiento(consentimiento._id!)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    title="Ver consentimiento"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {consentimiento.estado === 'firmado' && onDescargarPDF && (
                    <button
                      onClick={() => onDescargarPDF(consentimiento._id!)}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                      title="Descargar PDF"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

