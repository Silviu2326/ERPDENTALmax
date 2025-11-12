import { useState, useEffect } from 'react';
import { X, Save, Calendar, User, Clock, Stethoscope, FileText, MapPin, AlertCircle } from 'lucide-react';
import { Cita, NuevaCita, crearCita, actualizarCita, subirDocumentoCita, eliminarDocumentoCita, descargarDocumentoCita, DocumentoCita } from '../api/citasApi';
import DocumentUploader from './DocumentUploader';
import { useAuth } from '../../../contexts/AuthContext';

interface ModalGestionCitaProps {
  cita?: Cita | null;
  fechaSeleccionada?: Date;
  horaSeleccionada?: string;
  onClose: () => void;
  onSave: () => void;
  pacientes?: Array<{ _id: string; nombre: string; apellidos: string; telefono?: string }>;
  profesionales?: Array<{ _id: string; nombre: string; apellidos: string }>;
  tratamientos?: Array<{ _id: string; nombre: string }>;
}

export default function ModalGestionCita({
  cita,
  fechaSeleccionada,
  horaSeleccionada,
  onClose,
  onSave,
  pacientes = [],
  profesionales = [],
  tratamientos = [],
}: ModalGestionCitaProps) {
  const [formData, setFormData] = useState<NuevaCita>({
    paciente: cita?.paciente._id || '',
    profesional: cita?.profesional._id || '',
    fecha_hora_inicio: cita?.fecha_hora_inicio || '',
    fecha_hora_fin: cita?.fecha_hora_fin || '',
    tratamiento: cita?.tratamiento?._id || '',
    notas: cita?.notas || '',
    box_asignado: cita?.box_asignado || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoCita[]>(cita?.documentos || []);
  const [citaIdTemporal, setCitaIdTemporal] = useState<string | null>(cita?._id || null);
  const { user } = useAuth();

  useEffect(() => {
    if (fechaSeleccionada && horaSeleccionada) {
      const [hora, minuto] = horaSeleccionada.split(':');
      const fechaInicio = new Date(fechaSeleccionada);
      fechaInicio.setHours(parseInt(hora), parseInt(minuto), 0, 0);
      
      const fechaFin = new Date(fechaInicio);
      fechaFin.setMinutes(fechaFin.getMinutes() + 30); // Duración por defecto: 30 minutos

      setFormData((prev) => ({
        ...prev,
        fecha_hora_inicio: fechaInicio.toISOString(),
        fecha_hora_fin: fechaFin.toISOString(),
      }));
    }
  }, [fechaSeleccionada, horaSeleccionada]);

  const handleChange = (key: keyof NuevaCita, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFechaHoraChange = (tipo: 'inicio' | 'fin', fecha: string, hora: string) => {
    const [h, m] = hora.split(':');
    const fechaCompleta = new Date(fecha);
    fechaCompleta.setHours(parseInt(h), parseInt(m), 0, 0);

    if (tipo === 'inicio') {
      setFormData((prev) => {
        const nuevaFechaInicio = fechaCompleta.toISOString();
        const fechaFin = new Date(prev.fecha_hora_fin || nuevaFechaInicio);
        const fechaInicio = new Date(nuevaFechaInicio);
        
        // Si la fecha fin es anterior a la nueva fecha inicio, ajustarla
        if (fechaFin <= fechaInicio) {
          fechaFin.setTime(fechaInicio.getTime() + 30 * 60 * 1000); // +30 minutos
        }
        
        return {
          ...prev,
          fecha_hora_inicio: nuevaFechaInicio,
          fecha_hora_fin: fechaFin.toISOString(),
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        fecha_hora_fin: fechaCompleta.toISOString(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simular llamada a API con delay
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
      
      // Guardar cita
      let citaGuardada: Cita;
      if (cita?._id) {
        // Actualizar cita existente
        citaGuardada = await actualizarCita(cita._id, formData);
        setCitaIdTemporal(cita._id);
      } else {
        // Crear nueva cita
        citaGuardada = await crearCita(formData);
        setCitaIdTemporal(citaGuardada._id || null);
      }
      
      onSave();
      // No cerrar el modal si hay documentos pendientes de subir
      if (documentos.length === 0) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la cita');
    } finally {
      setLoading(false);
    }
  };

  const fechaInicio = formData.fecha_hora_inicio
    ? new Date(formData.fecha_hora_inicio)
    : new Date();
  const fechaFin = formData.fecha_hora_fin
    ? new Date(formData.fecha_hora_fin)
    : new Date();

  const fechaStr = fechaInicio.toISOString().split('T')[0];
  const horaInicioStr = `${fechaInicio.getHours().toString().padStart(2, '0')}:${fechaInicio.getMinutes().toString().padStart(2, '0')}`;
  const horaFinStr = `${fechaFin.getHours().toString().padStart(2, '0')}:${fechaFin.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {cita ? 'Editar Cita' : 'Nueva Cita'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Información de validación */}
          {formData.fecha_hora_inicio && formData.fecha_hora_fin && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Duración de la cita:</span>
              </div>
              <p>
                {Math.round((new Date(formData.fecha_hora_fin).getTime() - new Date(formData.fecha_hora_inicio).getTime()) / (1000 * 60))} minutos
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Paciente *</span>
              </label>
              <select
                required
                value={formData.paciente}
                onChange={(e) => handleChange('paciente', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar paciente</option>
                {pacientes.map((pac) => (
                  <option key={pac._id} value={pac._id}>
                    {pac.nombre} {pac.apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Stethoscope className="w-4 h-4" />
                <span>Profesional *</span>
              </label>
              <select
                required
                value={formData.profesional}
                onChange={(e) => handleChange('profesional', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar profesional</option>
                {profesionales.map((prof) => (
                  <option key={prof._id} value={prof._id}>
                    {prof.nombre} {prof.apellidos}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Fecha *</span>
              </label>
              <input
                type="date"
                required
                value={fechaStr}
                onChange={(e) => {
                  const fecha = e.target.value;
                  handleFechaHoraChange('inicio', fecha, horaInicioStr);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                <span>Hora Inicio *</span>
              </label>
              <input
                type="time"
                required
                value={horaInicioStr}
                onChange={(e) => {
                  handleFechaHoraChange('inicio', fechaStr, e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                <span>Hora Fin *</span>
              </label>
              <input
                type="time"
                required
                value={horaFinStr}
                onChange={(e) => {
                  handleFechaHoraChange('fin', fechaStr, e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Box/Consultorio Asignado</span>
              </label>
              <select
                value={formData.box_asignado || ''}
                onChange={(e) => handleChange('box_asignado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar box</option>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num.toString()}>
                    Box {num}
                  </option>
                ))}
                {['A', 'B', 'C', 'D'].map((letra) => (
                  <option key={letra} value={letra}>
                    Box {letra}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Stethoscope className="w-4 h-4" />
              <span>Tratamiento</span>
            </label>
            <select
              value={formData.tratamiento || ''}
              onChange={(e) => {
                handleChange('tratamiento', e.target.value);
                // Ajustar duración según tratamiento
                const tratamientoSeleccionado = tratamientos.find(t => t._id === e.target.value);
                if (tratamientoSeleccionado && formData.fecha_hora_inicio) {
                  const fechaInicio = new Date(formData.fecha_hora_inicio);
                  const fechaFin = new Date(fechaInicio);
                  fechaFin.setMinutes(fechaFin.getMinutes() + tratamientoSeleccionado.duracionEstimadaMinutos);
                  setFormData(prev => ({
                    ...prev,
                    fecha_hora_fin: fechaFin.toISOString(),
                  }));
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sin tratamiento específico</option>
              {tratamientos.map((trat) => (
                <option key={trat._id} value={trat._id}>
                  {trat.nombre} ({trat.duracionEstimadaMinutos} min)
                </option>
              ))}
            </select>
            {formData.tratamiento && (
              <p className="text-xs text-gray-500 mt-1">
                Duración estimada: {tratamientos.find(t => t._id === formData.tratamiento)?.duracionEstimadaMinutos || 30} minutos
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              <span>Notas</span>
            </label>
            <textarea
              value={formData.notas || ''}
              onChange={(e) => handleChange('notas', e.target.value)}
              rows={4}
              placeholder="Notas adicionales sobre la cita..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Gestión de Documentos - Solo mostrar si la cita ya tiene ID o después de guardar */}
          {(cita?._id || citaIdTemporal) && (
            <div className="pt-6 border-t border-gray-200">
              <DocumentUploader
                documentos={documentos}
                onUpload={async (file, descripcion) => {
                  const idCita = citaIdTemporal || cita?._id;
                  if (!idCita) {
                    throw new Error('La cita debe estar guardada antes de subir documentos');
                  }
                  try {
                    const nuevoDocumento = await subirDocumentoCita(idCita, file, descripcion);
                    setDocumentos(prev => [...prev, nuevoDocumento]);
                  } catch (err) {
                    throw err;
                  }
                }}
                onDelete={async (documentoId) => {
                  const idCita = citaIdTemporal || cita?._id;
                  if (!idCita) return;
                  try {
                    await eliminarDocumentoCita(idCita, documentoId);
                    setDocumentos(prev => prev.filter(d => d._id !== documentoId));
                  } catch (err) {
                    throw err;
                  }
                }}
                onDownload={async (documento) => {
                  const idCita = citaIdTemporal || cita?._id;
                  if (!idCita || !documento._id) return;
                  try {
                    const blob = await descargarDocumentoCita(idCita, documento._id);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = documento.nombre;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  } catch (err) {
                    throw err;
                  }
                }}
                onPreview={(documento) => {
                  if (documento.url) {
                    window.open(documento.url, '_blank');
                  }
                }}
                usuarioActual={user ? { _id: user._id, nombre: user.nombre } : undefined}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

