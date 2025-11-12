import { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, CheckSquare, Square } from 'lucide-react';
import { Cita, FiltrosCalendario } from '../api/citasApi';

interface ExportCitasModalProps {
  isOpen: boolean;
  onClose: () => void;
  citas: Cita[];
  filtros: FiltrosCalendario;
  profesionales: Array<{ _id: string; nombre: string; apellidos: string }>;
  sedes: Array<{ _id: string; nombre: string }>;
}

interface ColumnOption {
  key: string;
  label: string;
  default: boolean;
}

const COLUMN_OPTIONS: ColumnOption[] = [
  { key: 'fecha', label: 'Fecha', default: true },
  { key: 'hora_inicio', label: 'Hora Inicio', default: true },
  { key: 'hora_fin', label: 'Hora Fin', default: true },
  { key: 'paciente_nombre', label: 'Paciente', default: true },
  { key: 'paciente_telefono', label: 'Teléfono', default: true },
  { key: 'paciente_email', label: 'Email', default: false },
  { key: 'profesional', label: 'Profesional', default: true },
  { key: 'sede', label: 'Sede', default: true },
  { key: 'tratamiento', label: 'Tratamiento', default: true },
  { key: 'estado', label: 'Estado', default: true },
  { key: 'duracion', label: 'Duración (min)', default: true },
  { key: 'box', label: 'Box', default: false },
  { key: 'notas', label: 'Notas', default: false },
  { key: 'fecha_creacion', label: 'Fecha Creación', default: false },
];

