import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, History } from 'lucide-react';
import { Cita, NuevaCita, obtenerDetalleCita, actualizarCita } from '../api/citasApi';
import FormEditarCita from './FormEditarCita';

interface ModalEditarCitaProps {
  citaId: string;
  onClose: () => void;
  onSave: () => void;
}

export default function ModalEditarCita({
  citaId,
  onClose,
  onSave,
}: ModalEditarCitaProps) {
  const [cita, setCita] = useState<Cita | null>(null);
  const [formData, setFormData] = useState<Partial<NuevaCita>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disponibilidadValida, setDisponibilidadValida] = useState<boolean | null>(null);

  // Cargar datos de la cita
  useEffect(() => {
    const cargarCita = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simular delay de carga
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simular datos de cita (en producción vendría de la API)
        // Por ahora, creamos una cita mock basada en el ID
        const citaDataMock: Cita = {
          _id: citaId,
          paciente: {
            _id: '1',
            nombre: 'Ana',
            apellidos: 'Martínez',
            telefono: '123456789',
            email: 'ana.martinez@email.com',
          },
          profesional: {
            _id: '1',
            nombre: 'Juan',
            apellidos: 'Pérez',
          },
          sede: {
            _id: '1',
            nombre: 'Sede Central',
          },
          fecha_hora_inicio: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          fecha_hora_fin: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          duracion_minutos: 30,
          estado: 'confirmada',
          tratamiento: {
            _id: '1',
            nombre: 'Limpieza dental',
          },
          notas: 'Primera visita',
          box_asignado: '1',
          creadoPor: { _id: '1', nombre: 'Admin' },
          historial_cambios: [
            {
              fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              usuario: 'Admin',
              cambio: 'Cita creada',
            },
            {
              fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              usuario: 'Recepcionista',
              cambio: 'Cita confirmada por teléfono',
            },
          ],
        };
        
        setCita(citaDataMock);

        // Prellenar el formulario con los datos de la cita
        setFormData({
          paciente: citaDataMock.paciente._id,
          profesional: citaDataMock.profesional._id,
          fecha_hora_inicio: citaDataMock.fecha_hora_inicio,
          fecha_hora_fin: citaDataMock.fecha_hora_fin,
          tratamiento: citaDataMock.tratamiento?._id || '',
          notas: citaDataMock.notas || '',
          box_asignado: citaDataMock.box_asignado || '',
          estado: citaDataMock.estado as any,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos de la cita');
      } finally {
        setLoading(false);
      }
    };

    if (citaId) {
      cargarCita();
    }
  }, [citaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!disponibilidadValida && disponibilidadValida !== null) {
      if (!confirm('La disponibilidad podría no estar confirmada. ¿Desea continuar de todos modos?')) {
        return;
      }
    }

    setSaving(true);
    setError(null);

    try {
      // Simular delay de guardado
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Validaciones
      if (!formData.paciente) {
        throw new Error('Debe seleccionar un paciente');
      }
      if (!formData.profesional) {
        throw new Error('Debe seleccionar un profesional');
      }
      if (!formData.fecha_hora_inicio || !formData.fecha_hora_fin) {
        throw new Error('Debe especificar fecha y hora de inicio y fin');
      }
      
      const fechaInicio = new Date(formData.fecha_hora_inicio);
      const fechaFin = new Date(formData.fecha_hora_fin);
      
      if (fechaFin <= fechaInicio) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      
      // Simular actualización exitosa
      console.log('Actualizando cita:', citaId, formData);
      
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la cita');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Cargando datos de la cita...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !cita) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Editar Cita</h2>
            {cita && (
              <p className="text-sm text-gray-600 mt-1">
                Cita ID: {cita._id}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <FormEditarCita
            cita={cita}
            formData={formData}
            onFormDataChange={setFormData}
            onValidacionDisponibilidad={(valida, mensaje) => {
              setDisponibilidadValida(valida);
            }}
          />

          {/* Historial de Cambios */}
          {cita?.historial_cambios && cita.historial_cambios.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <History className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Historial de Cambios</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cita.historial_cambios.map((cambio, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">{cambio.usuario}</span>
                      <span className="text-gray-600">
                        {new Date(cambio.fecha).toLocaleString('es-ES')}
                      </span>
                    </div>
                    <p className="text-gray-700">{cambio.cambio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !formData.paciente || !formData.profesional || !formData.fecha_hora_inicio}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

