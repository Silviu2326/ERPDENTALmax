interface Inasistencia {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    telefono?: string;
  };
  fechaHora: string;
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  sede: {
    _id: string;
    nombre: string;
  };
  origen: string;
}

interface TablaDetalleInasistenciasProps {
  inasistencias: Inasistencia[];
  loading?: boolean;
}

export default function TablaDetalleInasistencias({
  inasistencias = [],
  loading = false,
}: TablaDetalleInasistenciasProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Detalle de Inasistencias</h3>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (inasistencias.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Detalle de Inasistencias</h3>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p>No hay inasistencias registradas en el período seleccionado</p>
        </div>
      </div>
    );
  }

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const etiquetasOrigen: Record<string, string> = {
    web: 'Web',
    telefono: 'Teléfono',
    presencial: 'Presencial',
    referido: 'Referido',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Detalle de Inasistencias</h3>
        <span className="text-sm text-gray-500">
          Total: {inasistencias.length} inasistencia{inasistencias.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Fecha/Hora
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Profesional
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Sede
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Origen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inasistencias.map((inasistencia) => (
              <tr key={inasistencia._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatearFecha(inasistencia.fechaHora)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {inasistencia.paciente.nombre} {inasistencia.paciente.apellidos}
                  </div>
                  {inasistencia.paciente.telefono && (
                    <div className="text-sm text-gray-500">{inasistencia.paciente.telefono}</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {inasistencia.profesional.nombre} {inasistencia.profesional.apellidos}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {inasistencia.sede.nombre}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {etiquetasOrigen[inasistencia.origen] || inasistencia.origen}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


