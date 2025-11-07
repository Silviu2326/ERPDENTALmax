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
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200">
      {/* Header con acciones */}
      <div className="px-6 py-4 border-b border-gray-200/60">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {nombrePlantilla || 'Vista Previa del Documento'}
              </h3>
              <p className="text-sm text-gray-600">Vista previa del documento generado</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {onGuardar && (
              <button
                onClick={onGuardar}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                <span>Guardar</span>
              </button>
            )}
            {onGenerarPDF && (
              <button
                onClick={onGenerarPDF}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                <span>PDF</span>
              </button>
            )}
            <button
              onClick={handleImprimir}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer size={18} />
              <span>Imprimir</span>
            </button>
            {onEnviarEmail && (
              <button
                onClick={onEnviarEmail}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail size={18} />
                <span>Email</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido del documento */}
      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm text-gray-600">Generando documento...</p>
          </div>
        ) : contenidoHtml ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: contenidoHtml }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay contenido para mostrar</h3>
            <p className="text-sm text-gray-600">Selecciona una plantilla y un paciente para generar el documento</p>
          </div>
        )}
      </div>
    </div>
  );
}



