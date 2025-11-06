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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h3>
          {tieneFiltrosActivos && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              Filtros activos
            </span>
          )}
        </div>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profesional
          </label>
          <select
            value={filtros.profesionalId || ''}
            onChange={(e) => handleChange('profesionalId', e.target.value)}
            disabled={loadingDatos}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sede
          </label>
          <select
            value={filtros.sedeId || ''}
            onChange={(e) => handleChange('sedeId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={filtros.estado || ''}
            onChange={(e) => handleChange('estado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tratamiento
          </label>
          <select
            value={filtros.tratamientoId || ''}
            onChange={(e) => handleChange('tratamientoId', e.target.value)}
            disabled={loadingDatos}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Inicio *
          </label>
          <input
            type="date"
            value={filtros.fechaInicio ? new Date(filtros.fechaInicio).toISOString().split('T')[0] : ''}
            onChange={(e) => handleChange('fechaInicio', new Date(e.target.value).toISOString())}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Fin *
          </label>
          <input
            type="date"
            value={filtros.fechaFin ? new Date(filtros.fechaFin).toISOString().split('T')[0] : ''}
            onChange={(e) => handleChange('fechaFin', new Date(e.target.value).toISOString())}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onBuscar}
          disabled={loading || !filtros.fechaInicio || !filtros.fechaFin}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Search className="w-5 h-5" />
          <span>{loading ? 'Buscando...' : 'Buscar Citas'}</span>
        </button>
      </div>
    </div>
  );
}


