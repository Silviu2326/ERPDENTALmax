import { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet } from 'lucide-react';

interface ModalExportarListaProps {
  isOpen: boolean;
  onClose: () => void;
  totalPacientes: number;
  pacientesSeleccionados: number;
  onExportar: (formato: 'csv' | 'pdf') => void;
}

export default function ModalExportarLista({
  isOpen,
  onClose,
  totalPacientes,
  pacientesSeleccionados,
  onExportar,
}: ModalExportarListaProps) {
  const [formatoSeleccionado, setFormatoSeleccionado] = useState<'csv' | 'pdf'>('csv');
  const [exportando, setExportando] = useState(false);

  if (!isOpen) return null;

  const handleExportar = async () => {
    setExportando(true);
    try {
      await onExportar(formatoSeleccionado);
      // El componente padre manejará la exportación y cerrará el modal
    } catch (error) {
      console.error('Error al exportar:', error);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-gray-900">Exportar Lista</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-slate-600 mb-2">
              {pacientesSeleccionados > 0
                ? `Se exportarán ${pacientesSeleccionados} paciente(s) seleccionado(s)`
                : `Se exportarán todos los ${totalPacientes} paciente(s) de la lista`}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Selecciona el formato de exportación:
            </label>
            <div className="space-y-3">
              <button
                onClick={() => setFormatoSeleccionado('csv')}
                className={`w-full flex items-center gap-3 p-4 ring-2 rounded-xl transition-all ${
                  formatoSeleccionado === 'csv'
                    ? 'ring-blue-600 bg-blue-50'
                    : 'ring-slate-200 hover:ring-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${
                  formatoSeleccionado === 'csv' ? 'bg-blue-600' : 'bg-slate-200'
                }`}>
                  <FileSpreadsheet className={`w-5 h-5 ${
                    formatoSeleccionado === 'csv' ? 'text-white' : 'text-slate-600'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">CSV (Excel)</p>
                  <p className="text-sm text-slate-600">Archivo de texto separado por comas</p>
                </div>
                {formatoSeleccionado === 'csv' && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 ring-4 ring-blue-50"></div>
                )}
              </button>

              <button
                onClick={() => setFormatoSeleccionado('pdf')}
                className={`w-full flex items-center gap-3 p-4 ring-2 rounded-xl transition-all ${
                  formatoSeleccionado === 'pdf'
                    ? 'ring-blue-600 bg-blue-50'
                    : 'ring-slate-200 hover:ring-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${
                  formatoSeleccionado === 'pdf' ? 'bg-blue-600' : 'bg-slate-200'
                }`}>
                  <FileText className={`w-5 h-5 ${
                    formatoSeleccionado === 'pdf' ? 'text-white' : 'text-slate-600'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">PDF</p>
                  <p className="text-sm text-slate-600">Documento PDF formateado</p>
                </div>
                {formatoSeleccionado === 'pdf' && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 ring-4 ring-blue-50"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
            disabled={exportando}
          >
            Cancelar
          </button>
          <button
            onClick={handleExportar}
            disabled={exportando}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-all shadow-sm ring-1 ring-blue-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exportar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



