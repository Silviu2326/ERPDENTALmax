import { useState, useEffect } from 'react';
import { Clock, Calendar, User, FileText, AlertCircle, Loader2 } from 'lucide-react';
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
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando historial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>
    );
  }

  if (ajustes.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Historial de Ajustes</h3>
        <p className="text-gray-600 mb-4">No se han registrado ajustes aún</p>
        <p className="text-sm text-gray-500">El historial aparecerá aquí cuando se registren los primeros ajustes</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Historial de Ajustes</h3>
        <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          {ajustes.length} {ajustes.length === 1 ? 'ajuste' : 'ajustes'}
        </span>
      </div>

      <div className="space-y-4">
        {ajustes.map((ajuste, index) => (
          <div
            key={ajuste._id || index}
            className="border-l-4 border-blue-500 bg-blue-50/50 rounded-r-xl p-4 hover:shadow-md transition-shadow ring-1 ring-slate-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-xl p-2 ring-1 ring-blue-200/70">
                  <Calendar size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {formatearFecha(ajuste.fecha)}
                  </p>
                  {ajuste.createdAt && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      Registrado el {new Date(ajuste.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Zonas ajustadas */}
            {ajuste.zonasAjustadas && ajuste.zonasAjustadas.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-slate-700 mb-2">Zonas Ajustadas:</p>
                <div className="flex flex-wrap gap-2">
                  {ajuste.zonasAjustadas.map((zona, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {zona}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Descripción */}
            <div className="mb-3">
              <p className="text-sm font-medium text-slate-700 mb-1">Descripción del Ajuste:</p>
              <p className="text-gray-900 whitespace-pre-wrap">{ajuste.descripcionAjuste}</p>
            </div>

            {/* Feedback del paciente */}
            {ajuste.feedbackPaciente && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <User size={16} />
                  Feedback del Paciente:
                </p>
                <p className="text-gray-700 italic whitespace-pre-wrap bg-white rounded-lg p-3 ring-1 ring-slate-200">
                  "{ajuste.feedbackPaciente}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {modoLectura && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800 flex items-center gap-2">
            <AlertCircle size={16} />
            Modo de solo lectura - Este historial es visible para el laboratorio como referencia
          </p>
        </div>
      )}
    </div>
  );
}



