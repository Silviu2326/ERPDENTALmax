import { useState, useEffect } from 'react';
import { Bell, Filter, RefreshCw, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Loader2, AlertCircle, Calendar } from 'lucide-react';
import {
  obtenerHistorialRecordatorios,
  RecordatorioHistorial,
  FiltrosHistorial,
  HistorialResponse,
} from '../api/recordatoriosApi';
import TablaHistorialRecordatorios from '../components/TablaHistorialRecordatorios';
import PanelEstadisticasRecordatorios from '../components/PanelEstadisticasRecordatorios';

export default function RecordatoriosCitasPage() {
  const [historial, setHistorial] = useState<RecordatorioHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosHistorial>({
    page: 1,
    limit: 20,
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');

  // Estadísticas calculadas desde el historial
  const [estadisticas, setEstadisticas] = useState({
    totalEnviados: 0,
    totalConfirmados: 0,
    totalFallidos: 0,
    tasaConfirmacion: 0,
    tasaEntrega: 0,
    porCanal: {
      SMS: { enviados: 0, confirmados: 0 },
      Email: { enviados: 0, confirmados: 0 },
      WhatsApp: { enviados: 0, confirmados: 0 },
    },
    porEstado: {
      Pendiente: 0,
      Enviado: 0,
      Entregado: 0,
      Confirmado: 0,
      Fallido: 0,
      Cancelado: 0,
    },
  });

  useEffect(() => {
    cargarHistorial();
  }, [filtros]);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos completos de historial de recordatorios
      const datosFalsos: RecordatorioHistorial[] = [
        {
          _id: '1',
          cita: {
            _id: 'cita1',
            fecha_hora_inicio: '2024-03-20T10:00:00Z',
            paciente: {
              _id: 'pac1',
              nombre: 'María',
              apellidos: 'García López',
              telefono: '+34 612 345 678',
              email: 'maria.garcia@email.com',
            },
          },
          paciente: {
            _id: 'pac1',
            nombre: 'María',
            apellidos: 'García López',
          },
          plantilla: {
            _id: 'plant1',
            nombre: 'Recordatorio SMS 24h',
            tipo: 'SMS',
          },
          canal: 'SMS',
          fecha_envio: '2024-03-19T10:00:00Z',
          estado: 'Confirmado',
          respuesta_paciente: 'CONFIRMAR',
          id_mensaje_proveedor: 'SM123456789',
        },
        {
          _id: '2',
          cita: {
            _id: 'cita2',
            fecha_hora_inicio: '2024-03-20T14:30:00Z',
            paciente: {
              _id: 'pac2',
              nombre: 'Carlos',
              apellidos: 'Martínez Ruiz',
              telefono: '+34 623 456 789',
              email: 'carlos.martinez@email.com',
            },
          },
          paciente: {
            _id: 'pac2',
            nombre: 'Carlos',
            apellidos: 'Martínez Ruiz',
          },
          plantilla: {
            _id: 'plant2',
            nombre: 'Recordatorio Email 48h',
            tipo: 'Email',
          },
          canal: 'Email',
          fecha_envio: '2024-03-18T14:30:00Z',
          estado: 'Entregado',
          id_mensaje_proveedor: 'EM987654321',
        },
        {
          _id: '3',
          cita: {
            _id: 'cita3',
            fecha_hora_inicio: '2024-03-21T09:00:00Z',
            paciente: {
              _id: 'pac3',
              nombre: 'Ana',
              apellidos: 'Fernández Sánchez',
              telefono: '+34 634 567 890',
              email: 'ana.fernandez@email.com',
            },
          },
          paciente: {
            _id: 'pac3',
            nombre: 'Ana',
            apellidos: 'Fernández Sánchez',
          },
          plantilla: {
            _id: 'plant1',
            nombre: 'Recordatorio SMS 24h',
            tipo: 'SMS',
          },
          canal: 'SMS',
          fecha_envio: '2024-03-20T09:00:00Z',
          estado: 'Enviado',
          id_mensaje_proveedor: 'SM234567890',
        },
        {
          _id: '4',
          cita: {
            _id: 'cita4',
            fecha_hora_inicio: '2024-03-21T11:30:00Z',
            paciente: {
              _id: 'pac4',
              nombre: 'Pedro',
              apellidos: 'González Torres',
              telefono: '+34 645 678 901',
              email: 'pedro.gonzalez@email.com',
            },
          },
          paciente: {
            _id: 'pac4',
            nombre: 'Pedro',
            apellidos: 'González Torres',
          },
          plantilla: {
            _id: 'plant3',
            nombre: 'Recordatorio WhatsApp 24h',
            tipo: 'WhatsApp',
          },
          canal: 'WhatsApp',
          fecha_envio: '2024-03-20T11:30:00Z',
          estado: 'Confirmado',
          respuesta_paciente: 'Sí, confirmo',
          id_mensaje_proveedor: 'WA345678901',
        },
        {
          _id: '5',
          cita: {
            _id: 'cita5',
            fecha_hora_inicio: '2024-03-22T15:00:00Z',
            paciente: {
              _id: 'pac5',
              nombre: 'Lucía',
              apellidos: 'Moreno Díaz',
              telefono: '+34 656 789 012',
              email: 'lucia.moreno@email.com',
            },
          },
          paciente: {
            _id: 'pac5',
            nombre: 'Lucía',
            apellidos: 'Moreno Díaz',
          },
          plantilla: {
            _id: 'plant2',
            nombre: 'Recordatorio Email 48h',
            tipo: 'Email',
          },
          canal: 'Email',
          fecha_envio: '2024-03-20T15:00:00Z',
          estado: 'Entregado',
          id_mensaje_proveedor: 'EM456789012',
        },
        {
          _id: '6',
          cita: {
            _id: 'cita6',
            fecha_hora_inicio: '2024-03-22T16:30:00Z',
            paciente: {
              _id: 'pac6',
              nombre: 'Roberto',
              apellidos: 'Jiménez Vázquez',
              telefono: '+34 667 890 123',
              email: 'roberto.jimenez@email.com',
            },
          },
          paciente: {
            _id: 'pac6',
            nombre: 'Roberto',
            apellidos: 'Jiménez Vázquez',
          },
          plantilla: {
            _id: 'plant1',
            nombre: 'Recordatorio SMS 24h',
            tipo: 'SMS',
          },
          canal: 'SMS',
          fecha_envio: '2024-03-21T16:30:00Z',
          estado: 'Fallido',
          id_mensaje_proveedor: 'SM567890123',
        },
        {
          _id: '7',
          cita: {
            _id: 'cita7',
            fecha_hora_inicio: '2024-03-23T10:00:00Z',
            paciente: {
              _id: 'pac7',
              nombre: 'Sofía',
              apellidos: 'Ruiz Martín',
              telefono: '+34 678 901 234',
              email: 'sofia.ruiz@email.com',
            },
          },
          paciente: {
            _id: 'pac7',
            nombre: 'Sofía',
            apellidos: 'Ruiz Martín',
          },
          plantilla: {
            _id: 'plant2',
            nombre: 'Recordatorio Email 48h',
            tipo: 'Email',
          },
          canal: 'Email',
          fecha_envio: '2024-03-21T10:00:00Z',
          estado: 'Confirmado',
          id_mensaje_proveedor: 'EM567890123',
        },
        {
          _id: '8',
          cita: {
            _id: 'cita8',
            fecha_hora_inicio: '2024-03-23T12:00:00Z',
            paciente: {
              _id: 'pac8',
              nombre: 'David',
              apellidos: 'Hernández Castro',
              telefono: '+34 689 012 345',
              email: 'david.hernandez@email.com',
            },
          },
          paciente: {
            _id: 'pac8',
            nombre: 'David',
            apellidos: 'Hernández Castro',
          },
          plantilla: {
            _id: 'plant3',
            nombre: 'Recordatorio WhatsApp 24h',
            tipo: 'WhatsApp',
          },
          canal: 'WhatsApp',
          fecha_envio: '2024-03-22T12:00:00Z',
          estado: 'Pendiente',
          id_mensaje_proveedor: 'WA678901234',
        },
        {
          _id: '9',
          cita: {
            _id: 'cita9',
            fecha_hora_inicio: '2024-03-24T09:30:00Z',
            paciente: {
              _id: 'pac9',
              nombre: 'Elena',
              apellidos: 'Torres Ramírez',
              telefono: '+34 690 123 456',
              email: 'elena.torres@email.com',
            },
          },
          paciente: {
            _id: 'pac9',
            nombre: 'Elena',
            apellidos: 'Torres Ramírez',
          },
          plantilla: {
            _id: 'plant1',
            nombre: 'Recordatorio SMS 24h',
            tipo: 'SMS',
          },
          canal: 'SMS',
          fecha_envio: '2024-03-23T09:30:00Z',
          estado: 'Enviado',
          id_mensaje_proveedor: 'SM789012345',
        },
        {
          _id: '10',
          cita: {
            _id: 'cita10',
            fecha_hora_inicio: '2024-03-24T14:00:00Z',
            paciente: {
              _id: 'pac10',
              nombre: 'Javier',
              apellidos: 'Morales Serrano',
              telefono: '+34 601 234 567',
              email: 'javier.morales@email.com',
            },
          },
          paciente: {
            _id: 'pac10',
            nombre: 'Javier',
            apellidos: 'Morales Serrano',
          },
          plantilla: {
            _id: 'plant2',
            nombre: 'Recordatorio Email 48h',
            tipo: 'Email',
          },
          canal: 'Email',
          fecha_envio: '2024-03-22T14:00:00Z',
          estado: 'Entregado',
          id_mensaje_proveedor: 'EM678901234',
        },
        {
          _id: '11',
          cita: {
            _id: 'cita11',
            fecha_hora_inicio: '2024-03-25T11:00:00Z',
            paciente: {
              _id: 'pac11',
              nombre: 'Patricia',
              apellidos: 'López Gutiérrez',
              telefono: '+34 612 345 678',
              email: 'patricia.lopez@email.com',
            },
          },
          paciente: {
            _id: 'pac11',
            nombre: 'Patricia',
            apellidos: 'López Gutiérrez',
          },
          plantilla: {
            _id: 'plant1',
            nombre: 'Recordatorio SMS 24h',
            tipo: 'SMS',
          },
          canal: 'SMS',
          fecha_envio: '2024-03-24T11:00:00Z',
          estado: 'Confirmado',
          respuesta_paciente: 'CONFIRMAR',
          id_mensaje_proveedor: 'SM890123456',
        },
        {
          _id: '12',
          cita: {
            _id: 'cita12',
            fecha_hora_inicio: '2024-03-25T16:00:00Z',
            paciente: {
              _id: 'pac12',
              nombre: 'Miguel',
              apellidos: 'Ángel Pérez',
              telefono: '+34 623 456 789',
              email: 'miguel.angel@email.com',
            },
          },
          paciente: {
            _id: 'pac12',
            nombre: 'Miguel',
            apellidos: 'Ángel Pérez',
          },
          plantilla: {
            _id: 'plant3',
            nombre: 'Recordatorio WhatsApp 24h',
            tipo: 'WhatsApp',
          },
          canal: 'WhatsApp',
          fecha_envio: '2024-03-24T16:00:00Z',
          estado: 'Cancelado',
          respuesta_paciente: 'CANCELAR',
          id_mensaje_proveedor: 'WA789012345',
        },
      ];

      // Aplicar filtros
      let historialFiltrado = [...datosFalsos];
      
      if (fechaInicio) {
        historialFiltrado = historialFiltrado.filter(h => 
          new Date(h.fecha_envio) >= new Date(fechaInicio)
        );
      }
      
      if (fechaFin) {
        historialFiltrado = historialFiltrado.filter(h => 
          new Date(h.fecha_envio) <= new Date(fechaFin)
        );
      }
      
      if (estadoFiltro) {
        historialFiltrado = historialFiltrado.filter(h => h.estado === estadoFiltro);
      }

      // Paginación
      const page = filtros.page || 1;
      const limit = filtros.limit || 20;
      const total = historialFiltrado.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const historialPaginado = historialFiltrado.slice(startIndex, endIndex);

      setHistorial(historialPaginado);
      setPaginacion({
        total,
        page,
        limit,
        totalPages,
      });
    } catch (err) {
      setError('Error al cargar el historial de recordatorios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAplicarFiltros = () => {
    setFiltros({
      ...filtros,
      page: 1,
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined,
      estado: estadoFiltro || undefined,
    });
  };

  const handleLimpiarFiltros = () => {
    setFechaInicio('');
    setFechaFin('');
    setEstadoFiltro('');
    setFiltros({
      page: 1,
      limit: 20,
    });
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setFiltros({ ...filtros, page: nuevaPagina });
  };

  // Calcular estadísticas desde el historial
  useEffect(() => {
    if (historial.length > 0) {
      const stats = {
        totalEnviados: historial.length,
        totalConfirmados: historial.filter((r) => r.estado === 'Confirmado').length,
        totalFallidos: historial.filter((r) => r.estado === 'Fallido').length,
        tasaConfirmacion: 0,
        tasaEntrega: 0,
        porCanal: {
          SMS: { enviados: 0, confirmados: 0 },
          Email: { enviados: 0, confirmados: 0 },
          WhatsApp: { enviados: 0, confirmados: 0 },
        },
        porEstado: {
          Pendiente: 0,
          Enviado: 0,
          Entregado: 0,
          Confirmado: 0,
          Fallido: 0,
          Cancelado: 0,
        },
      };

      historial.forEach((r) => {
        // Por canal
        if (r.canal === 'SMS') {
          stats.porCanal.SMS.enviados++;
          if (r.estado === 'Confirmado') stats.porCanal.SMS.confirmados++;
        } else if (r.canal === 'Email') {
          stats.porCanal.Email.enviados++;
          if (r.estado === 'Confirmado') stats.porCanal.Email.confirmados++;
        } else if (r.canal === 'WhatsApp') {
          stats.porCanal.WhatsApp.enviados++;
          if (r.estado === 'Confirmado') stats.porCanal.WhatsApp.confirmados++;
        }

        // Por estado
        if (r.estado in stats.porEstado) {
          stats.porEstado[r.estado as keyof typeof stats.porEstado]++;
        }
      });

      stats.tasaConfirmacion =
        stats.totalEnviados > 0
          ? (stats.totalConfirmados / stats.totalEnviados) * 100
          : 0;
      stats.tasaEntrega =
        stats.totalEnviados > 0
          ? ((stats.totalEnviados - stats.totalFallidos) / stats.totalEnviados) * 100
          : 0;

      setEstadisticas(stats);
    }
  }, [historial]);

  const filtrosActivos = Boolean(fechaInicio || fechaFin || estadoFiltro);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Bell size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Recordatorios de Citas
                </h1>
                <p className="text-gray-600">
                  Historial y gestión de recordatorios enviados a pacientes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={cargarHistorial}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white shadow-sm ring-1 ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                Actualizar
              </button>
            </div>
          </div>

          {/* Panel de estadísticas */}
          <PanelEstadisticasRecordatorios estadisticas={estadisticas} />

          {/* Mensaje de error */}
          {error && (
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 flex-1">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Sistema de Filtros */}
          <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            <div className="p-0">
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  {/* Input de búsqueda */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar recordatorios..."
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                    />
                  </div>
                  
                  {/* Botón de filtros */}
                  <button
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white shadow-sm ring-1 ring-slate-200"
                  >
                    <Filter size={18} className="opacity-70" />
                    Filtros
                    {filtrosActivos && (
                      <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                        {[fechaInicio, fechaFin, estadoFiltro].filter(Boolean).length}
                      </span>
                    )}
                    {mostrarFiltros ? (
                      <ChevronUp size={18} className="opacity-70" />
                    ) : (
                      <ChevronDown size={18} className="opacity-70" />
                    )}
                  </button>

                  {/* Botón limpiar filtros */}
                  {filtrosActivos && (
                    <button
                      onClick={handleLimpiarFiltros}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white shadow-sm ring-1 ring-slate-200"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>

              {/* Panel de Filtros Avanzados */}
              {mostrarFiltros && (
                <div className="px-4 py-4">
                  <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          <Calendar size={16} className="inline mr-1" />
                          Fecha Inicio
                        </label>
                        <input
                          type="date"
                          value={fechaInicio}
                          onChange={(e) => setFechaInicio(e.target.value)}
                          className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          <Calendar size={16} className="inline mr-1" />
                          Fecha Fin
                        </label>
                        <input
                          type="date"
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                          className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Estado
                        </label>
                        <select
                          value={estadoFiltro}
                          onChange={(e) => setEstadoFiltro(e.target.value)}
                          className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                        >
                          <option value="">Todos</option>
                          <option value="Pendiente">Pendiente</option>
                          <option value="Enviado">Enviado</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Confirmado">Confirmado</option>
                          <option value="Fallido">Fallido</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleAplicarFiltros}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
                      >
                        Aplicar Filtros
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Resumen de resultados */}
              <div className="px-4 pb-4">
                <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                  <span>{paginacion.total} resultados encontrados</span>
                  <span>{filtrosActivos ? [fechaInicio, fechaFin, estadoFiltro].filter(Boolean).length : 0} filtros aplicados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de historial */}
          <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            <div className="p-6">
              <TablaHistorialRecordatorios historial={historial} loading={loading} />
            </div>
          </div>

          {/* Paginación */}
          {paginacion.totalPages > 1 && (
            <div className="bg-white shadow-sm rounded-xl p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-600">
                  Mostrando {((paginacion.page || 1) - 1) * (paginacion.limit || 20) + 1} a{' '}
                  {Math.min((paginacion.page || 1) * (paginacion.limit || 20), paginacion.total)} de{' '}
                  {paginacion.total} recordatorios
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCambiarPagina(paginacion.page - 1)}
                    disabled={paginacion.page === 1 || loading}
                    className="inline-flex items-center justify-center p-2 rounded-xl text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-slate-200"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-4 py-2 text-sm text-slate-700">
                    Página {paginacion.page} de {paginacion.totalPages}
                  </span>
                  <button
                    onClick={() => handleCambiarPagina(paginacion.page + 1)}
                    disabled={paginacion.page >= paginacion.totalPages || loading}
                    className="inline-flex items-center justify-center p-2 rounded-xl text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-slate-200"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


