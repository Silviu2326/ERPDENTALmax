import { useState, useEffect } from 'react';
import { X, Calendar, Stethoscope, User, Loader2, AlertCircle, Check } from 'lucide-react';
import { 
  CitaPaciente, 
  NuevaCitaPaciente, 
  ModificarCitaPaciente,
  FiltrosDisponibilidad,
  DisponibilidadHorario,
  solicitarNuevaCita,
  modificarMiCita,
} from '../api/citasPacienteApi';
import SelectorDisponibilidad from './SelectorDisponibilidad';
import { obtenerProfesionales, obtenerTratamientos } from '../../Agenda de Citas y Programación/api/citasApi';

interface Profesional {
  _id: string;
  nombre: string;
  apellidos: string;
  rol?: string;
}

interface Tratamiento {
  _id: string;
  nombre: string;
  codigo?: string;
  categoria?: string;
}

interface ModalGestionCitaProps {
  isOpen: boolean;
  onClose: () => void;
  onExito: () => void;
  citaParaModificar?: CitaPaciente | null;
}

export default function ModalGestionCita({
  isOpen,
  onClose,
  onExito,
  citaParaModificar = null,
}: ModalGestionCitaProps) {
  const esModificacion = !!citaParaModificar;

  // Estados para selecciones
  const [tratamientoId, setTratamientoId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [notasPaciente, setNotasPaciente] = useState<string>('');
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<DisponibilidadHorario | null>(null);

  // Estados para datos
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [cargandoEnvio, setCargandoEnvio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para disponibilidad
  const [mostrarDisponibilidad, setMostrarDisponibilidad] = useState(false);
  const [filtrosDisponibilidad, setFiltrosDisponibilidad] = useState<FiltrosDisponibilidad | null>(null);

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
      if (citaParaModificar) {
        // Pre-llenar datos si es modificación
        setTratamientoId(citaParaModificar.tratamiento?._id || '');
        setDoctorId(citaParaModificar.doctor._id);
        setNotasPaciente(citaParaModificar.notas_paciente || '');
      }
    } else {
      // Reset al cerrar
      resetForm();
    }
  }, [isOpen, citaParaModificar]);

  const cargarDatos = async () => {
    setCargandoDatos(true);
    setError(null);
    try {
      const [profs, trat] = await Promise.all([
        obtenerProfesionales(),
        obtenerTratamientos(),
      ]);
      setProfesionales(profs);
      setTratamientos(trat);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setCargandoDatos(false);
    }
  };

  const resetForm = () => {
    setTratamientoId('');
    setDoctorId('');
    setNotasPaciente('');
    setHorarioSeleccionado(null);
    setMostrarDisponibilidad(false);
    setFiltrosDisponibilidad(null);
    setError(null);
  };

  const handleConsultarDisponibilidad = () => {
    if (!tratamientoId) {
      setError('Debes seleccionar un tratamiento');
      return;
    }

    // Calcular rango de fechas (próximos 30 días)
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 30);
    fechaFin.setHours(23, 59, 59, 999);

    const filtros: FiltrosDisponibilidad = {
      tratamiento_id: tratamientoId,
      fecha_inicio: fechaInicio.toISOString(),
      fecha_fin: fechaFin.toISOString(),
    };

    if (doctorId) {
      filtros.doctor_id = doctorId;
    }

    setFiltrosDisponibilidad(filtros);
    setMostrarDisponibilidad(true);
  };

  const handleSeleccionarHorario = (horario: DisponibilidadHorario) => {
    setHorarioSeleccionado(horario);
  };

  const handleEnviar = async () => {
    if (!horarioSeleccionado) {
      setError('Debes seleccionar un horario disponible');
      return;
    }

    if (!tratamientoId) {
      setError('Debes seleccionar un tratamiento');
      return;
    }

    if (!doctorId) {
      setError('Debes seleccionar un doctor');
      return;
    }

    try {
      setCargandoEnvio(true);
      setError(null);

      if (esModificacion && citaParaModificar) {
        // Modificar cita existente
        const datos: ModificarCitaPaciente = {
          fecha_hora_inicio: horarioSeleccionado.start,
          notas_paciente: notasPaciente || undefined,
        };
        await modificarMiCita(citaParaModificar._id, datos);
      } else {
        // Crear nueva cita
        const datos: NuevaCitaPaciente = {
          doctor_id: doctorId,
          tratamiento_id: tratamientoId,
          fecha_hora_inicio: horarioSeleccionado.start,
          notas_paciente: notasPaciente || undefined,
        };
        await solicitarNuevaCita(datos);
      }

      onExito();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la solicitud');
    } finally {
      setCargandoEnvio(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={!cargandoEnvio ? onClose : undefined}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-white" />
                <h3 className="text-lg font-semibold text-white">
                  {esModificacion ? 'Modificar Cita' : 'Solicitar Nueva Cita'}
                </h3>
              </div>
              {!cargandoEnvio && (
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
            {cargandoDatos ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Cargando datos...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Formulario */}
                <div className="space-y-4">
                  {/* Tratamiento */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Stethoscope className="w-4 h-4" />
                      <span>Tratamiento *</span>
                    </label>
                    <select
                      value={tratamientoId}
                      onChange={(e) => {
                        setTratamientoId(e.target.value);
                        setMostrarDisponibilidad(false);
                        setHorarioSeleccionado(null);
                      }}
                      disabled={cargandoEnvio || esModificacion}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      required
                    >
                      <option value="">Seleccionar tratamiento</option>
                      {tratamientos.map((trat) => (
                        <option key={trat._id} value={trat._id}>
                          {trat.nombre} {trat.codigo && `(${trat.codigo})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Doctor */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      <span>Doctor {!esModificacion && '(Opcional)'}</span>
                    </label>
                    <select
                      value={doctorId}
                      onChange={(e) => {
                        setDoctorId(e.target.value);
                        setMostrarDisponibilidad(false);
                        setHorarioSeleccionado(null);
                      }}
                      disabled={cargandoEnvio}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Todos los doctores</option>
                      {profesionales.map((prof) => (
                        <option key={prof._id} value={prof._id}>
                          Dr./Dra. {prof.nombre} {prof.apellidos} {prof.rol && `(${prof.rol})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Botón consultar disponibilidad */}
                  {tratamientoId && (
                    <div>
                      <button
                        type="button"
                        onClick={handleConsultarDisponibilidad}
                        disabled={cargandoEnvio || !tratamientoId}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        Consultar Disponibilidad
                      </button>
                    </div>
                  )}

                  {/* Selector de disponibilidad */}
                  {mostrarDisponibilidad && filtrosDisponibilidad && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <SelectorDisponibilidad
                        filtros={filtrosDisponibilidad}
                        onSeleccionarHorario={handleSeleccionarHorario}
                        horarioSeleccionado={horarioSeleccionado}
                      />
                    </div>
                  )}

                  {/* Horario seleccionado */}
                  {horarioSeleccionado && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Horario seleccionado:</p>
                        <p className="text-sm text-green-700">
                          {new Date(horarioSeleccionado.start).toLocaleString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Notas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas (Opcional)
                    </label>
                    <textarea
                      value={notasPaciente}
                      onChange={(e) => setNotasPaciente(e.target.value)}
                      disabled={cargandoEnvio}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      placeholder="Agrega cualquier información adicional o comentarios..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={cargandoEnvio}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleEnviar}
              disabled={cargandoEnvio || !horarioSeleccionado}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {cargandoEnvio ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando...</span>
                </span>
              ) : (
                esModificacion ? 'Confirmar Modificación' : 'Solicitar Cita'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



