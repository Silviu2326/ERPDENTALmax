import { useState, useEffect } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { FiltrosReprogramacion, obtenerProfesionales, Profesional, obtenerTratamientos, Tratamiento } from '../api/citasApi';

interface FiltroCitasReprogramarProps {
  filtros: FiltrosReprogramacion;
  onFiltrosChange: (filtros: FiltrosReprogramacion) => void;
  onBuscar: () => void;
  loading?: boolean;
}

export default function FiltroCitasReprogramar({
  filtros,
  onFiltrosChange,
  onBuscar,
  loading = false,
}: FiltroCitasReprogramarProps) {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [loadingDatos, setLoadingDatos] = useState(false);

  // Mock de sedes (en producción vendría de una API)
  const sedes = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

  const estados = [
    { value: 'programada', label: 'Programada' },
    { value: 'confirmada', label: 'Confirmada' },
    { value: 'cancelada', label: 'Cancelada' },
    { value: 'realizada', label: 'Realizada' },
    { value: 'no-asistio', label: 'No Asistió' },
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      setLoadingDatos(true);
      try {
        const [profs, trat] = await Promise.all([
          obtenerProfesionales(),
          obtenerTratamientos(),
        ]);
        setProfesionales(profs);
        setTratamientos(trat);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoadingDatos(false);
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (key: keyof FiltrosReprogramacion, value: string) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
    });
  };

  const limpiarFiltros = () => {
    const ahora = new Date();
    const fechaInicio = new Date(ahora);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(ahora);
    fechaFin.setDate(fechaFin.getDate() + 7);
    fechaFin.setHours(23, 59, 59, 999);

    onFiltrosChange({
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
    });
  };

  const tieneFiltrosActivos = filtros.profesionalId || filtros.sedeId || filtros.estado || filtros.tratamientoId;

  return (
    <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
            {tieneFiltrosActivos && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Filtros activos
              </span>
            )}
          </div>
          {tieneFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-red-600 transition-colors"
            >
              <X size={16} />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Profesional
              </label>
              <select
                value={filtros.profesionalId || ''}
                onChange={(e) => handleChange('profesionalId', e.target.value)}
                disabled={loadingDatos}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <Filter size={16} className="inline mr-1" />
                Sede
              </label>
              <select
                value={filtros.sedeId || ''}
                onChange={(e) => handleChange('sedeId', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <Filter size={16} className="inline mr-1" />
                Estado
              </label>
              <select
                value={filtros.estado || ''}
                onChange={(e) => handleChange('estado', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Todos los estados</option>
                {estados.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Tratamiento
              </label>
              <select
                value={filtros.tratamientoId || ''}
                onChange={(e) => handleChange('tratamientoId', e.target.value)}
                disabled={loadingDatos}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100"
              >
                <option value="">Todos los tratamientos</option>
                {tratamientos.map((trat) => (
                  <option key={trat._id} value={trat._id}>
                    {trat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Fecha Inicio *
              </label>
              <input
                type="date"
                value={filtros.fechaInicio ? new Date(filtros.fechaInicio).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange('fechaInicio', new Date(e.target.value).toISOString())}
                required
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Fecha Fin *
              </label>
              <input
                type="date"
                value={filtros.fechaFin ? new Date(filtros.fechaFin).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange('fechaFin', new Date(e.target.value).toISOString())}
                required
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4 mt-4">
          <span>Filtros de búsqueda</span>
          <div className="flex items-center gap-2">
            {tieneFiltrosActivos && (
              <span className="text-slate-600">
                {[filtros.profesionalId, filtros.sedeId, filtros.estado, filtros.tratamientoId].filter(Boolean).length} filtros aplicados
              </span>
            )}
            <button
              onClick={onBuscar}
              disabled={loading || !filtros.fechaInicio || !filtros.fechaFin}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Search size={20} />
              <span>{loading ? 'Buscando...' : 'Buscar Citas'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



