import { Presupuesto } from '../api/presupuestosApi';
import MenuAccionesPresupuesto from './MenuAccionesPresupuesto';
import { Calendar, User, MapPin, DollarSign, FileText } from 'lucide-react';

const formatFecha = (fecha: string) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatFechaHora = (fecha: string) => {
  const date = new Date(fecha);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface TablaPresupuestosProps {
  presupuestos: Presupuesto[];
  loading?: boolean;
  onVerDetalle: (presupuesto: Presupuesto) => void;
  onCambiarEstado: (id: string, nuevoEstado: 'Pendiente' | 'Aceptado' | 'Rechazado' | 'Completado' | 'Anulado') => void;
  onEliminar: (id: string) => void;
  onEditar?: (presupuestoId: string) => void;
  onAprobar?: (presupuestoId: string) => void;
}

const getEstadoBadgeClass = (estado: Presupuesto['estado']) => {
  const clases = {
    Pendiente: 'bg-yellow-100 text-yellow-800',
    Aceptado: 'bg-green-100 text-green-800',
    Rechazado: 'bg-red-100 text-red-800',
    Completado: 'bg-blue-100 text-blue-800',
    Anulado: 'bg-gray-100 text-gray-800',
  };
  return clases[estado] || 'bg-gray-100 text-gray-800';
};

export default function TablaPresupuestos({
  presupuestos,
  loading = false,
  onVerDetalle,
  onCambiarEstado,
  onEliminar,
  onEditar,
  onAprobar,
}: TablaPresupuestosProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando presupuestos...</p>
      </div>
    );
  }

  if (presupuestos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600 text-lg">No se encontraron presupuestos</p>
        <p className="text-gray-500 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Profesional
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Sede
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {presupuestos.map((presupuesto) => {
              const diasRestantes = presupuesto.fechaValidez 
                ? Math.ceil((new Date(presupuesto.fechaValidez).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null;
              const estaVencido = diasRestantes !== null && diasRestantes < 0;
              
              return (
              <tr key={presupuesto._id} className="hover:bg-blue-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {presupuesto.numeroPresupuesto}
                      </div>
                      <div className="text-xs text-gray-500">
                        {presupuesto.tratamientos.length} {presupuesto.tratamientos.length === 1 ? 'tratamiento' : 'tratamientos'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {presupuesto.paciente.nombre} {presupuesto.paciente.apellidos}
                      </div>
                      {presupuesto.paciente.dni && (
                        <div className="text-xs text-gray-500">
                          DNI: {presupuesto.paciente.dni}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {presupuesto.profesional.nombre} {presupuesto.profesional.apellidos}
                  </div>
                  {presupuesto.profesional.rol && (
                    <div className="text-xs text-gray-500">
                      {presupuesto.profesional.rol}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <div className="text-sm text-gray-900 font-medium">
                      {presupuesto.sede.nombre}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-900 font-medium">
                        {formatFecha(presupuesto.fechaCreacion)}
                      </div>
                      {presupuesto.fechaValidez && (
                        <div className={`text-xs ${estaVencido ? 'text-red-600 font-semibold' : diasRestantes && diasRestantes <= 7 ? 'text-yellow-600' : 'text-gray-500'}`}>
                          {estaVencido 
                            ? '⚠️ Vencido' 
                            : diasRestantes !== null 
                              ? `${diasRestantes} días restantes`
                              : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getEstadoBadgeClass(
                      presupuesto.estado
                    )}`}
                  >
                    {presupuesto.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(presupuesto.total)}
                      </div>
                      {presupuesto.descuentoTotal > 0 && (
                        <div className="text-xs text-green-600">
                          -{new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(presupuesto.descuentoTotal)} desc.
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <MenuAccionesPresupuesto
                    presupuesto={presupuesto}
                    onVerDetalle={onVerDetalle}
                    onCambiarEstado={onCambiarEstado}
                    onEliminar={onEliminar}
                    onEditar={onEditar}
                    onAprobar={onAprobar}
                  />
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

