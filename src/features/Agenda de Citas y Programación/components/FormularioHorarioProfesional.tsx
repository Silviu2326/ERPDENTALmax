import { useState, useEffect } from 'react';
import { Clock, Plus, X, Save, AlertCircle } from 'lucide-react';
import { HorarioRecurrente, CrearHorarioRecurrente } from '../api/disponibilidadApi';

interface FormularioHorarioProfesionalProps {
  profesionalId: string;
  sedeId: string;
  horariosExistentes: HorarioRecurrente[];
  onGuardar: (datos: CrearHorarioRecurrente) => Promise<void>;
  loading?: boolean;
}

const DIAS_SEMANA = [
  { valor: 1, nombre: 'Lunes' },
  { valor: 2, nombre: 'Martes' },
  { valor: 3, nombre: 'Miércoles' },
  { valor: 4, nombre: 'Jueves' },
  { valor: 5, nombre: 'Viernes' },
  { valor: 6, nombre: 'Sábado' },
  { valor: 0, nombre: 'Domingo' },
];

export default function FormularioHorarioProfesional({
  profesionalId,
  sedeId,
  horariosExistentes,
  onGuardar,
  loading = false,
}: FormularioHorarioProfesionalProps) {
  const [horarios, setHorarios] = useState<Array<{
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
  }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    // Cargar horarios existentes
    const horariosActivos = horariosExistentes
      .filter(h => h.activo && h.profesional === profesionalId && h.sede === sedeId)
      .map(h => ({
        diaSemana: h.diaSemana,
        horaInicio: h.horaInicio,
        horaFin: h.horaFin,
      }));
    setHorarios(horariosActivos.length > 0 ? horariosActivos : []);
  }, [horariosExistentes, profesionalId, sedeId]);

  const agregarHorario = () => {
    setHorarios([...horarios, { diaSemana: 1, horaInicio: '09:00', horaFin: '18:00' }]);
  };

  const eliminarHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const actualizarHorario = (index: number, campo: 'diaSemana' | 'horaInicio' | 'horaFin', valor: string | number) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index] = { ...nuevosHorarios[index], [campo]: valor };
    setHorarios(nuevosHorarios);
  };

  const validarHorarios = (): boolean => {
    if (horarios.length === 0) {
      setError('Debe agregar al menos un horario');
      return false;
    }

    // Validar que no haya días duplicados
    const diasUsados = horarios.map(h => h.diaSemana);
    const diasDuplicados = diasUsados.filter((d, i) => diasUsados.indexOf(d) !== i);
    if (diasDuplicados.length > 0) {
      setError('No puede haber dos horarios para el mismo día');
      return false;
    }

    // Validar horas
    for (const horario of horarios) {
      if (horario.horaInicio >= horario.horaFin) {
        setError('La hora de inicio debe ser anterior a la hora de fin');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleGuardar = async () => {
    if (!validarHorarios()) {
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await onGuardar({
        profesionalId,
        sedeId,
        horarios,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el horario');
    } finally {
      setGuardando(false);
    }
  };

  if (!profesionalId || !sedeId) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>Seleccione un profesional y una sede para configurar los horarios</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Horarios Recurrentes</span>
        </h3>
        <button
          onClick={agregarHorario}
          disabled={loading || guardando}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Horario</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {horarios.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No hay horarios configurados. Haga clic en "Agregar Horario" para comenzar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {horarios.map((horario, index) => {
            const diasDisponibles = DIAS_SEMANA.filter(
              dia => !horarios.some((h, i) => i !== index && h.diaSemana === dia.valor)
            );

            return (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Día</label>
                  <select
                    value={horario.diaSemana}
                    onChange={(e) => actualizarHorario(index, 'diaSemana', parseInt(e.target.value))}
                    disabled={loading || guardando}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    {diasDisponibles.map((dia) => (
                      <option key={dia.valor} value={dia.valor}>
                        {dia.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    value={horario.horaInicio}
                    onChange={(e) => actualizarHorario(index, 'horaInicio', e.target.value)}
                    disabled={loading || guardando}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin</label>
                  <input
                    type="time"
                    value={horario.horaFin}
                    onChange={(e) => actualizarHorario(index, 'horaFin', e.target.value)}
                    disabled={loading || guardando}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <button
                  onClick={() => eliminarHorario(index)}
                  disabled={loading || guardando}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Eliminar horario"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {horarios.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleGuardar}
            disabled={loading || guardando}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{guardando ? 'Guardando...' : 'Guardar Horarios'}</span>
          </button>
        </div>
      )}
    </div>
  );
}


