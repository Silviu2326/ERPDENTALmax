import { FileText, Download, Printer, Mail, Save } from 'lucide-react';

interface VistaPreviaDocumentoProps {
  contenidoHtml: string;
  nombrePlantilla?: string;
  onGenerarPDF?: () => void;
  onImprimir?: () => void;
  onEnviarEmail?: () => void;
  onGuardar?: () => void;
  loading?: boolean;
}

export default function VistaPreviaDocumento({
  contenidoHtml,
  nombrePlantilla,
  onGenerarPDF,
  onImprimir,
  onEnviarEmail,
  onGuardar,
  loading = false,
}: VistaPreviaDocumentoProps) {
  const handleImprimir = () => {
    if (onImprimir) {
      onImprimir();
    } else {
      const ventana = window.open('', '_blank');
      if (ventana) {
        ventana.document.write(contenidoHtml);
        ventana.document.close();
        ventana.print();
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header con acciones */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {nombrePlantilla || 'Vista Previa del Documento'}
              </h3>
              <p className="text-sm text-gray-500">Vista previa del documento generado</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onGuardar && (
              <button
                onClick={onGuardar}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </button>
            )}
            {onGenerarPDF && (
              <button
                onClick={onGenerarPDF}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
            )}
            <button
              onClick={handleImprimir}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
            {onEnviarEmail && (
              <button
                onClick={onEnviarEmail}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido del documento */}
      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Generando documento...</p>
          </div>
        ) : contenidoHtml ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: contenidoHtml }}
          />
        ) : (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No hay contenido para mostrar</p>
              <p className="text-sm mt-2">Selecciona una plantilla y un paciente para generar el documento</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


