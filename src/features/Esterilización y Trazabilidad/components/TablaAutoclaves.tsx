import { useState } from 'react';
import { Search, Filter, Wrench, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Autoclave, FiltrosAutoclaves } from '../api/mantenimientoAutoclaveApi';

interface TablaAutoclavesProps {
  autoclaves: Autoclave[];
  loading: boolean;
  onVerDetalle: (autoclave: Autoclave) => void;
  onRegistrarMantenimiento: (autoclave: Autoclave) => void;
  filtros: FiltrosAutoclaves;
  onFiltrosChange: (filtros: FiltrosAutoclaves) => void;
}

export default function TablaAutoclaves({
  autoclaves,
  loading,
  onVerDetalle,
  onRegistrarMantenimiento,
  filtros,
  onFiltrosChange,
}: TablaAutoclavesProps) {
  const [busqueda, setBusqueda] = useState('');

  const autoclavesFiltrados = autoclaves.filter((autoclave) => {
    const coincideBusqueda =
      busqueda === '' ||
      autoclave.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      autoclave.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      autoclave.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
      autoclave.numeroSerie.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado = !filtros.estado || autoclave.estado === filtros.estado;

    return coincideBusqueda && coincideEstado;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Activo
          </span>
        );
      case 'en_reparacion':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Wrench className="w-3 h-3 mr-1" />
            En Reparación
          </span>
        );
      case 'inactivo':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Inactivo
          </span>
        );
      default:
        return null;
    }
  };

  const getDiasProximoMantenimiento = (fecha: Date | string) => {
    const fechaMantenimiento = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaMantenimiento.setHours(0, 0, 0, 0);
    const diffTime = fechaMantenimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProximoMantenimientoBadge = (fecha: Date | string) => {
    const dias = getDiasProximoMantenimiento(fecha);
    if (dias < 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Vencido ({Math.abs(dias)} días)
        </span>
      );
    } else if (dias <= 7) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Próximo ({dias} días)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {dias} días
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando autoclaves...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filtros y búsqueda */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, marca, modelo o número de serie..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filtros.estado || ''}
              onChange={(e) =>
                onFiltrosChange({ ...filtros, estado: e.target.value as any || undefined })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="en_reparacion">En Reparación</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marca / Modelo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número de Serie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Próximo Mantenimiento
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {autoclavesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No se encontraron autoclaves
                </td>
              </tr>
            ) : (
              autoclavesFiltrados.map((autoclave) => (
                <tr key={autoclave._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{autoclave.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {autoclave.marca} {autoclave.modelo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">{autoclave.numeroSerie}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{autoclave.ubicacion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getEstadoBadge(autoclave.estado)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getProximoMantenimientoBadge(autoclave.proximoMantenimiento)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onVerDetalle(autoclave)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Ver Detalle
                      </button>
                      <button
                        onClick={() => onRegistrarMantenimiento(autoclave)}
                        className="text-green-600 hover:text-green-900 transition-colors flex items-center space-x-1"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>Mantenimiento</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


