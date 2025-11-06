import { useState, useEffect } from 'react';
import { Bell, Filter, RefreshCw, Settings, BarChart3, Calendar } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recordatorios de Citas</h2>
            <p className="text-gray-600 text-sm mt-1">
              Historial y gestión de recordatorios enviados a pacientes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button
            onClick={cargarHistorial}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Panel de estadísticas */}
      <PanelEstadisticasRecordatorios estadisticas={estadisticas} />

      {/* Filtros */}
      {mostrarFiltros && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            <div className="flex items-end gap-2">
              <button
                onClick={handleAplicarFiltros}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aplicar
              </button>
              <button
                onClick={handleLimpiarFiltros}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de historial */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Recordatorios</h3>
          <span className="text-sm text-gray-500">
            Total: {paginacion.total} recordatorios
          </span>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <TablaHistorialRecordatorios historial={historial} loading={loading} />

        {/* Paginación */}
        {paginacion.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Página {paginacion.page} de {paginacion.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCambiarPagina(paginacion.page - 1)}
                disabled={paginacion.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => handleCambiarPagina(paginacion.page + 1)}
                disabled={paginacion.page === paginacion.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


