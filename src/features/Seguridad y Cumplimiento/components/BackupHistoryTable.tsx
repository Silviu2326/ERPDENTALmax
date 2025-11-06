import { useState } from 'react';
import { Download, RotateCcw, Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { BackupLog, formatFileSize } from '../api/backupApi';

interface BackupHistoryTableProps {
  backups: BackupLog[];
  loading?: boolean;
  onDownload: (backupId: string) => void;
  onRestore: (backup: BackupLog) => void;
  onRefresh?: () => void;
}

export default function BackupHistoryTable({
  backups,
  loading = false,
  onDownload,
  onRestore,
  onRefresh,
}: BackupHistoryTableProps) {
  const [backupExpanded, setBackupExpanded] = useState<string | null>(null);

  const formatearFecha = (fecha: Date | string) => {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const obtenerIconoEstado = (status: BackupLog['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const obtenerTextoEstado = (status: BackupLog['status']) => {
    const estados: Record<BackupLog['status'], string> = {
      completed: 'Completado',
      failed: 'Fallido',
      pending: 'En Progreso',
    };
    return estados[status];
  };

  const obtenerColorEstado = (status: BackupLog['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatearDuracion = (ms?: number) => {
    if (!ms) return 'N/A';
    const segundos = Math.floor(ms / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);

    if (horas > 0) {
      return `${horas}h ${minutos % 60}m`;
    } else if (minutos > 0) {
      return `${minutos}m ${segundos % 60}s`;
    } else {
      return `${segundos}s`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando historial de copias de seguridad...</p>
      </div>
    );
  }

  if (backups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">No se encontraron copias de seguridad</p>
        <p className="text-sm text-gray-500">Crea tu primera copia de seguridad manual para comenzar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tamaño
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duración
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creado Por
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {backups.map((backup) => (
              <>
                <tr key={backup._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatearFecha(backup.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        backup.type === 'manual'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {backup.type === 'manual' ? 'Manual' : 'Automática'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {obtenerIconoEstado(backup.status)}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${obtenerColorEstado(
                          backup.status
                        )}`}
                      >
                        {obtenerTextoEstado(backup.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backup.size ? formatFileSize(backup.size) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatearDuracion(backup.durationMs)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backup.createdBy?.nombre || 'Sistema'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {backup.description && (
                        <button
                          onClick={() =>
                            setBackupExpanded(backupExpanded === backup._id ? null : backup._id || null)
                          }
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {backup.status === 'completed' && (
                        <>
                          <button
                            onClick={() => onDownload(backup._id || '')}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Descargar"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRestore(backup)}
                            className="text-orange-600 hover:text-orange-900 transition-colors"
                            title="Restaurar"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                {backupExpanded === backup._id && backup.description && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 bg-gray-50">
                      <div className="text-sm">
                        <p className="font-medium text-gray-700 mb-1">Descripción:</p>
                        <p className="text-gray-600">{backup.description}</p>
                        {backup.errorMessage && (
                          <>
                            <p className="font-medium text-red-700 mt-2 mb-1">Error:</p>
                            <p className="text-red-600">{backup.errorMessage}</p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


