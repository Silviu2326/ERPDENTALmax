import { useState } from 'react';
import { Calendar, Filter, X, Clock, Users, MapPin, AlertCircle, Search } from 'lucide-react';
import { FiltrosCalendario as IFiltrosCalendario } from '../api/citasApi';

interface FiltrosCalendarioProps {
  filtros: IFiltrosCalendario;
  onFiltrosChange: (filtros: IFiltrosCalendario) => void;
  profesionales?: Array<{ _id: string; nombre: string; apellidos: string }>;
  sedes?: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosCalendario({
  filtros,
  onFiltrosChange,
  profesionales = [],
  sedes = [],
}: FiltrosCalendarioProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [busquedaPaciente, setBusquedaPaciente] = useState('');

  const estados = [
    { value: 'programada', label: 'Programada' },
    { value: 'confirmada', label: 'Confirmada' },
    { value: 'cancelada', label: 'Cancelada' },
    { value: 'realizada', label: 'Realizada' },
    { value: 'no-asistio', label: 'No Asistió' },
  ];

  const handleChange = (key: keyof IFiltrosCalendario, value: string) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
    });
  };

  const limpiarFiltros = () => {
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 7);
    fechaFin.setHours(23, 59, 59, 999);

    onFiltrosChange({
      fecha_inicio: fechaInicio.toISOString(),
      fecha_fin: fechaFin.toISOString(),
    });
  };

  const tieneFiltrosActivos = filtros.profesional_id || filtros.sede_id || filtros.estado || busquedaPaciente;

  // Presets de fechas rápidas
  const aplicarPresetFecha = (preset: 'hoy' | 'semana' | 'mes' | 'proximoMes') => {
    const ahora = new Date();
    let fechaInicio = new Date(ahora);
    let fechaFin = new Date(ahora);
    
    switch (preset) {
      case 'hoy':
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setHours(23, 59, 59, 999);
        break;
      case 'semana':
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setDate(fechaFin.getDate() + 7);
        fechaFin.setHours(23, 59, 59, 999);
        break;
      case 'mes':
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setMonth(fechaFin.getMonth() + 1);
        fechaFin.setDate(0); // Último día del mes
        fechaFin.setHours(23, 59, 59, 999);
        break;
      case 'proximoMes':
        fechaInicio.setMonth(fechaInicio.getMonth() + 1);
        fechaInicio.setDate(1);
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin = new Date(fechaInicio);
        fechaFin.setMonth(fechaFin.getMonth() + 1);
        fechaFin.setDate(0);
        fechaFin.setHours(23, 59, 59, 999);
        break;
    }
    
    onFiltrosChange({
      ...filtros,
      fecha_inicio: fechaInicio.toISOString(),
      fecha_fin: fechaFin.toISOString(),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Filtros y Búsqueda</h3>
            <p className="text-xs text-gray-500">Personaliza la vista del calendario</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {tieneFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <X className="w-4 h-4" />
              <span>Limpiar Todo</span>
            </button>
          )}
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {mostrarFiltros ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>
      
      {/* Presets de fecha rápidos */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => aplicarPresetFecha('hoy')}
          className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 font-medium"
        >
          📅 Hoy
        </button>
        <button
          onClick={() => aplicarPresetFecha('semana')}
          className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200 font-medium"
        >
          📆 Próxima Semana
        </button>
        <button
          onClick={() => aplicarPresetFecha('mes')}
          className="px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 font-medium"
        >
          🗓️ Este Mes
        </button>
        <button
          onClick={() => aplicarPresetFecha('proximoMes')}
          className="px-3 py-1.5 text-xs bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200 font-medium"
        >
          ➡️ Próximo Mes
        </button>
      </div>

      {mostrarFiltros && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {/* Búsqueda de paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Buscar Paciente</span>
            </label>
            <input
              type="text"
              value={busquedaPaciente}
              onChange={(e) => setBusquedaPaciente(e.target.value)}
              placeholder="Nombre, apellidos, teléfono o email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filtros principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Profesional</span>
              </label>
              <select
                value={filtros.profesional_id || ''}
                onChange={(e) => handleChange('profesional_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Todos los profesionales</option>
                {profesionales.map((prof) => (
                  <option key={prof._id} value={prof._id}>
                    {prof.nombre} {prof.apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span>Sede</span>
              </label>
              <select
                value={filtros.sede_id || ''}
                onChange={(e) => handleChange('sede_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span>Estado</span>
              </label>
              <select
                value={filtros.estado || ''}
                onChange={(e) => handleChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Todos los estados</option>
                {estados.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Filtros de fecha personalizados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Fecha Inicio</span>
              </label>
              <input
                type="datetime-local"
                value={filtros.fecha_inicio ? new Date(filtros.fecha_inicio).toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const fecha = e.target.value ? new Date(e.target.value).toISOString() : '';
                  onFiltrosChange({ ...filtros, fecha_inicio: fecha });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Fecha Fin</span>
              </label>
              <input
                type="datetime-local"
                value={filtros.fecha_fin ? new Date(filtros.fecha_fin).toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const fecha = e.target.value ? new Date(e.target.value).toISOString() : '';
                  onFiltrosChange({ ...filtros, fecha_fin: fecha });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Indicador de filtros activos */}
          {tieneFiltrosActivos && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-medium text-gray-600">Filtros activos:</span>
                {filtros.profesional_id && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Profesional
                  </span>
                )}
                {filtros.sede_id && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Sede
                  </span>
                )}
                {filtros.estado && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    {estados.find(e => e.value === filtros.estado)?.label}
                  </span>
                )}
                {busquedaPaciente && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Búsqueda: {busquedaPaciente}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

