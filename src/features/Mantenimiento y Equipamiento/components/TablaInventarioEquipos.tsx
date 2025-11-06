import { useState } from 'react';
import { Eye, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { EquipoClinico, FiltrosEquipos } from '../api/equiposApi';
import ModalDetalleEquipo from './ModalDetalleEquipo';
import { useAuth } from '../../../contexts/AuthContext';

interface TablaInventarioEquiposProps {
  equipos: EquipoClinico[];
  loading?: boolean;
  filtros: FiltrosEquipos;
  onFiltrosChange: (filtros: FiltrosEquipos) => void;
  onEquipoEliminado?: () => void;
  onEditarEquipo?: (equipo: EquipoClinico) => void;
  onVerDetalle?: (equipo: EquipoClinico) => void;
}

export default function TablaInventarioEquipos({
  equipos,
  loading = false,
  filtros,
  onFiltrosChange,
  onEquipoEliminado,
  onEditarEquipo,
  onVerDetalle,
}: TablaInventarioEquiposProps) {
  const { user } = useAuth();
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<EquipoClinico | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleSort = (campo: string) => {
    // Implementar ordenamiento si es necesario
    // Por ahora solo mostramos la tabla
  };

  const handleVerDetalle = (equipo: EquipoClinico) => {
    setEquipoSeleccionado(equipo);
    setMostrarModal(true);
    if (onVerDetalle) {
      onVerDetalle(equipo);
    }
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setEquipoSeleccionado(null);
  };

  const handleEditar = (equipo: EquipoClinico) => {
    if (onEditarEquipo) {
      onEditarEquipo(equipo);
    }
    handleCerrarModal();
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Operativo':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'En Mantenimiento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Fuera de Servicio':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'De Baja':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const puedeEditar =
    user?.role === 'compras_inventario' || user?.role === 'admin' || user?.role === 'director';

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando equipos...</p>
      </div>
    );
  }

  if (equipos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600">No se encontraron equipos</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipo
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
                  Costo
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
              {equipos.map((equipo) => (
                <tr key={equipo._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{equipo.nombre}</div>
                      <div className="text-sm text-gray-500">
                        {equipo.marca} {equipo.modelo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">{equipo.numeroSerie}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{equipo.ubicacion.sede.nombre}</div>
                    {equipo.ubicacion.gabinete && (
                      <div className="text-sm text-gray-500">Gabinete: {equipo.ubicacion.gabinete}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEstadoColor(
                        equipo.estado
                      )}`}
                    >
                      {equipo.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(equipo.costo)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(equipo.fechaProximoMantenimiento)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleVerDetalle(equipo)}
                        className="text-blue-600 hover:text-blue-900 p-1.5 rounded hover:bg-blue-50 transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {puedeEditar && onEditarEquipo && (
                        <button
                          onClick={() => onEditarEquipo(equipo)}
                          className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded hover:bg-indigo-50 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalDetalleEquipo
        equipo={equipoSeleccionado}
        isOpen={mostrarModal}
        onClose={handleCerrarModal}
        onEditar={puedeEditar && onEditarEquipo ? handleEditar : undefined}
      />
    </>
  );
}


