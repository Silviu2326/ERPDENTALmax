import { useState, useEffect } from 'react';
import { Search, X, CheckCircle, Clock } from 'lucide-react';
import { obtenerTrabajosNoFacturados, TrabajoLaboratorio } from '../api/facturacionLaboratorioApi';

interface BuscadorTrabajosLaboratorioProps {
  laboratorioId?: string;
  trabajosSeleccionados: TrabajoLaboratorio[];
  onTrabajosSeleccionados: (trabajos: TrabajoLaboratorio[]) => void;
  disabled?: boolean;
}

export default function BuscadorTrabajosLaboratorio({
  laboratorioId,
  trabajosSeleccionados,
  onTrabajosSeleccionados,
  disabled = false,
}: BuscadorTrabajosLaboratorioProps) {
  const [trabajos, setTrabajos] = useState<TrabajoLaboratorio[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarLista, setMostrarLista] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (laboratorioId) {
      cargarTrabajos();
    } else {
      setTrabajos([]);
    }
  }, [laboratorioId]);

  const cargarTrabajos = async () => {
    if (!laboratorioId) return;

    setLoading(true);
    setError(null);
    try {
      const trabajosDisponibles = await obtenerTrabajosNoFacturados(laboratorioId);
      // Filtrar los que ya están seleccionados
      const trabajosNoSeleccionados = trabajosDisponibles.filter(
        (trabajo) => !trabajosSeleccionados.some((sel) => sel._id === trabajo._id)
      );
      setTrabajos(trabajosNoSeleccionados);
    } catch (err) {
      console.error('Error al cargar trabajos:', err);
      setError('Error al cargar los trabajos no facturados');
      setTrabajos([]);
    } finally {
      setLoading(false);
    }
  };

  const trabajosFiltrados = trabajos.filter((trabajo) => {
    const busquedaLower = busqueda.toLowerCase();
    return (
      trabajo.paciente.nombre.toLowerCase().includes(busquedaLower) ||
      trabajo.paciente.apellidos.toLowerCase().includes(busquedaLower) ||
      trabajo.tratamiento.nombre.toLowerCase().includes(busquedaLower)
    );
  });

  const handleSeleccionar = (trabajo: TrabajoLaboratorio) => {
    if (!trabajosSeleccionados.some((t) => t._id === trabajo._id)) {
      onTrabajosSeleccionados([...trabajosSeleccionados, trabajo]);
      setBusqueda('');
      setMostrarLista(false);
      // Recargar trabajos para actualizar la lista
      setTimeout(() => cargarTrabajos(), 100);
    }
  };

  const handleEliminar = (trabajoId: string) => {
    onTrabajosSeleccionados(
      trabajosSeleccionados.filter((t) => t._id !== trabajoId)
    );
    // Recargar trabajos para actualizar la lista
    setTimeout(() => cargarTrabajos(), 100);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cantidad);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar Trabajos No Facturados
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setMostrarLista(true);
            }}
            onFocus={() => setMostrarLista(true)}
            onBlur={() => setTimeout(() => setMostrarLista(false), 200)}
            placeholder="Buscar por paciente o tratamiento..."
            disabled={disabled || !laboratorioId}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        {!laboratorioId && (
          <p className="mt-1 text-xs text-gray-500">
            Selecciona un laboratorio primero para buscar trabajos
          </p>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>

      {mostrarLista && busqueda && trabajosFiltrados.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {trabajosFiltrados.map((trabajo) => (
            <button
              key={trabajo._id}
              type="button"
              onClick={() => handleSeleccionar(trabajo)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">
                {trabajo.paciente.nombre} {trabajo.paciente.apellidos}
              </div>
              <div className="text-sm text-gray-600">{trabajo.tratamiento.nombre}</div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-gray-500">
                  {formatearFecha(trabajo.fechaCreacion)}
                </div>
                <div className="text-sm font-semibold text-blue-600">
                  {formatearMoneda(trabajo.coste)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {trabajosSeleccionados.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trabajos Seleccionados ({trabajosSeleccionados.length})
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
            {trabajosSeleccionados.map((trabajo) => (
              <div
                key={trabajo._id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {trabajo.paciente.nombre} {trabajo.paciente.apellidos}
                  </div>
                  <div className="text-sm text-gray-600">{trabajo.tratamiento.nombre}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatearFecha(trabajo.fechaCreacion)} - {formatearMoneda(trabajo.coste)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleEliminar(trabajo._id)}
                  disabled={disabled}
                  className="ml-2 text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Eliminar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Cargando trabajos...</span>
        </div>
      )}
    </div>
  );
}


