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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Clock size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Gestión de Horarios y Turnos
                </h1>
                <p className="text-gray-600">
                  Administra los horarios y turnos del personal de la clínica
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Tabs principales */}
        <div className="bg-white shadow-sm p-0 mb-6 rounded-xl overflow-hidden">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              <button
                onClick={() => setSubVista('calendario')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  subVista === 'calendario'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Calendar size={18} className={subVista === 'calendario' ? 'opacity-100' : 'opacity-70'} />
                <span>Calendario</span>
              </button>
              <button
                onClick={() => {
                  setSubVista('plantillas');
                  cargarPlantillas();
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  subVista === 'plantillas'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <FileText size={18} className={subVista === 'plantillas' ? 'opacity-100' : 'opacity-70'} />
                <span>Plantillas</span>
              </button>
              <button
                onClick={() => setSubVista('solicitudes')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  subVista === 'solicitudes'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <User size={18} className={subVista === 'solicitudes' ? 'opacity-100' : 'opacity-70'} />
                <span>Solicitudes de Ausencia</span>
              </button>
            </div>
          </div>

          {/* Contenido de las pestañas */}
          <div className="px-4 pb-4">
            {subVista === 'calendario' && (
              <div className="space-y-6 mt-6">
                {/* Toolbar superior */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => {
                      setFechaSeleccionada(null);
                      setMostrarModalTurno(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Plus size={20} className="mr-2" />
                    Nuevo Turno
                  </button>
                </div>

                {/* Filtros y controles */}
                <div className="bg-white shadow-sm rounded-xl p-4 mb-6">
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <SelectorProfesionalSede
                            profesionalId={profesionalId}
                            sedeId={sedeId}
                            onProfesionalChange={setProfesionalId}
                            onSedeChange={setSedeId}
                            required={false}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-sm font-medium text-gray-700">Vista:</span>
                      <div className="flex border rounded-lg overflow-hidden ring-1 ring-slate-200">
                        <button
                          onClick={() => setVista('semana')}
                          className={`px-4 py-2 text-sm font-medium transition-colors ${
                            vista === 'semana'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Semana
                        </button>
                        <button
                          onClick={() => setVista('mes')}
                          className={`px-4 py-2 text-sm font-medium transition-colors border-l border-slate-200 ${
                            vista === 'mes'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Mes
                        </button>
                      </div>
                    </div>
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
              <div className="space-y-6 mt-6">
                {/* Toolbar superior */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setMostrarFormularioPlantilla(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Plus size={20} className="mr-2" />
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
                      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
                        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay plantillas</h3>
                        <p className="text-gray-600 mb-4">
                          Crea una plantilla para reutilizar horarios comunes
                        </p>
                        <button
                          onClick={() => setMostrarFormularioPlantilla(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Plus size={20} />
                          Crear Primera Plantilla
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {plantillas.map((plantilla) => (
                          <div
                            key={plantilla._id}
                            className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 h-full flex flex-col transition-shadow overflow-hidden hover:shadow-md"
                          >
                            <div className="p-4 flex flex-col h-full">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="text-lg font-semibold text-gray-900">{plantilla.nombre}</h4>
                                <LayoutGrid size={20} className="text-blue-600 flex-shrink-0" />
                              </div>
                              {plantilla.descripcion && (
                                <p className="text-sm text-gray-600 mb-3 flex-1">{plantilla.descripcion}</p>
                              )}
                              <div className="text-xs text-slate-500 mb-4">
                                {plantilla.turnos.length} turno(s) definido(s)
                              </div>
                              <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                                <button
                                  onClick={() => {
                                    setPlantillaSeleccionada(plantilla._id!);
                                    setMostrarModalAplicarPlantilla(true);
                                  }}
                                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                >
                                  Aplicar Plantilla
                                </button>
                              </div>
                            </div>
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
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Fecha Inicio
                              </label>
                              <input
                                type="date"
                                value={fechaInicioPlantilla}
                                onChange={(e) => setFechaInicioPlantilla(e.target.value)}
                                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Fecha Fin
                              </label>
                              <input
                                type="date"
                                value={fechaFinPlantilla}
                                onChange={(e) => setFechaFinPlantilla(e.target.value)}
                                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                              />
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                              <button
                                onClick={() => {
                                  setMostrarModalAplicarPlantilla(false);
                                  setPlantillaSeleccionada('');
                                }}
                                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={handleAplicarPlantilla}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
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

            {subVista === 'solicitudes' && (
              <div className="mt-6">
                <PanelSolicitudesAusencia />
              </div>
            )}
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


