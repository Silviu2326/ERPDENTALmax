import { useState, useEffect } from 'react';
import { Calendar, Plus, RefreshCw, Filter, AlertCircle } from 'lucide-react';
import { Bloqueo, FiltrosBloqueos, obtenerBloqueos } from '../api/bloqueosApi';
import VisualizadorBloqueoCalendario from '../components/VisualizadorBloqueoCalendario';
import ModalGestionBloqueo from '../components/ModalGestionBloqueo';

export default function AdministracionBloqueosPage() {
  const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [bloqueoSeleccionado, setBloqueoSeleccionado] = useState<Bloqueo | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>();

  // Filtros
  const ahora = new Date();
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const inicio = new Date(ahora);
    inicio.setHours(0, 0, 0, 0);
    return inicio.toISOString();
  });
  const [fechaFin, setFechaFin] = useState<string>(() => {
    const fin = new Date(ahora);
    fin.setDate(fin.getDate() + 30); // 30 días por defecto
    fin.setHours(23, 59, 59, 999);
    return fin.toISOString();
  });
  const [sedeId, setSedeId] = useState<string>('');
  const [tipoFiltro, setTipoFiltro] = useState<'SALA' | 'PROFESIONAL' | ''>('');

  // Datos mock para sedes
  const sedes = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
    { _id: '4', nombre: 'Sede Este' },
    { _id: '5', nombre: 'Sede Oeste' },
    { _id: '6', nombre: 'Sede Centro Histórico' },
  ];

  const cargarBloqueos = async () => {
    setLoading(true);
    setError(null);
    try {
      const filtros: FiltrosBloqueos = {
        fechaInicio,
        fechaFin,
        sedeId: sedeId || undefined,
        tipo: tipoFiltro || undefined,
      };

      // En producción, esto llamaría a la API real
      // const datos = await obtenerBloqueos(filtros);
      // setBloqueos(datos);

      // Datos mock más completos para desarrollo
      const datosMock: Bloqueo[] = [];
      const ahora = new Date();
      
      // Generar bloqueos de salas (más bloqueos)
      for (let i = 0; i < 12; i++) {
        const fechaInicio = new Date(ahora);
        fechaInicio.setDate(fechaInicio.getDate() + i * 3);
        fechaInicio.setHours(14, 0, 0, 0);
        
        const fechaFin = new Date(fechaInicio);
        fechaFin.setHours(16, 0, 0, 0);
        
        const motivosSala = [
          'Mantenimiento preventivo',
          'Limpieza profunda',
          'Reparación de equipamiento',
          'Desinfección especial',
          'Revisión técnica',
          'Calibración de equipos',
          'Actualización de software',
          'Revisión de seguridad',
          'Limpieza post-cirugía',
          'Desinfección por COVID-19',
          'Reparación urgente',
          'Instalación de nuevo equipo',
        ];
        
        const numeroSillon = (i % 8) + 1;
        const esDiaCompleto = i % 4 === 0; // Algunos bloqueos de día completo
        
        if (esDiaCompleto) {
          fechaInicio.setHours(0, 0, 0, 0);
          fechaFin.setHours(23, 59, 59, 999);
        }
        
        datosMock.push({
          _id: `bloqueo-sala-${i + 1}`,
          sede: sedes[Math.floor(Math.random() * sedes.length)],
          tipo: 'SALA',
          recursoId: {
            _id: `${numeroSillon}`,
            numero: `${numeroSillon}`,
            nombreCompleto: `Sillón ${numeroSillon}`,
          },
          fechaInicio: fechaInicio.toISOString(),
          fechaFin: fechaFin.toISOString(),
          motivo: motivosSala[Math.floor(Math.random() * motivosSala.length)],
          esDiaCompleto: esDiaCompleto,
          creadoPor: { _id: '1', nombre: 'Admin' },
        });
      }
      
      // Generar bloqueos de profesionales (vacaciones, bajas, etc.)
      const profesionalesMock = [
        { _id: '1', nombre: 'Juan', apellidos: 'Pérez', nombreCompleto: 'Juan Pérez' },
        { _id: '2', nombre: 'María', apellidos: 'García', nombreCompleto: 'María García' },
        { _id: '3', nombre: 'Carlos', apellidos: 'López', nombreCompleto: 'Carlos López' },
        { _id: '4', nombre: 'Ana', apellidos: 'Fernández', nombreCompleto: 'Ana Fernández' },
        { _id: '5', nombre: 'Roberto', apellidos: 'Martínez', nombreCompleto: 'Roberto Martínez' },
        { _id: '6', nombre: 'Carmen', apellidos: 'Sánchez', nombreCompleto: 'Carmen Sánchez' },
        { _id: '7', nombre: 'Luis', apellidos: 'González', nombreCompleto: 'Luis González' },
        { _id: '8', nombre: 'Patricia', apellidos: 'Ruiz', nombreCompleto: 'Patricia Ruiz' },
      ];
      
      for (let i = 0; i < 8; i++) {
        const fechaInicio = new Date(ahora);
        fechaInicio.setDate(fechaInicio.getDate() + 7 + i * 7);
        fechaInicio.setHours(0, 0, 0, 0);
        
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + (i === 0 ? 7 : 3)); // 7 días o 3 días
        fechaFin.setHours(23, 59, 59, 999);
        
        const motivosProfesional = [
          'Vacaciones',
          'Baja médica',
          'Formación',
          'Congreso',
          'Permiso personal',
          'Baja por maternidad',
          'Jornada de formación',
          'Conferencia médica',
          'Permiso familiar',
          'Baja temporal',
          'Capacitación',
          'Evento profesional',
        ];
        
        datosMock.push({
          _id: `bloqueo-prof-${i + 1}`,
          sede: sedes[Math.floor(Math.random() * sedes.length)],
          tipo: 'PROFESIONAL',
          recursoId: profesionalesMock[i % profesionalesMock.length],
          fechaInicio: fechaInicio.toISOString(),
          fechaFin: fechaFin.toISOString(),
          motivo: motivosProfesional[Math.floor(Math.random() * motivosProfesional.length)],
          esDiaCompleto: true,
          creadoPor: { _id: '1', nombre: 'Admin' },
        });
      }

      // Filtrar bloqueos según los filtros
      const bloqueosFiltrados = datosMock.filter((bloqueo) => {
        const fechaInicioBloqueo = new Date(bloqueo.fechaInicio);
        const fechaFinBloqueo = new Date(bloqueo.fechaFin);
        const filtroInicio = new Date(fechaInicio);
        const filtroFin = new Date(fechaFin);

        const enRangoFecha =
          (fechaInicioBloqueo >= filtroInicio && fechaInicioBloqueo <= filtroFin) ||
          (fechaFinBloqueo >= filtroInicio && fechaFinBloqueo <= filtroFin) ||
          (fechaInicioBloqueo <= filtroInicio && fechaFinBloqueo >= filtroFin);

        const coincideSede = !sedeId || bloqueo.sede._id === sedeId;
        const coincideTipo = !tipoFiltro || bloqueo.tipo === tipoFiltro;

        return enRangoFecha && coincideSede && coincideTipo;
      });

      setBloqueos(bloqueosFiltrados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los bloqueos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarBloqueos();
  }, [fechaInicio, fechaFin, sedeId, tipoFiltro]);

  const handleNuevoBloqueo = () => {
    setBloqueoSeleccionado(null);
    setFechaSeleccionada(new Date());
    setMostrarModal(true);
  };

  const handleBloqueoClick = (bloqueo: Bloqueo) => {
    setBloqueoSeleccionado(bloqueo);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setBloqueoSeleccionado(null);
    setFechaSeleccionada(undefined);
  };

  const handleGuardarBloqueo = () => {
    cargarBloqueos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Calendar size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Administración de Bloqueos
                  </h1>
                  <p className="text-gray-600">
                    Gestiona los bloqueos de salas y horarios de profesionales
                  </p>
                </div>
              </div>
              <button
                onClick={handleNuevoBloqueo}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <Plus size={20} />
                <span>Nuevo Bloqueo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Filtros */}
          <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 mb-6">
            <div className="p-4">
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4 items-center mb-4">
                  <Filter size={20} className="text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Filtros</h3>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Fecha Inicio
                      </label>
                      <input
                        type="date"
                        value={fechaInicio.split('T')[0]}
                        onChange={(e) => {
                          const fecha = new Date(e.target.value);
                          fecha.setHours(0, 0, 0, 0);
                          setFechaInicio(fecha.toISOString());
                        }}
                        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Fecha Fin
                      </label>
                      <input
                        type="date"
                        value={fechaFin.split('T')[0]}
                        onChange={(e) => {
                          const fecha = new Date(e.target.value);
                          fecha.setHours(23, 59, 59, 999);
                          setFechaFin(fecha.toISOString());
                        }}
                        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Sede
                      </label>
                      <select
                        value={sedeId}
                        onChange={(e) => setSedeId(e.target.value)}
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      >
                        <option value="">Todas las sedes</option>
                        {sedes.map((sede) => (
                          <option key={sede._id} value={sede._id}>
                            {sede.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tipo
                      </label>
                      <select
                        value={tipoFiltro}
                        onChange={(e) => setTipoFiltro(e.target.value as 'SALA' | 'PROFESIONAL' | '')}
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      >
                        <option value="">Todos los tipos</option>
                        <option value="SALA">Sala</option>
                        <option value="PROFESIONAL">Profesional</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                    <span>{bloqueos.length} bloqueos encontrados</span>
                    <button
                      onClick={cargarBloqueos}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 ring-1 ring-slate-300 disabled:opacity-50"
                    >
                      <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                      <span>Actualizar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          )}

          {/* Lista de Bloqueos */}
          {loading ? (
            <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-8 text-center">
              <RefreshCw size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando bloqueos...</p>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bloqueos ({bloqueos.length})
              </h3>
              <VisualizadorBloqueoCalendario
                bloqueos={bloqueos}
                onBloqueoClick={handleBloqueoClick}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal de Gestión de Bloqueo */}
      {mostrarModal && (
        <ModalGestionBloqueo
          bloqueo={bloqueoSeleccionado}
          fechaSeleccionada={fechaSeleccionada}
          sedeId={sedeId || bloqueoSeleccionado?.sede._id}
          onClose={handleCerrarModal}
          onSave={handleGuardarBloqueo}
        />
      )}
    </div>
  );
}

