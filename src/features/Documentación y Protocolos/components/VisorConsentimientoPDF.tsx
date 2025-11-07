import { FileText, Download, Printer, X } from 'lucide-react';

interface VisorConsentimientoPDFProps {
  contenido: string; // HTML o contenido del consentimiento
  nombrePaciente?: string;
  nombrePlantilla?: string;
  estado?: 'pendiente' | 'firmado' | 'revocado';
  fechaFirma?: string;
  firmaDigitalUrl?: string;
  onCerrar?: () => void;
  onDescargarPDF?: () => void;
  onImprimir?: () => void;
}

export default function VisorConsentimientoPDF({
  contenido,
  nombrePaciente,
  nombrePlantilla,
  estado,
  fechaFirma,
  firmaDigitalUrl,
  onCerrar,
  onDescargarPDF,
  onImprimir,
}: VisorConsentimientoPDFProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={24} className="text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {nombrePlantilla || 'Consentimiento Informado'}
            </h3>
            {nombrePaciente && (
              <p className="text-sm text-gray-600">Paciente: {nombrePaciente}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {estado === 'firmado' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Firmado
            </span>
          )}
          {onImprimir && (
            <button
              onClick={onImprimir}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              title="Imprimir"
            >
              <Printer size={20} />
            </button>
          )}
          {onDescargarPDF && estado === 'firmado' && (
            <button
              onClick={onDescargarPDF}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              title="Descargar PDF"
            >
              <Download size={20} />
            </button>
          )}
          {onCerrar && (
            <button
              onClick={onCerrar}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              title="Cerrar"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: contenido }}
        />

        {/* Sección de Firma */}
        {estado === 'firmado' && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Firma del Paciente</h4>
                {fechaFirma && (
                  <p className="text-sm text-gray-600 mb-3">
                    Fecha de firma: {new Date(fechaFirma).toLocaleDateString('es-ES')}
                  </p>
                )}
                {firmaDigitalUrl ? (
                  <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                    <img
                      src={firmaDigitalUrl}
                      alt="Firma del paciente"
                      className="max-w-xs h-20 object-contain"
                    />
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-xl p-4 bg-gray-50 text-center text-gray-500">
                    Firma registrada digitalmente
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



