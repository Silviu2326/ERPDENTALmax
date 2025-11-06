import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { TraceabilityReportFilters, exportarInformeTrazabilidad } from '../api/traceabilityApi';

interface ExportReportButtonProps {
  filtros: TraceabilityReportFilters;
  disabled?: boolean;
}

export default function ExportReportButton({ filtros, disabled = false }: ExportReportButtonProps) {
  const [exportando, setExportando] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const descargarArchivo = (blob: Blob, nombreArchivo: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExportar = async (formato: 'pdf' | 'csv') => {
    try {
      setExportando(true);
      setMensaje(null);
      setMostrarMenu(false);

      const blob = await exportarInformeTrazabilidad(filtros, formato);
      
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `informe-trazabilidad-${fecha}.${formato}`;
      
      descargarArchivo(blob, nombreArchivo);

      setMensaje({
        tipo: 'success',
        texto: `Informe exportado correctamente como ${formato.toUpperCase()}`,
      });

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error al exportar informe:', error);
      setMensaje({
        tipo: 'error',
        texto: error.message || 'Error al exportar el informe. Por favor, intente nuevamente.',
      });

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setMensaje(null);
      }, 5000);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setMostrarMenu(!mostrarMenu)}
        disabled={disabled || exportando}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {exportando ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Exportando...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Exportar Informe</span>
          </>
        )}
      </button>

      {/* Menú desplegable */}
      {mostrarMenu && !exportando && (
        <>
          {/* Overlay para cerrar el menú al hacer clic fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMostrarMenu(false)}
          ></div>
          
          {/* Menú */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={() => handleExportar('pdf')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-red-600" />
                <span>Exportar como PDF</span>
              </button>
              <button
                onClick={() => handleExportar('csv')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <span>Exportar como CSV</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mensaje de éxito/error */}
      {mensaje && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-30">
          <div className={`flex items-start space-x-3 ${mensaje.tipo === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {mensaje.tipo === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium">{mensaje.texto}</p>
          </div>
        </div>
      )}
    </div>
  );
}

