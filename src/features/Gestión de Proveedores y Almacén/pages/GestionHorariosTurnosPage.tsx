import { useState } from 'react';
import { Clock, Calendar, FileText, User, Plus, LayoutGrid } from 'lucide-react';
import CalendarioHorariosProfesional from '../components/CalendarioHorariosProfesional';
import ModalGestionTurno from '../components/ModalGestionTurno';
import FormularioPlantillaHorario from '../components/FormularioPlantillaHorario';
import PanelSolicitudesAusencia from '../components/PanelSolicitudesAusencia';
import SelectorProfesionalSede from '../components/SelectorProfesionalSede';
import { HorarioProfesional } from '../api/horariosApi';
import { PlantillaHorario } from '../api/horariosApi';

type VistaType = 'semana' | 'mes';
type SubVistaType = 'calendario' | 'plantillas' | 'solicitudes';

export default function GestionHorariosTurnosPage() {
  const [vista, setVista] = useState<VistaType>('semana');
  const [subVista, setSubVista] = useState<SubVistaType>('calendario');
  const [profesionalId, setProfesionalId] = useState<string>('');
  const [sedeId, setSedeId] = useState<string>('');
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<HorarioProfesional | null>(null);
  const [mostrarModalTurno, setMostrarModalTurno] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [mostrarFormularioPlantilla, setMostrarFormularioPlantilla] = useState(false);
  const [plantillas, setPlantillas] = useState<PlantillaHorario[]>([]);
  const [mostrarModalAplicarPlantilla, setMostrarModalAplicarPlantilla] = useState(false);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<string>('');
  const [fechaInicioPlantilla, setFechaInicioPlantilla] = useState<string>('');
  const [fechaFinPlantilla, setFechaFinPlantilla] = useState<string>('');

  const cargarPlantillas = async () => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Datos falsos de plantillas de horarios
      const datos: PlantillaHorario[] = [
        {
          _id: '1',
          nombre: 'Horario Mañana',
          descripcion: 'Turno de mañana de 9:00 a 14:00',
          turnos: [
            { diaSemana: 1, horaInicio: '09:00', horaFin: '14:00' },
            { diaSemana: 2, horaInicio: '09:00', horaFin: '14:00' },
            { diaSemana: 3, horaInicio: '09:00', horaFin: '14:00' },
            { diaSemana: 4, horaInicio: '09:00', horaFin: '14:00' },
            { diaSemana: 5, horaInicio: '09:00', horaFin: '14:00' },
          ],
        },
        {
          _id: '2',
          nombre: 'Horario Tarde',
          descripcion: 'Turno de tarde de 15:00 a 20:00',
          turnos: [
            { diaSemana: 1, horaInicio: '15:00', horaFin: '20:00' },
            { diaSemana: 2, horaInicio: '15:00', horaFin: '20:00' },
            { diaSemana: 3, horaInicio: '15:00', horaFin: '20:00' },
            { diaSemana: 4, horaInicio: '15:00', horaFin: '20:00' },
            { diaSemana: 5, horaInicio: '15:00', horaFin: '20:00' },
          ],
        },
        {
          _id: '3',
          nombre: 'Horario Completo',
          descripcion: 'Jornada completa de 9:00 a 20:00 con descanso',
          turnos: [
            { diaSemana: 1, horaInicio: '09:00', horaFin: '14:00' },
            { diaSemana: 1, horaInicio: '15:00', horaFin: '20:00' },
            { diaSemana: 2, horaInicio: '09:00', horaFin: '14:00' },
            { diaSemana: 2, horaInicio: '15:00', horaFin: '20:00' },
            { diaSemana: 3, horaInicio: '09:00', horaFin: '14:00' },
            { diaSemana: 3, horaInicio: '15:00', horaFin: '20:00' },
            { diaSemana: 4, horaInicio: '09:00', horaFin: '14:00' },
            { diaSemana: 4, horaInicio: '15:00', horaFin: '20:00' },
            { diaSemana: 5, horaInicio: '09:00', horaFin: '14:00' },
            { diaSemana: 5, horaInicio: '15:00', horaFin: '20:00' },
          ],
        },
        {
          _id: '4',
          nombre: 'Horario Partido',
          descripcion: 'Horario partido con mañana y tarde',
          turnos: [
            { diaSemana: 1, horaInicio: '10:00', horaFin: '13:00' },
            { diaSemana: 1, horaInicio: '16:00', horaFin: '19:00' },
            { diaSemana: 2, horaInicio: '10:00', horaFin: '13:00' },
            { diaSemana: 2, horaInicio: '16:00', horaFin: '19:00' },
            { diaSemana: 3, horaInicio: '10:00', horaFin: '13:00' },
            { diaSemana: 3, horaInicio: '16:00', horaFin: '19:00' },
            { diaSemana: 4, horaInicio: '10:00', horaFin: '13:00' },
            { diaSemana: 4, horaInicio: '16:00', horaFin: '19:00' },
            { diaSemana: 5, horaInicio: '10:00', horaFin: '13:00' },
            { diaSemana: 5, horaInicio: '16:00', horaFin: '19:00' },
          ],
        },
      ];
      
      setPlantillas(datos);
    } catch (error) {
      console.error('Error al cargar plantillas:', error);
    }
  };

  const handleHorarioClick = (horario: HorarioProfesional) => {
    setHorarioSeleccionado(horario);
    setMostrarModalTurno(true);
  };

  const handleSlotClick = (fecha: Date) => {
    setFechaSeleccionada(fecha);
    setMostrarModalTurno(true);
  };

  const handleGuardarTurno = () => {
    setMostrarModalTurno(false);
    setHorarioSeleccionado(null);
    setFechaSeleccionada(null);
    // Recargar el calendario se hará automáticamente mediante el useEffect del componente
  };

  const handleGuardarPlantilla = () => {
    setMostrarFormularioPlantilla(false);
    cargarPlantillas();
  };

  const handleAplicarPlantilla = async () => {
    if (!plantillaSeleccionada || !profesionalId || !sedeId || !fechaInicioPlantilla || !fechaFinPlantilla) {
      alert('Por favor, complete todos los campos requeridos');
      return;
    }

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      // Simular aplicación de plantilla
      console.log('Aplicando plantilla:', {
        profesionalId,
        sedeId,
        plantillaSeleccionada,
        fechaInicio: fechaInicioPlantilla,
        fechaFin: fechaFinPlantilla,
      });
      setMostrarModalAplicarPlantilla(false);
      setPlantillaSeleccionada('');
      setFechaInicioPlantilla('');
      setFechaFinPlantilla('');
      alert('Plantilla aplicada correctamente');
    } catch (error) {
      console.error('Error al aplicar plantilla:', error);
      alert('Error al aplicar la plantilla');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Horarios y Turnos</h1>
              <p className="text-gray-600 mt-1">
                Administra los horarios y turnos del personal de la clínica
              </p>
            </div>
          </div>
        </div>

        {/* Tabs principales */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setSubVista('calendario')}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  subVista === 'calendario'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Calendario
              </button>
              <button
                onClick={() => {
                  setSubVista('plantillas');
                  cargarPlantillas();
                }}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  subVista === 'plantillas'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5" />
                Plantillas
              </button>
              <button
                onClick={() => setSubVista('solicitudes')}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  subVista === 'solicitudes'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                Solicitudes de Ausencia
              </button>
            </div>
          </div>

          {/* Contenido de las pestañas */}
          <div className="p-6">
            {subVista === 'calendario' && (
              <div className="space-y-6">
                {/* Filtros y controles */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <SelectorProfesionalSede
                      profesionalId={profesionalId}
                      sedeId={sedeId}
                      onProfesionalChange={setProfesionalId}
                      onSedeChange={setSedeId}
                      required={false}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setVista('semana')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          vista === 'semana'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Semana
                      </button>
                      <button
                        onClick={() => setVista('mes')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          vista === 'mes'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Mes
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setFechaSeleccionada(null);
                        setMostrarModalTurno(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Nuevo Turno
                    </button>
                  </div>
                </div>

                {/* Calendario */}
                <CalendarioHorariosProfesional
                  profesionalId={profesionalId || undefined}
                  sedeId={sedeId || undefined}
                  vista={vista}
                  onHorarioClick={handleHorarioClick}
                  onSlotClick={handleSlotClick}
                />
              </div>
            )}

            {subVista === 'plantillas' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Plantillas de Horarios</h3>
                  <button
                    onClick={() => setMostrarFormularioPlantilla(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Nueva Plantilla
                  </button>
                </div>

                {mostrarFormularioPlantilla ? (
                  <FormularioPlantillaHorario
                    onGuardado={handleGuardarPlantilla}
                    onCancelar={() => setMostrarFormularioPlantilla(false)}
                  />
                ) : (
                  <>
                    {plantillas.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-lg font-medium text-gray-600">No hay plantillas</p>
                        <p className="text-sm text-gray-500 mb-4">
                          Crea una plantilla para reutilizar horarios comunes
                        </p>
                        <button
                          onClick={() => setMostrarFormularioPlantilla(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Crear Primera Plantilla
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {plantillas.map((plantilla) => (
                          <div
                            key={plantilla._id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{plantilla.nombre}</h4>
                              <LayoutGrid className="w-5 h-5 text-blue-600" />
                            </div>
                            {plantilla.descripcion && (
                              <p className="text-sm text-gray-600 mb-3">{plantilla.descripcion}</p>
                            )}
                            <div className="text-xs text-gray-500 mb-3">
                              {plantilla.turnos.length} turno(s) definido(s)
                            </div>
                            <button
                              onClick={() => {
                                setPlantillaSeleccionada(plantilla._id!);
                                setMostrarModalAplicarPlantilla(true);
                              }}
                              className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Aplicar Plantilla
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {mostrarModalAplicarPlantilla && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Aplicar Plantilla</h3>
                          <div className="space-y-4">
                            <SelectorProfesionalSede
                              profesionalId={profesionalId}
                              sedeId={sedeId}
                              onProfesionalChange={setProfesionalId}
                              onSedeChange={setSedeId}
                            />
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha Inicio
                              </label>
                              <input
                                type="date"
                                value={fechaInicioPlantilla}
                                onChange={(e) => setFechaInicioPlantilla(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha Fin
                              </label>
                              <input
                                type="date"
                                value={fechaFinPlantilla}
                                onChange={(e) => setFechaFinPlantilla(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-4">
                              <button
                                onClick={() => {
                                  setMostrarModalAplicarPlantilla(false);
                                  setPlantillaSeleccionada('');
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={handleAplicarPlantilla}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Aplicar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {subVista === 'solicitudes' && <PanelSolicitudesAusencia />}
          </div>
        </div>
      </div>

      {/* Modal de gestión de turno */}
      {mostrarModalTurno && (
        <ModalGestionTurno
          horario={horarioSeleccionado}
          fechaInicial={fechaSeleccionada || undefined}
          profesionalIdInicial={profesionalId || undefined}
          sedeIdInicial={sedeId || undefined}
          onClose={() => {
            setMostrarModalTurno(false);
            setHorarioSeleccionado(null);
            setFechaSeleccionada(null);
          }}
          onSave={handleGuardarTurno}
        />
      )}
    </div>
  );
}


