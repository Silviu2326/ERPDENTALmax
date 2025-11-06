import { useState, useEffect } from 'react';
import { Eye, Plus, Calendar, Package } from 'lucide-react';
import { Implante, obtenerImplantesPorPaciente } from '../api/implantesApi';
import IndicadorEstadoImplante from './IndicadorEstadoImplante';

interface TablaImplantesPacienteProps {
  pacienteId: string;
  onVerDetalle: (implante: Implante) => void;
  onNuevoImplante?: () => void;
}

export default function TablaImplantesPaciente({
  pacienteId,
  onVerDetalle,
  onNuevoImplante,
}: TablaImplantesPacienteProps) {
  const [implantes, setImplantes] = useState<Implante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pacienteId) {
      cargarImplantes();
    }
  }, [pacienteId]);

  const cargarImplantes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerImplantesPorPaciente(pacienteId);
      setImplantes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los implantes');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: Date | string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Cargando implantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={cargarImplantes}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Implantes del Paciente</h3>
            <p className="text-sm text-gray-600">{implantes.length} implante(s) registrado(s)</p>
          </div>
        </div>
        {onNuevoImplante && (
          <button
            onClick={onNuevoImplante}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Implante
          </button>
        )}
      </div>

      {implantes.length === 0 ? (
        <div className="p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No hay implantes registrados para este paciente</p>
          {onNuevoImplante && (
            <button
              onClick={onNuevoImplante}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Registrar Primer Implante
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pieza Dental
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Implante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Colocación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Medición
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {implantes.map((implante) => (
                <tr key={implante._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{implante.piezaDental}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{implante.marca} {implante.modelo}</div>
                      <div className="text-gray-500">
                        Ø{implante.diametro}mm × {implante.longitud}mm
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatearFecha(implante.fechaColocacion)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <IndicadorEstadoImplante estado={implante.estadoOsteointegracion} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {implante.ultimaMedicion ? (
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">
                          {implante.ultimaMedicion.tipoMedicion}: {implante.ultimaMedicion.valor}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatearFecha(implante.ultimaMedicion.fecha)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Sin mediciones</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onVerDetalle(implante)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