export default function ExportCitasModal({
  isOpen,
  onClose,
  citas,
  filtros,
  profesionales,
  sedes,
}: ExportCitasModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set(COLUMN_OPTIONS.filter(col => col.default).map(col => col.key))
  );
  const [formato, setFormato] = useState<'csv' | 'excel'>('csv');
  const [exportando, setExportando] = useState(false);

  if (!isOpen) return null;

  const toggleColumn = (key: string) => {
    const newSelected = new Set(selectedColumns);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedColumns(newSelected);
  };

  const selectAll = () => {
    setSelectedColumns(new Set(COLUMN_OPTIONS.map(col => col.key)));
  };

  const deselectAll = () => {
    setSelectedColumns(new Set());
  };

  const getFiltrosTexto = (): string => {
    const partes: string[] = [];
    
    if (filtros.fecha_inicio && filtros.fecha_fin) {
      const inicio = new Date(filtros.fecha_inicio).toLocaleDateString('es-ES');
      const fin = new Date(filtros.fecha_fin).toLocaleDateString('es-ES');
      partes.push(`Período: ${inicio} - ${fin}`);
    }
    
    if (filtros.profesional_id) {
      const prof = profesionales.find(p => p._id === filtros.profesional_id);
      if (prof) partes.push(`Profesional: ${prof.nombre} ${prof.apellidos}`);
    }
    
    if (filtros.sede_id) {
      const sede = sedes.find(s => s._id === filtros.sede_id);
      if (sede) partes.push(`Sede: ${sede.nombre}`);
    }
    
    if (filtros.estado) {
      partes.push(`Estado: ${filtros.estado}`);
    }
    
    if (filtros.box_id) {
      partes.push(`Box: ${filtros.box_id}`);
    }
    
    return partes.join(' | ') || 'Sin filtros aplicados';
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (value instanceof Date) return value.toLocaleString('es-ES');
    return String(value);
  };

  const exportarCitas = async () => {
    if (selectedColumns.size === 0) {
      alert('Por favor, selecciona al menos una columna para exportar');
      return;
    }

    setExportando(true);

    try {
      // Preparar datos
      const columnas = COLUMN_OPTIONS.filter(col => selectedColumns.has(col.key));
      const headers = columnas.map(col => col.label);
      
      const rows = citas.map(cita => {
        const fechaInicio = new Date(cita.fecha_hora_inicio);
        const fechaFin = new Date(cita.fecha_hora_fin);
        
        const row: Record<string, string> = {};
        
        if (selectedColumns.has('fecha')) {
          row.fecha = fechaInicio.toLocaleDateString('es-ES');
        }
        if (selectedColumns.has('hora_inicio')) {
          row.hora_inicio = fechaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        }
        if (selectedColumns.has('hora_fin')) {
          row.hora_fin = fechaFin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        }
        if (selectedColumns.has('paciente_nombre')) {
          row.paciente_nombre = `${cita.paciente.nombre} ${cita.paciente.apellidos}`;
        }
        if (selectedColumns.has('paciente_telefono')) {
          row.paciente_telefono = cita.paciente.telefono || '';
        }
        if (selectedColumns.has('paciente_email')) {
          row.paciente_email = cita.paciente.email || '';
        }
        if (selectedColumns.has('profesional')) {
          row.profesional = `${cita.profesional.nombre} ${cita.profesional.apellidos}`;
        }
        if (selectedColumns.has('sede')) {
          row.sede = cita.sede.nombre;
        }
        if (selectedColumns.has('tratamiento')) {
          row.tratamiento = cita.tratamiento?.nombre || '';
        }
        if (selectedColumns.has('estado')) {
          row.estado = cita.estado;
        }
        if (selectedColumns.has('duracion')) {
          row.duracion = String(cita.duracion_minutos);
        }
        if (selectedColumns.has('box')) {
          row.box = cita.box_asignado || '';
        }
        if (selectedColumns.has('notas')) {
          row.notas = cita.notas || '';
        }
        if (selectedColumns.has('fecha_creacion')) {
          const fechaCreacion = cita.historial_cambios?.[0]?.fecha 
            ? new Date(cita.historial_cambios[0].fecha)
            : new Date();
          row.fecha_creacion = fechaCreacion.toLocaleString('es-ES');
        }
        
        return columnas.map(col => {
          const value = row[col.key] || '';
          // Escapar comillas y envolver en comillas si contiene comas o saltos de línea
          if (value.includes(',') || value.includes('\n') || value.includes('"')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
      });

      // Crear contenido CSV
      const metadatos = [
        ['METADATOS DE EXPORTACIÓN'],
        ['Fecha de exportación', new Date().toLocaleString('es-ES')],
        ['Total de citas', String(citas.length)],
        ['Filtros aplicados', getFiltrosTexto()],
        ['Columnas exportadas', columnas.map(col => col.label).join(', ')],
        [],
        ['DATOS'],
      ];

      const csvContent = [
        ...metadatos.map(row => row.join(',')),
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');

      // Crear blob y descargar
      const mimeType = formato === 'csv' 
        ? 'text/csv;charset=utf-8;' 
        : 'application/vnd.ms-excel';
      
      const blob = new Blob(['\ufeff' + csvContent], { type: mimeType }); // BOM para UTF-8
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const extension = formato === 'csv' ? 'csv' : 'xlsx';
      const fecha = new Date().toISOString().split('T')[0];
      link.download = `citas-exportadas-${fecha}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Registrar log de exportación
      await registrarLogExportacion({
        fecha: new Date().toISOString(),
        totalCitas: citas.length,
        formato,
        columnas: Array.from(selectedColumns),
        filtros: getFiltrosTexto(),
      });

      // Mostrar mensaje de éxito
      alert(`Exportación completada. Se exportaron ${citas.length} citas.`);
      onClose();
    } catch (error) {
      console.error('Error al exportar citas:', error);
      alert('Error al exportar las citas. Por favor, inténtelo de nuevo.');
    } finally {
      setExportando(false);
    }
  };

  const registrarLogExportacion = async (log: {
    fecha: string;
    totalCitas: number;
    formato: string;
    columnas: string[];
    filtros: string;
  }) => {
    try {
      // Guardar en localStorage como log local
      const logsKey = 'agenda_export_logs';
      const logs = JSON.parse(localStorage.getItem(logsKey) || '[]');
      logs.push({
        ...log,
        id: `export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      });
      
      // Mantener solo los últimos 50 logs
      const logsLimitados = logs.slice(-50);
      localStorage.setItem(logsKey, JSON.stringify(logsLimitados));
      
      // En producción, aquí se haría una llamada a la API para guardar el log en el servidor
      // await fetch('/api/agenda/export-logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(log),
      // });
    } catch (error) {
      console.warn('Error al registrar log de exportación:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Exportar Citas</h2>
              <p className="text-sm text-gray-600">
                {citas.length} citas visibles con los filtros actuales
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Formato */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Formato de exportación
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setFormato('csv')}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    formato === 'csv'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">CSV</span>
                </button>
                <button
                  onClick={() => setFormato('excel')}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    formato === 'excel'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  <span className="font-medium">Excel</span>
                </button>
              </div>
            </div>

            {/* Columnas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Columnas a exportar
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={selectAll}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Seleccionar todas
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={deselectAll}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Deseleccionar todas
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                {COLUMN_OPTIONS.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    {selectedColumns.has(col.key) ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">{col.label}</span>
                    <input
                      type="checkbox"
                      checked={selectedColumns.has(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Metadatos */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Información de exportación</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Total de citas:</strong> {citas.length}</p>
                <p><strong>Filtros aplicados:</strong> {getFiltrosTexto()}</p>
                <p><strong>Columnas seleccionadas:</strong> {selectedColumns.size} de {COLUMN_OPTIONS.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={exportarCitas}
            disabled={exportando || selectedColumns.size === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {exportando ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

