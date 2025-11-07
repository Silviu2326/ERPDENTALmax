import { useState } from 'react';
import { Plus, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { SesionBlanqueamiento, NuevaSesionData } from '../api/blanqueamientoApi';

interface SeguimientoSesionesBlanqueamientoProps {
  sesiones: SesionBlanqueamiento[];
  onAgregarSesion: (datos: NuevaSesionData) => Promise<void>;
  tratamientoId: string;
  loading?: boolean;
}

export default function SeguimientoSesionesBlanqueamiento({
  sesiones,
  onAgregarSesion,
  tratamientoId,
  loading = false,
}: SeguimientoSesionesBlanqueamientoProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState<NuevaSesionData>({
    fecha: new Date().toISOString().split('T')[0],
    duracionMinutos: 60,
    notasSesion: '',
    sensibilidadReportada: false,
  });
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await onAgregarSesion(formulario);
      setFormulario({
        fecha: new Date().toISOString().split('T')[0],
        duracionMinutos: 60,
        notasSesion: '',
        sensibilidadReportada: false,
      });
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error al agregar sesión:', error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Seguimiento de Sesiones
        </h3>
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Sesión
          </button>
        )}
      </div>

      {mostrarFormulario && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Agregar Nueva Sesión</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de la Sesión <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formulario.fecha}
                  onChange={(e) => setFormulario({ ...formulario, fecha: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formulario.duracionMinutos}
                  onChange={(e) =>
                    setFormulario({ ...formulario, duracionMinutos: parseInt(e.target.value) || 0 })
                  }
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={formulario.sensibilidadReportada}
                  onChange={(e) =>
                    setFormulario({ ...formulario, sensibilidadReportada: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Sensibilidad dental reportada
                </span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notas de la Sesión</label>
              <textarea
                value={formulario.notasSesion}
                onChange={(e) => setFormulario({ ...formulario, notasSesion: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingrese observaciones o notas sobre esta sesión..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={enviando || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {enviando ? 'Guardando...' : 'Guardar Sesión'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false);
                  setFormulario({
                    fecha: new Date().toISOString().split('T')[0],
                    duracionMinutos: 60,
                    notasSesion: '',
                    sensibilidadReportada: false,
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {sesiones.length > 0 ? (
        <div className="space-y-3">
          {sesiones
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .map((sesion, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">
                        {new Date(sesion.fecha).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 ml-8">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{sesion.duracionMinutos} minutos</span>
                      </div>
                      {sesion.sensibilidadReportada && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertCircle className="w-4 h-4" />
                          <span>Sensibilidad reportada</span>
                        </div>
                      )}
                      {!sesion.sensibilidadReportada && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Sin sensibilidad</span>
                        </div>
                      )}
                    </div>
                    {sesion.notasSesion && (
                      <p className="mt-2 text-sm text-gray-700 ml-8">{sesion.notasSesion}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No hay sesiones registradas</p>
          <p className="text-sm text-gray-400 mt-1">Agregue la primera sesión para comenzar el seguimiento</p>
        </div>
      )}
    </div>
  );
}



