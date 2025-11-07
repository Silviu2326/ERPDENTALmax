import { FileText, Download, Eye, PenTool, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Documento } from '../api/documentosApi';

interface DocumentoItemProps {
  documento: Documento;
  onVer: (documento: Documento) => void;
  onDescargar: (documento: Documento) => void;
  onFirmar?: (documento: Documento) => void;
}

const tipoLabels: Record<Documento['tipo'], string> = {
  Consentimiento: 'Consentimiento',
  Receta: 'Receta',
  PlanTratamiento: 'Plan de Tratamiento',
  Factura: 'Factura',
};

const tipoColors: Record<Documento['tipo'], string> = {
  Consentimiento: 'bg-blue-100 text-blue-800',
  Receta: 'bg-green-100 text-green-800',
  PlanTratamiento: 'bg-purple-100 text-purple-800',
  Factura: 'bg-yellow-100 text-yellow-800',
};

export default function DocumentoItem({
  documento,
  onVer,
  onDescargar,
  onFirmar,
}: DocumentoItemProps) {
  const formatoFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const requiereFirma = documento.estado === 'Pendiente de Firma' && documento.tipo === 'Consentimiento';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className={`p-3 rounded-lg ${tipoColors[documento.tipo]}`}>
            <FileText className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {documento.nombreArchivo}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoColors[documento.tipo]}`}>
                {tipoLabels[documento.tipo]}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatoFecha(documento.fechaCreacion)}</span>
              </span>

              {requiereFirma ? (
                <span className="flex items-center space-x-1 text-orange-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Pendiente de Firma</span>
                </span>
              ) : documento.estado === 'Firmado' ? (
                <span className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Firmado</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-gray-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Generado</span>
                </span>
              )}
            </div>

            {documento.firmaDigital && (
              <div className="text-xs text-gray-500 mb-2">
                Firmado el {formatoFecha(documento.firmaDigital.fecha)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onVer(documento)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Ver documento"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDescargar(documento)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Descargar"
          >
            <Download className="w-5 h-5" />
          </button>

          {requiereFirma && onFirmar && (
            <button
              onClick={() => onFirmar(documento)}
              className="flex items-center space-x-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              title="Firmar documento"
            >
              <PenTool className="w-4 h-4" />
              <span className="text-sm font-medium">Firmar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



