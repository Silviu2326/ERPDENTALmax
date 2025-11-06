import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { FiltrosInformeCostes, exportarInformePDF, exportarInformeCSV } from '../api/informesEquipamientoApi';

interface BotonExportarInformeProps {
  filtros: FiltrosInformeCostes;
}

export default function BotonExportarInforme({
  filtros,
}: BotonExportarInformeProps) {
  const [exportando, setExportando] = useState<'pdf' | 'csv' | null>(null);

  const handleExportarPDF = async () => {
    try {
      setExportando('pdf');
      const blob = await exportarInformePDF(filtros);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `informe-costes-equipamiento-${filtros.fechaInicio || 'inicio'}-${filtros.fechaFin || 'fin'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al exportar el informe en PDF. Por favor, inténtelo de nuevo.');
    } finally {
      setExportando(null);
    }
  };

  const handleExportarCSV = async () => {
    try {
      setExportando('csv');
      const blob = await exportarInformeCSV(filtros);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `informe-costes-equipamiento-${filtros.fechaInicio || 'inicio'}-${filtros.fechaFin || 'fin'}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      alert('Error al exportar el informe en CSV. Por favor, inténtelo de nuevo.');
    } finally {
      setExportando(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportarPDF}
        disabled={exportando !== null}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exportando === 'pdf' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        <span>Exportar PDF</span>
      </button>
      <button
        onClick={handleExportarCSV}
        disabled={exportando !== null}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exportando === 'csv' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-4 h-4" />
        )}
        <span>Exportar CSV</span>
      </button>
    </div>
  );
}


