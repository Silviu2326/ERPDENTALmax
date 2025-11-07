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
    <div className="bg-white shadow-sm rounded-lg mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={busquedaPaciente}
                onChange={(e) => setBusquedaPaciente(e.target.value)}
                placeholder="Buscar paciente por nombre, apellidos, teléfono o email..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            
            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-all text-sm font-medium"
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
              {tieneFiltrosActivos && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {[filtros.profesional_id, filtros.sede_id, filtros.estado, busquedaPaciente].filter(Boolean).length}
                </span>
              )}
            </button>
            
            {/* Botón limpiar (si hay filtros activos) */}
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium"
              >
                <X className="w-5 h-5" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Presets de fecha rápidos */}
        <div className="flex flex-wrap gap-2">
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

        {/* Panel de Filtros Avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Users size={16} className="inline mr-1" />
                  Profesional
                </label>
                <select
                  value={filtros.profesional_id || ''}
                  onChange={(e) => handleChange('profesional_id', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Sede
                </label>
                <select
                  value={filtros.sede_id || ''}
                  onChange={(e) => handleChange('sede_id', e.target.value)}
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
                  <AlertCircle size={16} className="inline mr-1" />
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleChange('estado', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Inicio
                </label>
                <input
                  type="datetime-local"
                  value={filtros.fecha_inicio ? new Date(filtros.fecha_inicio).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const fecha = e.target.value ? new Date(e.target.value).toISOString() : '';
                    onFiltrosChange({ ...filtros, fecha_inicio: fecha });
                  }}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Fecha Fin
                </label>
                <input
                  type="datetime-local"
                  value={filtros.fecha_fin ? new Date(filtros.fecha_fin).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const fecha = e.target.value ? new Date(e.target.value).toISOString() : '';
                    onFiltrosChange({ ...filtros, fecha_fin: fecha });
                  }}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Resumen de resultados */}
        {tieneFiltrosActivos && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>Filtros aplicados: {[filtros.profesional_id, filtros.sede_id, filtros.estado, busquedaPaciente].filter(Boolean).length}</span>
            <div className="flex flex-wrap gap-2">
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
                  Búsqueda
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

