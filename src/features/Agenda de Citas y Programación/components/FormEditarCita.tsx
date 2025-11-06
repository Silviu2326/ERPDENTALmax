import { useState, useEffect } from 'react';
import { User, AlertCircle, MapPin } from 'lucide-react';
import { Cita, NuevaCita, Paciente, buscarPacientes, obtenerDisponibilidad } from '../api/citasApi';
import SelectorFechaHoraCita from './SelectorFechaHoraCita';
import SelectorProfesional from './SelectorProfesional';
import SelectorTratamientoCita from './SelectorTratamientoCita';
import SelectorEstadoCita, { EstadoCita } from './SelectorEstadoCita';
import InputNotasCita from './InputNotasCita';

interface FormEditarCitaProps {
  cita: Cita | null;
  formData: Partial<NuevaCita>;
  onFormDataChange: (data: Partial<NuevaCita>) => void;
  disabled?: boolean;
  onValidacionDisponibilidad?: (disponible: boolean, mensaje?: string) => void;
}

export default function FormEditarCita({
  cita,
  formData,
  onFormDataChange,
  disabled = false,
  onValidacionDisponibilidad,
}: FormEditarCitaProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busquedaPaciente, setBusquedaPaciente] = useState('');
  const [cargandoPacientes, setCargandoPacientes] = useState(false);
  const [errorDisponibilidad, setErrorDisponibilidad] = useState<string | null>(null);
  const [verificandoDisponibilidad, setVerificandoDisponibilidad] = useState(false);

  // Estado del formulario
  const estado = (formData.estado as EstadoCita) || (cita?.estado as EstadoCita) || 'programada';
  const [fechaInicio, setFechaInicio] = useState(
    formData.fecha_hora_inicio || (cita?.fecha_hora_inicio || '')
  );
  const [horaInicio, setHoraInicio] = useState(() => {
    const fecha = formData.fecha_hora_inicio 
      ? new Date(formData.fecha_hora_inicio)
      : (cita?.fecha_hora_inicio ? new Date(cita.fecha_hora_inicio) : new Date());
    return `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
  });
  const [horaFin, setHoraFin] = useState(() => {
    const fecha = formData.fecha_hora_fin 
      ? new Date(formData.fecha_hora_fin)
      : (cita?.fecha_hora_fin ? new Date(cita.fecha_hora_fin) : new Date());
    return `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
  });

  // Buscar pacientes
  useEffect(() => {
    if (busquedaPaciente.trim().length >= 2) {
      setCargandoPacientes(true);
      buscarPacientes(busquedaPaciente)
        .then((resultados) => {
          setPacientes(resultados);
        })
        .catch(() => {
          setPacientes([]);
        })
        .finally(() => {
          setCargandoPacientes(false);
        });
    } else {
      setPacientes([]);
    }
  }, [busquedaPaciente]);

  // Verificar disponibilidad cuando cambian fecha/hora/profesional
  useEffect(() => {
    if (formData.fecha_hora_inicio && formData.profesional && formData.fecha_hora_fin) {
      const fechaInicio = new Date(formData.fecha_hora_inicio);
      const fechaFin = new Date(formData.fecha_hora_fin);
      const duracionMinutos = Math.round((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60));

      if (duracionMinutos > 0) {
        verificarDisponibilidad(
          formData.profesional,
          fechaInicio.toISOString(),
          fechaFin.toISOString(),
          duracionMinutos
        );
      }
    }
  }, [formData.fecha_hora_inicio, formData.fecha_hora_fin, formData.profesional]);

  const verificarDisponibilidad = async (
    profesionalId: string,
    fechaInicioStr: string,
    fechaFinStr: string,
    duracionMinutos: number
  ) => {
    setVerificandoDisponibilidad(true);
    setErrorDisponibilidad(null);

    try {
      const slots = await obtenerDisponibilidad(
        profesionalId,
        fechaInicioStr,
        fechaFinStr,
        duracionMinutos
      );

      // Verificar si el slot seleccionado está disponible
      const fechaInicio = new Date(fechaInicioStr);
      const fechaFin = new Date(fechaFinStr);
      const disponible = slots.some(
        (slot) =>
          new Date(slot.start) <= fechaInicio && new Date(slot.end) >= fechaFin
      );

      if (!disponible && cita?._id) {
        // Excluir la propia cita si estamos editando
        setErrorDisponibilidad(
          'El profesional podría no estar disponible en este horario. Verifique antes de guardar.'
        );
        onValidacionDisponibilidad?.(false, 'Horario posiblemente no disponible');
      } else {
        onValidacionDisponibilidad?.(true);
      }
    } catch (err) {
      setErrorDisponibilidad(
        'No se pudo verificar la disponibilidad. Verifique antes de guardar.'
      );
      onValidacionDisponibilidad?.(false, 'Error al verificar disponibilidad');
    } finally {
      setVerificandoDisponibilidad(false);
    }
  };

  const actualizarFormData = (campo: keyof NuevaCita, valor: any) => {
    const nuevoData = { ...formData, [campo]: valor };
    onFormDataChange(nuevoData);
  };

  const handleFechaHoraChange = (fecha: string, horaIni: string, horaFinStr: string) => {
    const [hIni, mIni] = horaIni.split(':');
    const [hFin, mFin] = horaFinStr.split(':');
    
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(parseInt(hIni), parseInt(mIni), 0, 0);
    
    const fechaFin = new Date(fecha);
    fechaFin.setHours(parseInt(hFin), parseInt(mFin), 0, 0);

    actualizarFormData('fecha_hora_inicio', fechaInicio.toISOString());
    actualizarFormData('fecha_hora_fin', fechaFin.toISOString());
  };

  const pacienteSeleccionado = cita?.paciente || pacientes.find((p) => p._id === formData.paciente);

  return (
    <div className="space-y-6">
      {/* Error de disponibilidad */}
      {errorDisponibilidad && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Advertencia de disponibilidad</p>
            <p className="text-sm">{errorDisponibilidad}</p>
          </div>
        </div>
      )}

      {/* Selector de Paciente */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4" />
          <span>Paciente *</span>
        </label>
        {cita ? (
          // Si estamos editando, mostrar el paciente seleccionado
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
            <p className="text-gray-800 font-medium">
              {cita.paciente.nombre} {cita.paciente.apellidos}
            </p>
            {cita.paciente.telefono && (
              <p className="text-sm text-gray-600">Tel: {cita.paciente.telefono}</p>
            )}
          </div>
        ) : (
          // Si es nueva cita, permitir búsqueda
          <div>
            <input
              type="text"
              value={busquedaPaciente}
              onChange={(e) => setBusquedaPaciente(e.target.value)}
              placeholder="Buscar paciente por nombre, apellido, DNI o teléfono..."
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {pacientes.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
                {pacientes.map((paciente) => (
                  <button
                    key={paciente._id}
                    type="button"
                    onClick={() => {
                      actualizarFormData('paciente', paciente._id);
                      setBusquedaPaciente(`${paciente.nombre} ${paciente.apellidos}`);
                      setPacientes([]);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <p className="font-medium text-gray-800">
                      {paciente.nombre} {paciente.apellidos}
                    </p>
                    {paciente.telefono && (
                      <p className="text-sm text-gray-600">Tel: {paciente.telefono}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
            {pacienteSeleccionado && (
              <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Paciente seleccionado: {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selector de Fecha y Hora */}
      <SelectorFechaHoraCita
        fechaInicio={fechaInicio}
        horaInicio={horaInicio}
        horaFin={horaFin}
        onFechaChange={(fecha) => {
          setFechaInicio(fecha);
          handleFechaHoraChange(fecha, horaInicio, horaFin);
        }}
        onHoraInicioChange={(hora) => {
          setHoraInicio(hora);
          handleFechaHoraChange(fechaInicio, hora, horaFin);
        }}
        onHoraFinChange={(hora) => {
          setHoraFin(hora);
          handleFechaHoraChange(fechaInicio, horaInicio, hora);
        }}
        disabled={disabled}
      />

      {/* Selector de Profesional */}
      <SelectorProfesional
        profesionalId={formData.profesional || ''}
        onProfesionalChange={(id) => actualizarFormData('profesional', id)}
        disabled={disabled}
      />

      {/* Selector de Tratamiento */}
      <SelectorTratamientoCita
        tratamientoId={formData.tratamiento || ''}
        onTratamientoChange={(id) => actualizarFormData('tratamiento', id)}
        disabled={disabled}
        onDuracionChange={(duracion) => {
          // Ajustar hora fin según la duración del tratamiento
          if (formData.fecha_hora_inicio) {
            const fechaInicio = new Date(formData.fecha_hora_inicio);
            const fechaFin = new Date(fechaInicio.getTime() + duracion * 60 * 1000);
            actualizarFormData('fecha_hora_fin', fechaFin.toISOString());
            setHoraFin(
              `${fechaFin.getHours().toString().padStart(2, '0')}:${fechaFin.getMinutes().toString().padStart(2, '0')}`
            );
          }
        }}
      />

      {/* Selector de Estado */}
      <SelectorEstadoCita
        estado={estado}
        onEstadoChange={(nuevoEstado) => {
          actualizarFormData('estado', nuevoEstado);
        }}
        disabled={disabled}
      />

      {/* Box Asignado */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4" />
          <span>Box/Consultorio Asignado</span>
        </label>
        <input
          type="text"
          value={formData.box_asignado || ''}
          onChange={(e) => actualizarFormData('box_asignado', e.target.value)}
          disabled={disabled}
          placeholder="Ej: 1, 2, A, B..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* Notas */}
      <InputNotasCita
        notas={formData.notas || ''}
        onNotasChange={(notas) => actualizarFormData('notas', notas)}
        disabled={disabled}
      />

      {/* Indicador de verificación de disponibilidad */}
      {verificandoDisponibilidad && (
        <div className="text-sm text-gray-600 flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Verificando disponibilidad...</span>
        </div>
      )}
    </div>
  );
}

