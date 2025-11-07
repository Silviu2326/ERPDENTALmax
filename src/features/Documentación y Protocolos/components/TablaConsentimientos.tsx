import { FileText, Eye, Download, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 size={12} />
            Firmado
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} />
            Pendiente
          </span>
        );
      case 'revocado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} />
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
      <div className="p-8 text-center bg-white shadow-sm rounded-lg">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (consentimientos.length === 0) {
    return (
      <div className="p-8 text-center bg-white shadow-sm rounded-lg">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay consentimientos registrados</h3>
        <p className="text-gray-600">Selecciona un paciente para ver sus consentimientos</p>
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
            <tr key={consentimiento._id} className="hover:bg-gray-50 transition-colors">
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatearFecha(consentimiento.fecha_generacion)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {consentimiento.fecha_firma ? formatearFecha(consentimiento.fecha_firma) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onVerConsentimiento(consentimiento._id!)}
                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Ver consentimiento"
                  >
                    <Eye size={20} />
                  </button>
                  {consentimiento.estado === 'firmado' && onDescargarPDF && (
                    <button
                      onClick={() => onDescargarPDF(consentimiento._id!)}
                      className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-xl transition-colors"
                      title="Descargar PDF"
                    >
                      <Download size={20} />
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

