import { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import { Bloqueo, NuevoBloqueo, validarConflictoConCitas } from '../api/bloqueosApi';
import SelectorRecursoBloqueo from './SelectorRecursoBloqueo';
import ConfiguradorRecurrencia, { ConfiguracionRecurrencia } from './ConfiguradorRecurrencia';

interface FormularioBloqueoProps {
  bloqueo?: Bloqueo | null;
  fechaSeleccionada?: Date;
  horaSeleccionada?: string;
  sedeId?: string;
  onValidar?: (valido: boolean) => void;
  onFormDataChange?: (formData: NuevoBloqueo | null) => void;
}

export default function FormularioBloqueo({
  bloqueo,
  fechaSeleccionada,
  horaSeleccionada,
  sedeId,
  onValidar,
  onFormDataChange,
}: FormularioBloqueoProps) {
  const [formData, setFormData] = useState<Omit<NuevoBloqueo, 'sedeId'>>({
    tipo: bloqueo?.tipo || '',
    recursoId: bloqueo?.recursoId._id || '',
    fechaInicio: bloqueo?.fechaInicio || '',
    fechaFin: bloqueo?.fechaFin || '',
    motivo: bloqueo?.motivo || '',
    esDiaCompleto: bloqueo?.esDiaCompleto || false,
    recurrencia: bloqueo?.recurrencia ? {
      tipo: bloqueo.recurrencia.tipo,
      frecuencia: bloqueo.recurrencia.frecuencia,
      finFecha: bloqueo.recurrencia.finFecha,
      finOcurrencias: bloqueo.recurrencia.finOcurrencias,
      diasSemana: bloqueo.recurrencia.diasSemana,
      diaMes: bloqueo.recurrencia.diaMes,
    } : undefined,
  });

  const [recurrencia, setRecurrencia] = useState<ConfiguracionRecurrencia>({
    tipo: bloqueo?.recurrencia?.tipo || null,
    frecuencia: bloqueo?.recurrencia?.frecuencia || 1,
    finFecha: bloqueo?.recurrencia?.finFecha,
    finOcurrencias: bloqueo?.recurrencia?.finOcurrencias,
    diasSemana: bloqueo?.recurrencia?.diasSemana,
    diaMes: bloqueo?.recurrencia?.diaMes,
  });

  const [conflicto, setConflicto] = useState<{ tiene: boolean; mensaje?: string }>({ tiene: false });

  useEffect(() => {
    if (fechaSeleccionada && horaSeleccionada && !bloqueo) {
      const [hora, minuto] = horaSeleccionada.split(':');
      const fechaInicio = new Date(fechaSeleccionada);
      fechaInicio.setHours(parseInt(hora), parseInt(minuto), 0, 0);
      
      const fechaFin = new Date(fechaInicio);
      fechaFin.setHours(fechaFin.getHours() + 1); // Duración por defecto: 1 hora

      setFormData((prev) => ({
        ...prev,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
      }));
    }
  }, [fechaSeleccionada, horaSeleccionada, bloqueo]);

  useEffect(() => {
    // Validar formulario completo
    const valido =
      formData.tipo !== '' &&
      formData.recursoId !== '' &&
      formData.fechaInicio !== '' &&
      formData.fechaFin !== '' &&
      formData.motivo.trim() !== '' &&
      !conflicto.tiene &&
      sedeId !== undefined;

    onValidar?.(valido);

    // Notificar cambios en los datos del formulario
    if (valido && sedeId) {
      const formDataCompleto: NuevoBloqueo = {
        sedeId,
        tipo: formData.tipo as 'SALA' | 'PROFESIONAL',
        recursoId: formData.recursoId,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        motivo: formData.motivo,
        esDiaCompleto: formData.esDiaCompleto,
        recurrencia: formData.recurrencia,
      };
      onFormDataChange?.(formDataCompleto);
    } else {
      onFormDataChange?.(null);
    }
  }, [formData, conflicto, sedeId, onValidar, onFormDataChange]);

  useEffect(() => {
    // Validar conflictos cuando cambian los datos relevantes
    if (
      formData.tipo &&
      formData.recursoId &&
      formData.fechaInicio &&
      formData.fechaFin &&
      !bloqueo // Solo validar al crear, no al editar
    ) {
      validarConflictoConCitas(
        formData.tipo as 'SALA' | 'PROFESIONAL',
        formData.recursoId,
        formData.fechaInicio,
        formData.fechaFin
      )
        .then((resultado) => {
          if (resultado.tieneConflicto) {
            setConflicto({
              tiene: true,
              mensaje: `Existen ${resultado.citasConflictivas?.length || 0} cita(s) programada(s) en este horario. Por favor, cancela o reprograma las citas antes de crear el bloqueo.`,
            });
          } else {
            setConflicto({ tiene: false });
          }
        })
        .catch(() => {
          // Ignorar errores de validación en desarrollo
          setConflicto({ tiene: false });
        });
    } else {
      setConflicto({ tiene: false });
    }
  }, [formData.tipo, formData.recursoId, formData.fechaInicio, formData.fechaFin, bloqueo]);

  const handleChange = (key: keyof typeof formData, value: any) => {
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
        const fechaFin = new Date(prev.fechaFin || nuevaFechaInicio);
        const fechaInicio = new Date(nuevaFechaInicio);
        
        if (fechaFin <= fechaInicio) {
          fechaFin.setTime(fechaInicio.getTime() + 60 * 60 * 1000); // +1 hora
        }
        
        return {
          ...prev,
          fechaInicio: nuevaFechaInicio,
          fechaFin: fechaFin.toISOString(),
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        fechaFin: fechaCompleta.toISOString(),
      }));
    }
  };

  const handleRecurrenciaChange = (nuevaRecurrencia: ConfiguracionRecurrencia) => {
    setRecurrencia(nuevaRecurrencia);
    if (nuevaRecurrencia.tipo) {
      setFormData((prev) => ({
        ...prev,
        recurrencia: {
          tipo: nuevaRecurrencia.tipo,
          frecuencia: nuevaRecurrencia.frecuencia,
          finFecha: nuevaRecurrencia.finFecha,
          finOcurrencias: nuevaRecurrencia.finOcurrencias,
          diasSemana: nuevaRecurrencia.diasSemana,
          diaMes: nuevaRecurrencia.diaMes,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        recurrencia: undefined,
      }));
    }
  };

  const fechaInicio = formData.fechaInicio ? new Date(formData.fechaInicio) : new Date();
  const fechaFin = formData.fechaFin ? new Date(formData.fechaFin) : new Date();

  const fechaStr = fechaInicio.toISOString().split('T')[0];
  const horaInicioStr = `${fechaInicio.getHours().toString().padStart(2, '0')}:${fechaInicio.getMinutes().toString().padStart(2, '0')}`;
  const horaFinStr = `${fechaFin.getHours().toString().padStart(2, '0')}:${fechaFin.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Alerta de conflicto */}
      {conflicto.tiene && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Conflicto detectado</p>
            <p className="text-sm">{conflicto.mensaje}</p>
          </div>
        </div>
      )}

      {/* Selector de Recurso */}
      <div>
        <SelectorRecursoBloqueo
          tipo={formData.tipo as 'SALA' | 'PROFESIONAL' | ''}
          recursoId={formData.recursoId}
          sedeId={sedeId || bloqueo?.sede._id}
          onTipoChange={(tipo) => handleChange('tipo', tipo)}
          onRecursoChange={(recursoId) => handleChange('recursoId', recursoId)}
        />
      </div>

      {/* Día Completo */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="esDiaCompleto"
          checked={formData.esDiaCompleto}
          onChange={(e) => {
            handleChange('esDiaCompleto', e.target.checked);
            if (e.target.checked) {
              const fecha = new Date(formData.fechaInicio || new Date());
              fecha.setHours(0, 0, 0, 0);
              const fechaFin = new Date(fecha);
              fechaFin.setHours(23, 59, 59, 999);
              handleChange('fechaInicio', fecha.toISOString());
              handleChange('fechaFin', fechaFin.toISOString());
            }
          }}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="esDiaCompleto" className="text-sm font-medium text-slate-700">
          Bloquear día completo
        </label>
      </div>

      {/* Fecha y Hora */}
      {!formData.esDiaCompleto && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
              <Calendar className="w-4 h-4" />
              <span>Fecha *</span>
            </label>
            <input
              type="date"
              required
              value={fechaStr}
              onChange={(e) => {
                handleFechaHoraChange('inicio', e.target.value, horaInicioStr);
              }}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
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
              disabled={formData.esDiaCompleto}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
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
              disabled={formData.esDiaCompleto}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:opacity-50"
            />
          </div>
        </div>
      )}

      {formData.esDiaCompleto && (
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
            <Calendar className="w-4 h-4" />
            <span>Fecha *</span>
          </label>
          <input
            type="date"
            required
            value={fechaStr}
            onChange={(e) => {
              const fecha = new Date(e.target.value);
              fecha.setHours(0, 0, 0, 0);
              const fechaFin = new Date(fecha);
              fechaFin.setHours(23, 59, 59, 999);
              handleChange('fechaInicio', fecha.toISOString());
              handleChange('fechaFin', fechaFin.toISOString());
            }}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>
      )}

      {/* Motivo */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
          <FileText className="w-4 h-4" />
          <span>Motivo del Bloqueo *</span>
        </label>
        <textarea
          value={formData.motivo}
          onChange={(e) => handleChange('motivo', e.target.value)}
          required
          rows={3}
          placeholder="Ej: Mantenimiento del sillón, Reunión de equipo, Vacaciones..."
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
        />
      </div>

      {/* Configurador de Recurrencia */}
      <ConfiguradorRecurrencia
        recurrencia={recurrencia}
        onRecurrenciaChange={handleRecurrenciaChange}
      />
    </div>
  );
}

