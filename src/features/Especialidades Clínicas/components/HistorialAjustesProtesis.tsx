import { useState, useEffect } from 'react';
import { Clock, Calendar, User, FileText, AlertCircle } from 'lucide-react';
import { AjusteProtesis, obtenerHistorialAjustes } from '../api/protesisRemovibleApi';

interface HistorialAjustesProtesisProps {
  tratamientoId: string;
  modoLectura?: boolean; // Para el rol de Protésico/Laboratorio
}

export default function HistorialAjustesProtesis({
  tratamientoId,
  modoLectura = false,
}: HistorialAjustesProtesisProps) {
  const [ajustes, setAjustes] = useState<AjusteProtesis[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarHistorial();
  }, [tratamientoId]);

  const cargarHistorial = async () => {
    setCargando(true);
    setError(null);
    try {
      const historial = await obtenerHistorialAjustes(tratamientoId);
      // Ordenar por fecha descendente (más reciente primero)
      historial.sort((a, b) => {
        const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
        const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
        return fechaB - fechaA;
      });
      setAjustes(historial);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial de ajustes');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return fecha;
    }
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando historial...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (ajustes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Historial de Ajustes</h3>
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No se han registrado ajustes aún</p>
          <p className="text-sm mt-1">El historial aparecerá aquí cuando se registren los primeros ajustes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Historial de Ajustes</h3>
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {ajustes.length} {ajustes.length === 1 ? 'ajuste' : 'ajustes'}
        </span>
      </div>

      <div className="space-y-4">
        {ajustes.map((ajuste, index) => (
          <div
            key={ajuste._id || index}
            className="border-l-4 border-blue-500 bg-blue-50 rounded-r-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white rounded-full p-2">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {formatearFecha(ajuste.fecha)}
                  </p>
                  {ajuste.createdAt && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      Registrado el {new Date(ajuste.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Zonas ajustadas */}
            {ajuste.zonasAjustadas && ajuste.zonasAjustadas.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Zonas Ajustadas:</p>
                <div className="flex flex-wrap gap-2">
                  {ajuste.zonasAjustadas.map((zona, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                    >
                      {zona}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Descripción */}
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Descripción del Ajuste:</p>
              <p className="text-gray-800 whitespace-pre-wrap">{ajuste.descripcionAjuste}</p>
            </div>

            {/* Feedback del paciente */}
            {ajuste.feedbackPaciente && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Feedback del Paciente:
                </p>
                <p className="text-gray-700 italic whitespace-pre-wrap bg-white rounded p-2 border border-blue-200">
                  "{ajuste.feedbackPaciente}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {modoLectura && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Modo de solo lectura - Este historial es visible para el laboratorio como referencia
          </p>
        </div>
      )}
    </div>
  );
}


