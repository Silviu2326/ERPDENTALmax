import { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, Calendar, Download } from 'lucide-react';
import { obtenerConsentimientosPaciente, Consentimiento } from '../api/rgpdApi';

interface TablaConsentimientosPacienteProps {
  pacienteId: string;
}

export default function TablaConsentimientosPaciente({
  pacienteId,
}: TablaConsentimientosPacienteProps) {
  const [consentimientos, setConsentimientos] = useState<Consentimiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pacienteId) {
      cargarConsentimientos();
    }
  }, [pacienteId]);

  const cargarConsentimientos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await obtenerConsentimientosPaciente(pacienteId);
      setConsentimientos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los consentimientos');
    } finally {
      setIsLoading(false);
    }
  };

  const getTipoConsentimientoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      TRATAMIENTO_DATOS: 'Tratamiento de Datos',
      COMUNICACIONES_COMERCIALES: 'Comunicaciones Comerciales',
      CESION_TERCEROS: 'Cesión a Terceros',
    };
    return labels[tipo] || tipo;
  };

  const getMetodoLabel = (metodo: string) => {
    const labels: Record<string, string> = {
      FIRMA_DIGITAL: 'Firma Digital',
      CHECKBOX_WEB: 'Checkbox Web',
      DOCUMENTO_FISICO: 'Documento Físico',
    };
    return labels[metodo] || metodo;
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">{error}</p>
      </div>
    );
  }

  if (consentimientos.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No hay consentimientos registrados para este paciente</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Consentimientos del Paciente</h3>
        <p className="text-sm text-gray-500 mt-1">
          Historial de consentimientos otorgados y revocados
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {consentimientos.map((consentimiento) => (
              <tr key={consentimiento._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getTipoConsentimientoLabel(consentimiento.tipoConsentimiento)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      consentimiento.estado === 'OTORGADO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {consentimiento.estado === 'OTORGADO' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {consentimiento.estado === 'OTORGADO' ? 'Otorgado' : 'Revocado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {getMetodoLabel(consentimiento.metodo)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatFecha(consentimiento.fecha)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {consentimiento.ipRegistro || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {consentimiento.documentoAdjunto && (
                    <button
                      onClick={() => {
                        // Lógica para descargar documento
                        window.open(consentimiento.documentoAdjunto, '_blank');
                      }}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Ver</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


