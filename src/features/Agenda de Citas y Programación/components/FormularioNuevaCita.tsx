import { useState } from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import { Paciente, Profesional, Tratamiento, SlotDisponibilidad } from '../api/citasApi';
import BuscadorPacientes from './BuscadorPacientes';
import SelectorProfesionalTratamiento from './SelectorProfesionalTratamiento';
import CalendarioDisponibilidad from './CalendarioDisponibilidad';
import CrearPacienteRapidoModal from './CrearPacienteRapidoModal';
import ModalConfirmacionCita from './ModalConfirmacionCita';

interface FormularioNuevaCitaProps {
  onConfirmar: (datos: {
    paciente: Paciente;
    profesional: Profesional;
    tratamiento: Tratamiento | null;
    slot: SlotDisponibilidad;
    notas?: string;
  }) => void;
}

export default function FormularioNuevaCita({ onConfirmar }: FormularioNuevaCitaProps) {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [profesional, setProfesional] = useState<Profesional | null>(null);
  const [tratamiento, setTratamiento] = useState<Tratamiento | null>(null);
  const [slotSeleccionado, setSlotSeleccionado] = useState<SlotDisponibilidad | null>(null);
  const [notas, setNotas] = useState('');
  const [mostrarModalPaciente, setMostrarModalPaciente] = useState(false);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);

  const handlePacienteSeleccionado = (pac: Paciente | null) => {
    setPaciente(pac);
  };

  const handlePacienteCreado = (pac: Paciente) => {
    setPaciente(pac);
    setMostrarModalPaciente(false);
  };

  const handleSlotSeleccionado = (slot: SlotDisponibilidad) => {
    setSlotSeleccionado(slot);
    // Mostrar modal de confirmación cuando se selecciona un slot
    if (paciente && profesional && slot) {
      setMostrarModalConfirmacion(true);
    }
  };

  const handleConfirmarCita = () => {
    if (paciente && profesional && slotSeleccionado) {
      onConfirmar({
        paciente,
        profesional,
        tratamiento,
        slot: slotSeleccionado,
        notas: notas.trim() || undefined,
      });
      // Resetear formulario
      setPaciente(null);
      setProfesional(null);
      setTratamiento(null);
      setSlotSeleccionado(null);
      setNotas('');
      setMostrarModalConfirmacion(false);
    }
  };

  const puedeMostrarCalendario = paciente && profesional && tratamiento;

  return (
    <div className="space-y-6">
      {/* Paso 1: Seleccionar Paciente */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Paso 1: Seleccionar Paciente
        </h3>
        <BuscadorPacientes
          onPacienteSeleccionado={handlePacienteSeleccionado}
          pacienteSeleccionado={paciente}
          onCrearPaciente={() => setMostrarModalPaciente(true)}
        />
        {paciente && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-800">
              Paciente seleccionado: <strong>{paciente.nombre} {paciente.apellidos}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Paso 2: Seleccionar Profesional y Tratamiento */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Paso 2: Seleccionar Profesional y Tratamiento
        </h3>
        <SelectorProfesionalTratamiento
          profesionalSeleccionado={profesional}
          tratamientoSeleccionado={tratamiento}
          onProfesionalChange={setProfesional}
          onTratamientoChange={setTratamiento}
          disabled={!paciente}
        />
        {!paciente && (
          <p className="mt-2 text-sm text-gray-500">
            Primero debes seleccionar un paciente
          </p>
        )}
      </div>

      {/* Paso 3: Seleccionar Fecha y Hora */}
      {puedeMostrarCalendario && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Paso 3: Seleccionar Fecha y Hora Disponible
          </h3>
          <CalendarioDisponibilidad
            profesional={profesional}
            tratamiento={tratamiento}
            onSlotSeleccionado={handleSlotSeleccionado}
          />
        </div>
      )}

      {/* Campo de Notas (opcional) */}
      {puedeMostrarCalendario && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4" />
            <span>Notas (Opcional)</span>
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            placeholder="Notas adicionales sobre la cita..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Mensaje cuando falta información */}
      {!puedeMostrarCalendario && paciente && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            {!profesional && 'Selecciona un profesional para continuar. '}
            {!tratamiento && 'Selecciona un tratamiento para ver la disponibilidad.'}
          </p>
        </div>
      )}

      {/* Modal de Crear Paciente Rápido */}
      {mostrarModalPaciente && (
        <CrearPacienteRapidoModal
          onClose={() => setMostrarModalPaciente(false)}
          onPacienteCreado={handlePacienteCreado}
        />
      )}

      {/* Modal de Confirmación */}
      {mostrarModalConfirmacion && (
        <ModalConfirmacionCita
          paciente={paciente}
          profesional={profesional}
          tratamiento={tratamiento}
          slot={slotSeleccionado}
          notas={notas}
          onConfirmar={handleConfirmarCita}
          onCancelar={() => setMostrarModalConfirmacion(false)}
        />
      )}
    </div>
  );
}


