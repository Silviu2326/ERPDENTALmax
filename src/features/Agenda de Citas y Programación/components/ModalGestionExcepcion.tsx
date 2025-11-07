import { useState, useEffect } from 'react';
import { X, Calendar, Clock, FileText, Save, AlertCircle } from 'lucide-react';
import { ExcepcionDisponibilidad, CrearExcepcion, crearExcepcion, actualizarExcepcion } from '../api/disponibilidadApi';

interface ModalGestionExcepcionProps {
  isOpen: boolean;
  onClose: () => void;
  profesionalId: string;
  sedeId?: string;
  excepcion?: ExcepcionDisponibilidad | null;
  onExcepcionGuardada: () => void;
}

export default function ModalGestionExcepcion({
  isOpen,
  onClose,
  profesionalId,
  sedeId,
  excepcion,
  onExcepcionGuardada,
}: ModalGestionExcepcionProps) {
  const [formData, setFormData] = useState<CrearExcepcion>({
    profesionalId: '',
    sedeId: '',
    fechaInicio: '',
    fechaFin: '',
    motivo: '',
    diaCompleto: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (excepcion) {
        // Modo edición
        setFormData({
          profesionalId: excepcion.profesional,
          sedeId: excepcion.sede || '',
          fechaInicio: excepcion.fechaInicio,
          fechaFin: excepcion.fechaFin,
          motivo: excepcion.motivo,
          diaCompleto: excepcion.diaCompleto,
        });
      } else {
        // Modo creación
        const ahora = new Date();
        const fechaInicio = new Date(ahora);
        fechaInicio.setHours(9, 0, 0, 0);
        const fechaFin = new Date(ahora);
        fechaFin.setHours(18, 0, 0, 0);

        setFormData({
          profesionalId,
          sedeId: sedeId || '',
          fechaInicio: fechaInicio.toISOString(),
          fechaFin: fechaFin.toISOString(),
          motivo: '',
          diaCompleto: false,
        });
      }
      setError(null);
    }
  }, [isOpen, excepcion, profesionalId, sedeId]);

  const validarFormulario = (): boolean => {
    if (!formData.fechaInicio || !formData.fechaFin) {
      setError('Debe seleccionar fechas de inicio y fin');
      return false;
    }

    const inicio = new Date(formData.fechaInicio);
    const fin = new Date(formData.fechaFin);

    if (inicio > fin) {
      setError('La fecha de inicio debe ser anterior a la fecha de fin');
      return false;
    }

    if (!formData.motivo.trim()) {
      setError('Debe especificar un motivo');
      return false;
    }

    setError(null);
    return true;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      if (excepcion?._id) {
        // Actualizar excepción existente
        await actualizarExcepcion(excepcion._id, formData);
      } else {
        // Crear nueva excepción
        await crearExcepcion(formData);
      }
      onExcepcionGuardada();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la excepción');
    } finally {
      setGuardando(false);
    }
  };

  const handleDiaCompletoChange = (diaCompleto: boolean) => {
    setFormData({ ...formData, diaCompleto });
    if (diaCompleto) {
      // Si es día completo, establecer la hora de inicio y fin al inicio y fin del día
      const fechaInicio = new Date(formData.fechaInicio);
      fechaInicio.setHours(0, 0, 0, 0);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setHours(23, 59, 59, 999);
      setFormData({
        ...formData,
        diaCompleto: true,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
      });
    }
  };

  if (!isOpen) return null;

  // Convertir fechas ISO a formato local para los inputs
  const fechaInicioLocal = formData.fechaInicio ? new Date(formData.fechaInicio).toISOString().slice(0, 16) : '';
  const fechaFinLocal = formData.fechaFin ? new Date(formData.fechaFin).toISOString().slice(0, 16) : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Calendar size={20} />
            <span>{excepcion ? 'Editar Excepción' : 'Nueva Excepción'}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
              <input
                type="checkbox"
                checked={formData.diaCompleto}
                onChange={(e) => handleDiaCompletoChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>Día completo</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha y Hora Inicio {!formData.diaCompleto && '*'}
              </label>
              <input
                type="datetime-local"
                value={fechaInicioLocal}
                onChange={(e) => {
                  const fecha = new Date(e.target.value);
                  setFormData({ ...formData, fechaInicio: fecha.toISOString() });
                }}
                disabled={formData.diaCompleto || guardando}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100"
                required={!formData.diaCompleto}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha y Hora Fin {!formData.diaCompleto && '*'}
              </label>
              <input
                type="datetime-local"
                value={fechaFinLocal}
                onChange={(e) => {
                  const fecha = new Date(e.target.value);
                  setFormData({ ...formData, fechaFin: fecha.toISOString() });
                }}
                disabled={formData.diaCompleto || guardando}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100"
                required={!formData.diaCompleto}
              />
            </div>
          </div>

          {formData.diaCompleto && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha *
              </label>
              <input
                type="date"
                value={formData.fechaInicio ? new Date(formData.fechaInicio).toISOString().slice(0, 10) : ''}
                onChange={(e) => {
                  const fecha = new Date(e.target.value);
                  fecha.setHours(0, 0, 0, 0);
                  const fechaFin = new Date(fecha);
                  fechaFin.setHours(23, 59, 59, 999);
                  setFormData({
                    ...formData,
                    fechaInicio: fecha.toISOString(),
                    fechaFin: fechaFin.toISOString(),
                  });
                }}
                disabled={guardando}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <FileText size={16} className="inline mr-1" />
              Motivo *
            </label>
            <textarea
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              disabled={guardando}
              rows={3}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100"
              placeholder="Ej: Vacaciones, Baja médica, Congreso, Formación..."
              required
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={guardando}
            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            <span>{guardando ? 'Guardando...' : 'Guardar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}



