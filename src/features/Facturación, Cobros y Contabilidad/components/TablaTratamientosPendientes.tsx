import { Tratamiento } from '../api/liquidacionesApi';
import { CheckCircle2, Circle } from 'lucide-react';

interface TablaTratamientosPendientesProps {
  tratamientos: Tratamiento[];
  tratamientosSeleccionados: string[];
  onToggleTratamiento: (tratamientoId: string) => void;
  onToggleTodos: () => void;
  loading?: boolean;
}

export default function TablaTratamientosPendientes({
  tratamientos,
  tratamientosSeleccionados,
  onToggleTratamiento,
  onToggleTodos,
  loading = false,
}: TablaTratamientosPendientesProps) {
  const todosSeleccionados =
    tratamientos.length > 0 && tratamientosSeleccionados.length === tratamientos.length;

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tratamientos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="text-center py-12">
          <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No hay tratamientos pendientes
          </h3>
          <p className="text-gray-500">
            No se encontraron tratamientos para liquidar con los filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Tratamientos Pendientes ({tratamientos.length})
          </h3>
          <button
            onClick={onToggleTodos}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {todosSeleccionados ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Deseleccionar todos</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-gray-400" />
                <span>Seleccionar todos</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={todosSeleccionados}
                  onChange={onToggleTodos}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Prestación
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Importe Total
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Importe Mutua
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Importe Paciente
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tratamientos.map((tratamiento) => {
              const estaSeleccionado = tratamientosSeleccionados.includes(tratamiento._id);
              return (
                <tr
                  key={tratamiento._id}
                  className={`hover:bg-gray-50 transition-colors ${
                    estaSeleccionado ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={estaSeleccionado}
                      onChange={() => onToggleTratamiento(tratamiento._id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatearFecha(tratamiento.fecha)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">
                        {tratamiento.paciente.nombre} {tratamiento.paciente.apellidos}
                      </div>
                      {tratamiento.paciente.dni && (
                        <div className="text-xs text-gray-500">DNI: {tratamiento.paciente.dni}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{tratamiento.prestacion.nombre}</div>
                      {tratamiento.prestacion.codigo && (
                        <div className="text-xs text-gray-500">Código: {tratamiento.prestacion.codigo}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatearMoneda(tratamiento.importeTotal)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-blue-600">
                    {formatearMoneda(tratamiento.importeMutua)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">
                    {formatearMoneda(tratamiento.importePaciente)}
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


